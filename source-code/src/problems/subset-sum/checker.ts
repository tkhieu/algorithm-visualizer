import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';
/** Duyệt tập con bằng bitmask; độc lập với bảng DP và cây lấy/bỏ. */
export function existsSubset(input: Input): boolean {
  const {values, target} = input;
  if (target === 0) return true;
  for (let mask = 1; mask < 1 << values.length; mask++) {
    let sum = 0;
    for (let i = 0; i < values.length; i++) if (mask & (1 << i)) sum += values[i];
    if (sum === target) return true;
  }
  return false;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  const expect = existsSubset(input);
  if (output.found !== expect)
    return {ok: false, reason: expect ? 'Phải tìm được tập con' : 'Không thể có tập con tổng đúng S'};
  if (!output.found) return {ok: true, optimal: true};
  if (
    new Set(output.indices).size !== output.indices.length ||
    output.indices.some((i) => i < 0 || i >= input.values.length)
  )
    return {ok: false, reason: 'Chỉ số trùng hoặc ngoài phạm vi'};
  const sum = output.indices.reduce((s, i) => s + input.values[i], 0);
  if (sum !== input.target) return {ok: false, reason: 'Tổng tập con không khớp S'};
  return {ok: true, optimal: true};
}
