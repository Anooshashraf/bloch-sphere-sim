"use client";

import { useState, useRef } from "react";
import {
  QuantumGate,
  SINGLE_QUBIT_GATES,
  TWO_QUBIT_GATES,
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

    const existingGateIndex = gates.findIndex(
      (g) => g.targets[0] === qubitIndex && g.step === stepIndex
    );

    let newGates;
    if (existingGateIndex >= 0) {
      newGates = [...gates];
      newGates[existingGateIndex] = { ...newGate, step: stepIndex };
    } else {
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

  const maxSteps =
    gates.length > 0 ? Math.max(...gates.map((g) => g.step)) + 1 : 5;
  const steps = Array.from({ length: maxSteps }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Gate Palette */}
      <div className="bg-[#13131a] border border-[#24243a] p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-[#ffc300] mb-3">
          Quantum Gates
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-400 font-medium">
            Single-qubit:
          </span>
          {SINGLE_QUBIT_GATES.map((gate) => (
            <button
              key={gate.name}
              onClick={() => setSelectedGate(gate)}
              className={`px-3 py-1 text-sm rounded-lg border transition ${
                selectedGate?.name === gate.name
                  ? "bg-[#4c6cff] border-[#4c6cff] text-white"
                  : "bg-[#1a1b26] border-[#2a2b3d] text-gray-300 hover:bg-[#2a2b3d]"
              }`}
            >
              {gate.symbol}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400 font-medium">Two-qubit:</span>
          {TWO_QUBIT_GATES.map((gate) => (
            <button
              key={gate.name}
              onClick={() => setSelectedGate(gate)}
              className={`px-3 py-1 text-sm rounded-lg border transition ${
                selectedGate?.name === gate.name
                  ? "bg-[#4c6cff] border-[#4c6cff] text-white"
                  : "bg-[#1a1b26] border-[#2a2b3d] text-gray-300 hover:bg-[#2a2b3d]"
              }`}
            >
              {gate.symbol}
            </button>
          ))}
        </div>
        {selectedGate && (
          <div className="mt-3 p-2 bg-[#1d2233] rounded text-sm text-gray-300">
            <strong className="text-[#ffc300]">{selectedGate.name}:</strong>{" "}
            {selectedGate.description}
          </div>
        )}
      </div>

      {/* Circuit Builder */}
      <div className="bg-[#13131a] border border-[#24243a] p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#ffc300]">
            Quantum Circuit
          </h3>
          <div className="flex gap-2">
            <button
              onClick={runSimulation}
              className="px-3 py-1 bg-[#4c6cff] text-white text-sm rounded-lg hover:bg-[#3b55cc]"
            >
              Run
            </button>
            <button
              onClick={clearCircuit}
              className="px-3 py-1 bg-[#2a2b3d] text-gray-300 text-sm rounded-lg hover:bg-[#3a3b4d]"
            >
              Clear
            </button>
          </div>
        </div>

        <div ref={circuitRef} className="overflow-x-auto">
          <div className="min-w-max">
            {/* Step labels */}
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

            {/* Circuit Grid */}
            {Array.from({ length: qubits }, (_, qubitIndex) => (
              <div
                key={qubitIndex}
                className="flex items-center border-b border-[#24243a]"
              >
                <div className="w-12 flex-shrink-0 text-sm text-gray-400 py-3">
                  Q{qubitIndex}
                </div>
                {steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="w-16 h-12 border-r border-[#24243a] flex items-center justify-center relative cursor-pointer hover:bg-[#1a1b26]"
                    onClick={() => addGateToCircuit(qubitIndex, stepIndex)}
                  >
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2a2b3d]"></div>

                    {gates
                      .filter(
                        (g) =>
                          g.step === stepIndex && g.targets.includes(qubitIndex)
                      )
                      .map((gate, i) => (
                        <div
                          key={i}
                          className="z-10 w-10 h-10 bg-[#4c6cff] border border-[#3b55cc] rounded-lg flex items-center justify-center text-white font-medium"
                        >
                          {gate.gate.symbol}
                          {gate.controls && (
                            <span className="absolute -top-2 text-xs">●</span>
                          )}
                        </div>
                      ))}

                    {gates
                      .filter(
                        (g) =>
                          g.step === stepIndex &&
                          g.controls &&
                          g.controls.includes(qubitIndex)
                      )
                      .map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-[#ffc300] rounded-full z-20"
                        ></div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Results */}
      {results && (
        <div className="bg-[#13131a] border border-[#24243a] p-4 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#ffc300] mb-3">
            Simulation Results
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#1a1b26] p-3 rounded-lg">
              <div className="text-sm text-gray-400">Final State</div>
              <div className="font-mono text-sm text-gray-300">
                {results.state.amplitudes.map((amp: any, i: number) => (
                  <div key={i}>
                    |{i.toString(2).padStart(results.state.numQubits, "0")}⟩:{" "}
                    {amp.re.toFixed(3)} {amp.im >= 0 ? "+" : ""}
                    {amp.im.toFixed(3)}i
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1a1b26] p-3 rounded-lg">
              <div className="text-sm text-gray-400">
                Measurement Probabilities
              </div>
              {results.probabilities.map((prob: number, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span>
                    |{i.toString(2).padStart(results.state.numQubits, "0")}⟩:
                  </span>
                  <span className="text-[#ffc300]">
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1b26] p-3 rounded-lg">
            <div className="text-sm text-gray-400 mb-2">
              Measurement Results (100 samples)
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.from(new Set(results.measurements)).map((value: any) => (
                <div
                  key={value}
                  className="text-xs bg-[#4c6cff] text-white px-2 py-1 rounded-lg"
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
