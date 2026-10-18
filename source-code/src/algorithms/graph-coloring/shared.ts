import type {Input, Output} from '../../problems/graph-coloring/definition';
import {adjacency} from '../../problems/graph-coloring/checker';
export interface TreeNode {
  id: number;
  parent: number | null;
  label: string;
  status: 'current' | 'open' | 'pruned' | 'best' | 'done' | 'superseded';
  value: number;
}
export interface GNode {
  id: string;
  role?: string;
  label?: string;
}
export interface GEdge {
  from: string;
  to: string;
  role?: string;
}
export interface VisualState {
  nodes: GNode[];
  edges: GEdge[];
  treeNodes: TreeNode[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return {
    nodes: input.nodes.map((id) => ({id})),
    edges: input.edges.map((e) => ({from: e.from, to: e.to})),
    treeNodes: [],
    note: '',
  };
}
export function pack(coloring: number[] | null): Output {
  return coloring ? {found: true, coloring} : {found: false, coloring: []};
}
export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}
export const limits = {maxSteps: 5000, maxBytes: 2500000};
export function smallestAvailableColor(
  adj: Set<string>,
  nodes: string[],
  coloring: (number | null)[],
  k: number,
  vertex: string,
): number | null {
  const used = new Set<number>();
  nodes.forEach((other, i) => {
    if (coloring[i] !== null && coloring[i] !== undefined && adj.has(`${vertex}|${other}`))
      used.add(coloring[i] as number);
  });
  for (let c = 0; c < k; c++) if (!used.has(c)) return c;
  return null;
}
export function markColoring(draft: VisualState, coloring: (number | null)[], current?: string) {
  draft.nodes.forEach((n, i) => {
    const c = coloring[i];
    n.label = c === null || c === undefined ? undefined : String(c);
    n.role = n.id === current ? 'current' : c === null || c === undefined ? undefined : 'visited';
  });
}
/** Giới hạn số màu dùng cho vòng chọn màu nhỏ nhất của ba heuristic: ở chế độ k-coloring giữ nguyên
 * k đầu vào (hành vi gốc); ở chế độ chromatic bỏ qua k, dùng n màu — luôn đủ vì mỗi đỉnh có tối đa
 * n−1 đỉnh kề nên chắc chắn còn một màu trong n màu còn trống (nguyên lý Dirichlet). */
export function effectiveColorLimit(input: Input): number {
  return input.mode === 'chromatic' ? input.nodes.length : input.colors;
}
export function countColorsUsed(coloring: (number | null)[]): number {
  const used = new Set<number>();
  for (const c of coloring) if (c !== null && c !== undefined) used.add(c);
  return used.size;
}
/** Tô tham lam thuần (không ghi trace) dùng làm chặn trên χ(G) ở chế độ chromatic của quay lui —
 * độc lập với vòng quay lui chính nên không tính là "tự chứng minh bằng chính thuật toán đang kiểm". */
export function dsaturUpperBound(input: Input): number {
  const {nodes} = input;
  const n = nodes.length;
  const adj = adjacency(input);
  const coloring: (number | null)[] = new Array(n).fill(null);
  for (let step = 0; step < n; step++) {
    let bestIdx = -1,
      bestSat = -1,
      bestDeg = -1;
    for (let i = 0; i < n; i++) {
      if (coloring[i] !== null) continue;
      const usedColors = new Set<number>();
      let degree = 0;
      for (let j = 0; j < n; j++)
        if (adj.has(`${nodes[i]}|${nodes[j]}`)) {
          degree++;
          if (coloring[j] !== null) usedColors.add(coloring[j] as number);
        }
      if (usedColors.size > bestSat || (usedColors.size === bestSat && degree > bestDeg)) {
        bestIdx = i;
        bestSat = usedColors.size;
        bestDeg = degree;
      }
    }
    const c = smallestAvailableColor(adj, nodes, coloring, n, nodes[bestIdx]);
    coloring[bestIdx] = c ?? 0;
  }
  return countColorsUsed(coloring);
}
/** Một clique tìm bằng tham lam (không chắc lớn nhất) cho chặn dưới χ(G) ≥ |clique| ở chế độ
 * chromatic của quay lui. Cấu trúc hoàn toàn khác vòng quay lui đang được kiểm (mở rộng clique theo
 * đỉnh kề chung, không gán màu tuần tự), nên dùng làm gợi ý hiển thị trong trace là hợp lý. */
export function greedyCliqueLowerBound(input: Input): string[] {
  const {nodes} = input;
  const adj = adjacency(input);
  const degree = nodes.map((v) => nodes.filter((u) => adj.has(`${v}|${u}`)).length);
  const order = nodes.map((_, i) => i).sort((a, b) => degree[b] - degree[a]);
  const clique: number[] = [];
  for (const i of order) {
    if (clique.every((j) => adj.has(`${nodes[i]}|${nodes[j]}`))) clique.push(i);
  }
  return clique.map((i) => nodes[i]);
}
