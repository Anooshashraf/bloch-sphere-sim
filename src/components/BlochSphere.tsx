// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as Three from "three";

// export default function BlochSphere() {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const [theta, setTheta] = useState(Math.PI / 2);
//   const [phi, setPhi] = useState(0);

//   // For mouse drag
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
//     const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setClearColor(0x181c24, 1);
//     renderer.setSize(width, height);
//     mountRef.current!.appendChild(renderer.domElement);

//     // Bloch group
//     const blochGroup = new Three.Group();

//     // Sphere
//     const geometry = new Three.SphereGeometry(1, 64, 64);
//     const material = new Three.MeshBasicMaterial({
//       color: 0x0077ff,
//       wireframe: true,
//       opacity: 0.25,
//       transparent: true,
//     });
//     const sphere = new Three.Mesh(geometry, material);
//     blochGroup.add(sphere);

//     // Axes
//     const axisLength = 1.3;
//     const axes = [
//       { dir: [1, 0, 0], color: 0xff4c4c, label: "x" },
//       { dir: [0, 1, 0], color: 0x4cff4c, label: "z" }, // z is up in Bloch sphere
//       { dir: [0, 0, 1], color: 0x4c6cff, label: "y" },
//     ];
//     axes.forEach(({ dir, color }) => {
//       const points = [
//         new Three.Vector3(0, 0, 0),
//         new Three.Vector3(...dir).multiplyScalar(axisLength),
//       ];
//       const axisGeom = new Three.BufferGeometry().setFromPoints(points);
//       const axisMat = new Three.LineBasicMaterial({ color, linewidth: 2 });
//       const axis = new Three.Line(axisGeom, axisMat);
//       blochGroup.add(axis);
//     });

//     // Bloch vector (geometry will be updated in animate)
//     const vectorMaterial = new Three.LineBasicMaterial({
//       color: 0xffc300,
//       linewidth: 5,
//     });
//     const vectorGeometry = new Three.BufferGeometry();
//     const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
//     blochGroup.add(blochVector);

//     // Basis state labels (using sprites)
//     function makeTextSprite(text: string, color: string) {
//       const canvas = document.createElement("canvas");
//       const size = 128;
//       canvas.width = size;
//       canvas.height = size;
//       const ctx = canvas.getContext("2d")!;
//       ctx.font = "bold 48px 'Segoe UI', Arial";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.shadowColor = "#000";
//       ctx.shadowBlur = 8;
//       ctx.fillStyle = color;
//       ctx.strokeStyle = "#fff";
//       ctx.lineWidth = 6;
//       ctx.strokeText(text, size / 2, size / 2);
//       ctx.fillText(text, size / 2, size / 2);
//       const texture = new Three.CanvasTexture(canvas);
//       const spriteMaterial = new Three.SpriteMaterial({
//         map: texture,
//         transparent: true,
//       });
//       const sprite = new Three.Sprite(spriteMaterial);
//       sprite.scale.set(0.32, 0.32, 0.32);
//       return sprite;
//     }

//     // |0⟩ (north pole, z+)
//     const label0 = makeTextSprite("|0⟩", "#4cff4c");
//     label0.position.set(0, axisLength, 0);
//     blochGroup.add(label0);

//     // |1⟩ (south pole, z-)
//     const label1 = makeTextSprite("|1⟩", "#4cff4c");
//     label1.position.set(0, -axisLength, 0);
//     blochGroup.add(label1);

//     // |+⟩ (x+)
//     const labelPlus = makeTextSprite("|+⟩", "#ff4c4c");
//     labelPlus.position.set(axisLength, 0, 0);
//     blochGroup.add(labelPlus);

//     // |-⟩ (x-)
//     const labelMinus = makeTextSprite("|-⟩", "#ff4c4c");
//     labelMinus.position.set(-axisLength, 0, 0);
//     blochGroup.add(labelMinus);

//     // |i⟩ (y+)
//     const labelI = makeTextSprite("|i⟩", "#4c6cff");
//     labelI.position.set(0, 0, axisLength);
//     blochGroup.add(labelI);

//     // -|i⟩ (y-)
//     const labelMinusI = makeTextSprite("-|i⟩", "#4c6cff");
//     labelMinusI.position.set(0, 0, -axisLength);
//     blochGroup.add(labelMinusI);

//     scene.add(blochGroup);

//     camera.position.z = 3;

//     // Mouse drag to rotate the group and update sliders
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
//       phiRef.current += deltaMove.x * 0.01;
//       thetaRef.current += deltaMove.y * 0.01;
//       thetaRef.current = Math.max(0, Math.min(Math.PI, thetaRef.current));
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//       setTheta(thetaRef.current);
//       setPhi(phiRef.current);
//     };

//     renderer.domElement.addEventListener("mousedown", onMouseDown);
//     renderer.domElement.addEventListener("mouseup", onMouseUp);
//     renderer.domElement.addEventListener("mouseleave", onMouseUp);
//     renderer.domElement.addEventListener("mousemove", onMouseMove);

