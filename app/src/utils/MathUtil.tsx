export function roundFixed(d: number, n: number): number {
  return Number(d.toFixed(n));
}

export function sum(xs: Array<number>): number {
  return xs.reduce((a, x) => a + x, 0);
}
