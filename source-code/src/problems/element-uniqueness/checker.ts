import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const counts = new Map<number, number>();
  for (const v of input.values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const trulyUnique = [...counts.values()].every(c => c === 1);
  if (output.unique !== trulyUnique)
    return { ok: false, reason: 'Kết luận duy nhất/không duy nhất không khớp dữ liệu' };
  if (output.unique)
    return output.duplicate === null
      ? { ok: true }
      : { ok: false, reason: 'Không được báo giá trị trùng khi dãy duy nhất' };
  if (output.duplicate === null || (counts.get(output.duplicate) ?? 0) < 2)
    return { ok: false, reason: 'Giá trị trùng không hợp lệ' };
  return { ok: true };
}