//     function animate() {
//       // Update Bloch vector direction according to theta and phi
//       const x = Math.sin(thetaRef.current) * Math.cos(phiRef.current);
//       const y = Math.cos(thetaRef.current);
//       const z = Math.sin(thetaRef.current) * Math.sin(phiRef.current);
//       const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
//       blochVector.geometry.setFromPoints(points);

//       renderer.render(scene, camera);
//       requestAnimationFrame(animate);
//     }
//     animate();

//     return () => {
//       // Check if mountRef.current exists before trying to remove child
//       if (
//         mountRef.current &&
//         renderer.domElement.parentNode === mountRef.current
//       ) {
//         mountRef.current.removeChild(renderer.domElement);
//       }

//       renderer.domElement.removeEventListener("mousedown", onMouseDown);
//       renderer.domElement.removeEventListener("mouseup", onMouseUp);
//       renderer.domElement.removeEventListener("mouseleave", onMouseUp);
//     };
//   }, []);

//   // Modern UI styles
//   const cardStyle: React.CSSProperties = {
//     background: "rgba(24,28,36,0.95)",
//     borderRadius: 18,
//     boxShadow: "0 4px 32px #0008",
//     padding: 24,
//     color: "#fff",
//     width: 440,
//     margin: "32px auto",
//     fontFamily: "'Segoe UI', Arial, sans-serif",
//   };

//   const sliderStyle: React.CSSProperties = {
//     width: "100%",
//     accentColor: "#ffc300",
//     margin: "8px 0 24px 0",
//     height: 4,
//     borderRadius: 4,
//     background: "linear-gradient(90deg, #0077ff 0%, #ffc300 100%)",
//   };

//   const buttonStyle: React.CSSProperties = {
//     background: "linear-gradient(90deg, #0077ff 0%, #4c6cff 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "8px 18px",
//     fontWeight: 600,
//     fontSize: 16,
//     cursor: "pointer",
//     boxShadow: "0 2px 8px #0004",
//     transition: "background 0.2s, transform 0.2s",
//   };

//   const buttonActiveStyle: React.CSSProperties = {
//     ...buttonStyle,
//     background: "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
//     color: "#222",
//     transform: "scale(1.08)",
//   };

//   // Helper to highlight the active basis state
//   function isActive(thetaVal: number, phiVal: number) {
//     return Math.abs(theta - thetaVal) < 0.01 && Math.abs(phi - phiVal) < 0.01;
//   }

//   return (
//     <div style={cardStyle}>
//       <h2 style={{ textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>
//         <span style={{ color: "#ffc300" }}>Bloch Sphere Simulator</span>
//       </h2>
//       <div
//         ref={mountRef}
//         style={{
//           cursor: "grab",
//           margin: "0 auto 24px auto",
//           display: "block",
//           borderRadius: 16,
//           background:
//             "radial-gradient(ellipse at center, #232b3a 60%, #181c24 100%)",
//           boxShadow: "0 2px 16px #000a",
//           width: 400,
//           height: 400,
//         }}
//       />
//       <div>
//         <label style={{ display: "block", marginBottom: 8 }}>
//           <span style={{ color: "#ffc300" }}>θ (theta):</span>{" "}
//           {theta.toFixed(2)} rad
//           <input
//             type="range"
//             min={0}
//             max={Math.PI}
//             step={0.01}
//             value={theta}
//             onChange={(e) => setTheta(Number(e.target.value))}
//             style={sliderStyle}
//           />
//         </label>
//         <label style={{ display: "block", marginBottom: 8 }}>
//           <span style={{ color: "#ffc300" }}>φ (phi):</span> {phi.toFixed(2)}{" "}
//           rad
//           <input
//             type="range"
//             min={0}
//             max={Math.PI * 2}
//             step={0.01}
//             value={phi}
//             onChange={(e) => setPhi(Number(e.target.value))}
//             style={sliderStyle}
//           />
//         </label>
//         <div
//           style={{
//             marginTop: 16,
//             display: "flex",
//             gap: 10,
//             flexWrap: "wrap",
//             justifyContent: "center",
//           }}
//         >
//           <button
//             style={isActive(0, 0) ? buttonActiveStyle : buttonStyle}
//             onClick={() => {
//               setTheta(0);
//               setPhi(0);
//             }}
//           >
//             |0⟩
//           </button>
//           <button
//             style={isActive(Math.PI, 0) ? buttonActiveStyle : buttonStyle}
//             onClick={() => {
//               setTheta(Math.PI);
//               setPhi(0);
//             }}
//           >
//             |1⟩
//           </button>
//           <button
//             style={isActive(Math.PI / 2, 0) ? buttonActiveStyle : buttonStyle}
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(0);
//             }}
//           >
//             |+⟩
//           </button>
//           <button
//             style={
//               isActive(Math.PI / 2, Math.PI) ? buttonActiveStyle : buttonStyle
//             }
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(Math.PI);
//             }}
//           >
//             |-⟩
//           </button>
//           <button
//             style={
//               isActive(Math.PI / 2, Math.PI / 2)
//                 ? buttonActiveStyle
//                 : buttonStyle
//             }
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(Math.PI / 2);
//             }}
//           >
//             |i⟩
//           </button>
//           <button
//             style={
//               isActive(Math.PI / 2, (3 * Math.PI) / 2)
//                 ? buttonActiveStyle
//                 : buttonStyle
//             }
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi((3 * Math.PI) / 2);
//             }}
//           >
//             -|i⟩
//           </button>
//         </div>
//       </div>
//       <div
//         style={{
//           textAlign: "center",
//           marginTop: 24,
//           color: "#aaa",
//           fontSize: 14,
//         }}
//       >
//         Drag to rotate. Use sliders or click a basis state.
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as Three from "three";

