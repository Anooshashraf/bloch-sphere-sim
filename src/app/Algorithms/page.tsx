import ClientOnly, { AlgorithmsNoSSR } from "@/components/ClientOnly";

export default function AlgorithmsPage() {
  return (
    <ClientOnly>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Quantum Algorithms</h1>
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <AlgorithmsNoSSR />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
