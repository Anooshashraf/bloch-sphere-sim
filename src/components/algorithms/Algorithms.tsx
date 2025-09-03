// components/algorithms/Algorithms.tsx
"use client";

import { useState } from "react";
import { simulateAlgorithm } from "../core/simulator";
import ResultsPanel from "../results/ResultsPanel";

export default function Algorithms() {
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<string>("deutsch-jozsa");
  const [results, setResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const algorithms = [
    {
      id: "deutsch-jozsa",
      name: "Deutsch-Jozsa Algorithm",
      description: "Determines if a function is constant or balanced",
      complexity: "O(1) vs O(2ⁿ) classical",
    },
    {
      id: "grover",
      name: "Grover's Algorithm",
      description: "Quantum search algorithm for unstructured data",
      complexity: "O(√N) vs O(N) classical",
    },
    {
      id: "shor",
      name: "Shor's Algorithm",
      description: "Finds prime factors of an integer",
      complexity: "O((log N)³) vs O(e^{(log N)^{1/3}}) classical",
    },
    {
      id: "quantum-fourier",
      name: "Quantum Fourier Transform",
      description: "Quantum analogue of the discrete Fourier transform",
      complexity: "O((log N)²) vs O(N log N) classical",
    },
  ];

  const runAlgorithm = async () => {
    setIsRunning(true);
    try {
      // Simulate the algorithm (in a real app, this would be actual quantum computation)
      const result = await simulateAlgorithm(selectedAlgorithm);
      setResults(result);
    } catch (error) {
      console.error("Error running algorithm:", error);
      setResults({ error: "Failed to run algorithm" });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quantum Algorithms
        </h2>
        <p className="text-gray-600 mb-6">
          Explore fundamental quantum algorithms that demonstrate quantum
          advantage over classical approaches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {algorithms.map((algo) => (
            <div
              key={algo.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAlgorithm === algo.id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedAlgorithm(algo.id)}
            >
              <h3 className="font-semibold text-gray-800">{algo.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{algo.description}</p>
              <div className="mt-2 text-xs text-indigo-600 font-medium">
                {algo.complexity}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">
            Algorithm Details
          </h3>
          {selectedAlgorithm === "deutsch-jozsa" && (
            <div className="text-sm text-gray-600">
              <p>
                The Deutsch-Jozsa algorithm determines whether a function is
                constant (returns all 0s or all 1s) or balanced (returns 0s for
                half the inputs and 1s for the other half).
              </p>
              <p className="mt-2">
                Quantum advantage: Requires only one function evaluation
                compared to 2ⁿ⁻¹+1 in the worst case for classical algorithms.
              </p>
            </div>
          )}
          {selectedAlgorithm === "grover" && (
            <div className="text-sm text-gray-600">
              <p>
                Grover's algorithm searches an unstructured database of N items
                in O(√N) time, providing a quadratic speedup over classical
                algorithms.
              </p>
              <p className="mt-2">
                Applications: Database search, solving NP-complete problems, and
                cryptography.
              </p>
            </div>
          )}
          {selectedAlgorithm === "shor" && (
            <div className="text-sm text-gray-600">
              <p>
                Shor's algorithm finds the prime factors of an integer in
                polynomial time, which would break widely used cryptographic
                systems like RSA.
              </p>
              <p className="mt-2">
                This algorithm demonstrates exponential speedup over the best
                known classical factoring algorithms.
              </p>
            </div>
          )}
          {selectedAlgorithm === "quantum-fourier" && (
            <div className="text-sm text-gray-600">
              <p>
                The Quantum Fourier Transform is the quantum analogue of the
                classical discrete Fourier transform.
              </p>
              <p className="mt-2">
                It forms the basis for many quantum algorithms including Shor's
                algorithm and quantum phase estimation.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={runAlgorithm}
          disabled={isRunning}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run Algorithm"}
        </button>
      </div>

      {results && (
        <ResultsPanel results={results} algorithm={selectedAlgorithm} />
      )}
    </div>
  );
}
