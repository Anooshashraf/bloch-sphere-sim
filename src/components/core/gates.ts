// /core/gates.ts
import { Complex } from "./utils";

// Define single-qubit gate matrices
export const GATES: Record<string, Complex[][]> = {
  X: [
    [
      [0, 0],
      [1, 0],
    ],
    [
      [1, 0],
      [0, 0],
    ],
  ],
  Y: [
    [
      [0, 0],
      [0, -1],
    ],
    [
      [0, 1],
      [0, 0],
    ],
  ],
  Z: [
    [
      [1, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [-1, 0],
    ],
  ],
  H: [
    [
      [1 / Math.sqrt(2), 0],
      [1 / Math.sqrt(2), 0],
    ],
    [
      [1 / Math.sqrt(2), 0],
      [-1 / Math.sqrt(2), 0],
    ],
  ],
};
