import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/binary-tree-traversal/definition';
type NodeT = Input['nodes'][number];
export interface VisualState {
  nodes: { id: string; parent: string | null; label: string; role?: string }[];
  note: string;
}
function buildNodes(input: Input): VisualState['nodes'] {
  const byId = new Map(input.nodes.map(n => [n.id, n]));
  const out: VisualState['nodes'] = [];
  const walk = (id: number | null, parent: string | null) => {
    if (id === null) return;
    const node = byId.get(id)!;
    out.push({ id: String(id), parent, label: String(node.value) });
    walk(node.left, String(id));
    walk(node.right, String(id));
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
  const visit = (id: number | null): void => {
    if (id === null) {
      rec.step('check', 'Gặp cây con rỗng — không thăm.', () => {}, [], 'traverse');
      return;
    }
    const node = byId.get(id)!;
    rec.step(
      'check',
      `Vào đỉnh ${node.value}.`,
      d => setRole(d, id, 'current'),
      [{ target: `tree-node-${id}`, role: 'current' }],
      'traverse',
    );
    rec.step('left', `Duyệt giữa cây con trái của ${node.value} trước.`, () => {}, [], 'traverse');
    visit(node.left);
    order.push(node.value);
    rec.count('visit');
    rec.step(
      'visit',
      `Thăm đỉnh ${node.value} (thêm vào kết quả duyệt giữa).`,
      d => setRole(d, id, 'best'),
      [{ target: `tree-node-${id}`, role: 'best' }],
      'traverse',
    );
    rec.step('right', `Duyệt giữa cây con phải của ${node.value}.`, () => {}, [], 'traverse');
    visit(node.right);
  };
  visit(input.root);
  const height = heightOf(byId, input.root);
  rec.step('done', `Hoàn tất duyệt giữa, độ cao cây = ${height}.`, () => {}, [], 'done');
  return { order, height };
}
