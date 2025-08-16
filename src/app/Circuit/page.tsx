import ClientOnly, { CircuitNoSSR } from "@/components/ClientOnly";

export default function CircuitPage() {
  return (
    <ClientOnly>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Quantum Circuit</h1>
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <CircuitNoSSR />
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
