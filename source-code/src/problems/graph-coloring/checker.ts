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
/** Duyệt các phân hoạch đỉnh thành lớp màu, độc lập với phép mở rộng quay lui của thuật toán.
 * Hai điều cần để không nổ cây tìm kiếm bất kể input.nodes xếp theo thứ tự nào:
 * 1. Mỗi đỉnh chỉ được thêm vào một lớp nếu không xung đột với đỉnh nào đã có trong lớp đó ngay
 *    tại thời điểm thêm (loại nhánh ngay, không đợi gán hết n đỉnh mới kiểm tra toàn bộ).
 * 2. (1) một mình không đủ: nếu nhiều đỉnh cô lập (không cạnh, luôn không xung đột với lớp nào)
 *    nằm TRƯỚC một lõi khó (ví dụ một clique không tô được với k màu) trong input.nodes, hàm vẫn
 *    phải thử hết tổ hợp lớp của các đỉnh cô lập trước khi chạm tới lõi và phát hiện vô nghiệm —
 *    tốn tới O(kⁿ) vẫn y như cũ, chỉ dời chỗ nổ ra chỗ khác. Vì vậy hàm này DUYỆT đỉnh theo bậc
 *    giảm dần của riêng nó (không theo thứ tự input.nodes) — không liên quan gì tới việc Welsh–
 *    Powell cũng sắp theo bậc, vì Welsh–Powell không hề là thuật toán đang được oracle này kiểm
 *    (oracle luôn kiểm quay lui/vét cạn, hai thuật toán giữ nguyên thứ tự input.nodes, không sắp
 *    bậc) — nhờ vậy lõi khó (bậc cao) luôn được xét trước, phát hiện vô nghiệm sớm bất kể người
 *    gọi liệt kê input.nodes theo thứ tự nào. */
export function existsColoring(input: Input): boolean {
  const n = input.nodes.length;
  const adj = adjacency(input);
  const degree = input.nodes.map((v) => input.nodes.filter((u) => adj.has(`${v}|${u}`)).length);
  const order = input.nodes.map((_, i) => i).sort((a, b) => degree[b] - degree[a]);
  const classes: Set<number>[] = [];
  function conflictsWithClass(members: Set<number>, v: number): boolean {
    for (const i of members) {
      if (connected(adj, input.nodes[i], input.nodes[v])) return true;
    }
    return false;
  }
  function enumerate(depth: number): boolean {
    if (depth === n) return true;
    const v = order[depth];
    for (let c = 0; c < Math.min(classes.length + 1, input.colors); c++) {
      if (c === classes.length) classes.push(new Set<number>());
      if (!conflictsWithClass(classes[c], v)) {
        classes[c].add(v);
        if (enumerate(depth + 1)) return true;
        classes[c].delete(v);
      }
      if (classes[c].size === 0) classes.pop();
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
  // Đồ thị vượt ngưỡng oracle: không tính được χ(G) độc lập để xác nhận, nên dù thuật toán có báo
  // chromaticExact cũng không được tin — không đưa ra tuyên bố tối ưu nào (bỏ trường optimal) để
  // tránh báo "tối ưu" cho một tuyên bố chưa hề được kiểm chứng.
  if (input.nodes.length > CHROMATIC_ORACLE_MAX_N) return {ok: true};
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
