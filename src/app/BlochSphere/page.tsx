// app/bloch/page.tsx (updated)
"use client";

import { useState } from "react";
import ClientOnly from "@/components/ClientOnly";
import BlochSphere from "@/components/visualizers/BlochSphere";
import BlochNotes from "@/components/notes/BlochNotes";
import Loading from "@/components/Loading";

export default function BlochPage() {
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);

  const handleStateChange = (newTheta: number, newPhi: number) => {
    setTheta(newTheta);
    setPhi(newPhi);
  };

  // Format the quantum state display properly
  const formatQuantumState = () => {
    const cosValue = Math.cos(theta / 2);
    const sinCosValue = Math.sin(theta / 2) * Math.cos(phi);
    const sinSinValue = Math.sin(theta / 2) * Math.sin(phi);

    const realPart = sinCosValue.toFixed(3);
    const imagPart = Math.abs(sinSinValue).toFixed(3);
    const sign = sinSinValue >= 0 ? "+" : "-";

    return `|ψ⟩ = ${cosValue.toFixed(
      3
    )}|0⟩ + (${realPart} ${sign} ${imagPart}i)|1⟩`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-800">
            Bloch Sphere Visualization
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize quantum states on the Bloch sphere representation
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ClientOnly fallback={<Loading />}>
              <BlochSphere
                theta={theta}
                phi={phi}
                onStateChange={handleStateChange}
              />
            </ClientOnly>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Current Quantum State
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theta (θ)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={(theta * 180) / Math.PI}
                    onChange={(e) =>
                      setTheta((parseInt(e.target.value) * Math.PI) / 180)
                    }
                    className="w-full"
                  />
                  <div className="text-center text-gray-600 mt-1">
                    {((theta * 180) / Math.PI).toFixed(1)}°
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phi (φ) ;{" "}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={(phi * 180) / Math.PI}
                    onChange={(e) =>
                      setPhi((parseInt(e.target.value) * Math.PI) / 180)
                    }
                    className="w-full"
                  />
                  <div className="text-center text-gray-600 mt-1">
                    {((phi * 180) / Math.PI).toFixed(1)}°
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700 font-mono">
                  {formatQuantumState()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <BlochNotes />
          </div>
        </div>
      </main>
    </div>
  );
}
