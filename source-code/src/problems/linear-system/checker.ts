import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function reference({ a, b }: Input): number[] {
  const n = a.length,
    m = a.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k++) {
    let pivot = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(m[i][k]) > Math.abs(m[pivot][k])) pivot = i;
    [m[k], m[pivot]] = [m[pivot], m[k]];
    for (let i = k + 1; i < n; i++) {
      const factor = m[i][k] / m[k][k];
      for (let j = k; j <= n; j++) m[i][j] -= factor * m[k][j];
    }
  }
  const x = Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = (m[i][n] - x.reduce((sum, v, j) => sum + (j > i ? m[i][j] * v : 0), 0)) / m[i][i];
  }
  return x;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success || output.solution.length !== input.a.length)
    return { ok: false, reason: 'Đầu ra sai định dạng' };
  return input.a.every(
    (row, i) =>
      Math.abs(row.reduce((sum, x, j) => sum + x * output.solution[j], 0) - input.b[i]) < 1e-7
  )
    ? { ok: true }
    : { ok: false, reason: 'Vector không thỏa hệ phương trình' };
}