// export default function BlochSphere() {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const [theta, setTheta] = useState(Math.PI / 2);
//   const [phi, setPhi] = useState(0);
//   const animationFrameId = useRef<number | null>(null);

//   // For mouse drag
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
//     const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setClearColor(0x181c24, 1);
//     renderer.setSize(width, height);

//     // Store Three.js objects for cleanup
//     const resources: {
//       geometry?: Three.BufferGeometry;
//       material?: Three.Material;
//       vectorMaterial?: Three.Material;
//       vectorGeometry?: Three.BufferGeometry;
//       axes?: Three.Line[];
//       textures?: Three.Texture[];
//     } = {};

//     if (mountRef.current) {
//       mountRef.current.appendChild(renderer.domElement);
//     }

//     // Bloch group
//     const blochGroup = new Three.Group();

//     // Sphere
//     const geometry = new Three.SphereGeometry(1, 64, 64);
//     const material = new Three.MeshBasicMaterial({
//       color: 0x0077ff,
//       wireframe: true,
//       opacity: 0.25,
//       transparent: true,
//     });
//     const sphere = new Three.Mesh(geometry, material);
//     blochGroup.add(sphere);

//     resources.geometry = geometry;
//     resources.material = material;

//     // Axes
//     const axisLength = 1.3;
//     const axes = [
//       { dir: [1, 0, 0], color: 0xff4c4c, label: "x" },
//       { dir: [0, 1, 0], color: 0x4cff4c, label: "z" },
//       { dir: [0, 0, 1], color: 0x4c6cff, label: "y" },
//     ];

//     const axisObjects = axes.map(({ dir, color }) => {
//       const points = [
//         new Three.Vector3(0, 0, 0),
//         new Three.Vector3(...dir).multiplyScalar(axisLength),
//       ];
//       const axisGeom = new Three.BufferGeometry().setFromPoints(points);
//       const axisMat = new Three.LineBasicMaterial({ color, linewidth: 2 });
//       const axis = new Three.Line(axisGeom, axisMat);
//       blochGroup.add(axis);
//       return { axis, geom: axisGeom, mat: axisMat };
//     });

//     resources.axes = axisObjects.map((obj) => obj.axis);

//     // Bloch vector
//     const vectorMaterial = new Three.LineBasicMaterial({
//       color: 0xffc300,
//       linewidth: 5,
//     });
//     const vectorGeometry = new Three.BufferGeometry();
//     const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
//     blochGroup.add(blochVector);

//     resources.vectorMaterial = vectorMaterial;
//     resources.vectorGeometry = vectorGeometry;

//     // Textures for labels
//     const textures: Three.Texture[] = [];
//     resources.textures = textures;

//     function makeTextSprite(text: string, color: string) {
//       const canvas = document.createElement("canvas");
//       const size = 128;
//       canvas.width = size;
//       canvas.height = size;
//       const ctx = canvas.getContext("2d")!;
//       ctx.font = "bold 48px 'Segoe UI', Arial";
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";
//       ctx.shadowColor = "#000";
//       ctx.shadowBlur = 8;
//       ctx.fillStyle = color;
//       ctx.strokeStyle = "#fff";
//       ctx.lineWidth = 6;
//       ctx.strokeText(text, size / 2, size / 2);
//       ctx.fillText(text, size / 2, size / 2);
//       const texture = new Three.CanvasTexture(canvas);
//       textures.push(texture);
//       const spriteMaterial = new Three.SpriteMaterial({
//         map: texture,
//         transparent: true,
//       });
//       const sprite = new Three.Sprite(spriteMaterial);
//       sprite.scale.set(0.32, 0.32, 0.32);
//       return sprite;
//     }

