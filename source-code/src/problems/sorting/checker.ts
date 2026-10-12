import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  if (output.sorted.length !== input.values.length)
    return { ok: false, reason: 'Số phần tử không khớp' };
  const expected = [...input.values].sort((a, b) => a - b);
  if (JSON.stringify(expected) !== JSON.stringify(output.sorted))
    return { ok: false, reason: 'Dãy không khớp tập giá trị đầu vào hoặc chưa được sắp đúng' };
  for (let i = 1; i < output.sorted.length; i++)
    if (output.sorted[i - 1] > output.sorted[i])
      return { ok: false, reason: 'Dãy chưa theo thứ tự không giảm' };
  return { ok: true };
}
