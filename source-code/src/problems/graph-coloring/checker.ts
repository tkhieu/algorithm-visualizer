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
/** Đồ thị > ngưỡng này không thử tính χ(G) bằng oracle liệt kê phân hoạch (tăng trưởng kiểu số Bell
 * — B(12) ≈ 4,2 triệu còn chịu được, B(15) > 1,38 tỷ thì không). Mọi thuật toán chính xác ở chế độ
 * chromatic (xem backtracking, exhaustive) đều tự giới hạn n trong ngưỡng này qua `precondition`, nên
 * một output `chromaticExact: true` luôn nằm trong khả năng xác minh của oracle ở đây. */
export const CHROMATIC_ORACLE_MAX_N = 12;
/** Sắc số χ(G) tính bằng cách tăng dần k và tái dùng `existsColoring` — một oracle có cấu trúc khác
 * hẳn thuật toán quay lui/vét cạn đang được kiểm (liệt kê phân hoạch theo lớp màu, không phải gán màu
 * tuần tự từng đỉnh), nên không được xem là "tự kiểm bằng chính nó". */
export function chromaticNumberOracle(input: Input): number {
  const n = input.nodes.length;
  if (n === 0) return 0;
  for (let k = 1; k <= n; k++) if (existsColoring({...input, colors: k})) return k;
  return n;
}
/** Phần kiểm hợp lệ dùng chung cho cả hai chế độ: không có hai đỉnh kề cùng màu, màu trong [0,k). */
function properColoringIssue(input: Input, coloring: number[], colorBound?: number): string | undefined {
  const n = input.nodes.length;
  if (coloring.length !== n) return 'Số màu gán không khớp số đỉnh';
  if (colorBound !== undefined && coloring.some((c) => c < 0 || c >= colorBound))
    return `Màu ngoài phạm vi [0,${colorBound})`;
  const adj = adjacency(input);
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (connected(adj, input.nodes[i], input.nodes[j]) && coloring[i] === coloring[j])
        return `Hai đỉnh kề ${input.nodes[i]} và ${input.nodes[j]} cùng màu`;
  return undefined;
}
function checkChromatic(input: Input, output: Output): Verdict {
  if (!output.found) return {ok: false, reason: 'Chế độ tìm sắc số luôn phải tìm được một cách tô hợp lệ'};
  const colorsUsed = output.colorsUsed ?? new Set(output.coloring).size;
  const issue = properColoringIssue(input, output.coloring);
  if (issue) return {ok: false, reason: issue};
  if (new Set(output.coloring).size !== colorsUsed)
    return {ok: false, reason: 'Số màu báo cáo không khớp số màu thực dùng trong cách tô'};
  if (input.nodes.length > CHROMATIC_ORACLE_MAX_N)
    return output.chromaticExact ? {ok: true, optimal: true} : {ok: true, optimal: false};
  const chi = chromaticNumberOracle(input);
  if (output.chromaticExact)
    return colorsUsed === chi
      ? {ok: true, optimal: true}
      : {ok: false, reason: `Thuật toán chính xác báo χ(G) = ${colorsUsed} nhưng oracle độc lập tính χ(G) = ${chi}`};
  return {ok: true, optimal: colorsUsed === chi};
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return {ok: false, reason: 'Đầu vào không hợp lệ'};
  if (!outputSchema.safeParse(output).success) return {ok: false, reason: 'Đầu ra sai định dạng'};
  if ((input.mode ?? 'k-coloring') === 'chromatic') return checkChromatic(input, output);
  if (!output.found) {
    if (output.coloring.length) return {ok: false, reason: 'Không tìm được cách tô thì danh sách màu phải rỗng'};
    if (output.heuristic) return {ok: true, optimal: false};
    return existsColoring(input)
      ? {ok: false, reason: 'Vẫn tồn tại cách tô hợp lệ với k màu'}
      : {ok: true, optimal: true};
  }
  const issue = properColoringIssue(input, output.coloring, input.colors);
  return issue ? {ok: false, reason: issue} : {ok: true};
}
