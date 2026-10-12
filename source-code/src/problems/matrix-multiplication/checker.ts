import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function reference({ a, b }: Input): number[][] {
  const n = a.length;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => a[i].reduce((sum, x, k) => sum + x * b[k][j], 0))
  );
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  return JSON.stringify(output.matrix) === JSON.stringify(reference(input))
    ? { ok: true }
    : { ok: false, reason: 'Tích ma trận không đúng' };
}
