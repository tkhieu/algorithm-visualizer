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
/** Duyệt các phân hoạch đỉnh thành lớp màu, độc lập với phép mở rộng quay lui của thuật toán. */
export function existsColoring(input: Input): boolean {
  const n = input.nodes.length;
  const adj = adjacency(input);
  const classes: number[] = [];
  function enumerate(v: number): boolean {
    if (v === n) {
      return classes.every((mask) => {
        for (let i = 0; i < n; i++) {
          if (!(mask & (1 << i))) continue;
          for (let j = i + 1; j < n; j++) {
            if ((mask & (1 << j)) && connected(adj, input.nodes[i], input.nodes[j])) return false;
          }
        }
        return true;
      });
    }
    for (let c = 0; c < Math.min(classes.length + 1, input.colors); c++) {
      if (c === classes.length) classes.push(0);
      classes[c] |= 1 << v;
      if (enumerate(v + 1)) return true;
      classes[c] &= ~(1 << v);
      if (classes[c] === 0) classes.pop();
    }
    return false;
  }
  return enumerate(0);
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  if (!output.found) {
    if (output.coloring.length) return {ok: false, reason: 'Không tìm được cách tô thì danh sách màu phải rỗng'};
    if (output.heuristic) return {ok: true, optimal: false};
    return existsColoring(input)
      ? {ok: false, reason: 'Vẫn tồn tại cách tô hợp lệ với k màu'}
      : {ok: true, optimal: true};
  }
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
