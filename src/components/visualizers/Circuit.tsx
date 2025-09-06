// "use client";

// import React, { useState, useCallback } from "react";
// import * as math from "mathjs";

// // Types
// type Qubit = number;
// type GateType = "X" | "Y" | "Z" | "H" | "S" | "T" | "CX";
// type GatePosition = { row: number; col: number };
// type Gate = { type: GateType; position: GatePosition };
// type CircuitStep = Gate[];
// type MeasurementResult = { [key: string]: number };

// // Gate definitions
// const gateMatrix: Record<GateType, math.Matrix> = {
//   X: math.matrix([
//     [0, 1],
//     [1, 0],
//   ]),
//   Y: math.matrix([
//     [0, math.complex(0, -1)],
//     [math.complex(0, 1), 0],
//   ]),
//   Z: math.matrix([
//     [1, 0],
//     [0, -1],
//   ]),
//   H: math.matrix([
//     [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
//     [1 / Math.sqrt(2), -1 / Math.sqrt(2)],
//   ]),
//   S: math.matrix([
//     [1, 0],
//     [0, math.complex(0, 1)],
//   ]),
//   T: math.matrix([
//     [1, 0],
//     [0, math.complex(1 / Math.sqrt(2), 1 / Math.sqrt(2))],
//   ]),
//   CX: math.matrix([
//     // Controlled-X (CNOT) gate
//     [1, 0, 0, 0],
//     [0, 1, 0, 0],
//     [0, 0, 0, 1],
//     [0, 0, 1, 0],
//   ]),
// };

// // Helper functions
// const identityMatrix = (size: number): math.Matrix => {
//   const data = Array(size)
//     .fill(0)
//     .map((_, i) =>
//       Array(size)
//         .fill(0)
//         .map((_, j) => (i === j ? 1 : 0))
//     );
//   return math.matrix(data);
// };

// const tensorProduct = (a: math.Matrix, b: math.Matrix): math.Matrix => {
//   return math.matrix(
//     math.kron(a.valueOf() as number[][], b.valueOf() as number[][])
//   );
// };

// const simulateCircuit = (
//   circuit: CircuitStep[],
//   numQubits: number
// ): MeasurementResult => {
//   // Initialize qubits in |0⟩ state
//   let state = math.matrix(Array(2 ** numQubits).fill(0));
//   state = math.subset(state, math.index(0), 1) as math.Matrix;

//   // Build the full unitary matrix for the circuit
//   let fullUnitary = identityMatrix(2 ** numQubits);

//   // Process each column (time step)
//   for (let col = 0; col < circuit.length; col++) {
//     let columnUnitary = identityMatrix(2 ** numQubits);
//     const gatesInColumn = circuit[col] || [];

//     // Process each gate in the current column
//     for (const gate of gatesInColumn) {
//       if (gate.type === "CX") {
//         // For multi-qubit gates like CNOT
//         const controlQubit = gate.position.row;
//         const targetQubit = gate.position.col; // Using col to represent target in CX

//         // Apply CX gate directly to the column unitary
//         columnUnitary = math.multiply(
//           gateMatrix.CX,
//           columnUnitary
//         ) as math.Matrix;
//       } else {
//         // For single-qubit gates
//         const qubitIndex = gate.position.row;

//         // Build the operator for this gate applied to the specific qubit
//         let gateOperator = identityMatrix(1);
//         for (let i = 0; i < numQubits; i++) {
//           if (i === qubitIndex) {
//             gateOperator = tensorProduct(gateOperator, gateMatrix[gate.type]);
//           } else {
//             gateOperator = tensorProduct(gateOperator, identityMatrix(2));
//           }
//         }

//         // Apply to the column unitary
//         columnUnitary = math.multiply(
//           gateOperator,
//           columnUnitary
//         ) as math.Matrix;
//       }
//     }

//     // Apply this column's transformation to the full unitary
//     fullUnitary = math.multiply(columnUnitary, fullUnitary) as math.Matrix;
//   }

//   // Apply the full unitary to the initial state
//   const finalState = math.multiply(fullUnitary, state) as math.Matrix;

//   // Calculate measurement probabilities
//   const probabilities: MeasurementResult = {};
//   const stateArray = finalState.valueOf() as number[];

//   for (let i = 0; i < stateArray.length; i++) {
//     const amplitude = stateArray[i];
//     const probability = Math.pow(Math.abs(amplitude as number), 2);
//     const basisState = i.toString(2).padStart(numQubits, "0");
//     probabilities[basisState] = probability;
//   }

//   return probabilities;
// };

// const QuantumCircuitSimulator: React.FC = () => {
//   const [numQubits, setNumQubits] = useState<number>(2);
//   const [steps, setSteps] = useState<number>(3);
//   const [circuit, setCircuit] = useState<CircuitStep[]>(
//     Array(3)
//       .fill(null)
//       .map(() => [])
//   );
//   const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
//   const [results, setResults] = useState<MeasurementResult | null>(null);
//   const [isRunning, setIsRunning] = useState<boolean>(false);

