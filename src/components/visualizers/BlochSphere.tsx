// "use client";

// import { useState, useRef, useEffect } from "react";
// import * as THREE from "three";
// import { getStateVector, getBlochCoordinates } from "../core/utils";

// interface BlochSphereProps {
//   theta?: number;
//   phi?: number;
//   onStateChange?: (theta: number, phi: number) => void;
// }

// export default function BlochSphere({
//   theta = Math.PI / 2,
//   phi = 0,
//   onStateChange,
// }: BlochSphereProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [internalTheta, setInternalTheta] = useState(theta);
//   const [internalPhi, setInternalPhi] = useState(phi);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isRotating, setIsRotating] = useState(false);
//   const [rotationSpeed, setRotationSpeed] = useState(0.002);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Set up Three.js scene
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       alpha: true,
//     });

//     renderer.setSize(
//       containerRef.current.clientWidth,
//       containerRef.current.clientHeight
//     );
//     renderer.setClearColor(0x000000, 0);
//     containerRef.current.appendChild(renderer.domElement);

//     // Position camera
//     camera.position.z = 2.8;
//     camera.position.y = 1.2;
//     camera.lookAt(0, 0, 0);

//     // Create Bloch sphere
//     const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

//     const sphereMaterial = new THREE.MeshPhongMaterial({
//       color: 0x3b82f6,
//       transparent: true,
//       opacity: 0.15,
//       wireframe: false,
//       specular: 0x555555,
//       shininess: 100,
//     });

//     const sphereWireframe = new THREE.WireframeGeometry(sphereGeometry);
//     const wireframeMaterial = new THREE.LineBasicMaterial({
//       color: 0x6366f1,
//       linewidth: 1,
//       transparent: true,
//       opacity: 0.3,
//     });

//     const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//     const wireframe = new THREE.LineSegments(
//       sphereWireframe,
//       wireframeMaterial
//     );
//     scene.add(sphere);
//     scene.add(wireframe);

//     // Add lighting
//     const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
//     directionalLight.position.set(1, 1, 1);
//     scene.add(directionalLight);

//     // Add axes
//     const axesHelper = new THREE.AxesHelper(1.3);
//     scene.add(axesHelper);

//     // Create axis labels
//     const createAxisLabel = (
//       text: string,
//       position: THREE.Vector3,
//       color: string
//     ) => {
//       const div = document.createElement("div");
//       div.style.position = "absolute";
//       div.style.color = color;
//       div.style.fontWeight = "bold";
//       div.style.fontSize = "14px";
//       div.style.fontFamily = "monospace";
//       div.style.backgroundColor = "rgba(31, 41, 55, 0.8)";
//       div.style.padding = "2px 6px";
//       div.style.borderRadius = "4px";
//       div.style.border = `1px solid ${color}40`;
//       div.textContent = text;

//       // Convert 3D position to screen coordinates
//       const vector = position.clone();
//       vector.project(camera);

//       const x = (vector.x * 0.5 + 0.5) * containerRef.current!.clientWidth;
//       const y = (-vector.y * 0.5 + 0.5) * containerRef.current!.clientHeight;

//       div.style.left = `${x}px`;
//       div.style.top = `${y}px`;
//       div.style.transform = "translate(-50%, -50%)";

//       containerRef.current!.appendChild(div);

//       return div;
//     };

//     const labels: HTMLDivElement[] = [];

//     // Add state vector
//     const stateVectorGeometry = new THREE.BufferGeometry();
//     const stateVectorMaterial = new THREE.LineBasicMaterial({
//       color: 0xef4444,
//       linewidth: 3,
//     });

//     const arrowHeadGeometry = new THREE.ConeGeometry(0.08, 0.2, 16);
//     const arrowHeadMaterial = new THREE.MeshBasicMaterial({
//       color: 0xef4444,
//     });

//     let stateVectorLine: THREE.Line;
//     let arrowHead: THREE.Mesh;

//     const updateStateVector = () => {
//       const state = getStateVector(internalTheta, internalPhi);
//       const [x, y, z] = getBlochCoordinates(state);

//       if (stateVectorLine) scene.remove(stateVectorLine);
//       if (arrowHead) scene.remove(arrowHead);

//       const points = [
//         new THREE.Vector3(0, 0, 0),
//         new THREE.Vector3(x * 0.95, y * 0.95, z * 0.95),
//       ];

