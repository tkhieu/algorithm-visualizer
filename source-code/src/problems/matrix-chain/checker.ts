import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';

export function optimalCost(dims: number[]): number {
  const n = dims.length - 1;
  // Shortest path over sequences of adjacent block merges. A bit marks a boundary
  // still present between matrices; this does not use the interval DP recurrence.
  const full = (1 << (n - 1)) - 1;
  const cost = new Array<number>(full + 1).fill(Infinity);
  cost[full] = 0;
  for (let mask = full; mask > 0; mask--) {
    if (!Number.isFinite(cost[mask])) continue;
    for (let boundary = 1; boundary < n; boundary++) {
      const bit = 1 << (boundary - 1);
      if (!(mask & bit)) continue;
      let left = boundary;
      while (left > 1 && !(mask & (1 << (left - 2)))) left--;
      let right = boundary + 1;
      while (right < n && !(mask & (1 << (right - 1)))) right++;
      const next = mask & ~bit;
      const merged = dims[left - 1] * dims[boundary] * dims[right];
      if (cost[mask] + merged < cost[next]) {
        cost[next] = cost[mask] + merged;
      }
    }
  }
  return cost[0];
}

interface ParseResult {
  leaves: number[];
  dim0: number;
  dim1: number;
  cost: number;
}

/** Phân tích cú pháp chuỗi đặt ngoặc "(A1A2)A3" dạng cây đệ quy và tính lại tổng số phép nhân vô hướng. */
function parseParenthesization(expr: string, dims: number[]): ParseResult | null {
  let pos = 0;
  function parse(): ParseResult | null {
    if (pos >= expr.length) return null;
    if (expr[pos] === '(') {
      pos++;
      const left = parse();
      if (!left) return null;
      const right = parse();
      if (!right) return null;
      if (expr[pos] !== ')') return null;
      pos++;
      if (left.dim1 !== right.dim0) return null;
      return {
        leaves: [...left.leaves, ...right.leaves],
        dim0: left.dim0,
        dim1: right.dim1,
        cost: left.cost + right.cost + left.dim0 * left.dim1 * right.dim1,
      };
    }
    if (expr[pos] !== 'A') return null;
    pos++;
    const start = pos;
    while (pos < expr.length && expr[pos] >= '0' && expr[pos] <= '9') pos++;
    if (pos === start) return null;
    const k = Number(expr.slice(start, pos));
    if (k < 1 || k > dims.length - 1) return null;
    return {leaves: [k], dim0: dims[k - 1], dim1: dims[k], cost: 0};
  }
  const result = parse();
  if (!result || pos !== expr.length) return null;
  return result;
}

export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  const n = input.dims.length - 1;
  const parsed = parseParenthesization(output.parenthesization, input.dims);
  if (!parsed) return {ok: false, reason: 'Chuỗi đặt ngoặc không hợp lệ hoặc không khớp kích thước ma trận'};
  const expectedLeaves = Array.from({length: n}, (_, i) => i + 1);
  if (parsed.leaves.length !== n || !parsed.leaves.every((v, i) => v === expectedLeaves[i]))
    return {ok: false, reason: 'Đặt ngoặc không phủ đúng các ma trận A1..An theo thứ tự'};
  if (parsed.cost !== output.cost) return {ok: false, reason: 'Chi phí báo cáo không khớp đặt ngoặc'};
  const best = optimalCost(input.dims);
  return {ok: true, optimal: output.cost === best, score: output.cost, ratio: best === 0 ? 1 : output.cost / best};
}