//   // Handle gate placement
//   const handleCellClick = (row: number, col: number) => {
//     if (!selectedGate) return;

//     // For CX gate, we need special handling
//     if (selectedGate === "CX") {
//       // For simplicity, let's assume control is on row and target is next row
//       if (row >= numQubits - 1) return; // Need at least 2 qubits for CX

//       const newCircuit = [...circuit];
//       if (!newCircuit[col]) newCircuit[col] = [];

//       // Remove any existing CX gate in this column that might conflict
//       newCircuit[col] = newCircuit[col].filter(
//         (g) => !(g.type === "CX" && g.position.col === col)
//       );

//       // Add the new CX gate
//       newCircuit[col].push({
//         type: selectedGate,
//         position: { row, col: row + 1 }, // Using col to represent target qubit
//       });

//       setCircuit(newCircuit);
//     } else {
//       // For single-qubit gates
//       const newCircuit = [...circuit];
//       if (!newCircuit[col]) newCircuit[col] = [];

//       // Remove any existing gate in this cell
//       newCircuit[col] = newCircuit[col].filter(
//         (g) => !(g.position.row === row && g.position.col === col)
//       );

//       // Add the new gate
//       newCircuit[col].push({
//         type: selectedGate,
//         position: { row, col },
//       });

//       setCircuit(newCircuit);
//     }
//   };

//   // Run simulation
//   const handleRun = useCallback(() => {
//     setIsRunning(true);

//     // Simulate in a timeout to allow UI to update
//     setTimeout(() => {
//       try {
//         const results = simulateCircuit(circuit, numQubits);
//         setResults(results);
//       } catch (error) {
//         console.error("Simulation error:", error);
//         setResults({ Error: 1 });
//       } finally {
//         setIsRunning(false);
//       }
//     }, 100);
//   }, [circuit, numQubits]);

//   // Reset circuit
//   const handleReset = () => {
//     setCircuit(
//       Array(steps)
//         .fill(null)
//         .map(() => [])
//     );
//     setResults(null);
//   };

//   // Change step count
//   const handleChangeSteps = (newSteps: number) => {
//     if (newSteps < 1) return;

//     const newCircuit = [...circuit];
//     if (newSteps > steps) {
//       // Add empty columns
//       while (newCircuit.length < newSteps) {
//         newCircuit.push([]);
//       }
//     } else {
//       // Remove columns from the end
//       newCircuit.length = newSteps;
//     }

//     setSteps(newSteps);
//     setCircuit(newCircuit);
//   };

//   // Render gate symbol
//   const renderGateSymbol = (type: GateType) => {
//     switch (type) {
//       case "X":
//         return "X";
//       case "Y":
//         return "Y";
//       case "Z":
//         return "Z";
//       case "H":
//         return "H";
//       case "S":
//         return "S";
//       case "T":
//         return "T";
//       case "CX":
//         return "⊕";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Quantum Circuit Simulator
//       </h1>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Gate Palette */}
//         <div className="bg-gray-800 p-4 rounded-lg lg:w-1/4">
//           <h2 className="text-xl font-semibold mb-4">Gate Palette</h2>
//           <div className="grid grid-cols-3 gap-2">
//             {(["X", "Y", "Z", "H", "S", "T", "CX"] as GateType[]).map(
//               (gate) => (
//                 <button
//                   key={gate}
//                   className={`p-3 rounded-md text-center font-mono text-lg ${
//                     selectedGate === gate
//                       ? "bg-blue-600 ring-2 ring-blue-400"
//                       : "bg-gray-700 hover:bg-gray-600"
//                   }`}
//                   onClick={() => setSelectedGate(gate)}
//                 >
//                   {renderGateSymbol(gate)}
//                 </button>
//               )
//             )}
//           </div>

//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-2">Circuit Controls</h2>
//             <div className="flex gap-2 mb-4">
//               <button
//                 className="flex-1 bg-red-700 hover:bg-red-600 py-2 px-4 rounded-md"
//                 onClick={handleReset}
//               >
//                 Reset
//               </button>
//               <button
//                 className="flex-1 bg-green-700 hover:bg-green-600 py-2 px-4 rounded-md disabled:opacity-50"
//                 onClick={handleRun}
//                 disabled={isRunning}
//               >
//                 {isRunning ? "Running..." : "Run"}
//               </button>
//             </div>

//             <div className="flex items-center gap-2">
//               <span>Qubits:</span>
//               <select
//                 className="bg-gray-700 text-white p-2 rounded-md"
//                 value={numQubits}
//                 onChange={(e) => setNumQubits(parseInt(e.target.value))}
//               >
//                 {[1, 2, 3, 4].map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex items-center gap-2 mt-2">
//               <span>Steps:</span>
//               <div className="flex items-center">
//                 <button
//                   className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-l-md"
//                   onClick={() => handleChangeSteps(steps - 1)}
//                 >
//                   -
//                 </button>
//                 <span className="bg-gray-800 w-10 h-8 flex items-center justify-center">
//                   {steps}
//                 </span>
//                 <button
//                   className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-r-md"
//                   onClick={() => handleChangeSteps(steps + 1)}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Circuit Display */}
//         <div className="bg-gray-800 p-4 rounded-lg flex-1 overflow-auto">
//           <h2 className="text-xl font-semibold mb-4">Circuit</h2>
//           <div className="mb-2">
//             Selected: {selectedGate ? `${selectedGate} Gate` : "None"}
//           </div>

