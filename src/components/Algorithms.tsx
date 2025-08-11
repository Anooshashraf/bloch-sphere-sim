// algorithms.tsx
// Separate React component that provides an interactive playground for
// common quantum algorithms (Grover, QFT, Deutsch-Jozsa, Bernstein-Vazirani)
// Keeps the exact same visual theme / styling as your existing circuit.tsx

// import React, { useState } from "react";
// import { create, all, Matrix } from "mathjs";

// const math = create(all);

// // Reuse the same look-and-feel as circuit.tsx
// const cardStyle: React.CSSProperties = {
// background: "rgba(24,28,36,0.98)",
// borderRadius: 18,
// boxShadow: "0 4px 32px #0008",
// padding: 24,
// color: "#fff",
// width: "100%",
// maxWidth: 900,
// margin: "32px auto",
// fontFamily: "'Segoe UI', Arial, sans-serif",
// boxSizing: "border-box",
// };

// const buttonStyle: React.CSSProperties = {
// background: "linear-gradient(90deg, #4c6cff 0%, #0077ff 100%)",
// color: "#fff",
// border: "none",
// borderRadius: 8,
// padding: "8px 14px",
// fontWeight: 600,
// fontSize: 14,
// cursor: "pointer",
// boxShadow: "0 2px 8px #0004",
// transition: "background 0.2s, transform 0.2s",
// marginRight: 8,
// };

// // Basic single-qubit gates
// const G_SINGLE: Record<string, Matrix> = {
// I: math.matrix([
//     [1, 0],
//     [0, 1],
// ]),
// X: math.matrix([
//     [0, 1],
//     [1, 0],
// ]),
// Y: math.matrix([
//     [0, math.complex(0, -1)],
//     [math.complex(0, 1), 0],
// ]),
// Z: math.matrix([
//     [1, 0],
//     [0, -1],
// ]),
// H: math.multiply(
//     1 / Math.sqrt(2),
//     math.matrix([
//     [1, 1],
//     [1, -1],
//     ])
// ),
// S: math.matrix([
//     [1, 0],
//     [0, math.complex(0, 1)],
// ]),
// T: math.matrix([
//     [1, 0],
//     [0, math.exp(math.complex(0, Math.PI / 4))],
// ]),
// };

// // Helpers for building multi-qubit operations
// function kronAll(matrices: Matrix[]) {
// return matrices.reduce((acc, m) => math.kron(acc, m)) as Matrix;
// }

// function identityN(n: number) {
// return G_SINGLE.I;
// }

// // Build full operator for single-qubit gate applied at qubit index (0 = MSB / leftmost)
// function fullOpSingle(n: number, gate: Matrix, target: number) {
// const ops: Matrix[] = [];
// for (let q = 0; q < n; q++) {
//     // note: we define qubit 0 as left-most (MSB) when forming kronecker
//     ops.push(q === target ? gate : G_SINGLE.I);
// }
// return kronAll(ops);
// }

// // Apply a controlled-X (CNOT) to a state vector (control, target indices)
// function applyCNOT(state: Matrix, n: number, control: number, target: number) {
// const arr = state.clone().valueOf() as Array<number | math.Complex>;
// const size = Math.pow(2, n);
// const out = Array(size).fill(math.complex(0));
// for (let i = 0; i < size; i++) {
//     // binary string with MSB = qubit 0
//     const bits = i.toString(2).padStart(n, "0").split("").map(Number);
//     if (bits[control] === 1) {
//     const flipped = [...bits];
//     flipped[target] = flipped[target] ^ 1;
//     const j = parseInt(flipped.join(""), 2);
//     out[j] = math.add(out[j], arr[i] as any);
//     } else {
//     out[i] = math.add(out[i], arr[i] as any);
//     }
// }
// return math.matrix(out);
// }

