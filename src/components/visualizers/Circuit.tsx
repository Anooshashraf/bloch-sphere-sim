// components/visualizers/Circuit.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  QuantumGate,
  SINGLE_QUBIT_GATES,
  TWO_QUBIT_GATES,
  CNOT_GATE,
} from "../core/gates";
import { simulateCircuit } from "../core/simulator";

interface CircuitProps {
  qubits?: number;
  onCircuitChange?: (gates: any[]) => void;
}

export default function Circuit({ qubits = 2, onCircuitChange }: CircuitProps) {
  const [gates, setGates] = useState<any[]>([]);
  const [selectedGate, setSelectedGate] = useState<QuantumGate | null>(null);
  const [results, setResults] = useState<any>(null);
  const circuitRef = useRef<HTMLDivElement>(null);

  const addGateToCircuit = (qubitIndex: number, stepIndex: number) => {
    if (!selectedGate) return;

    // Check if it's a two-qubit gate and we have enough qubits
    if (selectedGate.matrix.length > 2 && qubits < 2) {
      alert("Two-qubit gates require at least 2 qubits");
      return;
    }

    const newGate = {
      gate: selectedGate,
      targets: [qubitIndex],
      controls:
        selectedGate.name === "CNOT" ? [qubitIndex === 0 ? 1 : 0] : undefined,
    };

    // Check if there's already a gate at this position
    const existingGateIndex = gates.findIndex(
      (g) => g.targets[0] === qubitIndex && g.step === stepIndex
    );

    let newGates;
    if (existingGateIndex >= 0) {
      // Replace existing gate
      newGates = [...gates];
      newGates[existingGateIndex] = { ...newGate, step: stepIndex };
    } else {
      // Add new gate
      newGates = [...gates, { ...newGate, step: stepIndex }];
    }

    setGates(newGates);
    if (onCircuitChange) onCircuitChange(newGates);
  };

  const runSimulation = () => {
    try {
      const result = simulateCircuit(gates);
      setResults(result);
    } catch (error) {
      console.error("Simulation error:", error);
      alert("Failed to simulate circuit");
    }
  };

  const clearCircuit = () => {
    setGates([]);
    setResults(null);
    if (onCircuitChange) onCircuitChange([]);
  };

  // Group gates by step for display
  const maxSteps =
    gates.length > 0 ? Math.max(...gates.map((g) => g.step)) + 1 : 5;
  const steps = Array.from({ length: maxSteps }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Quantum Gates
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600 font-medium">
            Single-qubit:
          </span>
          {SINGLE_QUBIT_GATES.map((gate) => (
            <button
              key={gate.name}
              onClick={() => setSelectedGate(gate)}
              className={`px-3 py-1 text-sm rounded border ${
                selectedGate?.name === gate.name
                  ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {gate.symbol}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-medium">Two-qubit:</span>
          {TWO_QUBIT_GATES.map((gate) => (
            <button
              key={gate.name}
              onClick={() => setSelectedGate(gate)}
              className={`px-3 py-1 text-sm rounded border ${
                selectedGate?.name === gate.name
                  ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {gate.symbol}
            </button>
          ))}
        </div>
        {selectedGate && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <strong>{selectedGate.name}:</strong> {selectedGate.description}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Quantum Circuit
          </h3>
          <div className="flex gap-2">
            <button
              onClick={runSimulation}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Run
            </button>
            <button
              onClick={clearCircuit}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        <div ref={circuitRef} className="overflow-x-auto">
          <div className="min-w-max">
            {/* Qubit labels */}
            <div className="flex">
              <div className="w-12 flex-shrink-0"></div>
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="w-16 text-center text-sm text-gray-500 py-2"
                >
                  Step {i + 1}
                </div>
              ))}
            </div>

            {/* Circuit grid */}
            {Array.from({ length: qubits }, (_, qubitIndex) => (
              <div
                key={qubitIndex}
                className="flex items-center border-b border-gray-200"
              >
                <div className="w-12 flex-shrink-0 text-sm text-gray-600 py-3">
                  Q{qubitIndex}
                </div>
                {steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="w-16 h-12 border-r border-gray-200 flex items-center justify-center relative cursor-pointer hover:bg-gray-50"
                    onClick={() => addGateToCircuit(qubitIndex, stepIndex)}
                  >
                    {/* Qubit line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>

                    {/* Gate visualization */}
                    {gates
                      .filter(
                        (g) =>
                          g.step === stepIndex && g.targets.includes(qubitIndex)
                      )
                      .map((gate, i) => (
                        <div
                          key={i}
                          className="z-10 w-10 h-10 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center text-indigo-700 font-medium"
                        >
                          {gate.gate.symbol}
                          {gate.controls && (
                            <span className="absolute -top-2 text-xs">●</span>
                          )}
                        </div>
                      ))}

                    {/* Control points for multi-qubit gates */}
                    {gates
                      .filter(
                        (g) =>
                          g.step === stepIndex &&
                          g.controls &&
                          g.controls.includes(qubitIndex)
                      )
                      .map((gate, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-indigo-700 rounded-full z-20"
                        ></div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {results && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Simulation Results
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">Final State</div>
              <div className="font-mono text-sm">
                {results.state.amplitudes.map((amp: any, i: number) => (
                  <div key={i}>
                    |{i.toString(2).padStart(results.state.numQubits, "0")}⟩:{" "}
                    {amp.re.toFixed(3)} {amp.im >= 0 ? "+" : ""}
                    {amp.im.toFixed(3)}i
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-500">
                Measurement Probabilities
              </div>
              {results.probabilities.map((prob: number, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span>
                    |{i.toString(2).padStart(results.state.numQubits, "0")}⟩:
                  </span>
                  <span>{(prob * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500 mb-2">
              Measurement Results (100 samples)
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(results.measurements)).map((value: any) => (
                <div
                  key={value}
                  className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
                >
                  |{value.toString(2).padStart(results.state.numQubits, "0")}⟩:{" "}
                  {
                    results.measurements.filter((m: number) => m === value)
                      .length
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
