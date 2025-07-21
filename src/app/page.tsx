import NavigationBar from "@/components/NavigationBar";
import ClientOnly, {
  BlochSphereNoSSR,
  CircuitNoSSR,
} from "@/components/ClientOnly";

export default function HomePage() {
  return (
    <>
      <NavigationBar />
      <ClientOnly>
        <BlochSphereNoSSR />
        <CircuitNoSSR />
      </ClientOnly>
    </>
  );
}
