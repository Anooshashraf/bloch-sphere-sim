import React, { useState, useCallback } from "react";
import * as math from "mathjs";

// Types
type Qubit = number;
type GateType = "X" | "Y" | "Z" | "H" | "S" | "T" | "CX";
type GatePosition = { row: number; col: number };
type Gate = { type: GateType; position: GatePosition };
type CircuitStep = Gate[];
type MeasurementResult = { [key: string]: number };

// Gate definitions
const gateMatrix: Record<GateType, math.Matrix> = {
  X: math.matrix([
    [0, 1],
    [1, 0],
  ]),
  Y: math.matrix([
    [0, math.complex(0, -1)],
    [math.complex(0, 1), 0],
  ]),
  Z: math.matrix([
    [1, 0],
    [0, -1],
  ]),
  H: math.matrix([
    [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
    [1 / Math.sqrt(2), -1 / Math.sqrt(2)],
  ]),
  S: math.matrix([
    [1, 0],
    [0, math.complex(0, 1)],
  ]),
  T: math.matrix([
    [1, 0],
    [0, math.complex(1 / Math.sqrt(2), 1 / Math.sqrt(2))],
  ]),
  CX: math.matrix([
    // Controlled-X (CNOT) gate
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
  ]),
};

// Helper functions
const identityMatrix = (size: number): math.Matrix => {
  const data = Array(size)
    .fill(0)
    .map((_, i) =>
      Array(size)
        .fill(0)
        .map((_, j) => (i === j ? 1 : 0))
    );
  return math.matrix(data);
};

const tensorProduct = (a: math.Matrix, b: math.Matrix): math.Matrix => {
  return math.matrix(
    math.kron(a.valueOf() as number[][], b.valueOf() as number[][])
  );
};

const simulateCircuit = (
  circuit: CircuitStep[],
  numQubits: number
): MeasurementResult => {
  // Initialize qubits in |0⟩ state
  let state = math.matrix(Array(2 ** numQubits).fill(0));
  state = math.subset(state, math.index(0), 1) as math.Matrix;

  // Build the full unitary matrix for the circuit
  let fullUnitary = identityMatrix(2 ** numQubits);

  // Process each column (time step)
  for (let col = 0; col < circuit.length; col++) {
    let columnUnitary = identityMatrix(2 ** numQubits);
    const gatesInColumn = circuit[col] || [];

    // Process each gate in the current column
    for (const gate of gatesInColumn) {
      if (gate.type === "CX") {
        // For multi-qubit gates like CNOT
        const controlQubit = gate.position.row;
        const targetQubit = gate.position.col; // Using col to represent target in CX

        // Apply CX gate directly to the column unitary
        columnUnitary = math.multiply(
          gateMatrix.CX,
          columnUnitary
        ) as math.Matrix;
      } else {
        // For single-qubit gates
        const qubitIndex = gate.position.row;

        // Build the operator for this gate applied to the specific qubit
        let gateOperator = identityMatrix(1);
        for (let i = 0; i < numQubits; i++) {
          if (i === qubitIndex) {
            gateOperator = tensorProduct(gateOperator, gateMatrix[gate.type]);
          } else {
            gateOperator = tensorProduct(gateOperator, identityMatrix(2));
          }
        }

        // Apply to the column unitary
        columnUnitary = math.multiply(
          gateOperator,
          columnUnitary
        ) as math.Matrix;
      }
    }

    // Apply this column's transformation to the full unitary
    fullUnitary = math.multiply(columnUnitary, fullUnitary) as math.Matrix;
  }

  // Apply the full unitary to the initial state
  const finalState = math.multiply(fullUnitary, state) as math.Matrix;

  // Calculate measurement probabilities
  const probabilities: MeasurementResult = {};
  const stateArray = finalState.valueOf() as number[];

  for (let i = 0; i < stateArray.length; i++) {
    const amplitude = stateArray[i];
    const probability = Math.pow(Math.abs(amplitude as number), 2);
    const basisState = i.toString(2).padStart(numQubits, "0");
    probabilities[basisState] = probability;
  }

  return probabilities;
};

const Circuit: React.FC = () => {
  const [numQubits, setNumQubits] = useState<number>(2);
  const [steps, setSteps] = useState<number>(3);
  const [circuit, setCircuit] = useState<CircuitStep[]>(
    Array(3)
      .fill(null)
      .map(() => [])
  );
  const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
  const [results, setResults] = useState<MeasurementResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Handle gate placement
  const handleCellClick = (row: number, col: number) => {
    if (!selectedGate) return;

    // For CX gate, we need special handling
    if (selectedGate === "CX") {
      // For simplicity, let's assume control is on row and target is next row
      if (row >= numQubits - 1) return; // Need at least 2 qubits for CX

      const newCircuit = [...circuit];
      if (!newCircuit[col]) newCircuit[col] = [];

      // Remove any existing CX gate in this column that might conflict
      newCircuit[col] = newCircuit[col].filter(
        (g) => !(g.type === "CX" && g.position.col === col)
      );

      // Add the new CX gate
      newCircuit[col].push({
        type: selectedGate,
        position: { row, col: row + 1 }, // Using col to represent target qubit
      });

      setCircuit(newCircuit);
    } else {
      // For single-qubit gates
      const newCircuit = [...circuit];
      if (!newCircuit[col]) newCircuit[col] = [];

      // Remove any existing gate in this cell
      newCircuit[col] = newCircuit[col].filter(
        (g) => !(g.position.row === row && g.position.col === col)
      );

      // Add the new gate
      newCircuit[col].push({
        type: selectedGate,
        position: { row, col },
      });

      setCircuit(newCircuit);
    }
  };

  // Run simulation
  const handleRun = useCallback(() => {
    setIsRunning(true);

    // Simulate in a timeout to allow UI to update
    setTimeout(() => {
      try {
        const results = simulateCircuit(circuit, numQubits);
        setResults(results);
      } catch (error) {
        console.error("Simulation error:", error);
        setResults({ Error: 1 });
      } finally {
        setIsRunning(false);
      }
    }, 100);
  }, [circuit, numQubits]);

  // Reset circuit
  const handleReset = () => {
    setCircuit(
      Array(steps)
        .fill(null)
        .map(() => [])
    );
    setResults(null);
  };

  // Change step count
  const handleChangeSteps = (newSteps: number) => {
    if (newSteps < 1) return;

    const newCircuit = [...circuit];
    if (newSteps > steps) {
      // Add empty columns
      while (newCircuit.length < newSteps) {
        newCircuit.push([]);
      }
    } else {
      // Remove columns from the end
      newCircuit.length = newSteps;
    }

    setSteps(newSteps);
    setCircuit(newCircuit);
  };

  // Render gate symbol
  const renderGateSymbol = (type: GateType) => {
    switch (type) {
      case "X":
        return "X";
      case "Y":
        return "Y";
      case "Z":
        return "Z";
      case "H":
        return "H";
      case "S":
        return "S";
      case "T":
        return "T";
      case "CX":
        return "⊕";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Quantum Circuit Simulator
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Gate Palette */}
        <div className="bg-gray-800 p-4 rounded-lg lg:w-1/4">
          <h2 className="text-xl font-semibold mb-4">Gate Palette</h2>
          <div className="grid grid-cols-3 gap-2">
            {(["X", "Y", "Z", "H", "S", "T", "CX"] as GateType[]).map(
              (gate) => (
                <button
                  key={gate}
                  className={`p-3 rounded-md text-center font-mono text-lg ${
                    selectedGate === gate
                      ? "bg-blue-600 ring-2 ring-blue-400"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setSelectedGate(gate)}
                >
                  {renderGateSymbol(gate)}
                </button>
              )
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Circuit Controls</h2>
            <div className="flex gap-2 mb-4">
              <button
                className="flex-1 bg-red-700 hover:bg-red-600 py-2 px-4 rounded-md"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="flex-1 bg-green-700 hover:bg-green-600 py-2 px-4 rounded-md disabled:opacity-50"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? "Running..." : "Run"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span>Qubits:</span>
              <select
                className="bg-gray-700 text-white p-2 rounded-md"
                value={numQubits}
                onChange={(e) => setNumQubits(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span>Steps:</span>
              <div className="flex items-center">
                <button
                  className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-l-md"
                  onClick={() => handleChangeSteps(steps - 1)}
                >
                  -
                </button>
                <span className="bg-gray-800 w-10 h-8 flex items-center justify-center">
                  {steps}
                </span>
                <button
                  className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-r-md"
                  onClick={() => handleChangeSteps(steps + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Circuit Display */}
        <div className="bg-gray-800 p-4 rounded-lg flex-1 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Circuit</h2>
          <div className="mb-2">
            Selected: {selectedGate ? `${selectedGate} Gate` : "None"}
          </div>

          <div
            className="circuit-grid"
            style={{
              gridTemplateRows: `repeat(${numQubits + 1}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${steps}, minmax(0, 1fr))`,
            }}
          >
            {/* Qubit labels */}
            {Array.from({ length: numQubits }).map((_, row) => (
              <div
                key={`label-${row}`}
                className="p-2 font-mono bg-gray-700 flex items-center justify-center"
              >
                |0⟩{row}
              </div>
            ))}
            <div className="p-2 bg-gray-700"></div> {/* Spacer */}
            {/* Circuit cells */}
            {Array.from({ length: numQubits }).map((_, row) =>
              Array.from({ length: steps }).map((_, col) => {
                const gatesInCell =
                  circuit[col]?.filter((g) =>
                    g.type === "CX"
                      ? g.position.row === row || g.position.col === row
                      : g.position.row === row && g.position.col === col
                  ) || [];

                return (
                  <div
                    key={`cell-${row}-${col}`}
                    className="border border-gray-600 min-h-[60px] flex items-center justify-center relative cursor-pointer hover:bg-gray-700"
                    onClick={() => handleCellClick(row, col)}
                  >
                    {gatesInCell.map((gate, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center font-mono text-lg"
                      >
                        {renderGateSymbol(gate.type)}
                      </div>
                    ))}

                    {/* Draw wire between gates for multi-qubit operations */}
                    {gatesInCell.some((g) => g.type === "CX") && (
                      <div className="absolute left-0 right-0 h-0.5 bg-blue-500 top-1/2 transform -translate-y-1/2 -z-10"></div>
                    )}
                  </div>
                );
              })
            )}
            {/* Column labels */}
            {Array.from({ length: steps }).map((_, col) => (
              <div
                key={`step-${col}`}
                className="p-2 bg-gray-700 flex items-center justify-center"
              >
                Step {col}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {results && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Measurement Probabilities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.entries(results)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([state, probability]) => (
                <div key={state} className="bg-gray-700 p-3 rounded-md">
                  <div className="font-mono">|{state}⟩</div>
                  <div className="text-blue-400">
                    {(probability * 100).toFixed(2)}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Circuit;
