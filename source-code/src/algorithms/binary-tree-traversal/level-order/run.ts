import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/binary-tree-traversal/definition';
type NodeT = Input['nodes'][number];
export interface VisualState {
  nodes: {
    id: string;
    parent: string | null;
    label: string;
    role?: string;
    side?: 'L' | 'R';
  }[];
  note: string;
}
function buildNodes(input: Input): VisualState['nodes'] {
  const byId = new Map(input.nodes.map(n => [n.id, n]));
  const out: VisualState['nodes'] = [];
  const walk = (id: number | null, parent: string | null, side?: 'L' | 'R') => {
    if (id === null) return;
    const node = byId.get(id)!;
    out.push({ id: String(id), parent, label: String(node.value), side });
    walk(node.left, String(id), 'L');
    walk(node.right, String(id), 'R');
  };
  walk(input.root, null);
  return out;
}
export function initVisual(input: Input): VisualState {
  return { nodes: buildNodes(input), note: '' };
}
function setRole(d: VisualState, id: number, role: string | undefined) {
  const i = d.nodes.findIndex(n => n.id === String(id));
  if (i >= 0) d.nodes[i].role = role;
}
function heightOf(byId: Map<number, NodeT>, id: number | null): number {
  return id === null
    ? -1
    : 1 + Math.max(heightOf(byId, byId.get(id)!.left), heightOf(byId, byId.get(id)!.right));
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const byId = new Map(input.nodes.map(n => [n.id, n]));
  const order: number[] = [];
  const queue: number[] = [];
  if (input.root !== null) {
    queue.push(input.root);
    rec.step(
      'enqueue-root',
      `Đưa gốc ${byId.get(input.root)!.value} vào hàng đợi.`,
      d => setRole(d, input.root as number, 'current'),
      [{ target: `tree-node-${input.root}`, role: 'current' }],
      'traverse',
    );
  } else {
    rec.step('enqueue-root', 'Cây rỗng — hàng đợi trống.', () => {}, [], 'traverse');
  }
  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = byId.get(id)!;
    rec.step(
      'dequeue',
      `Lấy đỉnh ${node.value} ra khỏi hàng đợi.`,
      d => setRole(d, id, 'current'),
      [{ target: `tree-node-${id}`, role: 'current' }],
      'traverse',
    );
    order.push(node.value);
    rec.count('visit');
    rec.step(
      'visit',
      `Thăm đỉnh ${node.value} (thêm vào kết quả duyệt theo mức).`,
      d => setRole(d, id, 'best'),
      [{ target: `tree-node-${id}`, role: 'best' }],
      'traverse',
    );
    for (const child of [node.left, node.right]) {
      if (child === null) continue;
      queue.push(child);
      const childValue = byId.get(child)!.value;
      rec.step(
        'enqueue-children',
        `Đưa con ${childValue} của ${node.value} vào hàng đợi.`,
        d => setRole(d, child, 'current'),
        [{ target: `tree-node-${child}`, role: 'current' }],
        'traverse',
      );
    }
  }
  const height = heightOf(byId, input.root);
  rec.step('done', `Hoàn tất duyệt theo mức, độ cao cây = ${height}.`, () => {}, [], 'done');
  return { order, height };
}