//     // Add all labels
//     const labels = [
//       { position: [0, axisLength, 0], text: "|0⟩", color: "#4cff4c" },
//       { position: [0, -axisLength, 0], text: "|1⟩", color: "#4cff4c" },
//       { position: [axisLength, 0, 0], text: "|+⟩", color: "#ff4c4c" },
//       { position: [-axisLength, 0, 0], text: "|-⟩", color: "#ff4c4c" },
//       { position: [0, 0, axisLength], text: "|i⟩", color: "#4c6cff" },
//       { position: [0, 0, -axisLength], text: "-|i⟩", color: "#4c6cff" },
//     ];

//     labels.forEach(({ position, text, color }) => {
//       const label = makeTextSprite(text, color);
//       label.position.set(position[0], position[1], position[2]);
//       blochGroup.add(label);
//     });

//     scene.add(blochGroup);
//     camera.position.z = 3;

//     // Mouse interaction
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
//       phiRef.current += deltaMove.x * 0.01;
//       thetaRef.current += deltaMove.y * 0.01;
//       thetaRef.current = Math.max(0, Math.min(Math.PI, thetaRef.current));
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//       setTheta(thetaRef.current);
//       setPhi(phiRef.current);
//     };

//     renderer.domElement.addEventListener("mousedown", onMouseDown);
//     renderer.domElement.addEventListener("mouseup", onMouseUp);
//     renderer.domElement.addEventListener("mouseleave", onMouseUp);
//     renderer.domElement.addEventListener("mousemove", onMouseMove);

//     const animate = () => {
//       const x = Math.sin(thetaRef.current) * Math.cos(phiRef.current);
//       const y = Math.cos(thetaRef.current);
//       const z = Math.sin(thetaRef.current) * Math.sin(phiRef.current);
//       const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
//       blochVector.geometry.setFromPoints(points);

//       renderer.render(scene, camera);
//       animationFrameId.current = requestAnimationFrame(animate);
//     };
//     animationFrameId.current = requestAnimationFrame(animate);

//     return () => {
//       // Cancel animation
//       if (animationFrameId.current) {
//         cancelAnimationFrame(animationFrameId.current);
//       }

//       // Remove event listeners
//       if (renderer.domElement) {
//         renderer.domElement.removeEventListener("mousedown", onMouseDown);
//         renderer.domElement.removeEventListener("mouseup", onMouseUp);
//         renderer.domElement.removeEventListener("mouseleave", onMouseUp);
//         renderer.domElement.removeEventListener("mousemove", onMouseMove);
//       }

//       // Remove DOM element
//       if (
//         mountRef.current &&
//         renderer.domElement.parentNode === mountRef.current
//       ) {
//         mountRef.current.removeChild(renderer.domElement);
//       }

//       // Dispose Three.js resources
//       renderer.dispose();
//       resources.geometry?.dispose();
//       resources.material?.dispose();
//       resources.vectorMaterial?.dispose();
//       resources.vectorGeometry?.dispose();

//       axisObjects.forEach((obj) => {
//         obj.geom.dispose();
//         obj.mat.dispose();
//       });

//       resources.textures?.forEach((texture) => texture.dispose());
//     };
//   }, []);

//   const cardStyle: React.CSSProperties = {
//     background: "rgba(24,28,36,0.95)",
//     borderRadius: 18,
//     boxShadow: "0 4px 32px #0008",
//     padding: 24,
//     color: "#fff",
//     width: 440,
//     margin: "32px auto",
//     fontFamily: "'Segoe UI', Arial, sans-serif",
//   };

//   const sliderStyle: React.CSSProperties = {
//     width: "100%",
//     accentColor: "#ffc300",
//     margin: "8px 0 24px 0",
//     height: 4,
//     borderRadius: 4,
//     background: "linear-gradient(90deg, #0077ff 0%, #ffc300 100%)",
//   };

