// components/core/gates.ts
import { Complex, ZERO, ONE, complexMultiply, complexAdd } from "./utils";

export interface QuantumGate {
  name: string;
  matrix: Complex[][];
  symbol: string;
  description: string;
}

// Single-qubit gates
export const X_GATE: QuantumGate = {
  name: "Pauli-X",
  matrix: [
    [ZERO, ONE],
    [ONE, ZERO],
  ],
  symbol: "X",
  description: "Bit-flip gate (similar to classical NOT gate)",
};

export const Y_GATE: QuantumGate = {
  name: "Pauli-Y",
  matrix: [
    [
      { re: 0, im: 0 },
      { re: 0, im: -1 },
    ],
    [
      { re: 0, im: 1 },
      { re: 0, im: 0 },
    ],
  ],
  symbol: "Y",
  description: "Combination of bit and phase flip",
};

export const Z_GATE: QuantumGate = {
  name: "Pauli-Z",
  matrix: [
    [ONE, ZERO],
    [ZERO, { re: -1, im: 0 }],
  ],
  symbol: "Z",
  description: "Phase-flip gate",
};

export const H_GATE: QuantumGate = {
  name: "Hadamard",
  matrix: [
    [
      { re: 1 / Math.sqrt(2), im: 0 },
      { re: 1 / Math.sqrt(2), im: 0 },
    ],
    [
      { re: 1 / Math.sqrt(2), im: 0 },
      { re: -1 / Math.sqrt(2), im: 0 },
    ],
  ],
  symbol: "H",
  description: "Creates superposition states",
};

export const S_GATE: QuantumGate = {
  name: "Phase",
  matrix: [
    [ONE, ZERO],
    [ZERO, { re: 0, im: 1 }],
  ],
  symbol: "S",
  description: "π/2 phase gate",
};

export const T_GATE: QuantumGate = {
  name: "T",
  matrix: [
    [ONE, ZERO],
    [ZERO, { re: 1 / Math.sqrt(2), im: 1 / Math.sqrt(2) }],
  ],
  symbol: "T",
  description: "π/4 phase gate",
};

// Two-qubit gates
export const CNOT_GATE: QuantumGate = {
  name: "CNOT",
  matrix: [
    [ONE, ZERO, ZERO, ZERO],
    [ZERO, ONE, ZERO, ZERO],
    [ZERO, ZERO, ZERO, ONE],
    [ZERO, ZERO, ONE, ZERO],
  ],
  symbol: "CX",
  description: "Controlled-NOT gate (entangles qubits)",
};

export const SWAP_GATE: QuantumGate = {
  name: "SWAP",
  matrix: [
    [ONE, ZERO, ZERO, ZERO],
    [ZERO, ZERO, ONE, ZERO],
    [ZERO, ONE, ZERO, ZERO],
    [ZERO, ZERO, ZERO, ONE],
  ],
  symbol: "SWAP",
  description: "Swaps the states of two qubits",
};

// Gate collection for UI
export const SINGLE_QUBIT_GATES = [
  X_GATE,
  Y_GATE,
  Z_GATE,
  H_GATE,
  S_GATE,
  T_GATE,
];
export const TWO_QUBIT_GATES = [CNOT_GATE, SWAP_GATE];

// Apply a gate to a state
export function applyGate(
  state: Complex[],
  gate: QuantumGate,
  target: number,
  control?: number
): Complex[] {
  // For simplicity, this implementation handles single-qubit gates and CNOT
  const n = state.length;
  const newState = new Array(n).fill(ZERO);

  if (gate.matrix.length === 2) {
    // Single-qubit gate
    for (let i = 0; i < n; i++) {
      const bit = (i >> target) & 1;
      const otherBits = i & ~(1 << target);

      for (let j = 0; j < 2; j++) {
        const basisIndex = otherBits | (j << target);
        newState[i] = complexAdd(
          newState[i],
          complexMultiply(gate.matrix[bit][j], state[basisIndex])
        );
      }
    }
  } else if (gate.name === "CNOT" && control !== undefined) {
    // CNOT gate
    for (let i = 0; i < n; i++) {
      const controlBit = (i >> control) & 1;
      const targetBit = (i >> target) & 1;

      if (controlBit === 1) {
        // Flip the target bit
        const newIndex = i ^ (1 << target);
        newState[newIndex] = complexAdd(newState[newIndex], state[i]);
      } else {
        newState[i] = complexAdd(newState[i], state[i]);
      }
    }
  }

  return newState;
}
