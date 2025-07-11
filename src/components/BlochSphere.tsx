"use client";

import { useEffect, useRef } from "react";
import * as Three from "three";

export default function BlochSphere() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const width = 400;
    const height = 400;
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ antialias: true });

    // Sphere
    const geometry = new Three.SphereGeometry(1, 32, 32);
    const material = new Three.MeshBasicMaterial({
      color: 0x0077ff,
      wireframe: true,
    });
    const sphere = new Three.Mesh(geometry, material);
    scene.add(sphere);

    // Bloch vector (example: along z)
    const vectorMaterial = new Three.LineBasicMaterial({ color: 0xff0000 });
    const points = [new Three.Vector3(0, 0, 0), new Three.Vector3(0, 1, 0)];
    const vectorGeometry = new Three.BufferGeometry().setFromPoints(points);
    const blochVector = new Three.Line(vectorGeometry, vectorMaterial);
    scene.add(blochVector);

    camera.position.z = 3;
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      mountRef.current!.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} />;
}