//   const buttonStyle: React.CSSProperties = {
//     background: "linear-gradient(90deg, #0077ff 0%, #4c6cff 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 8,
//     padding: "8px 18px",
//     fontWeight: 600,
//     fontSize: 16,
//     cursor: "pointer",
//     boxShadow: "0 2px 8px #0004",
//     transition: "background 0.2s, transform 0.2s",
//   };
//   const isActive = (thetaVal: number, phiVal: number): boolean => {
//     return Math.abs(theta - thetaVal) < 0.01 && Math.abs(phi - phiVal) < 0.01;
//   };
//   const buttonActiveStyle: React.CSSProperties = {
//     ...buttonStyle,
//     background: "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
//     color: "#222",
//     transform: "scale(1.08)",
//   };
//   return (
//     <div style={cardStyle}>
//       <h2 style={{ textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>
//         <span style={{ color: "#ffc300" }}>Bloch Sphere Simulator</span>
//       </h2>
//       <div
//         ref={mountRef}
//         style={{
//           cursor: "grab",
//           margin: "0 auto 24px auto",
//           display: "block",
//           borderRadius: 16,
//           background:
//             "radial-gradient(ellipse at center, #232b3a 60%, #181c24 100%)",
//           boxShadow: "0 2px 16px #000a",
//           width: 400,
//           height: 400,
//         }}
//       />
//       <div>
//         <label style={{ display: "block", marginBottom: 8 }}>
//           <span style={{ color: "#ffc300" }}>θ (theta):</span>{" "}
//           {theta.toFixed(2)} rad
//           <input
//             type="range"
//             min={0}
//             max={Math.PI}
//             step={0.01}
//             value={theta}
//             onChange={(e) => setTheta(Number(e.target.value))}
//             style={sliderStyle}
//           />
//         </label>
//         <label style={{ display: "block", marginBottom: 8 }}>
//           <span style={{ color: "#ffc300" }}>φ (phi):</span> {phi.toFixed(2)}{" "}
//           rad
//           <input
//             type="range"
//             min={0}
//             max={Math.PI * 2}
//             step={0.01}
//             value={phi}
//             onChange={(e) => setPhi(Number(e.target.value))}
//             style={sliderStyle}
//           />
//         </label>
//         <div
//           style={{
//             marginTop: 16,
//             display: "flex",
//             gap: 10,
//             flexWrap: "wrap",
//             justifyContent: "center",
//           }}
//         >
//           <button
//             style={isActive(0, 0) ? buttonActiveStyle : buttonStyle}
//             onClick={() => {
//               setTheta(0);
//               setPhi(0);
//             }}
//           >
//             |0⟩
//           </button>
//           <button
//             style={isActive(Math.PI, 0) ? buttonActiveStyle : buttonStyle}
//             onClick={() => {
//               setTheta(Math.PI);
//               setPhi(0);
//             }}
//           >
//             |1⟩
//           </button>
//           <button
//             style={isActive(Math.PI / 2, 0) ? buttonActiveStyle : buttonStyle}
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(0);
//             }}
//           >
//             |+⟩
//           </button>
//           <button
//             style={
//               isActive(Math.PI / 2, Math.PI) ? buttonActiveStyle : buttonStyle
//             }
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(Math.PI);
//             }}
//           >
//             |-⟩
//           </button>
//           <button
//             style={
//               isActive(Math.PI / 2, Math.PI / 2)
//                 ? buttonActiveStyle
//                 : buttonStyle
//             }
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi(Math.PI / 2);
//             }}
//           >
//             |i⟩
//           </button>
//           <button
//             style={
//               isActive(Math.PI / 2, (3 * Math.PI) / 2)
//                 ? buttonActiveStyle
//                 : buttonStyle
//             }
//             onClick={() => {
//               setTheta(Math.PI / 2);
//               setPhi((3 * Math.PI) / 2);
//             }}
//           >
//             -|i⟩
//           </button>
//         </div>
//       </div>
//       <div
//         style={{
//           textAlign: "center",
//           marginTop: 24,
//           color: "#aaa",
//           fontSize: 14,
//         }}
//       >
//         Drag to rotate. Use sliders or click a basis state.
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import * as Three from "three";

// const BlochSphere = () => {
//   // Component state and refs
//   const mountRef = useRef<HTMLDivElement>(null);
//   const [theta, setTheta] = useState(Math.PI / 2);
//   const [phi, setPhi] = useState(0);
//   const animationFrameId = useRef<number | null>(null);
//   const thetaRef = useRef(theta);
//   const phiRef = useRef(phi);

//   // Update refs when state changes
//   useEffect(() => {
//     thetaRef.current = theta;
//     phiRef.current = phi;
//   }, [theta, phi]);

//   // Style definitions
// const cardStyle: React.CSSProperties = {
//   background: "rgba(24,28,36,0.95)",
//   borderRadius: 18,
//   boxShadow: "0 4px 32px #0008",
//   padding: "24px",
//   color: "#fff",
//   width: "100%",
//   maxWidth: "440px",
//   margin: "32px auto",
//   fontFamily: "'Segoe UI', Arial, sans-serif",
//   overflow: "hidden",
// };

// const containerStyle: React.CSSProperties = {
//   position: "relative",
//   width: "100%",
//   paddingBottom: "100%",
//   margin: "0 auto 24px auto",
//   borderRadius: 16,
//   background: "radial-gradient(ellipse at center, #232b3a 60%, #181c24 100%)",
//   boxShadow: "0 2px 16px #000a",
// };

// const canvasStyle: React.CSSProperties = {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   cursor: "grab",
// };

// const sliderStyle: React.CSSProperties = {
//   width: "100%",
//   accentColor: "#ffc300",
//   margin: "8px 0 24px 0",
//   height: 4,
//   borderRadius: 4,
//   background: "linear-gradient(90deg, #0077ff 0%, #ffc300 100%)",
// };

// const buttonStyle: React.CSSProperties = {
//   background: "linear-gradient(90deg, #0077ff 0%, #4c6cff 100%)",
//   color: "#fff",
//   border: "none",
//   borderRadius: 8,
//   padding: "8px 18px",
//   fontWeight: 600,
//   fontSize: 16,
//   cursor: "pointer",
//   boxShadow: "0 2px 8px #0004",
//   transition: "background 0.2s, transform 0.2s",
// };