//       stateVectorGeometry.setFromPoints(points);
//       stateVectorLine = new THREE.Line(
//         stateVectorGeometry,
//         stateVectorMaterial
//       );
//       scene.add(stateVectorLine);

//       arrowHead = new THREE.Mesh(arrowHeadGeometry, arrowHeadMaterial);
//       arrowHead.position.set(x * 0.95, y * 0.95, z * 0.95);

//       const direction = new THREE.Vector3(x, y, z).normalize();
//       arrowHead.lookAt(direction.multiplyScalar(2));
//       scene.add(arrowHead);

//       if (onStateChange) {
//         onStateChange(internalTheta, internalPhi);
//       }
//     };

//     updateStateVector();

//     // Handle dragging to change state
//     const onMouseMove = (event: MouseEvent) => {
//       if (!isDragging || !containerRef.current) return;

//       const rect = containerRef.current.getBoundingClientRect();
//       const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
//       const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

//       const newTheta = Math.max(0.01, Math.min(Math.PI - 0.01, Math.acos(-y)));
//       const newPhi = Math.atan2(x, Math.sqrt(1 - y * y));

//       setInternalTheta(newTheta);
//       setInternalPhi(newPhi);
//       updateStateVector();
//     };

//     const onMouseDown = (event: MouseEvent) => {
//       if (event.button === 0) {
//         setIsDragging(true);
//         setIsRotating(false);
//       }
//     };

//     const onMouseUp = () => {
//       setIsDragging(false);
//       setIsRotating(true);
//     };

//     // Add rotation controls
//     const onWheel = (event: WheelEvent) => {
//       event.preventDefault();
//       setRotationSpeed((prev) =>
//         Math.max(0.001, Math.min(0.01, prev + event.deltaY * 0.0001))
//       );
//     };

//     renderer.domElement.addEventListener("mousedown", onMouseDown);
//     renderer.domElement.addEventListener("mouseup", onMouseUp);
//     renderer.domElement.addEventListener("mousemove", onMouseMove);
//     renderer.domElement.addEventListener("wheel", onWheel);

//     // Add axis labels after initial render
//     const labelElements = [
//       createAxisLabel("|0⟩", new THREE.Vector3(0, 0, 1.4), "#10b981"),
//       createAxisLabel("|1⟩", new THREE.Vector3(0, 0, -1.4), "#ef4444"),
//       createAxisLabel("|+⟩", new THREE.Vector3(1.4, 0, 0), "#3b82f6"),
//       createAxisLabel("|-⟩", new THREE.Vector3(-1.4, 0, 0), "#8b5cf6"),
//       createAxisLabel("|i⟩", new THREE.Vector3(0, 1.4, 0), "#f59e0b"),
//       createAxisLabel("|-i⟩", new THREE.Vector3(0, -1.4, 0), "#ec4899"),
//     ];

//     labels.push(...labelElements);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);

//       if (isRotating && !isDragging) {
//         sphere.rotation.y += rotationSpeed;
//         wireframe.rotation.y += rotationSpeed;
//         if (stateVectorLine) stateVectorLine.rotation.y += rotationSpeed;
//         if (arrowHead) arrowHead.rotation.y += rotationSpeed;
//         axesHelper.rotation.y += rotationSpeed;
//       }

//       renderer.render(scene, camera);
//     };

//     animate();

//     // Handle resize
//     const onResize = () => {
//       if (!containerRef.current) return;
//       camera.aspect =
//         containerRef.current.clientWidth / containerRef.current.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(
//         containerRef.current.clientWidth,
//         containerRef.current.clientHeight
//       );
//     };

//     window.addEventListener("resize", onResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener("resize", onResize);
//       renderer.domElement.removeEventListener("mousedown", onMouseDown);
//       renderer.domElement.removeEventListener("mouseup", onMouseUp);
//       renderer.domElement.removeEventListener("mousemove", onMouseMove);
//       renderer.domElement.removeEventListener("wheel", onWheel);

//       // Remove labels
//       labels.forEach((label) => label.remove());

//       if (
//         containerRef.current &&
//         renderer.domElement.parentNode === containerRef.current
//       ) {
//         containerRef.current.removeChild(renderer.domElement);
//       }