// // Build oracle matrix for Grover that flips sign of marked index
// function groverOracle(n: number, markedIndex: number) {
// const size = Math.pow(2, n);
// const diag = Array(size)
//     .fill(1)
//     .map((v, i) => (i === markedIndex ? -1 : 1));
// return math.diag(diag) as Matrix;
// }

// // Diffusion operator for Grover: D = 2|s><s| - I
// function groverDiffusion(n: number) {
// const size = Math.pow(2, n);
// const s = Array(size).fill(1 / Math.sqrt(size));
// const row = math.matrix([s]);
// const col = math.transpose(row) as Matrix;
// const outer = math.multiply(col, row) as Matrix;

// return math.subtract(math.multiply(2, outer), math.identity(size)) as Matrix;
// }

// // Quantum Fourier Transform (QFT) full matrix (naive, for small n)
// function qftMatrix(n: number) {
// const N = Math.pow(2, n);
// const omega = math.exp(math.complex(0, (2 * Math.PI) / N));
// const mat = math.zeros([N, N]) as Matrix;
// for (let x = 0; x < N; x++) {
//     for (let y = 0; y < N; y++) {
//     const val = math.pow(omega, x * y) as math.MathType;
//     mat.set([x, y], math.divide(val, Math.sqrt(N)));
//     }
// }
// return mat;
// }

// export default function AlgorithmsPlayground() {
// const [algorithm, setAlgorithm] = useState<"grover" | "qft" | "dj" | "bv">(
//     "grover"
// );
// const [nQubits, setNQubits] = useState<number>(3);
// const [markedIdx, setMarkedIdx] = useState<number>(1);
// const [finalState, setFinalState] = useState<Matrix | null>(null);
// const [measurement, setMeasurement] = useState<string | null>(null);
// const [stepsExplanation, setStepsExplanation] = useState<string[]>([]);

// // limits
// const MAX_QUBITS = 5; // keep small so full-matrix operations remain snappy in browser

// const buildAndSimulate = () => {
//     if (nQubits < 1 || nQubits > MAX_QUBITS)
//     return alert(`n must be 1..${MAX_QUBITS}`);

//     const n = nQubits;
//     const N = Math.pow(2, n);

//     // initial state |0...0>
//     const arr = math.zeros([N]).valueOf() as number[];
//     arr[0] = 1;
//     let state = math.matrix(arr) as Matrix;
//     const explanations: string[] = [];

//     if (algorithm === "grover") {
//     explanations.push(`Grover's algorithm on ${n} qubits`);

//     // 1) Apply H to all qubits to prepare |s>
//     let Hall = kronAll(Array.from({ length: n }, () => G_SINGLE.H));
//     state = math.multiply(Hall, state) as Matrix;
//     explanations.push("Apply H to all qubits -> equal superposition |s>");

//     // 2) Run Grover iterations (approx pi/4 * sqrt(N))
//     const iterations = Math.max(1, Math.round((Math.PI / 4) * Math.sqrt(N)));
//     explanations.push(`Running ${iterations} Grover iterations`);
//     for (let it = 0; it < iterations; it++) {
//         // oracle
//         const oracle = groverOracle(n, markedIdx);
//         state = math.multiply(oracle, state) as Matrix;
//         explanations.push(
//         `Oracle: flip phase of |${markedIdx.toString(2).padStart(n, "0")}⟩`
//         );

//         // diffusion
//         const D = groverDiffusion(n);
//         state = math.multiply(D, state) as Matrix;
//         explanations.push(
//         `Diffusion: amplify marked amplitude (iteration ${it + 1})`
//         );
//     }

