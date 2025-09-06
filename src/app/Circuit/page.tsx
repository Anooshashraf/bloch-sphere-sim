// "use client";

// import { useState } from "react";
// import ClientOnly from "@/components/ClientOnly";
// import Circuit from "@/components/visualizers/Circuit";
// import CircuitNotes from "@/components/notes/CircuitNotes";
// import Loading from "@/components/Loading";

// export default function CircuitPage() {
//   const [qubits, setQubits] = useState(2);
//   const [circuitGates, setCircuitGates] = useState<any[]>([]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-4 py-6">
//           <h1 className="text-3xl font-bold text-indigo-800">
//             Quantum Circuit Simulator
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Build and simulate quantum circuits with drag-and-drop gates
//           </p>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           <div className="lg:col-span-3">
//             <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Circuit Configuration
//               </h2>
//               <div className="flex items-center gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Number of Qubits
//                   </label>
//                   <select
//                     value={qubits}
//                     onChange={(e) => setQubits(parseInt(e.target.value))}
//                     className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value={1}>1 Qubit</option>
//                     <option value={2}>2 Qubits</option>
//                     <option value={3}>3 Qubits</option>
//                     <option value={4}>4 Qubits</option>
//                   </select>
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   <p>Current gates: {circuitGates.length}</p>
//                   <p>Max possible states: {2 ** qubits}</p>
//                 </div>
//               </div>
//             </div>

//             <ClientOnly fallback={<Loading />}>
//               <Circuit qubits={qubits} onCircuitChange={setCircuitGates} />
//             </ClientOnly>
//           </div>

//           <div>
//             <CircuitNotes />

//             <div className="bg-white p-6 rounded-lg shadow-md mt-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                 Quick Examples
//               </h2>
//               <div className="space-y-3">
//                 <div className="p-3 bg-blue-50 rounded-md">
//                   <h3 className="font-medium text-blue-800">
//                     Bell State (Entanglement)
//                   </h3>
//                   <p className="text-sm text-blue-600 mt-1">
//                     H on qubit 0 → CNOT(control:0, target:1)
//                   </p>
//                   <p className="text-xs text-blue-500 mt-1">
//                     Creates: (|00⟩ + |11⟩)/√2
//                   </p>
//                 </div>

//                 <div className="p-3 bg-green-50 rounded-md">
//                   <h3 className="font-medium text-green-800">Superposition</h3>
//                   <p className="text-sm text-green-600 mt-1">H on any qubit</p>
//                   <p className="text-xs text-green-500 mt-1">
//                     Creates: (|0⟩ + |1⟩)/√2
//                   </p>
//                 </div>

//                 <div className="p-3 bg-purple-50 rounded-md">
//                   <h3 className="font-medium text-purple-800">Phase Change</h3>
//                   <p className="text-sm text-purple-600 mt-1">
//                     S or T gates on qubits
//                   </p>
//                   <p className="text-xs text-purple-500 mt-1">
//                     Adds phase without changing probabilities
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useState, useRef } from "react";
// import {
//   QuantumGate,
//   SINGLE_QUBIT_GATES,
//   TWO_QUBIT_GATES,
// } from "@/components/core/gates";
// import { simulateCircuit } from "@/components/core/simulator";

// interface CircuitProps {
//   qubits?: number;
//   onCircuitChange?: (gates: any[]) => void;
// }

// export default function Circuit({ qubits = 2, onCircuitChange }: CircuitProps) {
//   const [gates, setGates] = useState<any[]>([]);
//   const [selectedGate, setSelectedGate] = useState<QuantumGate | null>(null);
//   const [results, setResults] = useState<any>(null);
//   const [stepsCount, setStepsCount] = useState(5);
//   const circuitRef = useRef<HTMLDivElement>(null);

//   const addGateToCircuit = (qubitIndex: number, stepIndex: number) => {
//     if (!selectedGate) return;

//     if (selectedGate.matrix.length > 2 && qubits < 2) {
//       alert("Two-qubit gates require at least 2 qubits");
//       return;
//     }

//     const newGate = {
//       gate: selectedGate,
//       targets: [qubitIndex],
//       controls:
//         selectedGate.name === "CNOT" ? [qubitIndex === 0 ? 1 : 0] : undefined,
//     };

//     const existingGateIndex = gates.findIndex(
//       (g) => g.targets[0] === qubitIndex && g.step === stepIndex
//     );

//     let newGates;
//     if (existingGateIndex >= 0) {
//       newGates = [...gates];
//       newGates[existingGateIndex] = { ...newGate, step: stepIndex };
//     } else {
//       newGates = [...gates, { ...newGate, step: stepIndex }];
//     }

//     setGates(newGates);
//     if (onCircuitChange) onCircuitChange(newGates);
//   };

//   const runSimulation = () => {
//     try {
//       const result = simulateCircuit(gates);
//       setResults(result);
//     } catch (error) {
//       console.error("Simulation error:", error);
//       alert("Failed to simulate circuit");
//     }
//   };

//   const clearCircuit = () => {
//     setGates([]);
//     setResults(null);
//     if (onCircuitChange) onCircuitChange([]);
//   };

//   const steps = Array.from({ length: stepsCount }, (_, i) => i);

