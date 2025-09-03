// components/results/ResultsPanel.tsx
interface ResultsPanelProps {
  results: any;
  algorithm?: string;
}

export default function ResultsPanel({
  results,
  algorithm,
}: ResultsPanelProps) {
  if (!results) return null;

  const renderDeutschJozsaResults = () => (
    <div className="space-y-4">
      <div
        className={`p-3 rounded-md ${
          results.result === "constant"
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        <strong>Function is {results.result}</strong>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Quantum Evaluations</div>
          <div className="text-xl font-bold">{results.evaluations}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">
            Classical Evaluations (worst case)
          </div>
          <div className="text-xl font-bold">
            {results.classicalEvaluations}
          </div>
        </div>
      </div>
      <div className="bg-indigo-50 p-3 rounded-md">
        <div className="text-sm text-indigo-800">
          <strong>Speedup:</strong> {results.speedup}
        </div>
      </div>
    </div>
  );

  const renderGroverResults = () => (
    <div className="space-y-4">
      <div className="bg-green-100 p-3 rounded-md text-green-800">
        <strong>Item found at index: {results.foundIndex}</strong>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Quantum Iterations</div>
          <div className="text-xl font-bold">{results.iterations}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">
            Classical Checks (average)
          </div>
          <div className="text-xl font-bold">{results.classicalChecks}</div>
        </div>
      </div>
      <div className="bg-indigo-50 p-3 rounded-md">
        <div className="text-sm text-indigo-800">
          <strong>Speedup:</strong> {results.speedup} (O(√N) vs O(N))
        </div>
      </div>
    </div>
  );

  const renderShorResults = () => (
    <div className="space-y-4">
      <div
        className={`p-3 rounded-md ${
          results.success
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        <strong>
          {results.success
            ? "Factorization successful!"
            : "Factorization failed"}
        </strong>
      </div>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm text-gray-500">Number to factor</div>
        <div className="text-xl font-bold">{results.number}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm text-gray-500">Factors found</div>
        <div className="text-xl font-bold">{results.factors.join(" × ")}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-md">
        <div className="text-sm text-gray-500">Iterations required</div>
        <div className="text-xl font-bold">{results.iterations}</div>
      </div>
    </div>
  );

  const renderQFTResults = () => (
    <div className="space-y-4">
      <div className="bg-blue-100 p-3 rounded-md text-blue-800">
        <strong>Quantum Fourier Transform applied successfully</strong>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Input state</div>
          <div className="font-mono text-sm">[{results.input.join(", ")}]</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-500">Output state</div>
          <div className="font-mono text-sm">
            [{results.output.map((x: number) => x.toFixed(2)).join(", ")}]
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    switch (results.type) {
      case "deutsch-jozsa":
        return renderDeutschJozsaResults();
      case "grover":
        return renderGroverResults();
      case "shor":
        return renderShorResults();
      case "quantum-fourier":
        return renderQFTResults();
      default:
        return <pre>{JSON.stringify(results, null, 2)}</pre>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Algorithm Results
      </h3>
      {renderResults()}
    </div>
  );
}