//           <div className="grid gap-0 border border-gray-700 rounded-lg overflow-hidden">
//             {/* Qubit labels */}
//             <div
//               className="grid"
//               style={{ gridTemplateColumns: `60px repeat(${steps}, 1fr)` }}
//             >
//               <div className="p-2 font-mono bg-gray-700 flex items-center justify-center border-r border-gray-600">
//                 Qubit
//               </div>
//               {Array.from({ length: steps }).map((_, col) => (
//                 <div
//                   key={`step-label-${col}`}
//                   className="p-2 bg-gray-700 flex items-center justify-center border-r border-gray-600"
//                 >
//                   Step {col}
//                 </div>
//               ))}
//             </div>

//             {/* Circuit cells */}
//             {Array.from({ length: numQubits }).map((_, row) => (
//               <div
//                 key={`row-${row}`}
//                 className="grid"
//                 style={{ gridTemplateColumns: `60px repeat(${steps}, 1fr)` }}
//               >
//                 <div className="p-2 font-mono bg-gray-700 flex items-center justify-center border-r border-t border-gray-600">
//                   |0⟩{row}
//                 </div>

//                 {Array.from({ length: steps }).map((_, col) => {
//                   const gatesInCell =
//                     circuit[col]?.filter((g) =>
//                       g.type === "CX"
//                         ? g.position.row === row || g.position.col === row
//                         : g.position.row === row && g.position.col === col
//                     ) || [];

//                   return (
//                     <div
//                       key={`cell-${row}-${col}`}
//                       className="min-h-[60px] flex items-center justify-center relative cursor-pointer hover:bg-gray-700 border-t border-r border-gray-600"
//                       onClick={() => handleCellClick(row, col)}
//                     >
//                       {gatesInCell.map((gate, idx) => (
//                         <div
//                           key={idx}
//                           className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center font-mono text-lg"
//                         >
//                           {renderGateSymbol(gate.type)}
//                         </div>
//                       ))}

//                       {/* Draw wire between gates for multi-qubit operations */}
//                       {gatesInCell.some((g) => g.type === "CX") && (
//                         <div className="absolute left-0 right-0 h-0.5 bg-blue-500 top-1/2 transform -translate-y-1/2 -z-10"></div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Results Display */}
//       {results && (
//         <div className="mt-6 bg-gray-800 p-4 rounded-lg">
//           <h2 className="text-xl font-semibold mb-4">
//             Measurement Probabilities
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
//             {Object.entries(results)
//               .sort(([a], [b]) => a.localeCompare(b))
//               .map(([state, probability]) => (
//                 <div key={state} className="bg-gray-700 p-3 rounded-md">
//                   <div className="font-mono">|{state}⟩</div>
//                   <div className="text-blue-400">
//                     {(probability * 100).toFixed(2)}%
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuantumCircuitSimulator;

// "use client";

// import React, { useState, useCallback, useEffect } from "react";
// import * as math from "mathjs";

// // Types
// type GateType = "X" | "Y" | "Z" | "H" | "S" | "T" | "CX";
// type GatePosition = { row: number; col: number };
// type Gate = { type: GateType; position: GatePosition };
// type CircuitStep = Gate[];
// type MeasurementResult = { [key: string]: number };

// const QuantumCircuitSimulator: React.FC = () => {
//   // Gate definitions
//   const gateMatrix: Record<GateType, math.Matrix> = {
//     X: math.matrix([
//       [0, 1],
//       [1, 0],
//     ]),
//     Y: math.matrix([
//       [0, math.complex(0, -1)],
//       [math.complex(0, 1), 0],
//     ]),
//     Z: math.matrix([
//       [1, 0],
//       [0, -1],
//     ]),
//     H: math.matrix([
//       [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
//       [1 / Math.sqrt(2), -1 / Math.sqrt(2)],
//     ]),
//     S: math.matrix([
//       [1, 0],
//       [0, math.complex(0, 1)],
//     ]),
//     T: math.matrix([
//       [1, 0],
//       [0, math.complex(1 / Math.sqrt(2), 1 / Math.sqrt(2))],
//     ]),
//     CX: math.matrix([
//       [1, 0, 0, 0],
//       [0, 1, 0, 0],
//       [0, 0, 0, 1],
//       [0, 0, 1, 0],
//     ]),
//   };

