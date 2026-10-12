import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';

export function optimalLength(a: string, b: string): number {
  // Bit-parallel subsequence frontier; independent from the DP table recurrence.
  const matches = new Map<string, bigint>();
  for (let j = 0; j < b.length; j++) {
    matches.set(b[j], (matches.get(b[j]) ?? 0n) | (1n << BigInt(j)));
  }
  let frontier = 0n;
  for (const char of a) {
    const x = (matches.get(char) ?? 0n) | frontier;
    const y = (frontier << 1n) | 1n;
    frontier = x & ~(x - y);
  }
  return frontier.toString(2).replaceAll('0', '').length;
}

export function isSubsequence(sub: string, s: string): boolean {
  let i = 0;
  for (const ch of s) {
    if (i < sub.length && sub[i] === ch) i++;
  }
  return i === sub.length;
}

export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  if (output.subsequence.length !== output.length) return {ok: false, reason: 'Độ dài báo cáo không khớp dãy con'};
  if (!isSubsequence(output.subsequence, input.a)) return {ok: false, reason: 'Dãy con không phải dãy con của chuỗi a'};
  if (!isSubsequence(output.subsequence, input.b)) return {ok: false, reason: 'Dãy con không phải dãy con của chuỗi b'};
  const best = optimalLength(input.a, input.b);
  return {ok: true, optimal: output.length === best, score: output.length, ratio: best === 0 ? 1 : output.length / best};
}
