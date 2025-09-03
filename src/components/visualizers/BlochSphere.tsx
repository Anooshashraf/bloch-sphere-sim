"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";
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

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Position camera
    camera.position.z = 2.5;

    // Create Bloch sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Add axes
    const axesHelper = new THREE.AxesHelper(1.5);
    scene.add(axesHelper);

    // Add labels
    const createLabel = (text: string, position: [number, number, number]) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      canvas.width = 128;
      canvas.height = 64;

      context.fillStyle = "white";
      context.font = "24px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, 64, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(...position);
      sprite.scale.set(0.5, 0.25, 1);
      scene.add(sprite);
    };

    createLabel("|0⟩", [0, 0, 1.2]);
    createLabel("|1⟩", [0, 0, -1.2]);
    createLabel("|+⟩", [1.2, 0, 0]);
    createLabel("|-⟩", [-1.2, 0, 0]);
    createLabel("|i⟩", [0, 1.2, 0]);
    createLabel("|-i⟩", [0, -1.2, 0]);

    // Add state vector
    const stateVectorGeometry = new THREE.BufferGeometry();
    const stateVectorMaterial = new THREE.LineBasicMaterial({
      color: 0xff6b6b,
    });
    let stateVectorLine: THREE.Line;

    const updateStateVector = () => {
      const state = getStateVector(internalTheta, internalPhi);
      const [x, y, z] = getBlochCoordinates(state);

      if (stateVectorLine) scene.remove(stateVectorLine);

      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];

      stateVectorGeometry.setFromPoints(points);
      stateVectorLine = new THREE.Line(
        stateVectorGeometry,
        stateVectorMaterial
      );
      scene.add(stateVectorLine);

      // Notify parent of state change
      if (onStateChange) {
        onStateChange(internalTheta, internalPhi);
      }
    };

    updateStateVector();

    // Handle dragging to change state
    const onDocumentMouseMove = (event: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Convert screen coordinates to spherical coordinates
      const newTheta = Math.acos(y);
      const newPhi = Math.atan2(x, Math.sqrt(1 - y * y));

      setInternalTheta(newTheta);
      setInternalPhi(newPhi);
      updateStateVector();
    };

    const onDocumentMouseDown = () => setIsDragging(true);
    const onDocumentMouseUp = () => setIsDragging(false);

    renderer.domElement.addEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener("mouseup", onDocumentMouseUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("mouseup", onDocumentMouseUp);

      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [internalTheta, internalPhi, isDragging, onStateChange]);

  return (
    <div
      className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden"
      ref={containerRef}
    >
      <div className="p-2 text-white text-sm bg-gray-800 opacity-90 absolute bottom-0 left-0">
        θ: {((internalTheta * 180) / Math.PI).toFixed(1)}°, φ:{" "}
        {((internalPhi * 180) / Math.PI).toFixed(1)}°
      </div>
      <div className="p-2 text-white text-sm bg-gray-800 opacity-90 absolute top-0 left-0">
        Drag on the sphere to change the quantum state
      </div>
    </div>
  );
}
