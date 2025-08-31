// /core/simulator.ts
import { Complex, mul, add, normalize } from "./utils";
import { GATES } from "./gates";

export interface Gate {
  name: string;
  target: number;
  control?: number;
}

export interface SimulationResult {
  finalState: Complex[];
  probabilities: Record<string, number>;
  explanation: string;
}

export function runSimulation(
  numQubits: number,
  gates: Gate[]
): SimulationResult {
  // Initial state |0...0>
  let state: Complex[] = Array(1 << numQubits).fill([0, 0]);
  state[0] = [1, 0];

  // Apply each gate (only single-qubit for now)
  gates.forEach((gate) => {
    const matrix = GATES[gate.name];
    if (!matrix) return;

    let newState: Complex[] = Array(state.length).fill([0, 0]);

    for (let basis = 0; basis < state.length; basis++) {
      const bit = (basis >> gate.target) & 1;
      for (let row = 0; row < 2; row++) {
        const amp = state[basis];
        const coeff = matrix[row][bit];
        if (coeff[0] !== 0 || coeff[1] !== 0) {
          const newBasis = (basis & ~(1 << gate.target)) | (row << gate.target);
          newState[newBasis] = add(newState[newBasis], mul(coeff, amp));
        }
      }
    }

    state = newState;
  });

  state = normalize(state);

  // Probabilities
  const probabilities: Record<string, number> = {};
  state.forEach(([r, i], idx) => {
    const prob = r * r + i * i;
    if (prob > 1e-6) {
      const key = idx.toString(2).padStart(numQubits, "0");
      probabilities[key] = prob;
    }
  });

  return {
    finalState: state,
    probabilities,
    explanation: "Simulation complete. Statevector normalized.",
  };
}
