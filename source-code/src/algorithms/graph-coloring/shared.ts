import type {Input, Output} from '../../problems/graph-coloring/definition';
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
