"use client";

import React, { useState, useEffect } from "react";

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
    name: "Grover's Search Algorithm: ",
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
  {
    id: "shor: ",
    name: "Shor's Factoring Algorithm",
    description:
      "Factors large integers exponentially faster than classical algorithms, breaking RSA encryption.",
    complexity: "O((log N)³) vs classical superpolynomial",
    steps: [
      "Initialize two registers (quantum and classical)",
      "Apply quantum Fourier transform (QFT)",
      "Perform modular exponentiation",
      "Apply inverse QFT",
      "Measure first register",
      "Use continued fractions to find period",
      "Compute factors from period",
    ],
    circuit: [
      ["H", "H", "H", "H", "QFT⁻¹", "M"],
      ["", "MOD", "MOD", "MOD", "MOD", ""],
    ],
    explanation:
      "Shor's algorithm reduces factoring to period finding. The quantum part finds the period of a function, which is then processed classically to find factors. The exponential speedup comes from the QFT and quantum parallelism.",
  },
  {
    id: "deutsch: ",
    name: "Deutsch-Jozsa Algorithm",
    description:
      "Determines if a function is constant or balanced with a single query.",
    complexity: "O(1) vs classical O(2ⁿ)",
    steps: [
      "Initialize |0⟩⊗ⁿ|1⟩",
      "Apply Hadamard to all qubits",
      "Apply function as quantum oracle",
      "Apply Hadamard to first n qubits",
      "Measure first register",
    ],
    circuit: [
      ["H", "", "Uf", "H", "M"],
      ["H", "X", "Uf", "H", "M"],
    ],
    explanation:
      "This algorithm demonstrates quantum parallelism. By querying the function in superposition, it evaluates all possible inputs simultaneously and uses interference to determine the function's nature with certainty in one step.",
  },
  {
    id: "teleport: ",
    name: "Quantum Teleportation",
    description: "Transfers quantum state between qubits using entanglement.",
    complexity: "Requires classical communication",
    steps: [
      "Create entangled pair (Bell state)",
      "Perform Bell measurement on sender's qubits",
      "Send classical results (2 bits)",
      "Apply corrections based on classical bits",
    ],
    circuit: [
      ["H", "CX", "M", "", ""],
      ["", "CX", "M", "", ""],
      ["ψ", "", "", "X", "Z"],
    ],
    explanation:
      "Quantum teleportation transfers quantum information without moving physical particles. It uses entanglement as a resource and requires classical communication to complete the state transfer, preserving the no-cloning theorem.",
  },
  {
    id: "qft  ",
    name: "Fourier Transform: ",
    description:
      "Quantum analog of discrete Fourier transform, exponentially faster than classical FFT for certain applications.",
    complexity: "O((log N)²) vs classical O(N log N)",
    steps: [
      "Initialize qubits in input state",
      "Apply Hadamard to first qubit",
      "Apply controlled phase rotations",
      "Repeat for subsequent qubits",
      "Apply swap gates for correct order",
    ],
    circuit: [
      ["H", "R1", "R2", "R3", "SWAP"],
      ["", "●", "│", "│", "SWAP"],
      ["", "", "●", "│", ""],
      ["", "", "", "H", ""],
    ],
    explanation:
      "QFT is the foundation for many quantum algorithms. It transforms quantum states into frequency domain representation, enabling efficient period finding in Shor's algorithm and quantum phase estimation.",
  },
  {
    id: "bv",
    name: "Bernstein-Vazirani Algorithm: ",
    description:
      "Determines a secret bitstring with a single query, outperforming classical linear scans.",
    complexity: "O(1) vs classical O(n)",
    steps: [
      "Initialize |0⟩⊗ⁿ and |1⟩",
      "Apply Hadamard to all qubits",
      "Apply inner-product oracle",
      "Apply Hadamard to first n qubits",
      "Measure to reveal secret string",
    ],
    circuit: [
      ["H", "", "Uf", "H", "M"],
      ["H", "", "Uf", "H", "M"],
      ["H", "X", "Uf", "H", ""],
    ],
    explanation:
      "This algorithm demonstrates quantum parallelism's power for oracle problems. By encoding the secret string in phase shifts and using interference, it extracts n bits of information with one query.",
  },
  {
    id: "vqe",
    name: "Variational Quantum Eigensolver: ",
    description:
      "Hybrid algorithm for finding molecular ground states using parameterized quantum circuits.",
    complexity: "Polynomial in qubits (NISQ-friendly)",
    steps: [
      "Prepare parameterized ansatz state",
      "Measure expectation values",
      "Compute total energy classically",
      "Update parameters using optimizer",
      "Repeat until convergence",
    ],
    circuit: [
      ["Ry(θ1)", "Rz(θ2)", "●", "Ry(θ4)", "..."],
      ["Ry(θ1)", "●", "Rz(θ3)", "│", "..."],
      ["H", "│", "Ry(θ3)", "●", "..."],
    ],
    explanation:
      "VQE is a leading NISQ-era algorithm for quantum chemistry. It combines quantum state preparation with classical optimization to find eigenvalues, avoiding deep circuits through variational principles.",
  },
  {
    id: "qpe",
    name: "Phase Estimation: ",
    description:
      "Estimates eigenvalue phase of unitary operator, core component of Shor's and chemistry algorithms.",
    complexity: "O(1/ε) precision with O(log(1/ε)) qubits",
    steps: [
      "Prepare eigenstate |ψ⟩",
      "Apply Hadamards to counting register",
      "Apply controlled-U^(2^j) operations",
      "Apply inverse QFT",
      "Measure counting register",
    ],
    circuit: [
      ["H", "●", "●", "QFT†", "M"],
      ["H", "│", "●", "QFT†", "M"],
      ["|ψ⟩", "U", "U²", "U⁴", "|ψ⟩"],
    ],
    explanation:
      "QPE solves the eigenvalue problem by encoding phase information in the counting register. It provides exponential speedup over classical methods for eigenproblems and matrix inversion.",
  },
  {
    id: "qaa: ",
    name: "Quantum Amplitude Amplification",
    description:
      "Generalization of Grover's search that boosts success probability of quantum algorithms.",
    complexity: "O(1/√α) for initial success probability α",
    steps: [
      "Prepare initial state |Ψ⟩",
      "Define good state subspace",
      "Apply reflection about good states",
      "Apply reflection about initial state",
      "Repeat O(1/√α) times",
    ],
    circuit: [
      ["A", "Sχ", "A†", "SΨ", "A", "..."],
      ["A", "Sχ", "A†", "SΨ", "A", "..."],
    ],
    explanation:
      "QAA provides quadratic speedup for any algorithm where solutions can be recognized. It works by rotating the state vector toward the good subspace through iterative reflections.",
  },
  {
    id: "simon: ",
    name: "Simon's Algorithm",
    description:
      "Solves the hidden subgroup problem for boolean functions, inspiring Shor's algorithm.",
    complexity: "O(n) vs classical Ω(2^(n/2))",
    steps: [
      "Initialize two n-qubit registers",
      "Apply Hadamards to first register",
      "Apply oracle for f(x)",
      "Apply Hadamards to first register",
      "Measure first register repeatedly",
      "Solve linear system for hidden string",
    ],
    circuit: [
      ["H", "", "Uf", "H", "M"],
      ["H", "", "Uf", "H", "M"],
      ["|0⟩", "", "│", "│", ""],
      ["|0⟩", "", "=f(x)", "", ""],
    ],
    explanation:
      "Simon's algorithm demonstrates exponential quantum advantage for period finding. By measuring in superposition and analyzing interference patterns, it reveals XOR masks with polynomial queries.",
  },
];

