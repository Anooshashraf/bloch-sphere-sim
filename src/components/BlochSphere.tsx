// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as Three from "three";

// export default function BlochSphere() {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const [theta, setTheta] = useState(Math.PI / 2); // θ: 0 to π
//   const [phi, setPhi] = useState(0); // φ: 0 to 2π

//   useEffect(() => {
//     const width = 400;
//     const height = 400;
//     const scene = new Three.Scene();
//     const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
//     const renderer = new Three.WebGLRenderer({ antialias: true });
//     renderer.setSize(width, height);
//     mountRef.current!.appendChild(renderer.domElement);

//     // Sphere
//     const geometry = new Three.SphereGeometry(1, 32, 32);
//     const material = new Three.MeshBasicMaterial({
//       color: 0x0077ff,
//       wireframe: true,
//     });
//     const sphere = new Three.Mesh(geometry, material);
//     scene.add(sphere);

//     // Create a group for the Bloch sphere and vector
//     const blochGroup = new Three.Group();

//     // Bloch vector (will update on theta/phi change)
//     const vectorMaterial = new Three.LineBasicMaterial({ color: 0xff0000 });
//     // const getVector = () => {
//     //   // Convert θ, φ to Cartesian coordinates (Bloch sphere)
//     //   const x = Math.sin(theta) * Math.cos(phi);
//     //   const y = Math.cos(theta);
//     //   const z = Math.sin(theta) * Math.sin(phi);
//     //   return [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
//     // };
//     // let points = getVector();
//     const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(0, 1, 0)];
//     let vectorGeometry = new Three.BufferGeometry().setFromPoints(points);
//     let blochVector = new Three.Line(vectorGeometry, vectorMaterial);
//     blochGroup.add(blochVector);
//     scene.add(blochGroup);

//     camera.position.z = 3;
//     let isDragging = false;
//     let previousMousePosition = { x: 0, y: 0 };
//     let groupRotation = { x: theta - Math.PI / 2, y: phi };

//     const onMouseDown = (e: MouseEvent) => {
//       isDragging = true;
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//     };

//     const onMouseUp = () => {
//       isDragging = false;
//     };

//     const onMouseMove = (e: MouseEvent) => {
//       if (!isDragging) return;
//       const deltaMove = {
//         x: e.clientX - previousMousePosition.x,
//         y: e.clientY - previousMousePosition.y,
//       };

//       groupRotation.y += deltaMove.x * 0.01;
//       groupRotation.x += deltaMove.y * 0.01;
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//       setTheta(groupRotation.x + Math.PI / 2);
//       setPhi(groupRotation.y);
//     };
//     // Add event listeners for mouse interactions
//     renderer.domElement.addEventListener("mousedown", onMouseDown);
//     renderer.domElement.addEventListener("mouseup", onMouseUp);
//     renderer.domElement.addEventListener("mouseleave", onMouseUp);
//     renderer.domElement.addEventListener("mousemove", onMouseMove);

//     function animate() {
//       // Update Bloch vector direction according to theta and phi
//       // const x = Math.sin(theta) * Math.cos(phi);
//       // const y = Math.cos(theta);
//       // const z = Math.sin(theta) * Math.sin(phi);
//       // const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
//       // blochVector.geometry.setFromPoints(points);

//       // renderer.render(scene, camera);
//       // requestAnimationFrame(animate);

//       // Rotate the group according to theta and phi
//       blochGroup.rotation.x = theta - Math.PI / 2; // θ: polar angle
//       blochGroup.rotation.y = phi; // φ: azimuthal angle
//       renderer.render(scene, camera);
//       requestAnimationFrame(animate);
//     }
//     animate();
//     return () => {
//       mountRef.current!.removeChild(renderer.domElement);
//       renderer.domElement.removeEventListener("mousedown", onMouseDown);
//       renderer.domElement.removeEventListener("mouseup", onMouseUp);
//       renderer.domElement.removeEventListener("mouseleave", onMouseUp);
//       renderer.domElement.removeEventListener("mousemove", onMouseMove);
//     };
//   }, [theta, phi]);
//   return (
//     <div>
//       <div ref={mountRef} style={{ cursor: "grab", marginBottom: 16 }} />
//       <div style={{ width: 400 }}>
//         <label>
//           θ (theta): {theta.toFixed(2)} rad
//           <input
//             type="range"
//             min={0}
//             max={Math.PI}
//             step={0.01}
//             value={theta}
//             onChange={(e) => setTheta(Number(e.target.value))}
//             style={{ width: "100%" }}
//           />
//         </label>
//         <label>
//           φ (phi): {phi.toFixed(2)} rad
//           <input
//             type="range"
//             min={0}
//             max={Math.PI * 2}
//             step={0.01}
//             value={phi}
//             onChange={(e) => setPhi(Number(e.target.value))}
//             style={{ width: "100%" }}
//           />
//         </label>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import * as Three from "three";

export default function BlochSphere() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [theta, setTheta] = useState(Math.PI / 2); // θ: 0 to π
  const [phi, setPhi] = useState(0); // φ: 0 to 2π

  // These refs keep the latest values for animation and mouse events
  const thetaRef = useRef(theta);
  const phiRef = useRef(phi);

  useEffect(() => {
    thetaRef.current = theta;
    phiRef.current = phi;
  }, [theta, phi]);

  useEffect(() => {
    const width = 400;
    const height = 400;
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current!.appendChild(renderer.domElement);

    // Create a group for the Bloch sphere and vector
    const blochGroup = new Three.Group();

    // Sphere (add to group, not scene)
    const geometry = new Three.SphereGeometry(1, 32, 32);
    const material = new Three.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
    });
    const sphere = new Three.Mesh(geometry, material);
    blochGroup.add(sphere);

    // Bloch vector (always along y-axis in group space)
    const vectorMaterial = new Three.LineBasicMaterial({ color: 0xff0000 });
    const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(0, 1, 0)];
    const vectorGeometry = new Three.BufferGeometry().setFromPoints(points);
    const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
    blochGroup.add(blochVector);

    scene.add(blochGroup);

    camera.position.z = 3;

    // Mouse drag to rotate the group
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };
      // Update refs directly for smooth dragging
      phiRef.current += deltaMove.x * 0.01;
      thetaRef.current += deltaMove.y * 0.01;
      // Clamp theta to [0, π]
      thetaRef.current = Math.max(0, Math.min(Math.PI, thetaRef.current));
      previousMousePosition = { x: e.clientX, y: e.clientY };
      // Update sliders
      setTheta(thetaRef.current);
      setPhi(phiRef.current);
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mouseleave", onMouseUp);
    renderer.domElement.addEventListener("mousemove", onMouseMove);

    function animate() {
      // Rotate the group according to theta and phi
      blochGroup.rotation.x = thetaRef.current - Math.PI / 2;
      blochGroup.rotation.y = phiRef.current;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      mountRef.current!.removeChild(renderer.domElement);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("mouseleave", onMouseUp);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div>
      <div ref={mountRef} style={{ cursor: "grab", marginBottom: 16 }} />
      <div style={{ width: 400 }}>
        <label>
          θ (theta): {theta.toFixed(2)} rad
          <input
            type="range"
            min={0}
            max={Math.PI}
            step={0.01}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          φ (phi): {phi.toFixed(2)} rad
          <input
            type="range"
            min={0}
            max={Math.PI * 2}
            step={0.01}
            value={phi}
            onChange={(e) => setPhi(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
      </div>
    </div>
  );
}
