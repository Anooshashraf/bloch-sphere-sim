// components/core/utils.ts
export interface Complex {
  re: number;
  im: number;
}

export const ZERO: Complex = { re: 0, im: 0 };
export const ONE: Complex = { re: 1, im: 0 };

export function complexAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function complexMultiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function complexConjugate(c: Complex): Complex {
  return { re: c.re, im: -c.im };
}

export function complexMagnitude(c: Complex): number {
  return Math.sqrt(c.re * c.re + c.im * c.im);
}

export function complexPhase(c: Complex): number {
  return Math.atan2(c.im, c.re);
}

export function complexScale(c: Complex, scalar: number): Complex {
  return { re: c.re * scalar, im: c.im * scalar };
}

// Quantum state utilities
export function getStateVector(theta: number, phi: number): [Complex, Complex] {
  return [
    { re: Math.cos(theta / 2), im: 0 },
    {
      re: Math.sin(theta / 2) * Math.cos(phi),
      im: Math.sin(theta / 2) * Math.sin(phi),
    },
  ];
}

export function getBlochCoordinates(
  state: [Complex, Complex]
): [number, number, number] {
  const [a, b] = state;
  const x = 2 * (a.re * b.re + a.im * b.im);
  const y = 2 * (a.im * b.re - a.re * b.im);
  const z = a.re * a.re + a.im * a.im - (b.re * b.re + b.im * b.im);

  return [x, y, z];
}
