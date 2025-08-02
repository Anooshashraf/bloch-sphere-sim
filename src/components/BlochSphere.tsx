"use client";

import { useEffect, useRef, useState } from "react";
import * as Three from "three";
import { OrbitControls } from "three-stdlib";

interface QuantumState {
  theta: number;
  phi: number;
  label: string;
  color: string;
}

const BlochSphere = () => {
  // Component state and refs
  const mountRef = useRef<HTMLDivElement>(null);
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const animationFrameId = useRef<number | null>(null);
  const thetaRef = useRef(theta);
  const phiRef = useRef(phi);
  const sceneRef = useRef<Three.Scene | null>(null);
  const blochVectorRef = useRef<Three.Line | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<Three.WebGLRenderer | null>(null);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update refs when state changes
  useEffect(() => {
    thetaRef.current = theta;
    phiRef.current = phi;
    updateBlochVector();
  }, [theta, phi]);

  const updateBlochVector = () => {
    if (!blochVectorRef.current) return;

    const x = Math.sin(thetaRef.current) * Math.cos(phiRef.current);
    const y = Math.cos(thetaRef.current);
    const z = Math.sin(thetaRef.current) * Math.sin(phiRef.current);
    const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(x, y, z)];
    blochVectorRef.current.geometry.setFromPoints(points);
  };

  // Styles
  const cardStyle: React.CSSProperties = {
    background: "rgba(24,28,36,0.95)",
    borderRadius: 18,
    boxShadow: "0 4px 32px #0008",
    padding: "24px",
    color: "#fff",
    width: "100%",
    maxWidth: "900px",
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
    transition: "all 0.2s ease",
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

  // Three.js implementation
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new Three.Scene();
    sceneRef.current = scene;
    scene.background = new Three.Color(0x181c24);

    const camera = new Three.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
    controls.minDistance = 2;
    controls.maxDistance = 5;

    // Lighting
    const ambientLight = new Three.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new Three.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Bloch group
    const blochGroup = new Three.Group();
    scene.add(blochGroup);

    // Sphere
    const geometry = new Three.SphereGeometry(0.6, 64, 64);
    const material = new Three.MeshPhongMaterial({
      color: 0x0077ff,
      transparent: true,
      opacity: 0.2,
      wireframe: false,
      specular: 0x111111,
      shininess: 30,
    });
    const sphere = new Three.Mesh(geometry, material);
    sphere.castShadow = true;
    blochGroup.add(sphere);

    // Wireframe
    const wireframe = new Three.LineSegments(
      new Three.WireframeGeometry(geometry),
      new Three.LineBasicMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.3,
      })
    );
    blochGroup.add(wireframe);

    // Axes
    const axisLength = 0.8;
    const axes = [
      { dir: [1, 0, 0], color: 0xff4c4c, name: " " },
      { dir: [0, 1, 0], color: 0x4cff4c, name: " " },
      { dir: [0, 0, 1], color: 0x4c6cff, name: " " },
    ];

    axes.forEach(({ dir, color, name }) => {
      const points = [
        new Three.Vector3(0, 0, 0),
        new Three.Vector3(...dir).multiplyScalar(axisLength * 0.9),
      ];
      const axisGeom = new Three.BufferGeometry().setFromPoints(points);
      const axisMat = new Three.LineBasicMaterial({
        color,
        linewidth: 1,
        transparent: true,
        opacity: 0.8,
      });
      const axis = new Three.Line(axisGeom, axisMat);
      blochGroup.add(axis);

      const arrow = new Three.Mesh(
        new Three.ConeGeometry(0.03, 0.15, 16),
        new Three.MeshBasicMaterial({ color })
      );
      arrow.position.set(
        dir[0] * axisLength * 0.9,
        dir[1] * axisLength * 0.9,
        dir[2] * axisLength * 0.9
      );
      arrow.quaternion.setFromUnitVectors(
        new Three.Vector3(0, 1, 0),
        new Three.Vector3(...dir).normalize()
      );
      blochGroup.add(arrow);

      const labelPos = new Three.Vector3(...dir).multiplyScalar(
        axisLength + 0.2
      );
      const label = createAxisLabel(name, color, labelPos);
      blochGroup.add(label);
    });

    function createAxisLabel(
      text: string,
      color: number,
      position: Three.Vector3
    ) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 128;
      canvas.height = 64;

      context.font = "Bold 32px Arial";
      context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new Three.CanvasTexture(canvas);
      const spriteMaterial = new Three.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
      });
      const sprite = new Three.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(0.3, 0.15, 0.15);
      return sprite;
    }

    // Bloch vector
    const vectorMaterial = new Three.LineBasicMaterial({
      color: 0xffc300,
      linewidth: 3,
    });
    const vectorGeometry = new Three.BufferGeometry();
    const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
    blochVectorRef.current = blochVector;
    blochGroup.add(blochVector);

    // Arrow head
    const arrowHead = new Three.Mesh(
      new Three.ConeGeometry(0.05, 0.2, 16),
      new Three.MeshBasicMaterial({ color: 0xffc300 })
    );
    arrowHead.position.set(0, 0, 0);
    blochVector.add(arrowHead);

    // Basis state labels
    const labelDistance = 0.8;
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

    function createTextSprite(
      text: string,
      color: string,
      position: Three.Vector3
    ) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 256;
      canvas.height = 128;

      context.font = "Bold 42px Arial";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new Three.CanvasTexture(canvas);
      const spriteMaterial = new Three.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
      });
      const sprite = new Three.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(0.4, 0.2, 0.2);
      return sprite;
    }

    // Equator line
    const equatorGeometry = new Three.TorusGeometry(
      0.7,
      0.005,
      16,
      64,
      Math.PI * 2
    );
    const equatorMaterial = new Three.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const equator = new Three.Mesh(equatorGeometry, equatorMaterial);
    equator.rotation.x = Math.PI / 2;
    blochGroup.add(equator);

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      controls.update();
      updateBlochVector();

      if (blochVectorRef.current) {
        const points = blochVectorRef.current.geometry.attributes.position;
        if (points && points.count >= 2) {
          const end = new Three.Vector3().fromBufferAttribute(points, 1);
          const arrow = blochVectorRef.current.children[0] as Three.Mesh;
          arrow.position.copy(end);

          if (end.length() > 0) {
            arrow.quaternion.setFromUnitVectors(
              new Three.Vector3(0, 1, 0),
              end.clone().normalize()
            );
          }
        }
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      window.removeEventListener("resize", handleResize);

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }

      if (rendererRef.current) {
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }

      [geometry, material, vectorGeometry, vectorMaterial].forEach(
        (resource) => {
          if (resource) resource.dispose();
        }
      );
    };
  }, []);

  return (
    <div style={cardStyle}>
      <h2
        style={{
          textAlign: "center",
          letterSpacing: 1,
          marginBottom: "24px",
          background: "linear-gradient(90deg, #0077ff, #ffc300)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Bloch Sphere Simulator
      </h2>

      <div
        style={{
          display: "flex",
          gap: "24px",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Visualization Column */}
        <div style={{ flex: 1 }}>
          <div style={containerStyle}>
            <div ref={mountRef} style={canvasStyle} />
          </div>

          <div style={{ marginTop: "16px" }}>
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
              <span style={{ color: "#ffc300" }}>φ (phi):</span>{" "}
              {phi.toFixed(2)} rad
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
                { theta: 0, phi: 0, label: "|0⟩", color: "#4cff4c" },
                { theta: Math.PI, phi: 0, label: "|1⟩", color: "#4cff4c" },
                { theta: Math.PI / 2, phi: 0, label: "|+⟩", color: "#ff4c4c" },
                {
                  theta: Math.PI / 2,
                  phi: Math.PI,
                  label: "|-⟩",
                  color: "#ff4c4c",
                },
                {
                  theta: Math.PI / 2,
                  phi: Math.PI / 2,
                  label: "|i⟩",
                  color: "#4c6cff",
                },
                {
                  theta: Math.PI / 2,
                  phi: (3 * Math.PI) / 2,
                  label: "-|i⟩",
                  color: "#4c6cff",
                },
              ].map((state: QuantumState) => (
                <button
                  key={state.label}
                  style={{
                    ...(isActive(state.theta, state.phi)
                      ? buttonActiveStyle
                      : buttonStyle),
                    border: `2px solid ${state.color}`,
                  }}
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
        </div>

        {/* Notes Column */}
        <div
          style={{
            flex: 1,
            padding: "16px",
            background: "rgba(30, 35, 45, 0.8)",
            borderRadius: "12px",
            overflowY: "auto",
            maxHeight: "600px",
          }}
        >
          <h3
            style={{
              color: "#ffc300",
              borderBottom: "1px solid #ffc300",
              paddingBottom: "8px",
              marginBottom: "16px",
            }}
          >
            Understanding the Bloch Sphere
          </h3>

          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ color: "#4c6cff", marginBottom: "8px" }}>
              Quantum State Representation
            </h4>
            <p style={{ lineHeight: "1.6", color: "#ddd" }}>
              The Bloch sphere visually represents the quantum state of a qubit
              as a point on a unit sphere. The north pole is |0⟩, south pole is
              |1⟩, and all other points are superpositions.
            </p>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "12px",
                fontFamily: "monospace",
              }}
            >
              |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup>sin(θ/2)|1⟩
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ color: "#4c6cff", marginBottom: "8px" }}>
              Key Parameters
            </h4>
            <ul
              style={{ paddingLeft: "20px", color: "#ddd", lineHeight: "1.8" }}
            >
              <li>
                <strong>θ (Theta):</strong> Polar angle (0 to π) - Determines
                probability amplitudes
              </li>
              <li>
                <strong>φ (Phi):</strong> Azimuthal angle (0 to 2π) - Determines
                relative phase
              </li>
              <li>
                <strong>Basis States:</strong> |0⟩, |1⟩ (computational), |+⟩,
                |-⟩ (Hadamard), |i⟩, -|i⟩ (circular)
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ color: "#4c6cff", marginBottom: "8px" }}>
              Visualization Features
            </h4>
            <ul
              style={{ paddingLeft: "20px", color: "#ddd", lineHeight: "1.8" }}
            >
              <li>
                <strong>Gold Vector:</strong> Current quantum state
              </li>
              <li>
                <strong>Blue Sphere:</strong> All possible pure states
              </li>
              <li>
                <strong>Colored Axes:</strong> X (red), Y (green), Z (blue)
                measurement bases
              </li>
              <li>
                <strong>Equator:</strong> States with equal |0⟩ and |1⟩
                probabilities
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#4c6cff", marginBottom: "8px" }}>
              Interactivity Guide
            </h4>
            <ul
              style={{ paddingLeft: "20px", color: "#ddd", lineHeight: "1.8" }}
            >
              <li>Drag to rotate the sphere in 3D space</li>
              <li>Scroll to zoom in/out</li>
              <li>Adjust sliders to precisely set θ and φ</li>
              <li>Click basis state buttons for common configurations</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "24px",
          color: "#aaa",
          fontSize: "14px",
        }}
      >
        ..
      </div>
    </div>
  );
};