//   // Helper functions
//   const identityMatrix = (size: number): math.Matrix => {
//     const data = Array(size)
//       .fill(0)
//       .map((_, i) =>
//         Array(size)
//           .fill(0)
//           .map((_, j) => (i === j ? 1 : 0))
//       );
//     return math.matrix(data);
//   };

//   const tensorProduct = (a: math.Matrix, b: math.Matrix): math.Matrix => {
//     return math.matrix(
//       math.kron(a.valueOf() as number[][], b.valueOf() as number[][])
//     );
//   };

//   const simulateCircuit = (
//     circuit: CircuitStep[],
//     numQubits: number
//   ): MeasurementResult => {
//     // Initialize qubits in |0⟩ state
//     let state = math.matrix(Array(2 ** numQubits).fill(0));
//     state = math.subset(state, math.index(0), 1) as math.Matrix;

//     // Build the full unitary matrix for the circuit
//     let fullUnitary = identityMatrix(2 ** numQubits);

//     // Process each column (time step)
//     for (let col = 0; col < circuit.length; col++) {
//       let columnUnitary = identityMatrix(2 ** numQubits);
//       const gatesInColumn = circuit[col] || [];

//       // Process each gate in the current column
//       for (const gate of gatesInColumn) {
//         if (gate.type === "CX") {
//           // For multi-qubit gates like CNOT
//           const controlQubit = gate.position.row;
//           const targetQubit = gate.position.col;

//           // Apply CX gate directly to the column unitary
//           columnUnitary = math.multiply(
//             gateMatrix.CX,
//             columnUnitary
//           ) as math.Matrix;
//         } else {
//           // For single-qubit gates
//           const qubitIndex = gate.position.row;

//           // Build the operator for this gate applied to the specific qubit
//           let gateOperator = identityMatrix(1);
//           for (let i = 0; i < numQubits; i++) {
//             if (i === qubitIndex) {
//               gateOperator = tensorProduct(gateOperator, gateMatrix[gate.type]);
//             } else {
//               gateOperator = tensorProduct(gateOperator, identityMatrix(2));
//             }
//           }

//           // Apply to the column unitary
//           columnUnitary = math.multiply(
//             gateOperator,
//             columnUnitary
//           ) as math.Matrix;
//         }
//       }

//       // Apply this column's transformation to the full unitary
//       fullUnitary = math.multiply(columnUnitary, fullUnitary) as math.Matrix;
//     }

//     // Apply the full unitary to the initial state
//     const finalState = math.multiply(fullUnitary, state) as math.Matrix;

//     // Calculate measurement probabilities
//     const probabilities: MeasurementResult = {};
//     const stateArray = finalState.valueOf() as number[];

//     for (let i = 0; i < stateArray.length; i++) {
//       const amplitude = stateArray[i];
//       const probability = Math.pow(Math.abs(amplitude as number), 2);
//       const basisState = i.toString(2).padStart(numQubits, "0");
//       probabilities[basisState] = probability;
//     }

//     return probabilities;
//   };

//   // State management
//   const [numQubits, setNumQubits] = useState<number>(2);
//   const [steps, setSteps] = useState<number>(5);
//   const [circuit, setCircuit] = useState<CircuitStep[]>(
//     Array(5)
//       .fill(null)
//       .map(() => [])
//   );
//   const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
//   const [results, setResults] = useState<MeasurementResult | null>(null);
//   const [isRunning, setIsRunning] = useState<boolean>(false);

//   // Handle gate placement
//   const handleCellClick = (row: number, col: number) => {
//     if (!selectedGate) return;

//     // For CX gate, we need special handling
//     if (selectedGate === "CX") {
//       // For simplicity, let's assume control is on row and target is next row
//       if (row >= numQubits - 1) return; // Need at least 2 qubits for CX

//       const newCircuit = [...circuit];
//       if (!newCircuit[col]) newCircuit[col] = [];

//       // Remove any existing CX gate in this column that might conflict
//       newCircuit[col] = newCircuit[col].filter(
//         (g) => !(g.type === "CX" && g.position.col === col)
//       );

//       // Add the new CX gate
//       newCircuit[col].push({
//         type: selectedGate,
//         position: { row, col: row + 1 },
//       });

//       setCircuit(newCircuit);
//     } else {
//       // For single-qubit gates
//       const newCircuit = [...circuit];
//       if (!newCircuit[col]) newCircuit[col] = [];

//       // Remove any existing gate in this cell
//       newCircuit[col] = newCircuit[col].filter(
//         (g) => !(g.position.row === row && g.position.col === col)
//       );

//       // Add the new gate
//       newCircuit[col].push({
//         type: selectedGate,
//         position: { row, col },
//       });

//       setCircuit(newCircuit);
//     }
//   };

//   // Run simulation
//   const handleRun = useCallback(() => {
//     setIsRunning(true);

//     // Simulate in a timeout to allow UI to update
//     setTimeout(() => {
//       try {
//         const results = simulateCircuit(circuit, numQubits);
//         setResults(results);
//       } catch (error) {
//         console.error("Simulation error:", error);
//         setResults({ Error: 1 });
//       } finally {
//         setIsRunning(false);
//       }
//     }, 100);
//   }, [circuit, numQubits]);

