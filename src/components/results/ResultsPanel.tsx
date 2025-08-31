"use client";

import React from "react";
import { SimulationResult } from "../core/simulator";

interface ResultsPanelProps {
  results: SimulationResult | null;
  onBack?: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onBack }) => {
  if (!results) {
    return (
      <div className="p-4 text-gray-400">
        No results available. Run a circuit or algorithm first.
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#13131a] rounded-lg border border-[#24243a]">
      <h3 className="text-lg text-[#ffc300] mb-2">Simulation Results</h3>
      <p className="text-gray-300 mb-2">{results.explanation}</p>

      <h4 className="text-md text-[#9aa0c7] mb-1">Probabilities:</h4>
      <ul className="text-gray-200 mb-3">
        {Object.entries(results.probabilities).map(([state, prob]) => (
          <li key={state}>
            |{state}⟩ : {(prob * 100).toFixed(2)}%
          </li>
        ))}
      </ul>

      {onBack && (
        <button
          onClick={onBack}
          className="px-3 py-1 bg-[#24243a] text-[#ffc300] rounded-lg"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default ResultsPanel;
