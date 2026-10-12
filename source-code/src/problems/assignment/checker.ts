import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';

export function assignmentCost(cost: number[][], assignment: number[]): number {
  return assignment.reduce((sum, job, worker) => sum + cost[worker][job], 0);
}

/** Quy hoạch động theo tập việc đã gán, độc lập với vét cạn hoán vị. */
const REFERENCE_MAX = 9;
export function optimalCost(cost: number[][]): number | null {
  const n = cost.length;
  if (n > REFERENCE_MAX) return null;
  const dp = new Array<number>(1 << n).fill(Infinity);
  dp[0] = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    const worker = mask.toString(2).replaceAll('0', '').length;
    if (worker === n) continue;
    for (let job = 0; job < n; job++) {
      if (mask & (1 << job)) continue;
      const next = mask | (1 << job);
      dp[next] = Math.min(dp[next], dp[mask] + cost[worker][job]);
    }
  }
  return dp[(1 << n) - 1];
}

export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  const n = input.cost.length;
  if (output.assignment.length !== n) return {ok: false, reason: 'Số phân công không khớp n'};
  if (new Set(output.assignment).size !== n || output.assignment.some((j) => j < 0 || j >= n))
    return {ok: false, reason: 'Phân công không phải hoán vị hợp lệ của các việc'};
  const actual = assignmentCost(input.cost, output.assignment);
  if (actual !== output.cost) return {ok: false, reason: 'Chi phí báo cáo không khớp phân công'};
  const optimal = optimalCost(input.cost);
  if (optimal === null) return {ok: true, score: actual};
  return {ok: true, optimal: actual === optimal, score: actual, ratio: optimal === 0 ? 1 : actual / optimal};
}
