// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as Three from "three";

// export default function BlochSphere() {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const [theta, setTheta] = useState(Math.PI / 2); // θ: 0 to π
//   const [phi, setPhi] = useState(0); // φ: 0 to 2π

//   // These refs keep the latest values for animation and mouse events
//   const thetaRef = useRef(theta);
//   const phiRef = useRef(phi);

//   useEffect(() => {
//     thetaRef.current = theta;
//     phiRef.current = phi;
//   }, [theta, phi]);

//   useEffect(() => {
//     const width = 400;
//     const height = 400;
//     const scene = new Three.Scene();
//     const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
//     const renderer = new Three.WebGLRenderer({ antialias: true });
//     renderer.setSize(width, height);
//     mountRef.current!.appendChild(renderer.domElement);

//     // Create a group for the Bloch sphere and vector
//     const blochGroup = new Three.Group();

//     // Sphere (add to group, not scene)
//     const geometry = new Three.SphereGeometry(1, 32, 32);
//     const material = new Three.MeshBasicMaterial({
//       color: 0x0077ff,
//       wireframe: true,
//     });
//     const sphere = new Three.Mesh(geometry, material);
//     blochGroup.add(sphere);

//     // Bloch vector (always along y-axis in group space)
//     const vectorMaterial = new Three.LineBasicMaterial({ color: 0xff0000 });
//     // const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(0, 1, 0)];
//     const vectorGeometry = new Three.BufferGeometry();
//     const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
//     blochGroup.add(blochVector);

//     scene.add(blochGroup);

//     camera.position.z = 3;

//     // Mouse drag to rotate the group
//     let isDragging = false;
//     let previousMousePosition = { x: 0, y: 0 };

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
//       // Update refs directly for smooth dragging
//       phiRef.current += deltaMove.x * 0.01;
//       thetaRef.current += deltaMove.y * 0.01;
//       // Clamp theta to [0, π]
//       thetaRef.current = Math.max(0, Math.min(Math.PI, thetaRef.current));
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//       // Update sliders
//       setTheta(thetaRef.current);
//       setPhi(phiRef.current);
//     };

//     renderer.domElement.addEventListener("mousedown", onMouseDown);
//     renderer.domElement.addEventListener("mouseup", onMouseUp);
//     renderer.domElement.addEventListener("mouseleave", onMouseUp);
//     renderer.domElement.addEventListener("mousemove", onMouseMove);

//     function animate() {
//       const x = Math.sin(thetaRef.current) * Math.cos(phiRef.current);
//       const y = Math.cos(thetaRef.current);
//       const z = Math.sin(thetaRef.current) * Math.sin(phiRef.current);
//       const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
//       blochVector.geometry.setFromPoints(points);
//       // Rotate the group according to theta and phi
//       blochGroup.rotation.x = thetaRef.current - Math.PI / 2;
//       blochGroup.rotation.y = phiRef.current;
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
//   }, []);

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
//         <div
//           style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
//         >
//           <button
//             onClick={() => {
//               setTheta(0);
//               setPhi(0);
//             }}
//           >
//             |0⟩
//           </button>
//           <button
//             onClick={() => {
//               setTheta(Math.PI);
//               setPhi(0);
//             }}
//           >
//             |1⟩
//           </button>
//           <button
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(0);
//             }}
//           >
//             |+⟩
//           </button>
//           <button
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(Math.PI);
//             }}
//           >
//             |-⟩
//           </button>
//           <button
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(Math.PI / 2);
//             }}
//           >
//             |i⟩
//           </button>
//           <button
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi((3 * Math.PI) / 2);
//             }}
//           >
//             - |i⟩
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import * as Three from "three";

