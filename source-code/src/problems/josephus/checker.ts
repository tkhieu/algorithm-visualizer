import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function reference({ n, k }: Input): number {
  let survivor = 0;
  for (let size = 1; size <= n; size++) survivor = (survivor + k) % size;
  return survivor + 1;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  return output.survivor === reference(input)
    ? { ok: true }
    : { ok: false, reason: 'Người sống sót không đúng' };
}
