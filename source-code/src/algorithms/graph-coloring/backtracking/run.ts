import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/graph-coloring/definition';
import {assertActive, markColoring, pack, type VisualState} from '../shared';
import {adjacency, connected} from '../../../problems/graph-coloring/checker';
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {nodes, colors: k} = input;
  const n = nodes.length;
  const adj = adjacency(input);
  const coloring: (number | null)[] = new Array(n).fill(null);
  let nextId = 0;
  const nodeAtDepth: number[] = [];
  let found: number[] | null = null;
  const rootId = nextId++;
  rec.step(
    'init',
    `Tô ${n} đỉnh theo thứ tự cho sẵn.`,
    (d) => {
      d.treeNodes.push({id: rootId, parent: null, label: '∅', status: 'current', value: 0});
      markColoring(d, coloring);
    },
    [],
    'search',
  );
  function solve(v: number): boolean {
    assertActive(signal);
    if (v === n) return true;
    const parent = v === 0 ? rootId : nodeAtDepth[v - 1];
    for (let c = 0; c < k; c++) {
      rec.count('visit');
      let conflict = -1;
      for (let u = 0; u < v; u++)
        if (coloring[u] === c && connected(adj, nodes[u], nodes[v])) {
          conflict = u;
          break;
        }
      const id = nextId++;
      nodeAtDepth[v] = id;
      if (conflict >= 0) {
        rec.count('prune');
        rec.step(
          'reject',
          `Màu ${c} trùng với đỉnh kề ${nodes[conflict]} đã tô — loại bỏ.`,
          (d) => {
            d.treeNodes.push({id, parent, label: `${nodes[v]}:${c}✗`, status: 'pruned', value: 0});
          },
          [],
          'search',
        );
        continue;
      }
      coloring[v] = c;
      rec.step(
        'place',
        `Gán màu ${c} cho đỉnh ${nodes[v]}.`,
        (d) => {
          d.treeNodes.push({id, parent, label: `${nodes[v]}:${c}`, status: 'current', value: c});
          markColoring(d, coloring, nodes[v]);
        },
        [{target: `node-${nodes[v]}`, role: 'current'}],
        'search',
      );
      if (solve(v + 1)) {
        found = coloring.slice() as number[];
        return true;
      }
      coloring[v] = null;
      rec.step(
        'backtrack',
        `Không màu nào bên dưới đỉnh ${nodes[v]} khả thi — quay lui.`,
        (d) => {
          const node = d.treeNodes.find((x) => x.id === id);
          if (node) node.status = 'done';
        },
        [],
        'search',
      );
    }
    return false;
  }
  const ok = solve(0);
  rec.step(
    'done',
    ok ? 'Tô thành công với số màu đã cho.' : 'Đã thử hết mọi khả năng — không thể tô.',
    (d) => {
      d.note = ok ? 'Tô thành công' : 'Không thể tô';
    },
    [],
    'done',
  );
  return pack(found);
}