//     // measure
//     const amps = state.clone().valueOf() as Array<number | math.Complex>;
//     const probs = amps.map((a) => {
//         const v = a as any;
//         if (math.typeOf(v) === "Complex") return math.abs(v) * math.abs(v);
//         return (v as number) * (v as number);
//     });
//     const total = probs.reduce((s, p) => s + p, 0);
//     const norm = probs.map((p) => p / total);
//     let r = Math.random();
//     let s = 0;
//     let measuredIndex = 0;
//     for (let i = 0; i < norm.length; i++) {
//         s += norm[i];
//         if (r <= s) {
//         measuredIndex = i;
//         break;
//         }
//     }
//     setFinalState(state);
//     setMeasurement(measuredIndex.toString(2).padStart(n, "0"));
//     setStepsExplanation(explanations);
//     } else if (algorithm === "qft") {
//     explanations.push(`Quantum Fourier Transform on ${n} qubits`);
//     const Q = qftMatrix(n);
//     state = math.multiply(Q, state) as Matrix;
//     setFinalState(state);
//     setMeasurement(null);
//     setStepsExplanation(
//         explanations.concat(["Applied full QFT matrix (ideal)."])
//     );
//     } else if (algorithm === "dj") {
//     explanations.push(
//         "Deutsch-Jozsa (demo): building balanced/constant oracles"
//     );
//     // simple demo: if oracle is balanced or constant: we'll simulate a simple oracle
//     // choose a balanced oracle (parity of first qubit)
//     // Build DJ circuit: H on input qubits, apply oracle (we'll flip phase for certain x), H again, measure
//     const H_all = kronAll(Array.from({ length: n }, () => G_SINGLE.H));
//     state = math.multiply(H_all, state) as Matrix;
//     explanations.push("Applied H to input register");
//     // naive oracle: flip sign for half the states
//     const diag = Array(N)
//         .fill(1)
//         .map((v, i) => (i % 2 === 0 ? -1 : 1));
//     const oracle = math.diag(diag) as Matrix;
//     state = math.multiply(oracle, state) as Matrix;
//     explanations.push("Applied demo balanced oracle (parity)");
//     state = math.multiply(H_all, state) as Matrix;
//     explanations.push("Applied H again; measure to detect balanced/constant");
//     const amps = state.clone().valueOf() as Array<number | math.Complex>;
//     const probs = amps.map((a) => {
//         const v = a as any;
//         if (math.typeOf(v) === "Complex") return math.abs(v) * math.abs(v);
//         return (v as number) * (v as number);
//     });
//     let r = Math.random();
//     let s2 = 0;
//     let measuredIndex = 0;
//     for (let i = 0; i < probs.length; i++) {
//         s2 += probs[i];
//         if (r <= s2) {
//         measuredIndex = i;
//         break;
//         }
//     }
//     setFinalState(state);
//     setMeasurement(measuredIndex.toString(2).padStart(n, "0"));
//     setStepsExplanation(explanations);
//     } else if (algorithm === "bv") {
//     explanations.push("Bernstein-Vazirani demo (hidden bitstring)");
//     // hidden string demo: pick hidden string, build oracle that adds dot-product into target
//     const hidden = Math.floor(Math.random() * N);
//     explanations.push(
//         `Hidden bitstring: ${hidden.toString(2).padStart(n, "0")}`
//     );
//     // build BV oracle as phase-flip on basis states where dot(hidden,x)=1
//     const diag = Array(N)
//         .fill(1)
//         .map((_, x) => {
//         const dot =
//             (hidden & x)
//             .toString(2)
//             .split("")
//             .filter((c) => c === "1").length % 2;
//         return dot === 1 ? -1 : 1;
//         });
//     const oracle = math.diag(diag) as Matrix;
//     const H_all = kronAll(Array.from({ length: n }, () => G_SINGLE.H));
//     state = math.multiply(H_all, state) as Matrix;
//     state = math.multiply(oracle, state) as Matrix;
//     state = math.multiply(H_all, state) as Matrix;
//     setFinalState(state);
//     setMeasurement(null);
//     setStepsExplanation(
//         explanations.concat(["Measured to reveal hidden string (ideal)."])
//     );
//     }
// };