//   return (
//     <div className="space-y-6">
//       {/* Gate Palette */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//           Quantum Gates
//         </h3>
//         <div className="flex flex-wrap gap-2 mb-4">
//           <span className="text-sm text-gray-600 font-medium">
//             Single-qubit:
//           </span>
//           {SINGLE_QUBIT_GATES.map((gate) => (
//             <button
//               key={gate.name}
//               onClick={() => setSelectedGate(gate)}
//               className={`px-3 py-1 text-sm rounded border ${
//                 selectedGate?.name === gate.name
//                   ? "bg-indigo-100 border-indigo-500 text-indigo-700"
//                   : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               {gate.symbol}
//             </button>
//           ))}
//         </div>
//         <div className="flex flex-wrap gap-2">
//           <span className="text-sm text-gray-600 font-medium">Two-qubit:</span>
//           {TWO_QUBIT_GATES.map((gate) => (
//             <button
//               key={gate.name}
//               onClick={() => setSelectedGate(gate)}
//               className={`px-3 py-1 text-sm rounded border ${
//                 selectedGate?.name === gate.name
//                   ? "bg-indigo-100 border-indigo-500 text-indigo-700"
//                   : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
//               }`}
//             >
//               {gate.symbol}
//             </button>
//           ))}
//         </div>
//         {selectedGate && (
//           <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
//             <strong>{selectedGate.name}:</strong> {selectedGate.description}
//           </div>
//         )}
//       </div>

//       {/* Circuit Builder */}
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Quantum Circuit
//           </h3>
//           <div className="flex gap-2">
//             <button
//               onClick={runSimulation}
//               className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
//             >
//               Run
//             </button>
//             <button
//               onClick={clearCircuit}
//               className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
//             >
//               Clear
//             </button>
//           </div>
//         </div>

//         {/* Step size controls */}
//         <div className="flex items-center gap-2 mb-4">
//           <span className="text-sm text-gray-700 font-medium">Steps:</span>
//           <button
//             onClick={() => setStepsCount((s) => Math.max(1, s - 1))}
//             className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             –
//           </button>
//           <span className="px-2 text-gray-800 font-medium">{stepsCount}</span>
//           <button
//             onClick={() => setStepsCount((s) => s + 1)}
//             className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             +
//           </button>
//         </div>

//         <div ref={circuitRef} className="overflow-x-auto">
//           <div className="min-w-max">
//             {/* Step labels */}
//             <div className="flex">
//               <div className="w-12 flex-shrink-0"></div>
//               {steps.map((step, i) => (
//                 <div
//                   key={i}
//                   className="w-16 text-center text-sm text-gray-500 py-2"
//                 >
//                   Step {i + 1}
//                 </div>
//               ))}
//             </div>

//             {/* Qubit rows */}
//             {Array.from({ length: qubits }, (_, qubitIndex) => (
//               <div
//                 key={qubitIndex}
//                 className="flex items-center border-b border-gray-200"
//               >
//                 <div className="w-12 flex-shrink-0 text-sm text-gray-600 py-3">
//                   Q{qubitIndex}
//                 </div>
//                 {steps.map((step, stepIndex) => (
//                   <div
//                     key={stepIndex}
//                     className="w-16 h-12 border-r border-gray-200 flex items-center justify-center relative cursor-pointer hover:bg-gray-50"
//                     onClick={() => addGateToCircuit(qubitIndex, stepIndex)}
//                   >
//                     {/* Qubit line */}
//                     <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>

//                     {/* Gate */}
//                     {gates
//                       .filter(
//                         (g) =>
//                           g.step === stepIndex && g.targets.includes(qubitIndex)
//                       )
//                       .map((gate, i) => (
//                         <div
//                           key={i}
//                           className="z-10 w-10 h-10 bg-indigo-100 border border-indigo-300 rounded flex items-center justify-center text-indigo-700 font-medium"
//                         >
//                           {gate.gate.symbol}
//                         </div>
//                       ))}

//                     {/* Controls for multi-qubit gates */}
//                     {gates
//                       .filter(
//                         (g) =>
//                           g.step === stepIndex &&
//                           g.controls &&
//                           g.controls.includes(qubitIndex)
//                       )
//                       .map((_, i) => (
//                         <div
//                           key={i}
//                           className="absolute w-3 h-3 bg-indigo-700 rounded-full z-20"
//                         ></div>
//                       ))}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Simulation Results */}
//       {results && (
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-800 mb-3">
//             Simulation Results
//           </h3>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div className="bg-gray-50 p-3 rounded">
//               <div className="text-sm text-gray-500">Final State</div>
//               <div className="font-mono text-sm">
//                 {results.state.amplitudes.map((amp: any, i: number) => (
//                   <div key={i}>
//                     |{i.toString(2).padStart(results.state.numQubits, "0")}⟩:{" "}
//                     {amp.re.toFixed(3)} {amp.im >= 0 ? "+" : ""}
//                     {amp.im.toFixed(3)}i
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="bg-gray-50 p-3 rounded">
//               <div className="text-sm text-gray-500">
//                 Measurement Probabilities
//               </div>
//               {results.probabilities.map((prob: number, i: number) => (
//                 <div key={i} className="flex items-center justify-between">
//                   <span>
//                     |{i.toString(2).padStart(results.state.numQubits, "0")}⟩:
//                   </span>
//                   <span>{(prob * 100).toFixed(1)}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gray-50 p-3 rounded">
//             <div className="text-sm text-gray-500 mb-2">
//               Measurement Results (100 samples)
//             </div>
//             <div className="flex flex-wrap gap-1">
//               {Array.from(new Set(results.measurements)).map((value: any) => (
//                 <div
//                   key={value}
//                   className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
//                 >
//                   |{value.toString(2).padStart(results.state.numQubits, "0")}⟩:{" "}
//                   {
//                     results.measurements.filter((m: number) => m === value)
//                       .length
//                   }
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import QuantumCircuitSimulator from "@/components/visualizers/Circuit";

export default function CircuitPage() {
  return <QuantumCircuitSimulator />;
}