//   // Reset circuit
//   const handleReset = () => {
//     setCircuit(
//       Array(steps)
//         .fill(null)
//         .map(() => [])
//     );
//     setResults(null);
//   };

//   // Change step count
//   const handleChangeSteps = (newSteps: number) => {
//     if (newSteps < 1) return;

//     const newCircuit = [...circuit];
//     if (newSteps > steps) {
//       // Add empty columns
//       while (newCircuit.length < newSteps) {
//         newCircuit.push([]);
//       }
//     } else {
//       // Remove columns from the end
//       newCircuit.length = newSteps;
//     }

//     setSteps(newSteps);
//     setCircuit(newCircuit);
//   };

//   // Render gate symbol
//   const renderGateSymbol = (type: GateType) => {
//     switch (type) {
//       case "X":
//         return "X";
//       case "Y":
//         return "Y";
//       case "Z":
//         return "Z";
//       case "H":
//         return "H";
//       case "S":
//         return "S";
//       case "T":
//         return "T";
//       case "CX":
//         return "⊕";
//       default:
//         return "";
//     }
//   };

//   // Update circuit when steps change
//   useEffect(() => {
//     const newCircuit = [...circuit];
//     if (steps > circuit.length) {
//       // Add empty columns
//       while (newCircuit.length < steps) {
//         newCircuit.push([]);
//       }
//     } else {
//       // Remove columns from the end
//       newCircuit.length = steps;
//     }
//     setCircuit(newCircuit);
//   }, [steps]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         <header className="text-center mb-8 p-6 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/30">
//           <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
//             Quantum Circuit Simulator
//           </h1>
//           <p className="text-gray-300 text-lg max-w-2xl mx-auto">
//             Build and simulate quantum circuits with a visual interface
//           </p>
//         </header>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Control Panel */}
//           <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30 lg:w-80">
//             <h2 className="text-xl font-semibold mb-6 text-cyan-300 border-b border-gray-700 pb-3">
//               Gate Palette
//             </h2>
//             <div className="grid grid-cols-3 gap-3 mb-8">
//               {(["X", "Y", "Z", "H", "S", "T", "CX"] as GateType[]).map(
//                 (gate) => (
//                   <button
//                     key={gate}
//                     className={`p-4 rounded-xl text-center font-mono text-lg transition-all duration-200 ${
//                       selectedGate === gate
//                         ? "bg-blue-600 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400"
//                         : "bg-gray-700/50 hover:bg-gray-700/80 hover:shadow-md"
//                     }`}
//                     onClick={() => setSelectedGate(gate)}
//                   >
//                     {renderGateSymbol(gate)}
//                   </button>
//                 )
//               )}
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-gray-300 mb-2">
//                   Number of Qubits
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="10"
//                   className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   value={numQubits}
//                   onChange={(e) =>
//                     setNumQubits(Math.max(1, parseInt(e.target.value) || 1))
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-300 mb-2">
//                   Number of Steps
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   <button
//                     className="bg-gray-700/50 hover:bg-gray-700 w-10 h-10 rounded-l-lg flex items-center justify-center transition-colors"
//                     onClick={() => handleChangeSteps(steps - 1)}
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     min="1"
//                     className="bg-gray-700/50 border border-gray-600 w-16 h-10 text-center focus:outline-none"
//                     value={steps}
//                     onChange={(e) =>
//                       handleChangeSteps(
//                         Math.max(1, parseInt(e.target.value) || 1)
//                       )
//                     }
//                   />
//                   <button
//                     className="bg-gray-700/50 hover:bg-gray-700 w-10 h-10 rounded-r-lg flex items-center justify-center transition-colors"
//                     onClick={() => handleChangeSteps(steps + 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="flex space-x-3 mt-8">
//               <button
//                 className="flex-1 bg-red-600/80 hover:bg-red-600 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
//                 onClick={handleReset}
//               >
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//                 Reset
//               </button>
//               <button
//                 className="flex-1 bg-green-600/80 hover:bg-green-600 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
//                 onClick={handleRun}
//                 disabled={isRunning}
//               >
//                 {isRunning ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Running...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       className="w-5 h-5 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     Run
//                   </>
//                 )}
//               </button>
//             </div>

//             <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
//               <div className="text-gray-300 mb-2">
//                 Selected: {selectedGate ? `${selectedGate} Gate` : "None"}
//               </div>
//               <div className="text-sm text-gray-400">
//                 Click on a circuit cell to place the selected gate
//               </div>
//             </div>
//           </div>

//           {/* Circuit Display */}
//           <div className="flex-1 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30 overflow-x-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-cyan-300">
//                 Quantum Circuit
//               </h2>
//               <div className="text-sm text-gray-400">
//                 {numQubits} Qubit{numQubits !== 1 ? "s" : ""} × {steps} Step
//                 {steps !== 1 ? "s" : ""}
//               </div>
//             </div>