// return (
//     <div style={cardStyle}>
//     <h2 style={{ textAlign: "center", color: "#4c6cff", marginBottom: 6 }}>
//         Interactive Algorithms Playground
//     </h2>
//     <div style={{ color: "#aaa", marginBottom: 12, textAlign: "center" }}>
//         Choose an algorithm, tweak parameters, and press <b>Run</b>.
//         Explanations and results will appear below.
//     </div>

//     <div
//         style={{
//         display: "flex",
//         gap: 12,
//         alignItems: "center",
//         justifyContent: "center",
//         marginBottom: 12,
//         }}
//     >
//         <select
//         value={algorithm}
//         onChange={(e) => setAlgorithm(e.target.value as any)}
//         style={{
//             padding: 8,
//             borderRadius: 8,
//             background: "#181c24",
//             color: "#fff",
//             border: "1px solid #4c6cff",
//         }}
//         >
//         <option value="grover">Grover</option>
//         <option value="qft">QFT</option>
//         <option value="dj">Deutsch-Jozsa</option>
//         <option value="bv">Bernstein-Vazirani</option>
//         </select>

//         <label style={{ color: "#aaa" }}>Qubits:</label>
//         <input
//         type="number"
//         value={nQubits}
//         min={1}
//         max={5}
//         onChange={(e) => setNQubits(Number(e.target.value))}
//         style={{
//             width: 64,
//             padding: 6,
//             borderRadius: 6,
//             background: "#181c24",
//             color: "#fff",
//             border: "1px solid #4c6cff",
//         }}
//         />

//         {algorithm === "grover" && (
//         <>
//             <label style={{ color: "#aaa" }}>Marked index (decimal):</label>
//             <input
//             type="number"
//             value={markedIdx}
//             min={0}
//             max={Math.pow(2, nQubits) - 1}
//             onChange={(e) => setMarkedIdx(Number(e.target.value))}
//             style={{
//                 width: 96,
//                 padding: 6,
//                 borderRadius: 6,
//                 background: "#181c24",
//                 color: "#fff",
//                 border: "1px solid #4c6cff",
//             }}
//             />
//         </>
//         )}

//         <button style={buttonStyle} onClick={buildAndSimulate}>
//         Run
//         </button>
//     </div>

//     <div
//         style={{
//         background: "#232b3a",
//         padding: 16,
//         borderRadius: 12,
//         color: "#fff",
//         boxShadow: "0 2px 8px #0004",
//         }}
//     >
//         <div style={{ color: "#4c6cff", fontWeight: 700, marginBottom: 8 }}>
//         Explanation / Steps
//         </div>
//         {stepsExplanation.length === 0 ? (
//         <div style={{ color: "#ccc" }}>
//             Run the algorithm to see step-by-step explanations.
//         </div>
//         ) : (
//         <ol style={{ color: "#ddd" }}>
//             {stepsExplanation.map((s, i) => (
//             <li key={i} style={{ marginBottom: 6 }}>
//                 {s}
//             </li>
//             ))}
//         </ol>
//         )}
//     </div>

//     <div
//         style={{
//         marginTop: 12,
//         background: "#232b3a",
//         padding: 16,
//         borderRadius: 12,
//         boxShadow: "0 2px 8px #0004",
//         }}
//     >
//         <div style={{ color: "#4c6cff", fontWeight: 700, marginBottom: 8 }}>
//         Result
//         </div>
//         {finalState ? (
//         <div style={{ color: "#ddd" }}>
//             <div style={{ marginBottom: 8 }}>
//             <strong>State vector (non-zero amplitudes):</strong>
//             </div>
//             <pre style={{ color: "#ffc300", whiteSpace: "pre-wrap" }}>
//             {(finalState.valueOf() as Array<any>)
//                 .map((a, i) => {
//                 const abs2 =
//                     math.typeOf(a) === "Complex"
//                     ? math.abs(a) * math.abs(a)
//                     : (a as number) * (a as number);
//                 if (abs2 < 1e-6) return null;
//                 return `${(a as any).toString().slice(0, 8)} |${i
//                     .toString(2)
//                     .padStart(nQubits, "0")}⟩`;
//                 })
//                 .filter(Boolean)
//                 .join("\n")}
//             </pre>
//             {measurement && (
//             <div style={{ marginTop: 8, color: "#00c853" }}>
//                 <strong>Measured:</strong> |{measurement}⟩
//             </div>
//             )}
//         </div>
//         ) : (
//         <div style={{ color: "#ccc" }}>
//             No result yet — run the algorithm.
//         </div>
//         )}
//     </div>

