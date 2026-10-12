import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
export function optimum(freq: number[]): number {
  // Enumerate every ordered BST shape for catalog-sized instances.
  if (freq.length <= 9) {
    function costs(lo: number, hi: number, depth: number): number[] {
      if (lo > hi) return [0];
      const result: number[] = [];
      for (let root = lo; root <= hi; root++) {
        const left = costs(lo, root - 1, depth + 1);
        const right = costs(root + 1, hi, depth + 1);
        for (const a of left) for (const b of right) result.push(freq[root] * depth + a + b);
      }
      return result;
    }
    return Math.min(...costs(0, freq.length - 1, 1));
  }
  // Memoized tree enumeration keeps the full schema range practical.
  const memo = new Map<string, number>();
  function best(lo: number, hi: number, depth: number): number {
    if (lo > hi) return 0;
    const key = `${lo},${hi},${depth}`;
    if (memo.has(key)) return memo.get(key)!;
    let answer = Infinity;
    for (let root = lo; root <= hi; root++) {
      answer = Math.min(answer, freq[root] * depth + best(lo, root - 1, depth + 1) + best(root + 1, hi, depth + 1));
    }
    memo.set(key, answer);
    return answer;
  }
  return best(0, freq.length - 1, 1);
}
function subtreeCost(
  freq: number[],
  roots: number[][],
  i: number,
  j: number,
  depth: number,
): { cost: number; ok: boolean } {
  if (i > j) return { cost: 0, ok: true };
  const r = roots[i]?.[j];
  if (r === undefined || r < i || r > j) return { cost: 0, ok: false };
  const sumFreq = freq.slice(i, j + 1).reduce((s, f) => s + f, 0);
  const left = subtreeCost(freq, roots, i, r - 1, depth + 1);
  const right = subtreeCost(freq, roots, r + 1, j, depth + 1);
  return { cost: sumFreq + left.cost + right.cost, ok: left.ok && right.ok };
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const n = input.freq.length;
  const { cost, ok } = subtreeCost(input.freq, output.roots, 0, n - 1, 1);
  if (!ok) return { ok: false, reason: 'Bảng chọn gốc không hợp lệ' };
  if (cost !== output.cost) return { ok: false, reason: 'Chi phí báo cáo không khớp với bảng chọn gốc' };
  const best = optimum(input.freq);
  return { ok: true, optimal: output.cost === best, score: output.cost };
}
