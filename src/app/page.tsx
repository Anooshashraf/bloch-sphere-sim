"use client";

import ClientOnly, {
  BlochSphereNoSSR,
  CircuitNoSSR,
  AlgorithmsNoSSR,
} from "@/components/ClientOnly";

export default function HomePage() {
  return (
    <ClientOnly>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 ">Quantum Playground</h1>
        <div>
          <BlochSphereNoSSR />
          {/* <CircuitNoSSR /> */}
          <AlgorithmsNoSSR />
        </div>
      </div>
    </ClientOnly>
  );
}
