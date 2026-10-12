import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';

export function assignmentCost(cost: number[][], assignment: number[]): number {
  return assignment.reduce((sum, job, worker) => sum + cost[worker][job], 0);
}

/** Vét cạn mọi hoán vị — chỉ dùng khi n nhỏ để làm nguồn tham chiếu tối ưu đáng tin cậy. */
const BRUTE_FORCE_MAX = 8;
export function optimalCost(cost: number[][]): number | null {
  const n = cost.length;
  if (n > BRUTE_FORCE_MAX) return null;
  const jobs = Array.from({length: n}, (_, i) => i);
  let best = Infinity;
  function permute(arr: number[], k: number) {
    if (k === arr.length) {
      best = Math.min(best, assignmentCost(cost, arr));
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      permute(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  }
  permute(jobs, 0);
  return best;
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
