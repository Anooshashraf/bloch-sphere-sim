// /core/utils.ts

// Complex number representation
export type Complex = [number, number]; // [real, imag]

export function add([ar, ai]: Complex, [br, bi]: Complex): Complex {
  return [ar + br, ai + bi];
}

export function mul([ar, ai]: Complex, [br, bi]: Complex): Complex {
  return [ar * br - ai * bi, ar * bi + ai * br];
}

export function scale([r, i]: Complex, s: number): Complex {
  return [r * s, i * s];
}

export function norm([r, i]: Complex): number {
  return Math.sqrt(r * r + i * i);
}

// Normalize statevector
export function normalize(state: Complex[]): Complex[] {
  const total = Math.sqrt(
    state.reduce((sum, [r, i]) => sum + r * r + i * i, 0)
  );
  return state.map(([r, i]) => [r / total, i / total]);
}
