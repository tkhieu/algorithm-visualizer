import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';
export function hasSolution(n: number): boolean {
  return n !== 2 && n !== 3;
}
export function valid(positions: number[]): boolean {
  for (let i = 0; i < positions.length; i++)
    for (let j = i + 1; j < positions.length; j++) {
      if (positions[i] === positions[j]) return false;
      if (Math.abs(positions[i] - positions[j]) === Math.abs(i - j)) return false;
    }
  return true;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  const expectSolution = hasSolution(input.n);
  if (output.found !== expectSolution)
    return {ok: false, reason: expectSolution ? 'Phải tìm được nghiệm' : 'Không thể có nghiệm với n này'};
  if (!output.found) return {ok: true, optimal: true};
  if (output.positions.length !== input.n) return {ok: false, reason: 'Số quân hậu không khớp n'};
  if (output.positions.some((c) => c < 0 || c >= input.n)) return {ok: false, reason: 'Vị trí cột ngoài phạm vi'};
  if (!valid(output.positions)) return {ok: false, reason: 'Có hai quân hậu tấn công nhau'};
  return {ok: true, optimal: true};
}
