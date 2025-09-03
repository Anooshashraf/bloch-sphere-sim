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

// app/algorithms/page.tsx

// "use client";

import { useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import AlgorithmsComponent from "@/components/algorithms/Algorithms"; // Renamed import
import Loading from "@/components/Loading";

export default function AlgorithmsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Algorithms" },
    { id: "search", name: "Search Algorithms" },
    { id: "factorization", name: "Factorization" },
    { id: "transform", name: "Transforms" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-800">
            Quantum Algorithms
          </h1>
          <p className="text-gray-600 mt-2">
            Explore fundamental quantum algorithms and their advantages
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Algorithm Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <ClientOnly fallback={<Loading />}>
          <AlgorithmsComponent /> {/* Use the renamed component */}
        </ClientOnly>

        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quantum Advantage Explained
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold text-blue-800 mb-2">
                Exponential Speedup
              </h3>
              <p className="text-sm text-blue-600">
                Algorithms like Shor's can factor numbers exponentially faster
                than classical algorithms, potentially breaking RSA encryption.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">
                Quadratic Speedup
              </h3>
              <p className="text-sm text-green-600">
                Grover's algorithm provides quadratic speedup for unstructured
                search problems, reducing O(N) to O(√N).
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="font-semibold text-purple-800 mb-2">
                Quantum Parallelism
              </h3>
              <p className="text-sm text-purple-600">
                Quantum computers can evaluate multiple inputs simultaneously
                through superposition, enabling massive parallelism.
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-md">
              <h3 className="font-semibold text-orange-800 mb-2">
                Interference Effects
              </h3>
              <p className="text-sm text-orange-600">
                Quantum algorithms use constructive and destructive interference
                to amplify correct answers and suppress wrong ones.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