//   return (
//     <div style={cardStyle} className="bloch-card">
//       <h2
//         style={{
//           textAlign: "center",
//           letterSpacing: 1,
//           marginBottom: "24px",
//           background: "linear-gradient(90deg, #0077ff, #ffc300)",
//           WebkitBackgroundClip: "text",
//           backgroundClip: "text",
//           color: "transparent",
//         }}
//       >
//         Bloch Sphere Simulator
//       </h2>

//       <div
//         style={{
//           display: "flex",
//           gap: "24px",
//           flexDirection: isMobile ? "column" : "row",
//           width: "100%",
//         }}
//         className="bloch-main"
//       >
//         {/* Visualization Column */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={containerStyle} className="bloch-3d-container">
//             <div ref={mountRef} style={canvasStyle} />
//           </div>
//           {/* ...rest of controls... */}
//           {/* (keep your controls and buttons as they are) */}
//         </div>

//         {/* Notes Column */}
//         <div
//           style={{
//             flex: 1,
//             padding: "16px",
//             background: "rgba(30, 35, 45, 0.8)",
//             borderRadius: "12px",
//             overflowY: "auto",
//             maxHeight: "600px",
//             minWidth: 0,
//           }}
//           className="bloch-notes"
//         >
//           {/* ...notes content as before... */}
//         </div>
//       </div>
// };

export default BlochSphere;
