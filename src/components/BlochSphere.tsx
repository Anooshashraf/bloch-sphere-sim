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
  });
}
