// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname || "/bloch");

  const tabs = [
    {
      id: "/bloch",
      name: "Bloch Sphere",
      description: "Visualize quantum states on the Bloch sphere",
    },
    {
      id: "/circuit",
      name: "Circuit Simulator",
      description: "Build and simulate quantum circuits",
    },
    {
      id: "/algorithms",
      name: "Algorithms",
      description: "Explore quantum algorithms",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-800">
            Quantum Computing Playground
          </h1>
          <p className="text-gray-600 mt-2">
            Interactive visualizations for learning quantum computing concepts
          </p>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.id}
                className={`py-4 px-1 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to the Quantum Computing Playground
          </h2>
          <p className="text-gray-600 mb-4">
            This interactive tool helps you visualize and understand fundamental
            quantum computing concepts through three main sections:
          </p>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>
              <span className="font-medium">Bloch Sphere</span>: Visualize
              quantum states and operations on a Bloch sphere representation
            </li>
            <li>
              <span className="font-medium">Circuit Simulator</span>: Build
              quantum circuits with drag-and-drop gates and simulate their
              behavior
            </li>
            <li>
              <span className="font-medium">Algorithms</span>: Explore
              implemented quantum algorithms like Deutsch-Jozsa, Grover's, and
              Shor's
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                {tab.name}
              </h3>
              <p className="text-gray-600">{tab.description}</p>
              <div className="mt-4 text-indigo-600 font-medium flex items-center">
                Explore {tab.name}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            Quantum Computing Playground - An educational tool for learning
            quantum computing concepts
          </p>
        </div>
      </footer>
    </div>
  );
}