//             <div className="inline-block min-w-full">
//               {/* Column headers */}
//               <div className="flex">
//                 <div className="w-24 h-12 flex items-center justify-center bg-gray-700/50 rounded-tl-lg border-r border-b border-gray-600/50 font-medium">
//                   Qubits
//                 </div>
//                 {Array.from({ length: steps }).map((_, col) => (
//                   <div
//                     key={`header-${col}`}
//                     className="w-20 h-12 flex items-center justify-center bg-gray-700/50 border-r border-b border-gray-600/50 last:rounded-tr-lg font-medium"
//                   >
//                     {col + 1}
//                   </div>
//                 ))}
//               </div>

//               {/* Circuit rows */}
//               {Array.from({ length: numQubits }).map((_, row) => (
//                 <div key={`row-${row}`} className="flex">
//                   <div className="w-24 h-20 flex items-center justify-center bg-gray-700/30 border-r border-b border-gray-600/50 font-mono">
//                     |0⟩<sub>{row}</sub>
//                   </div>

//                   {Array.from({ length: steps }).map((_, col) => {
//                     const gatesInCell =
//                       circuit[col]?.filter((g) =>
//                         g.type === "CX"
//                           ? g.position.row === row || g.position.col === row
//                           : g.position.row === row && g.position.col === col
//                       ) || [];

//                     return (
//                       <div
//                         key={`cell-${row}-${col}`}
//                         className="w-20 h-20 flex items-center justify-center relative cursor-pointer hover:bg-gray-700/30 border-r border-b border-gray-600/50 last:border-r-0"
//                         onClick={() => handleCellClick(row, col)}
//                       >
//                         {gatesInCell.map((gate, idx) => (
//                           <div
//                             key={idx}
//                             className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-lg font-bold shadow-lg ${
//                               gate.type === "X"
//                                 ? "bg-red-500/90"
//                                 : gate.type === "Y"
//                                 ? "bg-green-500/90"
//                                 : gate.type === "Z"
//                                 ? "bg-blue-500/90"
//                                 : gate.type === "H"
//                                 ? "bg-yellow-500/90"
//                                 : gate.type === "S"
//                                 ? "bg-purple-500/90"
//                                 : gate.type === "T"
//                                 ? "bg-pink-500/90"
//                                 : "bg-cyan-500/90"
//                             }`}
//                           >
//                             {renderGateSymbol(gate.type)}
//                           </div>
//                         ))}

//                         {/* Draw connection line for multi-qubit gates */}
//                         {gatesInCell.some((g) => g.type === "CX") && (
//                           <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/50 top-1/2 transform -translate-y-1/2 -z-10"></div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Results Display */}
//         {results && (
//           <div className="mt-8 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30">
//             <h2 className="text-xl font-semibold mb-6 text-cyan-300 border-b border-gray-700 pb-3">
//               Measurement Probabilities
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//               {Object.entries(results)
//                 .sort(([a], [b]) => a.localeCompare(b))
//                 .map(([state, probability]) => (
//                   <div
//                     key={state}
//                     className="bg-gray-700/30 p-4 rounded-lg text-center hover:bg-gray-700/50 transition-colors"
//                   >
//                     <div className="font-mono text-sm mb-2">|{state}⟩</div>
//                     <div className="text-cyan-400 font-bold text-lg">
//                       {(probability * 100).toFixed(1)}%
//                     </div>
//                     <div className="h-2 bg-gray-600 rounded-full mt-2 overflow-hidden">
//                       <div
//                         className="h-full bg-cyan-500 rounded-full"
//                         style={{ width: `${probability * 100}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}

//         {/* Instructions */}
//         <div className="mt-8 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30">
//           <h3 className="text-lg font-semibold mb-4 text-cyan-300">
//             How to use the simulator
//           </h3>
//           <ul className="text-gray-300 space-y-2 text-sm">
//             <li className="flex items-start">
//               <span className="text-cyan-400 mr-2">•</span>
//               Select a gate from the palette, then click on a cell in the
//               circuit to place it
//             </li>
//             <li className="flex items-start">
//               <span className="text-cyan-400 mr-2">•</span>
//               Use the step controls to add more columns to your circuit
//             </li>
//             <li className="flex items-start">
//               <span className="text-cyan-400 mr-2">•</span>
//               Click "Run" to see the measurement probabilities
//             </li>
//             <li className="flex items-start">
//               <span className="text-cyan-400 mr-2">•</span>
//               Click "Reset" to clear all gates and start over
//             </li>
//             <li className="flex items-start">
//               <span className="text-cyan-400 mr-2">•</span>
//               For CX (CNOT) gates, the first qubit is the control and the second
//               is the target
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuantumCircuitSimulator;

"use client";

import React, { useState, useCallback, useEffect } from "react";
import * as math from "mathjs";

// Types
type GateType = "X" | "Y" | "Z" | "H" | "S" | "T" | "CX";
type GatePosition = { row: number; col: number };
type Gate = { type: GateType; position: GatePosition };
type CircuitStep = Gate[];
type MeasurementResult = { [key: string]: number };

