import NavigationBar from "@/components/NavigationBar";
import ClientOnly, { BlochSphereNoSSR } from "@/components/ClientOnly";

export default function BlochSpherePage() {
  return (
    <>
      <NavigationBar />
      <ClientOnly>
        <BlochSphereNoSSR />
      </ClientOnly>
    </>
  );
}
