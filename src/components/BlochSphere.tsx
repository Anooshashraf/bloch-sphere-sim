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

const BlochSphere: React.FC = () => {
  // Component state and refs
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [theta, setTheta] = useState(Math.PI / 2);
  const [phi, setPhi] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const animationFrameId = useRef<number | null>(null);
  const thetaRef = useRef<number>(theta);
  const phiRef = useRef<number>(phi);
  const sceneRef = useRef<Three.Scene | null>(null);
  const blochVectorRef = useRef<Three.Line | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<Three.WebGLRenderer | null>(null);

  // Handle responsive layout
  useEffect(() => {
    const handleResizeScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResizeScreen();
    window.addEventListener("resize", handleResizeScreen);
    return () => window.removeEventListener("resize", handleResizeScreen);
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

  // Styles adjusted to match the new MainApp layout (full-width card, responsive)
  const cardStyle: React.CSSProperties = {
    background: "rgba(24,28,36,0.95)",
    borderRadius: 14,
    boxShadow: "0 6px 28px rgba(0,0,0,0.6)",
    padding: "20px",
    color: "#fff",
    width: "100%",
    maxWidth: "100%",
    margin: "24px 0",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingBottom: "100%", // keep square aspect ratio (responsive)
    borderRadius: 12,
    background: "radial-gradient(ellipse at center, #232b3a 60%, #181c24 100%)",
    boxShadow: "0 2px 16px #000a",
    overflow: "hidden",
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
    margin: "8px 0 20px 0",
    height: 4,
    borderRadius: 4,
    background: "linear-gradient(90deg, #0077ff 0%, #ffc300 100%)",
  };

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #0077ff 0%, #4c6cff 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 2px 8px #0004",
    transition: "all 0.18s ease",
  };

  const buttonActiveStyle: React.CSSProperties = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #ffc300 0%, #ff4c4c 100%)",
    color: "#222",
    transform: "scale(1.06)",
  };

  const isActive = (thetaVal: number, phiVal: number): boolean =>
    Math.abs(theta - thetaVal) < 0.01 && Math.abs(phi - phiVal) < 0.01;

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
    renderer.setPixelRatio(window.devicePixelRatio || 1);
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

      context.font = "Bold 24px Arial";
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
      sprite.scale.set(0.26, 0.12, 0.12);
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

    // Basis state labels (sprites)
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

      context.font = "Bold 36px Arial";
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new Three.CanvasTexture(canvas);
      const spriteMaterial = new Three.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
      });
      const sprite = new Three.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(0.36, 0.18, 0.18);
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

    // Handle container resize
    const handleResize = () => {
      if (!container) return;
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
        const points = (blochVectorRef.current.geometry as Three.BufferGeometry)
          .attributes.position;
        if (points && (points as any).count >= 2) {
          const end = new Three.Vector3().fromBufferAttribute(points as any, 1);
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

    // Cleanup on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", handleResize);

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        try {
          if (container.contains(rendererRef.current.domElement)) {
            container.removeChild(rendererRef.current.domElement);
          }
        } catch (e) {
          // ignore DOM removal errors
        }
        rendererRef.current.dispose();
      }

      // Dispose materials/geometries to avoid memory leaks
      [
        geometry,
        material,
        vectorGeometry,
        vectorMaterial,
        equatorGeometry,
        equatorMaterial,
      ].forEach((r) => {
        try {
          // some resources are MeshPhongMaterial / BufferGeometry / LineBasicMaterial
          // @ts-ignore
          if (r && typeof r.dispose === "function") r.dispose();
        } catch (e) {
          // ignore disposal errors
        }
      });

      // clear refs
      sceneRef.current = null;
      blochVectorRef.current = null;
      controlsRef.current = null;
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once

  // --- Render UI (kept your controls and layout logic, only styled to match main UI) ---
  return (
    <div style={cardStyle}>
      <h2
        style={{
          textAlign: "center",
          letterSpacing: 1,
          marginBottom: 16,
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
          gap: 20,
          flexDirection: isMobile ? "column" : "row",
          alignItems: "stratch",
        }}
      >
        {/* Visualization Column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={containerStyle}>
            <div ref={mountRef} style={canvasStyle} />
          </div>

          <div style={{ marginTop: 12 }}>
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
                marginTop: 12,
                display: "flex",
                gap: 8,
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
            display: "flex",
            flexDirection: "column",
            padding: 12,
            background: "rgba(30, 35, 45, 0.85)",
            borderRadius: 10,
            overflowY: "auto",
            height: "100%",
            minWidth: 0,
          }}
        >
          <h3
            style={{
              color: "#ffc300",
              borderBottom: "1px solid #ffc300",
              paddingBottom: 8,
              marginBottom: 12,
            }}
          >
            Understanding the Bloch Sphere
          </h3>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: "#4c6cff", marginBottom: 8 }}>
              Quantum State Representation
            </h4>
            <p style={{ lineHeight: 1.6, color: "#ddd", margin: 0 }}>
              The Bloch sphere visually represents the quantum state of a qubit
              as a point on a unit sphere. The north pole is |0⟩, south pole is
              |1⟩, and all other points are superpositions.
            </p>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.25)",
                padding: 10,
                borderRadius: 8,
                marginTop: 12,
                fontFamily: "monospace",
              }}
            >
              |ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: "#4c6cff", marginBottom: 8 }}>
              Key Parameters
            </h4>
            <ul style={{ paddingLeft: 16, color: "#ddd", lineHeight: 1.6 }}>
              <li>
                <strong>θ (Theta):</strong> Polar angle (0 to π).
              </li>
              <li>
                <strong>φ (Phi):</strong> Azimuthal angle (0 to 2π).
              </li>
              <li>
                <strong>Basis States:</strong> |0⟩, |1⟩, |+⟩, |-⟩, |i⟩, -|i⟩.
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#4c6cff", marginBottom: 8 }}>
              Interactivity Guide
            </h4>
            <ul style={{ paddingLeft: 16, color: "#ddd", lineHeight: 1.6 }}>
              <li>Drag to rotate the sphere in 3D space.</li>
              <li>Scroll to zoom in/out (use mouse wheel / touchpad).</li>
              <li>Adjust sliders to precisely set θ and φ.</li>
              <li>Click basis state buttons for quick configuration.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#4c6cff", marginBottom: 8 }}>
              Pure vs Mixed States
            </h4>
            <ul style={{ paddingLeft: 16, color: "#ddd", lineHeight: 1.6 }}>
              <li>
                <strong>Pure States: </strong>The Bloch sphere represents pure
                states (points on the surface)
              </li>
              <li>
                <strong>Mixed States: </strong> (statistical mixtures) lie
                inside the sphere, with the center representing the maximally
                mixed state (50% |0⟩, 50% |1⟩).
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 18,
          color: "#aaa",
          fontSize: 13,
        }}
      >
        Drag to rotate. Use sliders or click a basis state.
      </div>
    </div>
  );
};

export default BlochSphere;
