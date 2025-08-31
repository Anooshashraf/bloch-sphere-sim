"use client";

import React from "react";
import { runSimulation, SimulationResult } from "../core/simulator";

interface AlgorithmsProps {
  onRun?: (result: SimulationResult) => void;
}

const Algorithms: React.FC<AlgorithmsProps> = ({ onRun }) => {
  const runHadamardDemo = () => {
    const result = runSimulation(1, [{ name: "H", target: 0 }]);
    onRun?.(result);
  };

  return (
    <div className="p-4 bg-[#13131a] rounded-lg border border-[#24243a]">
      <h3 className="text-lg text-[#ffc300] mb-2">Algorithms</h3>
      <button
        onClick={runHadamardDemo}
        className="px-4 py-2 bg-[#ffc300] text-black rounded-lg"
      >
        Run Hadamard |0⟩
      </button>
    </div>
  );
};

export default Algorithms;