//     <div style={{ marginTop: 14, color: "#aaa", fontSize: 13 }}>
//         You can copy the resulting full state vector or use the steps shown
//         above to map the circuit into your circuit editor.
//     </div>
//     </div>
// );
// }

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

// Algorithm definitions with circuits and explanations
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
  {
    id: "shor",
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
    id: "deutsch",
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
    id: "teleport",
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
];

export default function Circuit() {
  const [circuit, setCircuit] = useState(INIT_CIRCUIT);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const [initialStates, setInitialStates] = useState<string[]>(
    Array(circuit.length).fill("|0⟩")
  );
  const [showEquations, setShowEquations] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(
    null
  );
  const [algorithmStep, setAlgorithmStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load algorithm when selected
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

  // Animation for algorithm steps
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

  const calculateFinalState = () => {
    let finalStates = initialStates.map((state) => state);

    circuit.forEach((wire, qi) => {
      wire.forEach((gate) => {
        if (gate === "H") {
          finalStates[qi] = `(${finalStates[qi].replace("⟩", "⟩ + |1⟩")})/√2`;
        } else if (gate === "X") {
          finalStates[qi] = finalStates[qi].replace("0", "1").replace("1", "0");
        } else if (gate === "M") {
          finalStates[qi] = `Measured: ${Math.random() > 0.5 ? "|1⟩" : "|0⟩"}`;
        }
      });
    });

    return finalStates;
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(24,28,36,0.98)",
    borderRadius: 18,
    boxShadow: "0 4px 32px #0008",
    padding: 24,
    color: "#fff",
    width: "100%",
    maxWidth: 900,
    margin: "32px auto",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #4c6cff 0%, #0077ff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 2px 8px #0004",
    transition: "background 0.2s, transform 0.2s",
    marginRight: 12,
    minWidth: 120,
  };

  const algoButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #9c27b0 0%, #673ab7 100%)",
    padding: "8px 12px",
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

  const finalStates = calculateFinalState();

  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>
        <span style={{ color: "#4c6cff" }}>Quantum Playground</span>
      </h2>

      {/* Algorithm Selection */}
      <div
        style={{
          background: "linear-gradient(120deg, #2d2a1a 30%, #3a320f 100%)",
          borderRadius: 12,
          padding: "16px 20px",
          marginBottom: 20,
          border: "2px solid #ffc300",
          boxShadow: "0 2px 12px #ffc30033",
        }}
      >
        <h3 style={{ color: "#ffc300", marginTop: 0, marginBottom: 16 }}>
          Quantum Algorithms Explorer
        </h3>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
            Custom Circuit
          </button>
        </div>

        {currentAlgorithm && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <h4 style={{ color: "#ffc300", marginBottom: 8 }}>
                  {currentAlgorithm.name}
                </h4>
                <p style={{ color: "#ddd", margin: 0, fontSize: 15 }}>
                  {currentAlgorithm.description} <br />
                  <span style={{ color: "#4c6cff" }}>
                    Complexity: {currentAlgorithm.complexity}
                  </span>
                </p>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
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
                background: "rgba(0,0,0,0.3)",
                borderRadius: 8,
                padding: 12,
                marginTop: 12,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ color: "#4c6cff", fontWeight: 600 }}>
                  Step {algorithmStep + 1}/{currentAlgorithm.steps.length}:
                </div>
                <div style={{ color: "#fff", fontSize: 16 }}>
                  {currentAlgorithm.steps[algorithmStep]}
                </div>
              </div>

              <div style={{ flex: 2, minWidth: 300 }}>
                <div style={{ color: "#ffc300", fontWeight: 600 }}>
                  Explanation:
                </div>
                <div style={{ color: "#ddd", fontSize: 15 }}>
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
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
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
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 24,
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
              width: 44,
              height: 44,
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
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "grab",
              boxShadow: "0 2px 8px #0006",
              userSelect: "none",
              transition: "all 0.2s",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
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
          gap: 12,
          marginBottom: 18,
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
          borderRadius: 12,
          padding: 24,
          margin: "0 auto 16px auto",
          minHeight: 120,
          boxShadow: "0 2px 8px #0004",
          overflowX: "auto",
          width: "100%",
          maxWidth: "100vw",
        }}
      >
        {circuit.map((wire, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 18,
              minHeight: 44,
            }}
          >
            <span
              style={{
                color: "#aaa",
                fontWeight: 600,
                marginRight: 10,
                fontSize: 16,
                minWidth: 32,
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
              {/* Wire line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 4,
                  background: "#444",
                  borderRadius: 2,
                  zIndex: 0,
                }}
              />
              {/* Gates */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  width: "100%",
                  zIndex: 1,
                  minWidth: 0,
                  overflowX: "auto",
                }}
              >
                {wire.map((gate, j) =>
                  gate ? (
                    <div
                      key={j}
                      style={{
                        width: 44,
                        height: 44,
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
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px #0006",
                        transition: "box-shadow 0.2s, border 0.2s",
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
                          "0 0 0 4px #ffc30088";
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
                        width: 44,
                        height: 44,
                        background: draggedGate
                          ? "#333"
                          : "rgba(255,255,255,0.04)",
                        border: draggedGate
                          ? "2px dashed #ffc300"
                          : "1px dashed #4c6cff",
                        borderRadius: 8,
                        transition: "border 0.2s, background 0.2s",
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

      {/* Final States Display */}
      {showEquations && (
        <div
          style={{
            background: "#232b3a",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
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

      <div style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>
        All major gates: Pauli-X, Y, Z, Hadamard, Phase, T, CNOT, Toffoli, SWAP,
        Identity, Measure.
      </div>

      {/* Notes Section */}
      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          alignItems: "stretch",
          marginTop: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Gate Effects */}
        <div
          style={{
            background: "linear-gradient(120deg, #232b3a 80%, #2d3750 100%)",
            borderRadius: 12,
            padding: "18px 22px",
            color: "#fff",
            fontSize: 15,
            lineHeight: 1.7,
            minWidth: 220,
            flex: "1 1 220px",
            maxWidth: 340,
            border: "2px solid #4c6cff",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px #4c6cff22",
          }}
        >
          <strong style={{ color: "#4c6cff" }}>Gate Effects:</strong>
          <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
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
        {/* Quantum Computing Principles */}
        <div
          style={{
            background: "linear-gradient(120deg, #1b2a32 80%, #1c3b4a 100%)",
            borderRadius: 12,
            padding: "18px 22px",
            color: "#fff",
            fontSize: 15,
            lineHeight: 1.7,
            minWidth: 220,
            flex: "1 1 220px",
            maxWidth: 340,
            border: "2px solid #00bcd4",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px #00bcd422",
          }}
        >
          <strong style={{ color: "#00bcd4" }}>Quantum Principles:</strong>
          <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
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
            borderRadius: 12,
            padding: "18px 22px",
            color: "#fff",
            fontSize: 15,
            lineHeight: 1.7,
            minWidth: 220,
            flex: "1 1 220px",
            maxWidth: 340,
            border: "2px solid #ffc300",
            boxSizing: "border-box",
            boxShadow: "0 2px 8px #ffc30022",
          }}
        >
          <strong style={{ color: "#ffc300" }}>Manufacturing Notes:</strong>
          <ul style={{ margin: "10px 0 0 18px", padding: 0 }}>
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
