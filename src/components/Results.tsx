import React from "react";

interface ResultsPanelProps {
  results: any;
  onBack: () => void;
}

const describeResults = (data: any): string => {
  if (!data) return "No results to display";

  if (data?.results?.[0]?.data?.counts) {
    const counts: Record<string, number> = data.results[0].data.counts;
    const total = Object.values(counts).reduce<number>(
      (sum: number, val: number) => sum + val,
      0
    );
    const mostFrequent = Object.entries(counts).reduce(
      (max, [key, val]) => (val > max[1] ? [key, val] : max),
      ["", 0] as [string, number]
    );
    return `🔢 Measurement Results (${total} shots):
    • Most frequent outcome: ${mostFrequent[0]} (${mostFrequent[1]} occurrences)
    • ${Object.keys(counts).length} unique outcomes`;
  }

  // Handle plain counts object
  if (typeof data === "object" && !Array.isArray(data)) {
    const counts: Record<string, number> = data.counts || data;
    if (Object.keys(counts).some((k) => /^[01]+$/.test(k))) {
      const total = Object.values(counts).reduce<number>(
        (sum: number, val: number) => sum + val,
        0
      );
      const outcomes = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      return `📊 Top Measurements (${total} shots):${outcomes
        .map(
          ([outcome, count]) =>
            `\n• ${outcome}: ${count} (${Math.round((count / total) * 100)}%)`
        )
        .join("")}`;
    }
    return `📦 Results Data:\n${JSON.stringify(data, null, 2)}`;
  }

  // Handle array results (statevector)
  if (Array.isArray(data)) {
    const qubitCount = Math.log2(data.length);
    return `🌌 Quantum State Vector:
    • Qubits: ${qubitCount} (${data.length} amplitudes)
    • First amplitude: ${data[0].toFixed(4)}${
      data.length > 1
        ? `\n• Last amplitude: ${data[data.length - 1].toFixed(4)}`
        : ""
    }`;
  }

  return `✅ Algorithm Completed:\n${JSON.stringify(data, null, 2)}`;
};

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, onBack }) => {
  if (!results) {
    return (
      <div className="text-[#9aa0c7] p-4 bg-[#0f1116] rounded border border-dashed border-[#4cc9f0]">
        ⚠️ No results available. Run a circuit first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#1a1d2e] rounded-lg border border-[#4cc9f0]">
        <h3 className="text-[#4cc9f0] font-bold mb-2">Results Analysis</h3>
        <div className="text-[#c5c8e0] whitespace-pre-wrap font-mono text-sm">
          {describeResults(results)}
        </div>
      </div>

      <div className="bg-[#0f1116] p-4 rounded border border-[#2d2f3d]">
        <div className="text-[#9aa0c7] text-sm mb-2">Raw Data:</div>
        <pre className="text-sm overflow-auto max-h-60">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-[#4cc9f0] hover:bg-[#3ab0d0] text-black rounded transition-colors"
        onClick={onBack}
      >
        ← Back to Circuit
      </button>
    </div>
  );
};

export default ResultsPanel;
