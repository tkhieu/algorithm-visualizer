import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/balanced-search-tree/definition';
interface Node {
  id: number;
  key: number;
  left: number | null;
  right: number | null;
  parent: number | null;
}
export interface VisualState {
  nodes: { id: string; parent: string | null; label: string; role?: string }[];
  note: string;
}
export function initVisual(_input: Input): VisualState {
  void _input;
  return { nodes: [], note: '' };
}
function render(nodes: Node[], rootId: number | null): VisualState['nodes'] {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const out: VisualState['nodes'] = [];
  const walk = (id: number | null) => {
    if (id === null) return;
    const n = byId.get(id)!;
    out.push({
      id: String(n.id),
      parent: n.parent === null ? null : String(n.parent),
      label: String(n.key),
    });
    walk(n.left);
    walk(n.right);
  };
  walk(rootId);
  return out;
}
function heightOf(nodes: Node[], id: number | null): number {
  if (id === null) return -1;
  const n = nodes.find(x => x.id === id)!;
  return 1 + Math.max(heightOf(nodes, n.left), heightOf(nodes, n.right));
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const nodes: Node[] = [];
  let rootId: number | null = null,
    nextId = 0;
  for (const key of input.keys) {
    rec.step(
      'start',
      `Chèn khóa ${key}.`,
      d => {
        d.nodes = render(nodes, rootId);
        d.note = `Chèn ${key}`;
      },
      [],
      'insert',
    );
    if (nodes.some(n => n.key === key)) {
      rec.step('exists', `Khóa ${key} đã tồn tại — bỏ qua.`, () => {}, [], 'insert');
      continue;
    }
    let curId = rootId,
      parentId: number | null = null,
      goLeft = false;
    while (curId !== null) {
      const cur = nodes.find(n => n.id === curId)!;
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh ${key} với ${cur.key}.`,
        d => {
          d.nodes = render(nodes, rootId).map(x =>
            x.id === String(cur.id) ? { ...x, role: 'current' } : x,
          );
        },
        [{ target: `tree-node-${cur.id}`, role: 'current' }],
        'insert',
      );
      parentId = cur.id;
      if (key < cur.key) {
        goLeft = true;
        curId = cur.left;
      } else {
        goLeft = false;
        curId = cur.right;
      }
    }
    const id = nextId++;
    nodes.push({ id, key, left: null, right: null, parent: parentId });
    if (parentId === null) rootId = id;
    else {
      const parent = nodes.find(n => n.id === parentId)!;
      if (goLeft) parent.left = id;
      else parent.right = id;
    }
    const parentKey = parentId === null ? null : nodes.find(n => n.id === parentId)!.key;
    rec.step(
      'insert',
      `Tạo đỉnh mới cho ${key}${parentKey === null ? ' làm gốc' : ` làm con của ${parentKey}`}.`,
      d => {
        d.nodes = render(nodes, rootId).map(x =>
          x.id === String(id) ? { ...x, role: 'best' } : x,
        );
      },
      [{ target: `tree-node-${id}`, role: 'best' }],
      'insert',
    );
  }
  rec.step(
    'done',
    `Hoàn tất, cây có ${nodes.length} đỉnh.`,
    d => {
      d.nodes = render(nodes, rootId);
    },
    [],
    'done',
  );
  return { values: nodes.map(n => n.key).sort((a, b) => a - b), height: heightOf(nodes, rootId) };
}
