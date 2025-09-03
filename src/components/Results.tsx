"use client";

import React, { useState, useEffect } from "react";

// === Gate Palette & Algorithms ===
const GATE_PALETTE = [
  { label: "X", name: "Pauli-X" },
  { label: "Y", name: "Pauli-Y" },
  { label: "Z", name: "Pauli-Z" },
  { label: "H", name: "Hadamard" },
  { label: "S", name: "Phase" },
  { label: "T", name: "T" },
  { label: "CX", name: "CNOT" },
  { label: "CCX", name: "Toffoli" },
  { label: "SW", name: "SWAP" },
  { label: "I", name: "Identity" },
  { label: "M", name: "Measure" },
];

const INIT_CIRCUIT = [
  ["H", "CX", "", "T"],
  ["", "CX", "Z", ""],
  ["", "CCX", "", "SW"],
];

const QUANTUM_ALGORITHMS = [
  {
    id: "grover",
    name: "Grover's Search Algorithm",
    description:
      "Finds a marked item in an unsorted database quadratically faster than classical algorithms.",
    complexity: "O(√N) vs classical O(N)",
    steps: [
      "Initialize all qubits to |0⟩",
      "Apply Hadamard gates to create superposition",
      "Apply oracle to mark the solution",
      "Apply diffusion operator to amplify amplitude",
      "Repeat steps 3-4 ≈ √N times",
      "Measure to get solution with high probability",
    ],
    circuit: [
      ["H", "H", "O", "D", "M"],
      ["H", "H", "O", "D", "M"],
    ],
    explanation:
      "Grover's algorithm uses amplitude amplification to boost the probability of measuring the correct solution. The oracle 'marks' the solution by flipping its phase, and the diffusion operator inverts all amplitudes about the average, amplifying the marked item.",
  },
  // ... other algorithms omitted for brevity (keep from your file)
];

export default function Algorithms() {
  // === State ===
  const [circuit, setCircuit] = useState(INIT_CIRCUIT);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const [initialStates, setInitialStates] = useState<string[]>(
    Array(INIT_CIRCUIT.length).fill("|0⟩")
  );
  const [finalStates, setFinalStates] = useState<string[] | null>(null);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(
    null
  );

  // === Auto load circuit when algorithm chosen ===
  useEffect(() => {
    if (selectedAlgorithm) {
      const algo = QUANTUM_ALGORITHMS.find((a) => a.id === selectedAlgorithm);
      if (algo) {
        setCircuit(algo.circuit);
        setInitialStates(Array(algo.circuit.length).fill("|0⟩"));
      }
    }
  }, [selectedAlgorithm]);

  const currentAlgorithm = selectedAlgorithm
    ? QUANTUM_ALGORITHMS.find((a) => a.id === selectedAlgorithm)
    : null;

  // === Run logic ===
  const runCircuit = () => {
    const computed = initialStates.map((state) => state);

    circuit.forEach((wire, qi) => {
      wire.forEach((gate) => {
        if (!gate) return;
        if (gate === "H") {
          computed[qi] = `(${computed[qi].replace("⟩", "⟩ + |1⟩")})/√2`;
        } else if (gate === "X") {
          computed[qi] = computed[qi].replace("0", "1").replace("1", "0");
        } else if (gate === "M") {
          computed[qi] = `Measured: ${Math.random() > 0.5 ? "|1⟩" : "|0⟩"}`;
        } else {
          computed[qi] = `${gate}(${computed[qi]})`;
        }
      });
    });

    setFinalStates(computed);
  };

  // === Styles (compact for clarity) ===
  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #4c6cff 0%, #0077ff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    marginRight: 8,
    cursor: "pointer",
  };

  const runButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)",
  };

  // === Render ===
  return (
    <div style={{ padding: 16, color: "#fff", background: "#181c24" }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>
        Quantum Playground
      </h2>

      {/* Algorithm Selector */}
      <div style={{ marginBottom: 16 }}>
        {QUANTUM_ALGORITHMS.map((algo) => (
          <button
            key={algo.id}
            style={{
              ...buttonStyle,
              background:
                selectedAlgorithm === algo.id
                  ? "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)"
                  : buttonStyle.background,
            }}
            onClick={() => setSelectedAlgorithm(algo.id)}
          >
            {algo.name.split(" ")[0]}
          </button>
        ))}
        <button
          style={{
            ...buttonStyle,
            background: "linear-gradient(90deg, #f44336 0%, #d32f2f 100%)",
          }}
          onClick={() => {
            setSelectedAlgorithm(null);
            setCircuit(INIT_CIRCUIT);
            setInitialStates(Array(INIT_CIRCUIT.length).fill("|0⟩"));
            setFinalStates(null);
          }}
        >
          Custom
        </button>
      </div>

      {/* Run Button */}
      <div style={{ marginBottom: 16 }}>
        <button style={runButtonStyle} onClick={runCircuit}>
          Run ▶
        </button>
      </div>

      {/* Results Panel (appears after Run) */}
      {finalStates && (
        <div
          style={{
            background: "#232b3a",
            borderRadius: 8,
            padding: "12px 14px",
            marginTop: 16,
            boxShadow: "0 2px 8px #0006",
          }}
        >
          <h3 style={{ color: "#ffc300" }}>Results</h3>
          {currentAlgorithm && (
            <>
              <p>
                <b>{currentAlgorithm.name}</b>
              </p>
              <p>{currentAlgorithm.description}</p>
              <p>
                <b>Complexity:</b> {currentAlgorithm.complexity}
              </p>
              <p style={{ fontSize: 13, color: "#ddd" }}>
                {currentAlgorithm.explanation}
              </p>
              <h4 style={{ color: "#4c6cff" }}>Steps:</h4>
              <ol>
                {currentAlgorithm.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </>
          )}

          <h4 style={{ color: "#4c6cff", marginTop: 12 }}>
            Final Qubit States:
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {finalStates.map((state, i) => (
              <div key={i}>
                <b style={{ color: "#aaa" }}>q{i}:</b>{" "}
                <span style={{ color: "#ffc300" }}>{state}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
