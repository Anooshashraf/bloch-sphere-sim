import React from "react";

interface ResultsPanelProps {
  results: any;
  onBack: () => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onBack }) => {
  if (!results) {
    return (
      <div className="text-[#9aa0c7]">
        No results available yet. Run a circuit or algorithm to see results.
      </div>
    );
  }

  return (
    <div>
      <pre className="bg-[#0f1116] p-4 rounded text-sm overflow-auto">
        {JSON.stringify(results, null, 2)}
      </pre>
      <button
        className="mt-4 px-4 py-2 bg-[#4cc9f0] text-black rounded hover:bg-[#3ab0d0]"
        onClick={onBack}
      >
        Back to Circuit
      </button>
    </div>
  );
};

export default ResultsPanel;