//       // Dispose of resources
//       renderer.dispose();
//       sphereGeometry.dispose();
//       sphereMaterial.dispose();
//       wireframeMaterial.dispose();
//       stateVectorMaterial.dispose();
//       arrowHeadGeometry.dispose();
//       arrowHeadMaterial.dispose();
//     };
//   }, [
//     internalTheta,
//     internalPhi,
//     isDragging,
//     isRotating,
//     rotationSpeed,
//     onStateChange,
//   ]);

//   return (
//     <div
//       className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden relative border border-gray-700 shadow-xl"
//       ref={containerRef}
//     >
//       <div className="absolute bottom-3 left-3 bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-600">
//         <div className="text-white text-sm font-mono">
//           θ: {((internalTheta * 180) / Math.PI).toFixed(1)}°
//           <span className="mx-2 text-gray-400">|</span>
//           φ: {((internalPhi * 180) / Math.PI).toFixed(1)}°
//         </div>
//       </div>

//       <div className="absolute top-3 left-3 bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-600">
//         <div className="text-white text-sm flex items-center gap-2">
//           <div
//             className={`w-2 h-2 rounded-full ${
//               isDragging ? "bg-red-400" : "bg-green-400"
//             }`}
//           ></div>
//           <span>
//             {isDragging
//               ? "Dragging..."
//               : "Click to set state • Scroll to adjust rotation"}
//           </span>
//         </div>
//       </div>

//       <div className="absolute top-3 right-3 bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-600">
//         <div className="text-white text-sm">
//           Speed: {(rotationSpeed * 1000).toFixed(1)}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { getStateVector, getBlochCoordinates } from "../core/utils";

interface BlochSphereProps {
  theta?: number;
  phi?: number;
  onStateChange?: (theta: number, phi: number) => void;
}

