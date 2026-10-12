import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/hamiltonian-circuit/definition';
import {assertActive, markPath, pack, type VisualState} from '../shared';
import {adjacency, connected} from '../../../problems/hamiltonian-circuit/checker';
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const n = input.nodes.length;
  if (n === 1) {
    rec.step(
      'done',
      'Chỉ có một đỉnh — chu trình tầm thường.',
      (d) => {
        markPath(d, [input.nodes[0]]);
      },
      [],
      'done',
    );
    return pack([input.nodes[0]]);
  }
  const adj = adjacency(input);
  let nextId = 0;
  const nodeAtDepth: number[] = [];
  let found: string[] | null = null;
  const visited = new Set<string>([input.nodes[0]]);
  const path: string[] = [input.nodes[0]];
  const rootId = nextId++;
  nodeAtDepth[0] = rootId;
  rec.step(
    'init',
    `Bắt đầu đường đi tại đỉnh xuất phát ${input.nodes[0]}.`,
    (d) => {
      d.treeNodes.push({id: rootId, parent: null, label: input.nodes[0], status: 'current', value: 0});
      markPath(d, path);
    },
    [],
    'search',
  );
  function extend(depth: number): boolean {
    assertActive(signal);
    const last = path[path.length - 1];
    for (const next of input.nodes) {
      if (visited.has(next) || !connected(adj, last, next)) continue;
      rec.count('visit');
      const id = nextId++;
      const parent = nodeAtDepth[depth - 1];
      path.push(next);
      visited.add(next);
      nodeAtDepth[depth] = id;
      rec.step(
        'extend',
        `Mở rộng đường đi từ ${last} sang ${next}.`,
        (d) => {
          d.treeNodes.push({id, parent, label: next, status: 'current', value: 0});
          markPath(d, path);
        },
        [{target: `node-${next}`, role: 'current'}],
        'search',
      );
      if (path.length === n) {
        if (connected(adj, next, path[0])) {
          found = path.slice();
          rec.step(
            'found',
            `Đã thăm hết ${n} đỉnh và ${next} nối lại ${path[0]} — tìm được chu trình.`,
            (d) => {
              const node = d.treeNodes.find((x) => x.id === id);
              if (node) node.status = 'best';
            },
            [],
            'done',
          );
          return true;
        }
        rec.count('prune');
        rec.step(
          'backtrack',
          `${next} không nối lại đỉnh xuất phát ${path[0]} — không khép được chu trình.`,
          (d) => {
            const node = d.treeNodes.find((x) => x.id === id);
            if (node) node.status = 'pruned';
          },
          [],
          'search',
        );
      } else {
        if (extend(depth + 1)) return true;
        rec.step(
          'backtrack',
          `Không còn đỉnh kề chưa thăm từ ${next} — quay lui.`,
          (d) => {
            const node = d.treeNodes.find((x) => x.id === id);
            if (node) node.status = 'done';
          },
          [],
          'search',
        );
      }
      path.pop();
      visited.delete(next);
    }
    return false;
  }
  const ok = extend(1);
  if (!ok)
    rec.step(
      'done',
      'Đã thử hết mọi hướng mở rộng — không có chu trình Hamilton.',
      (d) => {
        markPath(d, []);
        d.note = 'Không có chu trình';
      },
      [],
      'done',
    );
  else
    rec.step(
      'done',
      `Hoàn tất với chu trình ${found!.join(' → ')}.`,
      (d) => {
        markPath(d, [...found!, found![0]]);
        d.note = 'Hoàn tất';
      },
      [],
      'done',
    );
  return pack(found);
}