const QuantumCircuitSimulator: React.FC = () => {
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

  // Create a matrix for a gate applied to specific qubits
  const createGateMatrix = (
    gateType: GateType,
    targetQubit: number,
    controlQubit: number | null,
    numQubits: number
  ): math.Matrix => {
    if (gateType === "CX" && controlQubit !== null) {
      // Create CNOT gate matrix
      const size = 2 ** numQubits;
      let matrix = identityMatrix(size);

      // Iterate through all basis states
      for (let i = 0; i < size; i++) {
        // Get binary representation
        const bits = i
          .toString(2)
          .padStart(numQubits, "0")
          .split("")
          .map(Number);

        // Check if control qubit is |1⟩
        if (bits[controlQubit] === 1) {
          // Flip the target qubit
          bits[targetQubit] = bits[targetQubit] === 1 ? 0 : 1;

          // Convert back to decimal
          const j = parseInt(bits.join(""), 2);

          // Update matrix
          matrix = math.subset(matrix, math.index(i, i), 0) as math.Matrix;
          matrix = math.subset(matrix, math.index(i, j), 1) as math.Matrix;
        }
      }

      return matrix;
    } else {
      // Single qubit gate
      let gateOperator = identityMatrix(1);
      for (let i = 0; i < numQubits; i++) {
        if (i === targetQubit) {
          gateOperator = tensorProduct(gateOperator, gateMatrix[gateType]);
        } else {
          gateOperator = tensorProduct(gateOperator, identityMatrix(2));
        }
      }
      return gateOperator;
    }
  };

  const simulateCircuit = (
    circuit: CircuitStep[],
    numQubits: number
  ): MeasurementResult => {
    // Initialize qubits in |0⟩ state
    let state = math.matrix(Array(2 ** numQubits).fill(0));
    state = math.subset(state, math.index(0), 1) as math.Matrix;

    // Process each column (time step)
    for (let col = 0; col < circuit.length; col++) {
      const gatesInColumn = circuit[col] || [];

      // Process each gate in the current column
      for (const gate of gatesInColumn) {
        if (gate.type === "CX") {
          // For CNOT gates, use control and target qubits
          const controlQubit = gate.position.row;
          const targetQubit = gate.position.col;

          // Create the CNOT gate matrix
          const cnotMatrix = createGateMatrix(
            "CX",
            targetQubit,
            controlQubit,
            numQubits
          );

          // Apply the gate to the state
          state = math.multiply(cnotMatrix, state) as math.Matrix;
        } else {
          // For single-qubit gates
          const qubitIndex = gate.position.row;

          // Create the gate matrix
          const gateMatrix = createGateMatrix(
            gate.type,
            qubitIndex,
            null,
            numQubits
          );

          // Apply the gate to the state
          state = math.multiply(gateMatrix, state) as math.Matrix;
        }
      }
    }

    // Calculate measurement probabilities
    const probabilities: MeasurementResult = {};
    const stateArray = state.valueOf() as number[];

    for (let i = 0; i < stateArray.length; i++) {
      const amplitude = stateArray[i];
      const probability = Math.pow(Math.abs(amplitude as number), 2);
      const basisState = i.toString(2).padStart(numQubits, "0");
      probabilities[basisState] = probability;
    }

    return probabilities;
  };

  // State management
  const [numQubits, setNumQubits] = useState<number>(2);
  const [steps, setSteps] = useState<number>(5);
  const [circuit, setCircuit] = useState<CircuitStep[]>(
    Array(5)
      .fill(null)
      .map(() => [])
  );
  const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
  const [results, setResults] = useState<MeasurementResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        position: { row, col: row + 1 },
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

  // Update circuit when steps change
  useEffect(() => {
    const newCircuit = [...circuit];
    if (steps > circuit.length) {
      // Add empty columns
      while (newCircuit.length < steps) {
        newCircuit.push([]);
      }
    } else {
      // Remove columns from the end
      newCircuit.length = steps;
    }
    setCircuit(newCircuit);
  }, [steps]);

  // Only render the component on the client side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading Quantum Circuit Simulator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 p-6 bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/30">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Quantum Circuit Simulator
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Build and simulate quantum circuits with a visual interface
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Control Panel */}
          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30 lg:w-80">
            <h2 className="text-xl font-semibold mb-6 text-cyan-300 border-b border-gray-700 pb-3">
              Gate Palette
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {(["X", "Y", "Z", "H", "S", "T", "CX"] as GateType[]).map(
                (gate) => (
                  <button
                    key={gate}
                    className={`p-4 rounded-xl text-center font-mono text-lg transition-all duration-200 ${
                      selectedGate === gate
                        ? "bg-blue-600 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400"
                        : "bg-gray-700/50 hover:bg-gray-700/80 hover:shadow-md"
                    }`}
                    onClick={() => setSelectedGate(gate)}
                  >
                    {renderGateSymbol(gate)}
                  </button>
                )
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Number of Qubits
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={numQubits}
                  onChange={(e) =>
                    setNumQubits(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Number of Steps
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-gray-700/50 hover:bg-gray-700 w-10 h-10 rounded-l-lg flex items-center justify-center transition-colors"
                    onClick={() => handleChangeSteps(steps - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    className="bg-gray-700/50 border border-gray-600 w-16 h-10 text-center focus:outline-none"
                    value={steps}
                    onChange={(e) =>
                      handleChangeSteps(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                  />
                  <button
                    className="bg-gray-700/50 hover:bg-gray-700 w-10 h-10 rounded-r-lg flex items-center justify-center transition-colors"
                    onClick={() => handleChangeSteps(steps + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button
                className="flex-1 bg-red-600/80 hover:bg-red-600 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                onClick={handleReset}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset
              </button>
              <button
                className="flex-1 bg-green-600/80 hover:bg-green-600 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                onClick={handleRun}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Running...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Run
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
              <div className="text-gray-300 mb-2">
                Selected: {selectedGate ? `${selectedGate} Gate` : "None"}
              </div>
              <div className="text-sm text-gray-400">
                Click on a circuit cell to place the selected gate
              </div>
            </div>
          </div>

          {/* Circuit Display */}
          <div className="flex-1 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30 overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-cyan-300">
                Quantum Circuit
              </h2>
              <div className="text-sm text-gray-400">
                {numQubits} Qubit{numQubits !== 1 ? "s" : ""} × {steps} Step
                {steps !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="inline-block min-w-full">
              {/* Column headers */}
              <div className="flex">
                <div className="w-24 h-12 flex items-center justify-center bg-gray-700/50 rounded-tl-lg border-r border-b border-gray-600/50 font-medium">
                  Qubits
                </div>
                {Array.from({ length: steps }).map((_, col) => (
                  <div
                    key={`header-${col}`}
                    className="w-20 h-12 flex items-center justify-center bg-gray-700/50 border-r border-b border-gray-600/50 last:rounded-tr-lg font-medium"
                  >
                    {col + 1}
                  </div>
                ))}
              </div>

              {/* Circuit rows */}
              {Array.from({ length: numQubits }).map((_, row) => (
                <div key={`row-${row}`} className="flex">
                  <div className="w-24 h-20 flex items-center justify-center bg-gray-700/30 border-r border-b border-gray-600/50 font-mono">
                    |0⟩<sub>{row}</sub>
                  </div>

                  {Array.from({ length: steps }).map((_, col) => {
                    const gatesInCell =
                      circuit[col]?.filter((g) =>
                        g.type === "CX"
                          ? g.position.row === row || g.position.col === row
                          : g.position.row === row && g.position.col === col
                      ) || [];

                    return (
                      <div
                        key={`cell-${row}-${col}`}
                        className="w-20 h-20 flex items-center justify-center relative cursor-pointer hover:bg-gray-700/30 border-r border-b border-gray-600/50 last:border-r-0"
                        onClick={() => handleCellClick(row, col)}
                      >
                        {gatesInCell.map((gate, idx) => (
                          <div
                            key={idx}
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-lg font-bold shadow-lg ${
                              gate.type === "X"
                                ? "bg-red-500/90"
                                : gate.type === "Y"
                                ? "bg-green-500/90"
                                : gate.type === "Z"
                                ? "bg-blue-500/90"
                                : gate.type === "H"
                                ? "bg-yellow-500/90"
                                : gate.type === "S"
                                ? "bg-purple-500/90"
                                : gate.type === "T"
                                ? "bg-pink-500/90"
                                : "bg-cyan-500/90"
                            }`}
                          >
                            {renderGateSymbol(gate.type)}
                          </div>
                        ))}

                        {/* Draw connection line for multi-qubit gates */}
                        {gatesInCell.some((g) => g.type === "CX") && (
                          <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/50 top-1/2 transform -translate-y-1/2 -z-10"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Display */}
        {results && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30">
            <h2 className="text-xl font-semibold mb-6 text-cyan-300 border-b border-gray-700 pb-3">
              Measurement Probabilities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(results)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([state, probability]) => (
                  <div
                    key={state}
                    className="bg-gray-700/30 p-4 rounded-lg text-center hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="font-mono text-sm mb-2">|{state}⟩</div>
                    <div className="text-cyan-400 font-bold text-lg">
                      {(probability * 100).toFixed(1)}%
                    </div>
                    <div className="h-2 bg-gray-600 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${probability * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold mb-4 text-cyan-300">
            How to use the simulator
          </h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              Select a gate from the palette, then click on a cell in the
              circuit to place it
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              Use the step controls to add more columns to your circuit
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              Click "Run" to see the measurement probabilities
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              Click "Reset" to clear all gates and start over
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 mr-2">•</span>
              For CX (CNOT) gates, the first qubit is the control and the second
              is the target
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuantumCircuitSimulator;
