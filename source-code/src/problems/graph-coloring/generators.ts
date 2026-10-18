import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
import {rng} from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = {tiny: 4, small: 5, medium: 6, large: 7}[size];
  const nodes = Array.from({length: n}, (_, i) => `V${i}`);
  const edges: {from: string; to: string}[] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) if (r() < 0.45) edges.push({from: nodes[i], to: nodes[j]});
  const colors = 1 + Math.floor(r() * n);
  return {nodes, edges, colors};
}
type Edge = {from: string; to: string};
/** Đồ thị ngẫu nhiên G(n,p) có seed — dùng cho tab "Ngẫu nhiên" (n, p tuỳ chỉnh) và các ca lớn.
 * Sinh đúng mẫu G(n,p) thật (mỗi cặp đỉnh độc lập có cạnh với xác suất p) — KHÔNG tự cắt bớt cạnh
 * khi vượt một ngưỡng nào đó: cắt ở một điểm cố định trong thứ tự duyệt (ví dụ dừng khi đủ 8000
 * cạnh) làm lệch mẫu — các cặp đỉnh xét sau trong vòng lặp (chỉ số i,j lớn) sẽ có ít cạnh hơn hẳn
 * so với các cặp xét trước, không còn là G(n,p) thật nữa. Nơi gọi (ui.tsx) chịu trách nhiệm chọn
 * (n,p) để số cạnh kỳ vọng nằm trong giới hạn của inputSchema, và xử lý trường hợp hiếm khi mẫu
 * thực tế vẫn vượt (từ chối, không lặng lẽ cắt). */
export function randomGraph(seed: number, n: number, p: number, colors = 4): Input {
  const r = rng(seed);
  const nodes = Array.from({length: n}, (_, i) => `V${i}`);
  const edges: Edge[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (r() < p) edges.push({from: nodes[i], to: nodes[j]});
  return {nodes, edges, colors};
}
/** Đồ thị vương miện (crown graph): hai nhóm A, B kích thước m, cạnh Ai–Bj với mọi i≠j — đây là
 * K_{m,m} bỏ một ghép cặp hoàn hảo, nên luôn hai phía (χ=2). Thứ tự đỉnh xen kẽ A1,B1,A2,B2,… khiến
 * tham lam theo thứ tự cho sẵn phải dùng đúng m = n/2 màu (mỗi cặp một màu mới), minh hoạ khoảng
 * cách giữa heuristic và χ(G) thật. */
export function crownGraph(m: number, colors = 2): Input {
  const nodes: string[] = [];
  for (let i = 1; i <= m; i++) {
    nodes.push(`A${i}`);
    nodes.push(`B${i}`);
  }
  const edges: Edge[] = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= m; j++) if (i !== j) edges.push({from: `A${i}`, to: `B${j}`});
  return {nodes, edges, colors};
}
/** Đồ thị đầy đủ Kₙ — mọi cặp đỉnh đều kề nhau, χ(Kₙ) = n. */
export function completeGraph(n: number, colors = n): Input {
  const nodes = Array.from({length: n}, (_, i) => `K${i + 1}`);
  const edges: Edge[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push({from: nodes[i], to: nodes[j]});
  return {nodes, edges, colors};
}
/** Chu trình Cₙ (n ≥ 3) — χ = 2 nếu n chẵn, χ = 3 nếu n lẻ. */
export function cycleGraph(n: number, colors = 3): Input {
  const nodes = Array.from({length: n}, (_, i) => `C${i + 1}`);
  const edges: Edge[] = Array.from({length: n}, (_, i) => ({from: nodes[i], to: nodes[(i + 1) % n]}));
  return {nodes, edges, colors};
}
/** Đồ thị hai phía đầy đủ K_{p,q} — luôn tô được bằng 2 màu (một màu mỗi phía) nếu có ít nhất 1 cạnh. */
export function completeBipartiteGraph(p: number, q: number, colors = 2): Input {
  const left = Array.from({length: p}, (_, i) => `L${i + 1}`);
  const right = Array.from({length: q}, (_, i) => `R${i + 1}`);
  const edges: Edge[] = left.flatMap((l) => right.map((r) => ({from: l, to: r})));
  return {nodes: [...left, ...right], edges, colors};
}
/** Đồ thị Petersen: 10 đỉnh, 15 cạnh, 3-đều — χ(Petersen) = 3 (kết quả toán học đã biết). */
export function petersenGraph(colors = 3): Input {
  const outer = Array.from({length: 5}, (_, i) => `O${i}`);
  const inner = Array.from({length: 5}, (_, i) => `I${i}`);
  const edges: Edge[] = [];
  for (let i = 0; i < 5; i++) edges.push({from: outer[i], to: outer[(i + 1) % 5]});
  for (let i = 0; i < 5; i++) edges.push({from: inner[i], to: inner[(i + 2) % 5]});
  for (let i = 0; i < 5; i++) edges.push({from: outer[i], to: inner[i]});
  return {nodes: [...outer, ...inner], edges, colors};
}
/** Phép dựng Mycielski: biến G thành đồ thị G' giữ nguyên tính không tam giác nhưng χ(G') = χ(G)+1.
 * Thêm bản sao "bóng" v' cho mỗi đỉnh v (nối với đúng các đỉnh kề gốc của v, không nối các bóng với
 * nhau) và một đỉnh "chóp" u nối với mọi bóng. Grötzsch = Mycielski(C₅) (xem `grotzschGraph`). */
export function mycielskian(graph: Input, colors = graph.colors + 1): Input {
  const shadow = (id: string) => `${id}'`;
  const apex = 'U';
  const nodes = [...graph.nodes, ...graph.nodes.map(shadow), apex];
  const edges: Edge[] = [...graph.edges];
  for (const e of graph.edges) {
    edges.push({from: shadow(e.from), to: e.to});
    edges.push({from: shadow(e.to), to: e.from});
  }
  for (const v of graph.nodes) edges.push({from: apex, to: shadow(v)});
  return {nodes, edges, colors};
}
/** Grötzsch: đồ thị không tam giác nhỏ nhất có χ = 4 — chính là Mycielski(C₅), 11 đỉnh, 20 cạnh. */
export function grotzschGraph(colors = 4): Input {
  return mycielskian(cycleGraph(5), colors);
}