// const buttonActiveStyle: React.CSSProperties = {
//   ...buttonStyle,
//   background: "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
//   color: "#222",
//   transform: "scale(1.08)",
// };

// const isActive = (thetaVal: number, phiVal: number): boolean => {
//   return Math.abs(theta - thetaVal) < 0.01 && Math.abs(phi - phiVal) < 0.01;
// };

//   // Three.js implementation
//   useEffect(() => {
//     if (!mountRef.current) return;

//     const container = mountRef.current;
//     const width = container.clientWidth;
//     const height = container.clientHeight;

//     // Scene setup
//     const scene = new Three.Scene();
//     const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
//     const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });

//     renderer.setSize(width, height);
//     container.appendChild(renderer.domElement);

//     // Handle window resize
//     const handleResize = () => {
//       const newWidth = container.clientWidth;
//       const newHeight = container.clientHeight;
//       camera.aspect = newWidth / newHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(newWidth, newHeight);
//     };

//     window.addEventListener("resize", handleResize);

//     // Bloch group
//     const blochGroup = new Three.Group();

//     // Sphere
//     const geometry = new Three.SphereGeometry(1, 64, 64);
//     const material = new Three.MeshBasicMaterial({
//       color: 0x0077ff,
//       wireframe: true,
//       opacity: 0.25,
//       transparent: true,
//     });
//     const sphere = new Three.Mesh(geometry, material);
//     blochGroup.add(sphere);

//     // Axes
//     const axisLength = 1.3;
//     const axes = [
//       { dir: [1, 0, 0], color: 0xff4c4c },
//       { dir: [0, 1, 0], color: 0x4cff4c },
//       { dir: [0, 0, 1], color: 0x4c6cff },
//     ];

//     axes.forEach(({ dir, color }) => {
//       const points = [
//         new Three.Vector3(0, 0, 0),
//         new Three.Vector3(...dir).multiplyScalar(axisLength),
//       ];
//       const axisGeom = new Three.BufferGeometry().setFromPoints(points);
//       const axisMat = new Three.LineBasicMaterial({ color, linewidth: 2 });
//       const axis = new Three.Line(axisGeom, axisMat);
//       blochGroup.add(axis);
//     });

//     // Bloch vector
//     const vectorMaterial = new Three.LineBasicMaterial({
//       color: 0xffc300,
//       linewidth: 5,
//     });
//     const vectorGeometry = new Three.BufferGeometry();
//     const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
//     blochGroup.add(blochVector);

//     scene.add(blochGroup);
//     camera.position.z = 3;

//     // Mouse interaction
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
//       phiRef.current += deltaMove.x * 0.01;
//       thetaRef.current += deltaMove.y * 0.01;
//       thetaRef.current = Math.max(0, Math.min(Math.PI, thetaRef.current));
//       previousMousePosition = { x: e.clientX, y: e.clientY };
//       setTheta(thetaRef.current);
//       setPhi(phiRef.current);
//     };

//     container.addEventListener("mousedown", onMouseDown);
//     container.addEventListener("mouseup", onMouseUp);
//     container.addEventListener("mouseleave", onMouseUp);
//     container.addEventListener("mousemove", onMouseMove);

//     // Animation loop
//     const animate = () => {
//       const x = Math.sin(thetaRef.current) * Math.cos(phiRef.current);
//       const y = Math.cos(thetaRef.current);
//       const z = Math.sin(thetaRef.current) * Math.sin(phiRef.current);
//       const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
//       blochVector.geometry.setFromPoints(points);

//       renderer.render(scene, camera);
//       animationFrameId.current = requestAnimationFrame(animate);
//     };
//     animationFrameId.current = requestAnimationFrame(animate);

//     // Cleanup
//     return () => {
//       if (animationFrameId.current) {
//         cancelAnimationFrame(animationFrameId.current);
//       }

//       container.removeEventListener("mousedown", onMouseDown);
//       container.removeEventListener("mouseup", onMouseUp);
//       container.removeEventListener("mouseleave", onMouseUp);
//       container.removeEventListener("mousemove", onMouseMove);

//       window.removeEventListener("resize", handleResize);

//       if (container.contains(renderer.domElement)) {
//         container.removeChild(renderer.domElement);
//       }

//       renderer.dispose();
//       geometry.dispose();
//       material.dispose();
//       vectorGeometry.dispose();
//       vectorMaterial.dispose();
//     };
//   }, []);

//   return (
//     <div style={cardStyle}>
//   <h2 style={{ textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>
//     <span style={{ color: "#ffc300" }}>Bloch Sphere Simulator</span>
//   </h2>

//   <div style={containerStyle}>
//     <div ref={mountRef} style={canvasStyle} />
//   </div>

