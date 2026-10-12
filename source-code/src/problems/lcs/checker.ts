import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';

export function optimalLength(a: string, b: string): number {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({length: n + 1}, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][m];
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
