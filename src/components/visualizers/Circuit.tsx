"use client";

import React, { useState } from "react";
import { runSimulation, SimulationResult, Gate } from "../core/simulator";

interface CircuitProps {
  onRun?: (result: SimulationResult) => void;
}

const GATE_PALETTE = ["X", "Y", "Z", "H"];

const Circuit: React.FC<CircuitProps> = ({ onRun }) => {
  const [gates, setGates] = useState<Gate[]>([]);
  const numQubits = 1;

  const addGate = (name: string) => {
    const newGates = [...gates, { name, target: 0 }];
    setGates(newGates);
  };

  const runCircuit = () => {
    const result = runSimulation(numQubits, gates);
    onRun?.(result);
  };

  return (
    <div className="p-4 bg-[#13131a] rounded-lg border border-[#24243a]">
      <h3 className="text-lg text-[#ffc300] mb-2">Circuit Editor</h3>
      <div className="flex gap-2 mb-3">
        {GATE_PALETTE.map((g) => (
          <button
            key={g}
            onClick={() => addGate(g)}
            className="px-3 py-1 bg-[#24243a] text-[#ffc300] rounded-lg"
          >
            {g}
          </button>
        ))}
      </div>

      <div className="text-gray-300 mb-2">
        Current Gates: {gates.map((g) => g.name).join(" → ") || "None"}
      </div>

      <button
        onClick={runCircuit}
        className="px-4 py-2 bg-[#ffc300] text-black rounded-lg"
      >
        Run Circuit
      </button>
    </div>
  );
};

export default Circuit;