//   <div>
//     <label style={{ display: "block", marginBottom: 8 }}>
//       <span style={{ color: "#ffc300" }}>θ (theta):</span>{" "}
//       {theta.toFixed(2)} rad
//       <input
//         type="range"
//         min={0}
//         max={Math.PI}
//         step={0.01}
//         value={theta}
//         onChange={(e) => setTheta(Number(e.target.value))}
//         style={sliderStyle}
//       />
//     </label>

//     <label style={{ display: "block", marginBottom: 8 }}>
//       <span style={{ color: "#ffc300" }}>φ (phi):</span> {phi.toFixed(2)}{" "}
//       rad
//       <input
//         type="range"
//         min={0}
//         max={Math.PI * 2}
//         step={0.01}
//         value={phi}
//         onChange={(e) => setPhi(Number(e.target.value))}
//         style={sliderStyle}
//       />
//     </label>

//     <div
//       style={{
//         marginTop: 16,
//         display: "flex",
//         gap: 10,
//         flexWrap: "wrap",
//         justifyContent: "center",
//       }}
//     >
//       {[
//         { theta: 0, phi: 0, label: "|0⟩" },
//         { theta: Math.PI, phi: 0, label: "|1⟩" },
//         { theta: Math.PI / 2, phi: 0, label: "|+⟩" },
//         { theta: Math.PI / 2, phi: Math.PI, label: "|-⟩" },
//         { theta: Math.PI / 2, phi: Math.PI / 2, label: "|i⟩" },
//         { theta: Math.PI / 2, phi: (3 * Math.PI) / 2, label: "-|i⟩" },
//       ].map((state) => (
//         <button
//           key={state.label}
//           style={
//             isActive(state.theta, state.phi)
//               ? buttonActiveStyle
//               : buttonStyle
//           }
//           onClick={() => {
//             setTheta(state.theta);
//             setPhi(state.phi);
//           }}
//         >
//           {state.label}
//         </button>
//       ))}
//     </div>
//   </div>

//   <div
//     style={{
//       textAlign: "center",
//       marginTop: 24,
//       color: "#aaa",
//       fontSize: 14,
//     }}
//   >
//     Drag to rotate. Use sliders or click a basis state.
//   </div>
// </div>
//   );
// };

// export default BlochSphere;

"use client";

import { useEffect, useRef, useState } from "react";
import * as Three from "three";

