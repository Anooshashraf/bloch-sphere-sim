// components/core/simulator.ts
import { Complex, ZERO, ONE, complexAdd, complexMultiply } from "./utils";
import { QuantumGate, applyGate } from "./gates";

export interface QuantumState {
  amplitudes: Complex[];
  numQubits: number;
}

export interface SimulationResult {
  state: QuantumState;
  measurements: number[];
  probabilities: number[];
  steps: any[];
}

export function createInitialState(numQubits: number = 1): QuantumState {
  const amplitudes = new Array(2 ** numQubits).fill(ZERO);
  amplitudes[0] = ONE; // Start with |0...0⟩
  return { amplitudes, numQubits };
}

export function simulateCircuit(
  gates: Array<{ gate: QuantumGate; targets: number[]; controls?: number[] }>
): SimulationResult {
  let state = createInitialState(2); // Default to 2 qubits for demonstration

  const steps = gates.map((gateConfig, index) => {
    const beforeState = [...state.amplitudes];
    state.amplitudes = applyGate(
      state.amplitudes,
      gateConfig.gate,
      gateConfig.targets[0],
      gateConfig.controls ? gateConfig.controls[0] : undefined
    );
    return {
      step: index + 1,
      gate: gateConfig.gate.name,
      before: beforeState,
      after: [...state.amplitudes],
    };
  });

  // Calculate probabilities
  const probabilities = state.amplitudes.map((amp) => {
    const re = amp.re || 0;
    const im = amp.im || 0;
    return re * re + im * im;
  });

  // Simulate measurement
  const measurements = Array.from({ length: 100 }, () => {
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < probabilities.length; i++) {
      sum += probabilities[i];
      if (rand <= sum) return i;
    }
    return probabilities.length - 1;
  });

  return {
    state,
    measurements,
    probabilities,
    steps,
  };
}

export async function simulateAlgorithm(algorithmId: string): Promise<any> {
  // Simulate different algorithms with artificial delays
  await new Promise((resolve) => setTimeout(resolve, 1000));

  switch (algorithmId) {
    case "deutsch-jozsa":
      return {
        type: "deutsch-jozsa",
        result: "balanced",
        evaluations: 1,
        classicalEvaluations: 3, // Would be 2^(n-1)+1 for n qubits
        speedup: "exponential",
      };

    case "grover":
      return {
        type: "grover",
        iterations: 3,
        items: 16,
        foundIndex: 7,
        classicalChecks: 8,
        speedup: "quadratic",
      };

    case "shor":
      return {
        type: "shor",
        number: 15,
        factors: [3, 5],
        success: true,
        iterations: 4,
      };

    case "quantum-fourier":
      return {
        type: "quantum-fourier",
        input: [1, 0, 0, 0], // |00⟩
        output: [0.5, 0.5, 0.5, 0.5], // Equal superposition
        transformed: true,
      };

    default:
      throw new Error(`Unknown algorithm: ${algorithmId}`);
  }
}

export function measureState(state: QuantumState): number {
  const probabilities = state.amplitudes.map((amp) => {
    const re = amp.re || 0;
    const im = amp.im || 0;
    return re * re + im * im;
  });

  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (rand <= sum) return i;
  }
  return probabilities.length - 1;
}
