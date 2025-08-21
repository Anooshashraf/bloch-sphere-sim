import React, { useEffect } from "react";

interface ResultsPanelProps {
  results: any;
  onBack: () => void;
}

function tryParseResults(raw: any) {
  if (!raw) return { code: "", counts: null, explanation: "", raw };
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return {
        code: parsed.code ?? "",
        counts: parsed.counts ?? parsed.finalStates ?? parsed.count ?? null,
        explanation: parsed.explanation ?? parsed.description ?? "",
        raw: parsed,
      };
    } catch {
      return { code: "", counts: null, explanation: raw, raw };
    }
  }
  return {
    code: raw.code ?? "",
    counts: raw.counts ?? raw.finalStates ?? raw.count ?? null,
    explanation: raw.explanation ?? raw.description ?? "",
    raw,
  };
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  onBack,
}) => {
  if (!results) {
    return (
      <div className="text-[#9aa0c7]">
        No results available yet. Run a circuit or algorithm to see results.
      </div>
    );
  }

  const parsed = tryParseResults(results);
  const { code, counts, explanation, raw } = parsed;

  useEffect(() => {
    console.log("ResultsPanel rendered ->", { code, counts, explanation });
  }, [results]);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(raw ?? results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quantum-results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCounts = (c: any) => {
    if (!c)
      return (
        <div className="text-sm text-[#9aa0c7]">
          No technical results available.
        </div>
      );

    if (Array.isArray(c)) {
      return (
        <div className="space-y-2">
          {c.map((item, idx) => (
            <div
              key={idx}
              className="p-2 bg-[#0f1116] rounded-md text-sm text-white"
            >
              {typeof item === "string" ? item : JSON.stringify(item)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof c === "object") {
      return (
        <div className="space-y-2">
          {Object.entries(c).map(([k, v]) => (
            <div
              key={k}
              className="p-2 bg-[#0f1116] rounded-md text-sm text-white flex justify-between"
            >
              <span className="font-mono">{k}</span>
              <span className="text-[#9aa0c7]">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <div className="text-sm text-white">{String(c)}</div>;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold text-[#ffc300]">Run Results</div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-3 py-1 rounded bg-[#3b82f6] text-white hover:bg-[#2563eb]"
          >
            Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Algorithm Code */}
        <div className="bg-[#1e2235] border border-[#2a2f4c] rounded-xl shadow-lg">
          <div className="border-b border-[#2a2f4c] p-3 font-semibold text-lg text-white">
            Algorithm Code
          </div>
          <div className="p-3">
            <pre className="bg-[#0f1116] p-3 rounded text-sm text-[#c5f2e2] overflow-auto">
              {code || "No algorithm code provided."}
            </pre>
          </div>
        </div>

        {/* Technical Result */}
        <div className="bg-[#1e2235] border border-[#2a2f4c] rounded-xl shadow-lg">
          <div className="border-b border-[#2a2f4c] p-3 font-semibold text-lg text-white">
            Technical Result
          </div>
          <div className="p-3 text-sm text-[#9aa0c7]">
            {renderCounts(counts)}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-[#1e2235] border border-[#2a2f4c] rounded-xl shadow-lg">
          <div className="border-b border-[#2a2f4c] p-3 font-semibold text-lg text-white">
            Explanation
          </div>
          <div className="p-3 text-sm text-[#d1d5e8] whitespace-pre-line">
            {explanation || "No explanation provided."}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-[#0b0d11] border border-[#1f2530] rounded p-3 text-sm text-[#9aa0c7]">
        <div className="font-semibold mb-2 text-[#c7d0e6]">
          Raw Technical Data
        </div>
        <pre className="max-h-48 overflow-auto">
          {JSON.stringify(raw ?? results, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ResultsPanel;
