import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  if (output.heap.length !== input.values.length)
    return { ok: false, reason: 'Số phần tử không khớp' };
  const expected = [...input.values].sort((a, b) => a - b);
  const got = [...output.heap].sort((a, b) => a - b);
  if (JSON.stringify(expected) !== JSON.stringify(got))
    return { ok: false, reason: 'Tập giá trị trong đống không khớp đầu vào' };
  const n = output.heap.length;
  for (let i = 0; i < n; i++) {
    const l = 2 * i + 1,
      r = 2 * i + 2;
    if (l < n && output.heap[i] < output.heap[l])
      return { ok: false, reason: `Vi phạm tính chất đống tại vị trí ${i} và ${l}` };
    if (r < n && output.heap[i] < output.heap[r])
      return { ok: false, reason: `Vi phạm tính chất đống tại vị trí ${i} và ${r}` };
  }
  return { ok: true };
}
