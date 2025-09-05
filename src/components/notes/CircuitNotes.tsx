// // components/notes/CircuitNotes.tsx
// export default function CircuitNotes() {
//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">
//         About Quantum Circuits
//       </h2>

//       <div className="prose prose-indigo max-w-none">
//         <p>
//           Quantum circuits are sequences of quantum gates applied to qubits to
//           perform quantum computations.
//         </p>

//         <h3 className="font-semibold text-gray-700 mt-4">Basic Elements:</h3>
//         <ul className="list-disc pl-5 text-gray-600 space-y-2">
//           <li>
//             <strong>Qubits:</strong> Represented as horizontal lines
//           </li>
//           <li>
//             <strong>Gates:</strong> Represented as boxes on the qubit lines
//           </li>
//           <li>
//             <strong>Controls:</strong> Dots connected to gates (for conditional
//             operations)
//           </li>
//           <li>
//             <strong>Measurements:</strong> Typically represented at the end of
//             the circuit
//           </li>
//         </ul>

//         <h3 className="font-semibold text-gray-700 mt-4">Common Gates:</h3>
//         <ul className="list-disc pl-5 text-gray-600 space-y-2">
//           <li>
//             <strong>X, Y, Z:</strong> Pauli gates (bit flip and phase flip)
//           </li>
//           <li>
//             <strong>H:</strong> Hadamard gate (creates superposition)
//           </li>
//           <li>
//             <strong>CNOT:</strong> Controlled-NOT (entangles qubits)
//           </li>
//           <li>
//             <strong>S, T:</strong> Phase gates
//           </li>
//         </ul>

//         <h3 className="font-semibold text-gray-700 mt-4">Circuit Rules:</h3>
//         <ul className="list-disc pl-5 text-gray-600 space-y-2">
//           <li>Time flows from left to right</li>
//           <li>Gates are applied in sequence from left to right</li>
//           <li>Multi-qubit gates create entanglement between qubits</li>
//           <li>Measurement collapses superpositions to classical states</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// components/notes/CircuitNotes.tsx
export default function CircuitNotes() {
  return (
    <div className="bg-[#13131a] border border-[#24243a] p-6 rounded-2xl shadow-lg text-gray-300">
      <h2 className="text-2xl font-semibold text-[#ffc300] mb-4">
        About Quantum Circuits
      </h2>

      <div className="space-y-4">
        <p>
          Quantum circuits are sequences of quantum gates applied to qubits to
          perform quantum computations.
        </p>

        <h3 className="text-lg font-semibold text-[#4c6cff]">
          Basic Elements:
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>
            <span className="text-gray-200 font-medium">Qubits:</span>{" "}
            Represented as horizontal lines
          </li>
          <li>
            <span className="text-gray-200 font-medium">Gates:</span>{" "}
            Represented as boxes on the qubit lines
          </li>
          <li>
            <span className="text-gray-200 font-medium">Controls:</span> Dots
            connected to gates (for conditional operations)
          </li>
          <li>
            <span className="text-gray-200 font-medium">Measurements:</span>{" "}
            Typically represented at the end of the circuit
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-[#4c6cff]">Common Gates:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>
            <span className="text-gray-200 font-medium">X, Y, Z:</span> Pauli
            gates (bit flip and phase flip)
          </li>
          <li>
            <span className="text-gray-200 font-medium">H:</span> Hadamard gate
            (creates superposition)
          </li>
          <li>
            <span className="text-gray-200 font-medium">CNOT:</span>{" "}
            Controlled-NOT (entangles qubits)
          </li>
          <li>
            <span className="text-gray-200 font-medium">S, T:</span> Phase gates
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-[#4c6cff]">Circuit Rules:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-400">
          <li>Time flows from left to right</li>
          <li>Gates are applied in sequence from left to right</li>
          <li>Multi-qubit gates create entanglement between qubits</li>
          <li>Measurement collapses superpositions to classical states</li>
        </ul>
      </div>
    </div>
  );
}