export default function BlochSphere({
  theta = Math.PI / 2,
  phi = 0,
  onStateChange,
}: BlochSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalTheta, setInternalTheta] = useState(theta);
  const [internalPhi, setInternalPhi] = useState(phi);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for Three.js objects with proper initial values
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
  const stateVectorRef = useRef<THREE.Line | null>(null);
  const arrowHeadRef = useRef<THREE.Mesh | null>(null);
  const axesRef = useRef<THREE.AxesHelper | null>(null);
  const animationRef = useRef<number | null>(null);
  const rotationAngleRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3.2;
    camera.position.y = 1.5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Bloch sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);

    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.12,
      specular: 0x777777,
      shininess: 80,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Wireframe
    const wireframeGeometry = new THREE.WireframeGeometry(sphereGeometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      linewidth: 1,
      transparent: true,
      opacity: 0.25,
    });

    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial
    );
    scene.add(wireframe);
    wireframeRef.current = wireframe;

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight1.position.set(2, 3, 2);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-2, -1, -2);
    scene.add(directionalLight2);

    // Axes
    const axes = new THREE.AxesHelper(1.4);
    (axes.material as THREE.LineBasicMaterial).linewidth = 2;
    scene.add(axes);
    axesRef.current = axes;

    // State vector
    const stateVectorGeometry = new THREE.BufferGeometry();
    const stateVectorMaterial = new THREE.LineBasicMaterial({
      color: 0xef4444,
      linewidth: 4,
      transparent: true,
      opacity: 0.9,
    });

    const stateVector = new THREE.Line(
      stateVectorGeometry,
      stateVectorMaterial
    );
    scene.add(stateVector);
    stateVectorRef.current = stateVector;

    // Arrow head
    const arrowHeadGeometry = new THREE.ConeGeometry(0.1, 0.25, 16);
    const arrowHeadMaterial = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.9,
    });

    const arrowHead = new THREE.Mesh(arrowHeadGeometry, arrowHeadMaterial);
    scene.add(arrowHead);
    arrowHeadRef.current = arrowHead;

    // Update function for state vector
    const updateStateVector = () => {
      const state = getStateVector(internalTheta, internalPhi);
      const [x, y, z] = getBlochCoordinates(state);

      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.96, y * 0.96, z * 0.96),
      ];

      stateVectorGeometry.setFromPoints(points);

      arrowHead.position.set(x * 0.96, y * 0.96, z * 0.96);
      const direction = new THREE.Vector3(x, y, z).normalize();
      arrowHead.lookAt(direction.multiplyScalar(2));

      if (onStateChange) {
        onStateChange(internalTheta, internalPhi);
      }
    };

    updateStateVector();

    // Mouse event handlers
    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        setIsDragging(true);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const newTheta = Math.max(0.01, Math.min(Math.PI - 0.01, Math.acos(-y)));
      const newPhi = Math.atan2(x, Math.sqrt(1 - y * y));

      setInternalTheta(newTheta);
      setInternalPhi(newPhi);
      updateStateVector();
    };

    // Touch support for mobile
    const onTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      setIsDragging(true);
    };

    const onTouchEnd = () => {
      setIsDragging(false);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isDragging || !containerRef.current || !event.touches[0]) return;

      event.preventDefault();
      const touch = event.touches[0];
      const rect = containerRef.current.getBoundingClientRect();

      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      const newTheta = Math.max(0.01, Math.min(Math.PI - 0.01, Math.acos(-y)));
      const newPhi = Math.atan2(x, Math.sqrt(1 - y * y));

      setInternalTheta(newTheta);
      setInternalPhi(newPhi);
      updateStateVector();
    };

    // Add event listeners
    const canvas = renderer.domElement;
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    // Smooth animation loop
    const animate = (time: number) => {
      animationRef.current = requestAnimationFrame(animate);

      if (!isDragging) {
        // Smooth continuous rotation
        rotationAngleRef.current += 0.002;
        const smoothRotation =
          Math.sin(rotationAngleRef.current * 0.5) * 0.003 + 0.002;

        if (sphereRef.current) sphereRef.current.rotation.y += smoothRotation;
        if (wireframeRef.current)
          wireframeRef.current.rotation.y += smoothRotation;
        if (stateVectorRef.current)
          stateVectorRef.current.rotation.y += smoothRotation;
        if (arrowHeadRef.current)
          arrowHeadRef.current.rotation.y += smoothRotation;
        if (axesRef.current) axesRef.current.rotation.y += smoothRotation;
      }

      // Smooth camera movement
      if (cameraRef.current) {
        const targetPosition = isDragging
          ? new THREE.Vector3(3.0, 1.3, 0)
          : new THREE.Vector3(3.2, 1.5, 0);
        cameraRef.current.position.lerp(targetPosition, 0.1);
        cameraRef.current.lookAt(0, 0, 0);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Handle resize with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current)
          return;

        cameraRef.current.aspect =
          containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }, 100);
    };

    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);

      if (canvas) {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchend", onTouchEnd);
        canvas.removeEventListener("touchmove", onTouchMove);
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (containerRef.current && rendererRef.current?.domElement) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Dispose of resources
      rendererRef.current?.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      stateVectorGeometry.dispose();
      stateVectorMaterial.dispose();
      arrowHeadGeometry.dispose();
      arrowHeadMaterial.dispose();

      // Clear refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      sphereRef.current = null;
      wireframeRef.current = null;
      stateVectorRef.current = null;
      arrowHeadRef.current = null;
      axesRef.current = null;
      animationRef.current = null;
    };
  }, [internalTheta, internalPhi, isDragging, onStateChange]);

  return (
    <div className="w-full h-96 relative">
      {/* Main container with gradient background */}
      <div
        ref={containerRef}
        className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl"
      />

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-600/50">
        <div className="text-white font-mono text-sm flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isDragging ? "bg-red-400 animate-pulse" : "bg-green-400"
              }`}
            ></div>
            <span>θ: {((internalTheta * 180) / Math.PI).toFixed(1)}°</span>
          </div>
          <div className="w-px h-4 bg-gray-600"></div>
          <span>φ: {((internalPhi * 180) / Math.PI).toFixed(1)}°</span>
        </div>
      </div>

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-600/50">
        <div className="text-white text-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="font-medium">Click & drag to set state</span>
          </div>
          <div className="text-gray-300 text-xs">
            The sphere rotates automatically when idle
          </div>
        </div>
      </div>

      {/* Quantum state display */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-600/50">
        <div className="text-white font-mono text-xs">
          <div className="opacity-80">|ψ⟩ = </div>
          <div className="ml-4">
            {Math.cos(internalTheta / 2).toFixed(3)}|0⟩
            <span className="mx-1">+</span>
            <span>
              e<sup>i{internalPhi.toFixed(2)}</sup>
            </span>
            {Math.sin(internalTheta / 2).toFixed(3)}|1⟩
          </div>
        </div>
      </div>

      {!containerRef.current && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/20 to-transparent animate-shimmer"></div>
        </div>
      )}
    </div>
  );
}
