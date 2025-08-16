"use client";

import ClientOnly, { BlochSphereNoSSR } from "@/components/ClientOnly";

export default function BlochSpherePage() {
  return (
    <ClientOnly>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Bloch Sphere</h1>;{" "}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <BlochSphereNoSSR />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
