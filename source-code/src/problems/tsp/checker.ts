import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';

export function dist(a: {x: number; y: number}, b: {x: number; y: number}): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function tourLength(points: {x: number; y: number}[], tour: number[]): number {
  if (tour.length <= 1) return 0;
  let total = 0;
  for (let i = 0; i < tour.length; i++) {
    const a = points[tour[i]];
    const b = points[tour[(i + 1) % tour.length]];
    total += dist(a, b);
  }
  return total;
}

/** Vét cạn đầy đủ — chỉ dùng khi n nhỏ để làm nguồn tham chiếu tối ưu đáng tin cậy. */
const BRUTE_FORCE_MAX = 8;
export function optimalLength(points: {x: number; y: number}[]): number | null {
  const n = points.length;
  if (n > BRUTE_FORCE_MAX) return null;
  if (n <= 1) return 0;
  const rest = Array.from({length: n - 1}, (_, i) => i + 1);
  let best = Infinity;
  function permute(arr: number[], k: number) {
    if (k === arr.length) {
      best = Math.min(best, tourLength(points, [0, ...arr]));
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      permute(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  }
  permute(rest, 0);
  return best;
}

export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  const n = input.points.length;
  if (output.tour.length !== n) return {ok: false, reason: 'Số điểm trong hành trình không khớp'};
  if (new Set(output.tour).size !== n || output.tour.some((i) => i < 0 || i >= n))
    return {ok: false, reason: 'Hành trình không phải hoán vị hợp lệ của các điểm'};
  const actual = tourLength(input.points, output.tour);
  if (Math.abs(actual - output.length) > 1e-6) return {ok: false, reason: 'Độ dài báo cáo không khớp hành trình'};
  const optimal = optimalLength(input.points);
  if (optimal === null) return {ok: true, score: actual};
  return {
    ok: true,
    optimal: Math.abs(actual - optimal) < 1e-6,
    score: actual,
    ratio: optimal === 0 ? 1 : actual / optimal,
  };
}
