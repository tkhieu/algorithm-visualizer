import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  if (output.buckets.length !== input.tableSize)
    return { ok: false, reason: 'Số ngăn không khớp kích thước bảng' };
  const countsOut = new Map<number, number>();
  for (const b of output.buckets) for (const k of b) countsOut.set(k, (countsOut.get(k) ?? 0) + 1);
  const countsIn = new Map<number, number>();
  for (const k of input.keys) countsIn.set(k, (countsIn.get(k) ?? 0) + 1);
  for (const [k, c] of countsOut)
    if (c > (countsIn.get(k) ?? 0))
      return { ok: false, reason: 'Khóa trong bảng không khớp đầu vào' };
  return { ok: true };
}
