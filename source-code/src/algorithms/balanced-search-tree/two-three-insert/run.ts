import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/balanced-search-tree/definition';
const MAX_KEYS = 2;
interface MNode {
  id: number;
  keys: number[];
  children: number[];
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
function render(nodes: MNode[], rootId: number | null): VisualState['nodes'] {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const out: VisualState['nodes'] = [];
  const walk = (id: number | null) => {
    if (id === null) return;
    const n = byId.get(id)!;
    out.push({
      id: String(n.id),
      parent: n.parent === null ? null : String(n.parent),
      label: n.keys.join(','),
    });
    for (const c of n.children) walk(c);
  };
  walk(rootId);
  return out;
}
function heightOf(nodes: MNode[], id: number | null): number {
  if (id === null) return -1;
  const n = nodes.find(x => x.id === id)!;
  if (n.children.length === 0) return 0;
  return 1 + Math.max(...n.children.map(c => heightOf(nodes, c)));
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const nodes: MNode[] = [];
  let rootId: number | null = null,
    nextId = 0;
  const find = (id: number) => nodes.find(n => n.id === id)!;
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
    if (rootId === null) {
      const id = nextId++;
      nodes.push({ id, keys: [key], children: [], parent: null });
      rootId = id;
      rec.step(
        'insert-leaf',
        `Tạo gốc mới chứa khóa ${key}.`,
        d => {
          d.nodes = render(nodes, rootId).map(x =>
            x.id === String(id) ? { ...x, role: 'best' } : x,
          );
        },
        [{ target: `tree-node-${id}`, role: 'best' }],
        'insert',
      );
      continue;
    }
    let curId: number = rootId;
    while (find(curId).children.length > 0) {
      rec.count('compare');
      const cur = find(curId);
      rec.step(
        'descend',
        `Tại đỉnh [${cur.keys.join(',')}], chọn nhánh con chứa ${key}.`,
        d => {
          d.nodes = render(nodes, rootId).map(x =>
            x.id === String(cur.id) ? { ...x, role: 'current' } : x,
          );
        },
        [{ target: `tree-node-${cur.id}`, role: 'current' }],
        'insert',
      );
      let i = 0;
      while (i < cur.keys.length && key > cur.keys[i]) i++;
      curId = cur.children[i];
    }
    if (find(curId).keys.includes(key)) {
      rec.step('exists', `Khóa ${key} đã tồn tại — bỏ qua.`, () => {}, [], 'insert');
      continue;
    }
    const leaf = find(curId);
    leaf.keys.push(key);
    leaf.keys.sort((a, b) => a - b);
    rec.step(
      'insert-leaf',
      `Thêm ${key} vào lá [${leaf.keys.join(',')}].`,
      d => {
        d.nodes = render(nodes, rootId).map(x =>
          x.id === String(leaf.id) ? { ...x, role: 'best' } : x,
        );
      },
      [{ target: `tree-node-${leaf.id}`, role: 'best' }],
      'insert',
    );
    let splitId: number | null = leaf.id;
    while (splitId !== null) {
      const cur = find(splitId);
      if (cur.keys.length <= MAX_KEYS) break;
      const midIndex = Math.floor(cur.keys.length / 2);
      const midKey = cur.keys[midIndex];
      const leftKeys = cur.keys.slice(0, midIndex);
      const rightKeys = cur.keys.slice(midIndex + 1);
      const leftChildrenCount = leftKeys.length + 1;
      const leftChildren = cur.children.slice(0, leftChildrenCount);
      const rightChildren = cur.children.slice(leftChildrenCount);
      cur.keys = leftKeys;
      cur.children = leftChildren;
      const newId = nextId++;
      nodes.push({ id: newId, keys: rightKeys, children: rightChildren, parent: cur.parent });
      for (const c of rightChildren) find(c).parent = newId;
      if (cur.parent === null) {
        const newRootId = nextId++;
        nodes.push({ id: newRootId, keys: [midKey], children: [cur.id, newId], parent: null });
        cur.parent = newRootId;
        find(newId).parent = newRootId;
        rootId = newRootId;
        rec.step(
          'split',
          `Nút lá đầy, tách và đưa khóa ${midKey} lên tạo gốc mới.`,
          d => {
            d.nodes = render(nodes, rootId);
          },
          [{ target: `tree-node-${newRootId}`, role: 'current' }],
          'split',
        );
        splitId = null;
      } else {
        const parent = find(cur.parent);
        const idx = parent.children.indexOf(cur.id);
        parent.keys.splice(idx, 0, midKey);
        parent.children.splice(idx + 1, 0, newId);
        rec.step(
          'split',
          `Nút đầy, tách và đưa khóa ${midKey} lên nút cha [${parent.keys.join(',')}].`,
          d => {
            d.nodes = render(nodes, rootId);
          },
          [{ target: `tree-node-${parent.id}`, role: 'current' }],
          'split',
        );
        splitId = parent.id;
      }
    }
  }
  rec.step(
    'done',
    `Hoàn tất, cây có ${nodes.length} nút.`,
    d => {
      d.nodes = render(nodes, rootId);
    },
    [],
    'done',
  );
  return {
    values: nodes.flatMap(n => n.keys).sort((a, b) => a - b),
    height: heightOf(nodes, rootId),
  };
}
