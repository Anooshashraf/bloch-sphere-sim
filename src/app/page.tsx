import BlochSphere from "@/components/BlochSphere";
import Circuit from "@/components/circuit";
import NavigationBar from "@/components/NavigationBar";

export default function Home() {
  return (
    <main>
      <NavigationBar />
      <BlochSphere />
      <Circuit />
    </main>
  );
}
