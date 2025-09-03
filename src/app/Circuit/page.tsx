// app/circuit/page.tsx (updated)
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
            <ClientOnly fallback={<Loading />}>
              <Circuit qubits={qubits} onCircuitChange={setCircuitGates} />
            </ClientOnly>
          </div>

          <div>
            <CircuitNotes />
          </div>
        </div>
      </main>
    </div>
  );
}