const BlochSphere = () => {
  // Component state and refs
  const mountRef = useRef<HTMLDivElement>(null);
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);
  const animationFrameId = useRef<number | null>(null);
  const thetaRef = useRef(theta);
  const phiRef = useRef(phi);

  // Update refs when state changes
  useEffect(() => {
    thetaRef.current = theta;
    phiRef.current = phi;
  }, [theta, phi]);

  const cardStyle: React.CSSProperties = {
    background: "rgba(24,28,36,0.95)",
    borderRadius: 18,
    boxShadow: "0 4px 32px #0008",
    padding: "24px",
    color: "#fff",
    width: "100%",
    maxWidth: "440px",
    margin: "32px auto",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    overflow: "hidden",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingBottom: "100%",
    margin: "0 auto 24px auto",
    borderRadius: 16,
    background: "radial-gradient(ellipse at center, #232b3a 60%, #181c24 100%)",
    boxShadow: "0 2px 16px #000a",
  };

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    cursor: "grab",
  };

  const sliderStyle: React.CSSProperties = {
    width: "100%",
    accentColor: "#ffc300",
    margin: "8px 0 24px 0",
    height: 4,
    borderRadius: 4,
    background: "linear-gradient(90deg, #0077ff 0%, #ffc300 100%)",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #0077ff 0%, #4c6cff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 2px 8px #0004",
    transition: "background 0.2s, transform 0.2s",
  };

  const buttonActiveStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
    color: "#222",
    transform: "scale(1.08)",
  };

  const isActive = (thetaVal: number, phiVal: number): boolean => {
    return Math.abs(theta - thetaVal) < 0.01 && Math.abs(phi - phiVal) < 0.01;
  };

  // Three.js implementation with labels
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Bloch group
    const blochGroup = new Three.Group();

    // Sphere (unchanged)
    const geometry = new Three.SphereGeometry(1, 64, 64);
    const material = new Three.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
      opacity: 0.25,
      transparent: true,
    });
    const sphere = new Three.Mesh(geometry, material);
    blochGroup.add(sphere);

    // Axes (unchanged)
    const axisLength = 1.3;
    const axes = [
      { dir: [1, 0, 0], color: 0xff4c4c },
      { dir: [0, 1, 0], color: 0x4cff4c },
      { dir: [0, 0, 1], color: 0x4c6cff },
    ];

    axes.forEach(({ dir, color }) => {
      const points = [
        new Three.Vector3(0, 0, 0),
        new Three.Vector3(...dir).multiplyScalar(axisLength),
      ];
      const axisGeom = new Three.BufferGeometry().setFromPoints(points);
      const axisMat = new Three.LineBasicMaterial({ color, linewidth: 2 });
      const axis = new Three.Line(axisGeom, axisMat);
      blochGroup.add(axis);
    });

    // Bloch vector (unchanged)
    const vectorMaterial = new Three.LineBasicMaterial({
      color: 0xffc300,
      linewidth: 5,
    });
    const vectorGeometry = new Three.BufferGeometry();
    const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
    blochGroup.add(blochVector);

    // BASIS STATE LABELS
    const createTextSprite = (
      text: string,
      color: string,
      position: Three.Vector3
    ) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 256;
      canvas.height = 128;

      // Text styling
      context.font = "Bold 48px Arial";
      context.fillStyle = color;
      context.textAlign = "center";
      context.textBaseline = "middle";

      // Add background for better visibility
      context.fillStyle = "rgba(0, 0, 0, 0.5)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Text
      context.fillStyle = color;
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new Three.CanvasTexture(canvas);
      const spriteMaterial = new Three.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new Three.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(0.5, 0.25, 0.25);
      return sprite;
    };

    // Add basis state labels
    const labelDistance = 1.5;
    const labels = [
      {
        text: "|0⟩",
        color: "#4cff4c",
        position: new Three.Vector3(0, labelDistance, 0),
      },
      {
        text: "|1⟩",
        color: "#4cff4c",
        position: new Three.Vector3(0, -labelDistance, 0),
      },
      {
        text: "|+⟩",
        color: "#ff4c4c",
        position: new Three.Vector3(labelDistance, 0, 0),
      },
      {
        text: "|-⟩",
        color: "#ff4c4c",
        position: new Three.Vector3(-labelDistance, 0, 0),
      },
      {
        text: "|i⟩",
        color: "#4c6cff",
        position: new Three.Vector3(0, 0, labelDistance),
      },
      {
        text: "-|i⟩",
        color: "#4c6cff",
        position: new Three.Vector3(0, 0, -labelDistance),
      },
    ];

    labels.forEach((label) => {
      const sprite = createTextSprite(label.text, label.color, label.position);
      blochGroup.add(sprite);
    });

    scene.add(blochGroup);
    camera.position.z = 3;

    // Mouse interaction (unchanged)
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
      thetaRef.current = Math.max(0, Math.min(Math.PI, thetaRef.current));
      previousMousePosition = { x: e.clientX, y: e.clientY };
      setTheta(thetaRef.current);
      setPhi(phiRef.current);
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseUp);
    container.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const animate = () => {
      const x = Math.sin(thetaRef.current) * Math.cos(phiRef.current);
      const y = Math.cos(thetaRef.current);
      const z = Math.sin(thetaRef.current) * Math.sin(phiRef.current);
      const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
      blochVector.geometry.setFromPoints(points);

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseUp);
      container.removeEventListener("mousemove", onMouseMove);

      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      geometry.dispose();
      material.dispose();
      vectorGeometry.dispose();
      vectorMaterial.dispose();
    };
  }, []);

  // Rest of the component (JSX) remains the same
  return (
    <div style={cardStyle}>
      <h2 style={{ textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>
        <span style={{ color: "#ffc300" }}>Bloch Sphere Simulator</span>
      </h2>

      <div style={containerStyle}>
        <div ref={mountRef} style={canvasStyle} />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: 8 }}>
          <span style={{ color: "#ffc300" }}>θ (theta):</span>{" "}
          {theta.toFixed(2)} rad
          <input
            type="range"
            min={0}
            max={Math.PI}
            step={0.01}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
            style={sliderStyle}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          <span style={{ color: "#ffc300" }}>φ (phi):</span> {phi.toFixed(2)}{" "}
          rad
          <input
            type="range"
            min={0}
            max={Math.PI * 2}
            step={0.01}
            value={phi}
            onChange={(e) => setPhi(Number(e.target.value))}
            style={sliderStyle}
          />
        </label>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { theta: 0, phi: 0, label: "|0⟩" },
            { theta: Math.PI, phi: 0, label: "|1⟩" },
            { theta: Math.PI / 2, phi: 0, label: "|+⟩" },
            { theta: Math.PI / 2, phi: Math.PI, label: "|-⟩" },
            { theta: Math.PI / 2, phi: Math.PI / 2, label: "|i⟩" },
            { theta: Math.PI / 2, phi: (3 * Math.PI) / 2, label: "-|i⟩" },
          ].map((state) => (
            <button
              key={state.label}
              style={
                isActive(state.theta, state.phi)
                  ? buttonActiveStyle
                  : buttonStyle
              }
              onClick={() => {
                setTheta(state.theta);
                setPhi(state.phi);
              }}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          color: "#aaa",
          fontSize: 14,
        }}
      >
        Drag to rotate. Use sliders or click a basis state.
      </div>
    </div>
  );
};

export default BlochSphere;
