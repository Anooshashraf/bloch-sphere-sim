// // app/circuit/page.tsx (updated)
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
//             <ClientOnly fallback={<Loading />}>
//               <Circuit qubits={qubits} onCircuitChange={setCircuitGates} />
//             </ClientOnly>
//           </div>

//           <div>
//             <CircuitNotes />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// app/circuit/page.tsx
"use client";

import { useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import Circuit from "@/components/visualizers/Circuit";
import CircuitNotes from "@/components/notes/CircuitNotes";
import Loading from "@/components/Loading";

export default function CircuitPage() {
  const [qubits, setQubits] = useState(2);
  const [circuitGates, setCircuitGates] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-800">
            Quantum Circuit Simulator
          </h1>
          <p className="text-gray-600 mt-2">
            Build and simulate quantum circuits with drag-and-drop gates
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Circuit Configuration
              </h2>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Qubits
                  </label>
                  <select
                    value={qubits}
                    onChange={(e) => setQubits(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1 Qubit</option>
                    <option value={2}>2 Qubits</option>
                    <option value={3}>3 Qubits</option>
                    <option value={4}>4 Qubits</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Current gates: {circuitGates.length}</p>
                  <p>Max possible states: {2 ** qubits}</p>
                </div>
              </div>
            </div>

            <ClientOnly fallback={<Loading />}>
              <Circuit qubits={qubits} onCircuitChange={setCircuitGates} />
            </ClientOnly>
          </div>

          <div>
            <CircuitNotes />

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Examples
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-800">
                    Bell State (Entanglement)
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    H on qubit 0 → CNOT(control:0, target:1)
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Creates: (|00⟩ + |11⟩)/√2
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-md">
                  <h3 className="font-medium text-green-800">Superposition</h3>
                  <p className="text-sm text-green-600 mt-1">H on any qubit</p>
                  <p className="text-xs text-green-500 mt-1">
                    Creates: (|0⟩ + |1⟩)/√2
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-md">
                  <h3 className="font-medium text-purple-800">Phase Change</h3>
                  <p className="text-sm text-purple-600 mt-1">
                    S or T gates on qubits
                  </p>
                  <p className="text-xs text-purple-500 mt-1">
                    Adds phase without changing probabilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
