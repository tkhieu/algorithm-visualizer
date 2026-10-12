import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/balanced-search-tree/definition';
interface Node {
  id: number;
  key: number;
  left: number | null;
  right: number | null;
  parent: number | null;
  height: number;
}
export interface VisualState {
  nodes: { id: string; parent: string | null; label: string; role?: string; sub?: string }[];
  note: string;
}
export function initVisual(_input: Input): VisualState {
  void _input;
  return { nodes: [], note: '' };
}
function render(nodes: Node[], rootId: number | null): VisualState['nodes'] {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const heightOf = (id: number | null) => (id === null ? -1 : byId.get(id)!.height);
  const out: VisualState['nodes'] = [];
  const walk = (id: number | null) => {
    if (id === null) return;
    const n = byId.get(id)!;
    const balance = heightOf(n.left) - heightOf(n.right);
    out.push({
      id: String(n.id),
      parent: n.parent === null ? null : String(n.parent),
      label: String(n.key),
      sub: balance > 0 ? `+${balance}` : String(balance),
    });
    walk(n.left);
    walk(n.right);
  };
  walk(rootId);
  return out;
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const nodes: Node[] = [];
  let rootId: number | null = null,
    nextId = 0;
  const find = (id: number) => nodes.find(n => n.id === id)!;
  const h = (id: number | null) => (id === null ? -1 : find(id).height);
  const updateHeight = (id: number) => {
    const n = find(id);
    n.height = 1 + Math.max(h(n.left), h(n.right));
  };
  const balanceOf = (id: number) => {
    const n = find(id);
    return h(n.left) - h(n.right);
  };
  const setChild = (parentId: number | null, oldId: number, newId: number | null) => {
    if (parentId === null) {
      rootId = newId;
      return;
    }
    const p = find(parentId);
    if (p.left === oldId) p.left = newId;
    else p.right = newId;
  };
  function rotateLeft(xId: number): number {
    const x = find(xId),
      yId = x.right as number,
      y = find(yId);
    x.right = y.left;
    if (y.left !== null) find(y.left).parent = x.id;
    y.left = x.id;
    y.parent = x.parent;
    setChild(x.parent, x.id, y.id);
    x.parent = y.id;
    updateHeight(x.id);
    updateHeight(y.id);
    return y.id;
  }
  function rotateRight(xId: number): number {
    const x = find(xId),
      yId = x.left as number,
      y = find(yId);
    x.left = y.right;
    if (y.right !== null) find(y.right).parent = x.id;
    y.right = x.id;
    y.parent = x.parent;
    setChild(x.parent, x.id, y.id);
    x.parent = y.id;
    updateHeight(x.id);
    updateHeight(y.id);
    return y.id;
  }
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
    const path: number[] = [];
    while (curId !== null) {
      const cur = find(curId);
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
      path.push(curId);
      parentId = curId;
      if (key < cur.key) {
        goLeft = true;
        curId = cur.left;
      } else {
        goLeft = false;
        curId = cur.right;
      }
    }
    const id = nextId++;
    nodes.push({ id, key, left: null, right: null, parent: parentId, height: 0 });
    if (parentId === null) rootId = id;
    else {
      const parent = find(parentId);
      if (goLeft) parent.left = id;
      else parent.right = id;
    }
    const parentKey = parentId === null ? null : find(parentId).key;
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
    for (let i = path.length - 1; i >= 0; i--) {
      const nodeId = path[i];
      updateHeight(nodeId);
      const balance = balanceOf(nodeId);
      const nodeKey = find(nodeId).key;
      if (balance > 1) {
        const leftId = find(nodeId).left as number;
        if (balanceOf(leftId) < 0) {
          const innerKey = find(leftId).key;
          rotateLeft(leftId);
          rec.step(
            'rebalance-inner',
            `Mất cân bằng trái-phải tại ${nodeKey}: xoay trái con trái ${innerKey} trước ` +
              `(trạng thái cây ngay sau lần xoay đơn đầu tiên).`,
            d => {
              d.nodes = render(nodes, rootId);
            },
            [{ target: `tree-node-${leftId}`, role: 'current' }],
            'balance',
          );
        }
        const newTop = rotateRight(nodeId);
        rec.step(
          'rebalance',
          `Mất cân bằng tại ${nodeKey}: xoay phải, ${find(newTop).key} lên làm gốc con.`,
          d => {
            d.nodes = render(nodes, rootId);
          },
          [{ target: `tree-node-${newTop}`, role: 'current' }],
          'balance',
        );
      } else if (balance < -1) {
        const rightId = find(nodeId).right as number;
        if (balanceOf(rightId) > 0) {
          const innerKey = find(rightId).key;
          rotateRight(rightId);
          rec.step(
            'rebalance-inner',
            `Mất cân bằng phải-trái tại ${nodeKey}: xoay phải con phải ${innerKey} trước ` +
              `(trạng thái cây ngay sau lần xoay đơn đầu tiên).`,
            d => {
              d.nodes = render(nodes, rootId);
            },
            [{ target: `tree-node-${rightId}`, role: 'current' }],
            'balance',
          );
        }
        const newTop = rotateLeft(nodeId);
        rec.step(
          'rebalance',
          `Mất cân bằng tại ${nodeKey}: xoay trái, ${find(newTop).key} lên làm gốc con.`,
          d => {
            d.nodes = render(nodes, rootId);
          },
          [{ target: `tree-node-${newTop}`, role: 'current' }],
          'balance',
        );
      }
    }
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
  return { values: nodes.map(n => n.key).sort((a, b) => a - b), height: h(rootId) };
}
