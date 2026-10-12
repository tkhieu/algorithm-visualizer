import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const expected = [...new Set(input.keys)].sort((a, b) => a - b);
  const got = [...output.values].sort((a, b) => a - b);
  if (JSON.stringify(expected) !== JSON.stringify(got))
    return { ok: false, reason: 'Tập khóa trong cây không khớp đầu vào' };
  if (expected.length === 0)
    return output.height === -1
      ? { ok: true }
      : { ok: false, reason: 'Cây rỗng phải có độ cao -1' };
  return output.height >= 0 && output.height <= expected.length - 1
    ? { ok: true }
    : { ok: false, reason: 'Độ cao cây không hợp lý' };
}
