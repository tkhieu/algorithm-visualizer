import type {Verdict} from '../../core/contracts';
import {inputSchema, outputSchema, type Input, type Output} from './definition';
export function adjacency(input: Input): Set<string> {
  const adj = new Set<string>();
  for (const e of input.edges) {
    if (!input.nodes.includes(e.from) || !input.nodes.includes(e.to) || e.from === e.to) continue;
    adj.add(`${e.from}|${e.to}`);
    adj.add(`${e.to}|${e.from}`);
  }
  return adj;
}
export function connected(adj: Set<string>, a: string, b: string): boolean {
  return adj.has(`${a}|${b}`);
}
/** Backtracking độc lập — n ≤ 10 nên luôn đủ nhanh để làm nguồn tham chiếu kiểm tra thuật toán và output. */
export function existsColoring(input: Input): boolean {
  const n = input.nodes.length,
    k = input.colors;
  const adj = adjacency(input);
  const color = new Array<number>(n).fill(-1);
  function safe(v: number, c: number): boolean {
    for (let u = 0; u < v; u++) if (color[u] === c && connected(adj, input.nodes[u], input.nodes[v])) return false;
    return true;
  }
  function solve(v: number): boolean {
    if (v === n) return true;
    for (let c = 0; c < k; c++) {
      if (safe(v, c)) {
        color[v] = c;
        if (solve(v + 1)) return true;
        color[v] = -1;
      }
    }
    return false;
  }
  return solve(0);
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  if (!output.found) return {ok: true};
  const n = input.nodes.length;
  if (output.coloring.length !== n) return {ok: false, reason: 'Số màu gán không khớp số đỉnh'};
  if (output.coloring.some((c) => c < 0 || c >= input.colors)) return {ok: false, reason: 'Màu ngoài phạm vi [0,k)'};
  const adj = adjacency(input);
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (connected(adj, input.nodes[i], input.nodes[j]) && output.coloring[i] === output.coloring[j])
        return {ok: false, reason: `Hai đỉnh kề ${input.nodes[i]} và ${input.nodes[j]} cùng màu`};
  return {ok: true};
}
