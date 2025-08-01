import NavigationBar from "@/components/NavigationBar";
import ClientOnly, { CircuitNoSSR } from "@/components/ClientOnly";

export default function CircuitPage() {
  return (
    <>
      <NavigationBar />
      <ClientOnly>
        <CircuitNoSSR />
      </ClientOnly>
    </>
  );
}
