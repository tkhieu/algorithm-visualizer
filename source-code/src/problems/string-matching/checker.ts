import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';

export function bruteForcePositions(input: Input): number[] {
  const positions: number[] = [];
  let from = 0;
  while (from <= input.text.length - input.pattern.length) {
    const found = input.text.indexOf(input.pattern, from);
    if (found < 0) break;
    positions.push(found);
    from = found + 1;
  }
  return positions;
}

export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const expected = bruteForcePositions(input);
  const got = [...output.positions].sort((a, b) => a - b);
  const exp = [...expected].sort((a, b) => a - b);
  if (got.length !== exp.length || got.some((v, i) => v !== exp[i])) {
    return { ok: false, reason: 'Tập vị trí tìm được không khớp với vét cạn' };
  }
  return { ok: true, optimal: true, score: got.length };
}