interface CircuitProps {
  // results removed on purpose
}

export default function Circuit(_: CircuitProps) {
  // === state (unchanged except results-related reintroduced minimally) ===
  const [circuit, setCircuit] = useState(INIT_CIRCUIT);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const [initialStates, setInitialStates] = useState<string[]>(
    Array(INIT_CIRCUIT.length).fill("|0⟩")
  );
  const [showEquations, setShowEquations] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(
    null
  );
  const [algorithmStep, setAlgorithmStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [algorithmCode, setAlgorithmCode] = useState<string>("");

  // <-- NEW: final states stored in component state so UI can render them -->
  const [finalStates, setFinalStates] = useState<string[] | null>(null);

  // === effects (unchanged) ===
  useEffect(() => {
    if (selectedAlgorithm) {
      const algo = QUANTUM_ALGORITHMS.find((a) => a.id === selectedAlgorithm);
      if (algo) {
        setCircuit(algo.circuit);
        setInitialStates(Array(algo.circuit.length).fill("|0⟩"));
        setAlgorithmStep(0);
      }
    }
  }, [selectedAlgorithm]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && selectedAlgorithm) {
      const algo = QUANTUM_ALGORITHMS.find((a) => a.id === selectedAlgorithm);
      if (algo && algorithmStep < algo.steps.length - 1) {
        timer = setTimeout(() => {
          setAlgorithmStep((prev) => prev + 1);
        }, 2000);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, algorithmStep, selectedAlgorithm]);

  const currentAlgorithm = selectedAlgorithm
    ? QUANTUM_ALGORITHMS.find((a) => a.id === selectedAlgorithm)
    : null;

  const addQubit = () => {
    setCircuit([...circuit, Array(circuit[0]?.length || 4).fill("")]);
    setInitialStates([...initialStates, "|0⟩"]);
  };

  const removeQubit = () => {
    if (circuit.length > 1) {
      setCircuit(circuit.slice(0, -1));
      setInitialStates(initialStates.slice(0, -1));
    }
  };

  const addColumn = () => {
    setCircuit(circuit.map((wire) => [...wire, ""]));
  };

  const removeColumn = () => {
    if (circuit[0].length > 1)
      setCircuit(circuit.map((wire) => wire.slice(0, -1)));
  };

  const placeGate = (qi: number, gj: number) => {
    if (!selectedGate) return;
    setCircuit((prev) =>
      prev.map((wire, i) =>
        wire.map((gate, j) => (i === qi && j === gj ? selectedGate : gate))
      )
    );
    setSelectedGate(null);
  };

  const removeGate = (qi: number, gj: number) => {
    setCircuit((prev) =>
      prev.map((wire, i) =>
        wire.map((gate, j) => (i === qi && j === gj ? "" : gate))
      )
    );
  };

  const updateInitialState = (index: number, value: string) => {
    const newStates = [...initialStates];
    newStates[index] = value;
    setInitialStates(newStates);
  };

  // RUN logic: compute final states AND store them in React state for UI display
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
          // For other gates we show them applied as textual wrapper (non-destructive)
          computed[qi] = `${gate}(${computed[qi]})`;
        }
      });
    });

    setFinalStates(computed);
    console.log("circuit run finalStates ->", computed);
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(24,28,36,0.98)",
    borderRadius: 12,
    boxShadow: "0 6px 28px rgba(0,0,0,0.6)",
    padding: 16,
    color: "#fff",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #4c6cff 0%, #0077ff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 2px 8px #0004",
    transition: "background 0.18s, transform 0.18s",
    marginRight: 8,
    minWidth: 100,
  };

  const runButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)",
    minWidth: 90,
  };

  const algoButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #9c27b0 0%, #673ab7 100%)",
    padding: "6px 10px",
    minWidth: "auto",
  };

  const toggleButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: showEquations
      ? "linear-gradient(90deg, #4c6cff 0%, #0077ff 100%)"
      : "linear-gradient(90deg, #232b3a 0%, #181c24 100%)",
  };

  const stepButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)",
    minWidth: "auto",
  };

  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>
        <span style={{ color: "#4c6cff" }}>Quantum Playground</span>
      </h2>
      {/* Algorithm Selection (UI slightly compressed to match new layout) */}
      <div
        style={{
          background: "linear-gradient(120deg, #222 20%, #2b2633 100%)",
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 14,
          border: "1px solid #3b3f72",
          boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
        }}
      >
        <h3 style={{ color: "#ffc300", marginTop: 0, marginBottom: 10 }}>
          Quantum Algorithms Explorer
        </h3>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {QUANTUM_ALGORITHMS.map((algo) => (
            <button
              key={algo.id}
              style={{
                ...algoButtonStyle,
                background:
                  selectedAlgorithm === algo.id
                    ? "linear-gradient(90deg, #ff9800 0%, #ff5722 100%)"
                    : algoButtonStyle.background,
              }}
              onClick={() => {
                setSelectedAlgorithm(algo.id);
                setIsPlaying(false);
              }}
            >
              {algo.name.split(" ")[0]}
            </button>
          ))}
          <button
            style={{
              ...algoButtonStyle,
              background: "linear-gradient(90deg, #f44336 0%, #d32f2f 100%)",
            }}
            onClick={() => {
              setSelectedAlgorithm(null);
              setIsPlaying(false);
              setCircuit(INIT_CIRCUIT);
              setInitialStates(Array(INIT_CIRCUIT.length).fill("|0⟩"));
            }}
          >
            Custom
          </button>
        </div>

        {currentAlgorithm && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h4 style={{ color: "#ffc300", marginBottom: 6 }}>
                  {currentAlgorithm.name}
                </h4>
                <p style={{ color: "#ddd", margin: 0, fontSize: 13 }}>
                  {currentAlgorithm.description} <br />
                  <span style={{ color: "#4c6cff" }}>
                    Complexity: {currentAlgorithm.complexity}
                  </span>
                </p>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  style={stepButtonStyle}
                  onClick={() => setAlgorithmStep((p) => Math.max(0, p - 1))}
                  disabled={algorithmStep === 0}
                >
                  ← Prev
                </button>
                <button
                  style={{
                    ...stepButtonStyle,
                    background: isPlaying
                      ? "linear-gradient(90deg, #f44336 0%, #d32f2f 100%)"
                      : "linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)",
                  }}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "❚❚ Pause" : "▶ Play"}
                </button>
                <button
                  style={stepButtonStyle}
                  onClick={() =>
                    setAlgorithmStep((p) =>
                      Math.min(currentAlgorithm.steps.length - 1, p + 1)
                    )
                  }
                  disabled={algorithmStep === currentAlgorithm.steps.length - 1}
                >
                  Next →
                </button>
              </div>
            </div>

            <div
              style={{
                background: "rgba(0,0,0,0.22)",
                borderRadius: 8,
                padding: 10,
                marginTop: 10,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 180px", minWidth: 160 }}>
                <div style={{ color: "#4c6cff", fontWeight: 600 }}>
                  Step {algorithmStep + 1}/{currentAlgorithm.steps.length}:
                </div>
                <div style={{ color: "#fff", fontSize: 14 }}>
                  {currentAlgorithm.steps[algorithmStep]}
                </div>
              </div>

              <div style={{ flex: "2 1 220px", minWidth: 200 }}>
                <div style={{ color: "#ffc300", fontWeight: 600 }}>
                  Explanation:
                </div>
                <div style={{ color: "#ddd", fontSize: 13 }}>
                  {currentAlgorithm.explanation}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Initial States Input */}
      {showEquations && (
        <div
          style={{
            background: "#232b3a",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 12,
            boxShadow: "0 2px 8px #0004",
          }}
        >
          <div style={{ color: "#4c6cff", fontWeight: 600, marginBottom: 8 }}>
            Initial Qubit States:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {initialStates.map((state, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 6, color: "#aaa" }}>q{i}:</span>
                <select
                  value={state}
                  onChange={(e) => updateInitialState(i, e.target.value)}
                  style={{
                    background: "#181c24",
                    color: "#fff",
                    border: "1px solid #4c6cff",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 13,
                  }}
                >
                  <option value="|0⟩">|0⟩</option>
                  <option value="|1⟩">|1⟩</option>
                  <option value="|+⟩">|+⟩ (|0⟩ + |1⟩)/√2</option>
                  <option value="|-⟩">|-⟩ (|0⟩ - |1⟩)/√2</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Gate Palette */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        {GATE_PALETTE.map((gate) => (
          <div
            key={gate.label}
            title={gate.name}
            draggable
            onDragStart={() => setDraggedGate(gate.label)}
            onDragEnd={() => setDraggedGate(null)}
            onClick={() => setSelectedGate(gate.label)}
            style={{
              width: 40,
              height: 40,
              background:
                selectedGate === gate.label || draggedGate === gate.label
                  ? "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)"
                  : "linear-gradient(90deg, #232b3a 60%, #181c24 100%)",
              border:
                selectedGate === gate.label || draggedGate === gate.label
                  ? "2px solid #ffc300"
                  : "2px solid #4c6cff",
              borderRadius: 8,
              color:
                selectedGate === gate.label || draggedGate === gate.label
                  ? "#232b3a"
                  : "#ffc300",
              fontWeight: 700,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              boxShadow: "0 2px 8px #0006",
              userSelect: "none",
              transition: "all 0.18s",
            }}
          >
            {gate.label}
          </div>
        ))}
      </div>
      {/* Circuit Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <button style={buttonStyle} onClick={addQubit}>
          + Qubit
        </button>
        <button style={buttonStyle} onClick={removeQubit}>
          - Qubit
        </button>
        <button style={buttonStyle} onClick={addColumn}>
          + Step
        </button>
        <button style={buttonStyle} onClick={removeColumn}>
          - Step
        </button>

        {/* Run button (same behavior/placement) */}
        <button style={runButtonStyle} onClick={runCircuit}>
          Run ▶
        </button>

        <button
          style={toggleButtonStyle}
          onClick={() => setShowEquations(!showEquations)}
        >
          {showEquations ? "Hide States" : "Show States"}
        </button>
      </div>

      {/* Demo Circuit */}
      <div
        style={{
          background: "#232b3a",
          borderRadius: 10,
          padding: 12,
          margin: "0 auto 12px auto",
          minHeight: 100,
          boxShadow: "0 2px 8px #0004",
          overflowX: "auto",
          width: "100%",
        }}
      >
        {circuit.map((wire, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
              minHeight: 40,
            }}
          >
            <span
              style={{
                color: "#aaa",
                fontWeight: 600,
                marginRight: 8,
                fontSize: 14,
                minWidth: 28,
                display: "inline-block",
              }}
            >
              q{i}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                position: "relative",
                minWidth: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 3,
                  background: "#444",
                  borderRadius: 2,
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  width: "100%",
                  zIndex: 1,
                  minWidth: 0,
                  overflowX: "auto",
                  paddingBottom: 6,
                }}
              >
                {wire.map((gate, j) =>
                  gate ? (
                    <div
                      key={j}
                      style={{
                        width: 40,
                        height: 40,
                        background:
                          gate === "M"
                            ? "linear-gradient(90deg, #00c853 0%, #64dd17 100%)"
                            : gate === "O" ||
                              gate === "D" ||
                              gate === "Uf" ||
                              gate === "QFT⁻¹"
                            ? "linear-gradient(90deg, #9c27b0 0%, #673ab7 100%)"
                            : "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
                        border: "2px solid #fff",
                        borderRadius: 8,
                        color: "#232b3a",
                        fontWeight: 500,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px #0006",
                        transition: "box-shadow 0.18s, border 0.18s",
                        cursor: "pointer",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={
                        GATE_PALETTE.find((g) => g.label === gate)?.name ||
                        (gate === "O"
                          ? "Oracle"
                          : gate === "D"
                          ? "Diffusion Operator"
                          : gate === "Uf"
                          ? "Function Oracle"
                          : gate === "QFT⁻¹"
                          ? "Inverse QFT"
                          : gate)
                      }
                      onClick={() => removeGate(i, j)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 0 0 4px #ffc30066";
                        (e.currentTarget as HTMLDivElement).style.border =
                          "2px solid #ffc300";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 2px 8px #0006";
                        (e.currentTarget as HTMLDivElement).style.border =
                          "2px solid #fff";
                      }}
                    >
                      {gate}
                    </div>
                  ) : (
                    <div
                      key={j}
                      style={{
                        width: 40,
                        height: 40,
                        background: draggedGate
                          ? "#333"
                          : "rgba(255,255,255,0.04)",
                        border: draggedGate
                          ? "2px dashed #ffc300"
                          : "1px dashed #4c6cff",
                        borderRadius: 8,
                        transition: "border 0.18s, background 0.18s",
                        cursor: draggedGate ? "pointer" : "default",
                      }}
                      onClick={() => selectedGate && placeGate(i, j)}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={() => {
                        if (draggedGate) {
                          setCircuit((prev) =>
                            prev.map((wire, wi) =>
                              wire.map((g, ji) =>
                                wi === i && ji === j ? draggedGate : g
                              )
                            )
                          );
                          setDraggedGate(null);
                        }
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final States Display (reintroduced exactly in previous style) */}
      {showEquations && finalStates && (
        <div
          style={{
            background: "#232b3a",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 12,
            boxShadow: "0 2px 8px #0004",
          }}
        >
          <div style={{ color: "#4c6cff", fontWeight: 600, marginBottom: 8 }}>
            Final Qubit States:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {finalStates.map((state, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 6, color: "#aaa" }}>q{i}:</span>
                <span style={{ color: "#ffc300" }}>{state}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", color: "#aaa", fontSize: 12 }}>
        All major gates: Pauli-X, Y, Z, Hadamard, Phase, T, CNOT, Toffoli, SWAP,
        Identity, Measure.
      </div>

      {/* RESULTS PANEL */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        {finalStates && (
          <div
            style={{
              marginTop: 20,
              padding: 16,
              background: "#232b3a",
              borderRadius: 8,
            }}
          >
            <h3 style={{ color: "#ffc300" }}>Results: </h3>

            {currentAlgorithm && (
              <>
                <p>
                  <b>{currentAlgorithm.name}</b>
                </p>
                <p>{currentAlgorithm.description}</p>
                <p>
                  <b>Complexity:</b> {currentAlgorithm.complexity}
                </p>
                <ul>
                  {currentAlgorithm.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </>
            )}

            <h4 style={{ marginTop: 12 }}>Final Qubit States:</h4>
            {finalStates.map((state, i) => (
              <div key={i}>
                q{i}: <span style={{ color: "#4c6cff" }}>{state}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          alignItems: "stretch",
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "linear-gradient(120deg, #232b3a 80%, #2d3750 100%)",
            borderRadius: 8,
            padding: "12px 14px",
            color: "#fff",
            fontSize: 13,
            lineHeight: 1.6,
            minWidth: 180,
            flex: "1 1 180px",
            maxWidth: 320,
            border: "1px solid #4c6cff",
            boxShadow: "0 2px 8px #4c6cff22",
            boxSizing: "border-box",
          }}
        >
          <strong style={{ color: "#4c6cff" }}>Gate Effects:</strong>
          <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
            <li>
              <b style={{ color: "#ffc300" }}>X (Pauli-X):</b> Flips the qubit
              state (like a NOT gate).
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Y, Z (Pauli-Y, Pauli-Z):</b>{" "}
              Rotate the qubit around Y or Z axis on the Bloch sphere.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>H (Hadamard):</b> Puts the qubit
              into superposition.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>S, T (Phase, T):</b> Add a phase
              to the qubit state.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>CX (CNOT):</b> Flips the target
              qubit if the control qubit is 1.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>CCX (Toffoli):</b> Flips the
              target qubit if both controls are 1.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>SW (SWAP):</b> Swaps the states of
              two qubits.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>I (Identity):</b> Does not change
              the qubit state.
            </li>
            <li>
              <b style={{ color: "#00c853" }}>M (Measure):</b> Collapses the
              qubit state to |0⟩ or |1⟩.
            </li>
            <li>
              <b style={{ color: "#9c27b0" }}>O (Oracle):</b> Marks solution in
              Grover's.
            </li>
            <li>
              <b style={{ color: "#9c27b0" }}>D (Diffusion):</b> Amplifies
              solution.
            </li>
          </ul>
        </div>

        {/* Quantum Principles */}
        <div
          style={{
            background: "linear-gradient(120deg, #1b2a32 80%, #1c3b4a 100%)",
            borderRadius: 8,
            padding: "12px 14px",
            color: "#fff",
            fontSize: 13,
            lineHeight: 1.6,
            minWidth: 180,
            flex: "1 1 180px",
            maxWidth: 320,
            border: "1px solid #00bcd4",
            boxShadow: "0 2px 8px #00bcd422",
            boxSizing: "border-box",
          }}
        >
          <strong style={{ color: "#00bcd4" }}>Quantum Principles:</strong>
          <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
            <li>
              <b style={{ color: "#ffc300" }}>Superposition:</b> Qubits can be
              in multiple states simultaneously.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Entanglement:</b> Particles linked
              across space, sharing state.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Interference:</b> Waves combine
              constructively/destructively.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Measurement:</b> Collapses
              superposition to definite state.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>No-Cloning:</b> Quantum states
              cannot be copied.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Reversibility:</b> Quantum gates
              are reversible.
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Qubit:</b> Fundamental unit (|0⟩
              and |1⟩ states).
            </li>
            <li>
              <b style={{ color: "#ffc300" }}>Quantum Advantage:</b> Solving
              problems exponentially faster.
            </li>
          </ul>
        </div>

        {/* Manufacturing Notes */}
        <div
          style={{
            background: "linear-gradient(120deg, #2d2a1a 80%, #3a320f 100%)",
            borderRadius: 8,
            padding: "12px 14px",
            color: "#fff",
            fontSize: 13,
            lineHeight: 1.6,
            minWidth: 180,
            flex: "1 1 180px",
            maxWidth: 320,
            border: "1px solid #ffc300",
            boxShadow: "0 2px 8px #ffc30022",
            boxSizing: "border-box",
          }}
        >
          <strong style={{ color: "#ffc300" }}>Manufacturing Notes:</strong>
          <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
            <li>
              Physical quantum circuits are built using superconducting qubits,
              trapped ions, or photonic systems.
            </li>
            <li>
              Each gate is implemented via precise control pulses or laser
              operations.
            </li>
            <li>
              Layout and connectivity are limited by hardware architecture.
            </li>
            <li>
              Noise and decoherence are major challenges; error correction is
              essential.
            </li>
            <li>
              Manufacturing requires ultra-low temperatures and advanced
              nanofabrication.
            </li>
            <li>
              Measurement is typically done via dispersive readout in
              superconducting qubits.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