export default function BlochSphere() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);

  // For mouse drag
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
    const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current!.appendChild(renderer.domElement);

    // Bloch group
    const blochGroup = new Three.Group();

    // Sphere
    const geometry = new Three.SphereGeometry(1, 64, 64);
    const material = new Three.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
      opacity: 0.5,
      transparent: true,
    });
    const sphere = new Three.Mesh(geometry, material);
    blochGroup.add(sphere);

    // Axes
    const axisLength = 1.3;
    const axes = [
      { dir: [1, 0, 0], color: 0xff0000, label: "x" },
      { dir: [0, 1, 0], color: 0x00ff00, label: "z" }, // z is up in Bloch sphere
      { dir: [0, 0, 1], color: 0x0000ff, label: "y" },
    ];
    axes.forEach(({ dir, color }) => {
      const points = [
        new Three.Vector3(0, 0, 0),
        new Three.Vector3(...dir).multiplyScalar(axisLength),
      ];
      const axisGeom = new Three.BufferGeometry().setFromPoints(points);
      const axisMat = new Three.LineBasicMaterial({ color });
      const axis = new Three.Line(axisGeom, axisMat);
      blochGroup.add(axis);
    });

    // Bloch vector (geometry will be updated in animate)
    const vectorMaterial = new Three.LineBasicMaterial({
      color: 0xff9900,
      linewidth: 3,
    });
    const vectorGeometry = new Three.BufferGeometry();
    const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
    blochGroup.add(blochVector);

    // Basis state labels (using sprites)
    function makeTextSprite(text: string, color: string) {
      const canvas = document.createElement("canvas");
      const size = 128;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 6;
      ctx.strokeText(text, size / 2, size / 2);
      ctx.fillText(text, size / 2, size / 2);
      const texture = new Three.CanvasTexture(canvas);
      const spriteMaterial = new Three.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new Three.Sprite(spriteMaterial);
      sprite.scale.set(0.3, 0.3, 0.3);
      return sprite;
    }

    // |0⟩ (north pole, z+)
    const label0 = makeTextSprite("|0⟩", "#00cc00");
    label0.position.set(0, axisLength, 0);
    blochGroup.add(label0);

    // |1⟩ (south pole, z-)
    const label1 = makeTextSprite("|1⟩", "#00cc00");
    label1.position.set(0, -axisLength, 0);
    blochGroup.add(label1);

    // |+⟩ (x+)
    const labelPlus = makeTextSprite("|+⟩", "#cc0000");
    labelPlus.position.set(axisLength, 0, 0);
    blochGroup.add(labelPlus);

    // |-⟩ (x-)
    const labelMinus = makeTextSprite("|-⟩", "#cc0000");
    labelMinus.position.set(-axisLength, 0, 0);
    blochGroup.add(labelMinus);

    // |i⟩ (y+)
    const labelI = makeTextSprite("|i⟩", "#0000cc");
    labelI.position.set(0, 0, axisLength);
    blochGroup.add(labelI);

    // -|i⟩ (y-)
    const labelMinusI = makeTextSprite("-|i⟩", "#0000cc");
    labelMinusI.position.set(0, 0, -axisLength);
    blochGroup.add(labelMinusI);

    scene.add(blochGroup);

    camera.position.z = 3;

    // Mouse drag to rotate the group and update sliders
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
      phiRef.current += deltaMove.x * 0.01;
      thetaRef.current += deltaMove.y * 0.01;
      // Clamp theta to [0, π]
      thetaRef.current = Math.max(0, Math.min(Math.PI, thetaRef.current));
      previousMousePosition = { x: e.clientX, y: e.clientY };
      setTheta(thetaRef.current);
      setPhi(phiRef.current);
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mouseleave", onMouseUp);
    renderer.domElement.addEventListener("mousemove", onMouseMove);

    function animate() {
      // Update Bloch vector direction according to theta and phi
      const x = Math.sin(thetaRef.current) * Math.cos(phiRef.current);
      const y = Math.cos(thetaRef.current);
      const z = Math.sin(thetaRef.current) * Math.sin(phiRef.current);
      const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
      blochVector.geometry.setFromPoints(points);

      // Rotate the group according to theta and phi
      // blochGroup.rotation.x = thetaRef.current - Math.PI / 2;
      // blochGroup.rotation.y = phiRef.current;

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
        <div
          style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <button
            onClick={() => {
              setTheta(0);
              setPhi(0);
            }}
          >
            |0⟩
          </button>
          <button
            onClick={() => {
              setTheta(Math.PI);
              setPhi(0);
            }}
          >
            |1⟩
          </button>
          <button
            onClick={() => {
              setTheta(Math.PI / 2);
              setPhi(0);
            }}
          >
            |+⟩
          </button>
          <button
            onClick={() => {
              setTheta(Math.PI / 2);
              setPhi(Math.PI);
            }}
          >
            |-⟩
          </button>
          <button
            onClick={() => {
              setTheta(Math.PI / 2);
              setPhi(Math.PI / 2);
            }}
          >
            |i⟩
          </button>
          <button
            onClick={() => {
              setTheta(Math.PI / 2);
              setPhi((3 * Math.PI) / 2);
            }}
          >
            - |i⟩
          </button>
        </div>
      </div>
    </div>
  );
}
