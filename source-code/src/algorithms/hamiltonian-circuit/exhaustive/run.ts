import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/hamiltonian-circuit/definition';
import {assertActive, markPath, pack, type VisualState} from '../shared';
import {adjacency, connected} from '../../../problems/hamiltonian-circuit/checker';
const SAFE_MAX = 8;
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const n = input.nodes.length;
  if (n > SAFE_MAX)
    throw new Error(
      `Vét cạn chỉ hỗ trợ đến ${SAFE_MAX} đỉnh (nhận ${n}); hãy dùng thuật toán quay lui cho đồ thị lớn hơn.`,
    );
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
  const start = input.nodes[0];
  const rest = input.nodes.slice(1);
  let nextId = 0;
  const nodeAtDepth: number[] = [];
  let found: string[] | null = null;
  const rootId = nextId++;
  nodeAtDepth[0] = rootId;
  rec.step(
    'init',
    `Cố định đỉnh xuất phát ${start}; sinh mọi hoán vị của ${rest.length} đỉnh còn lại.`,
    (d) => {
      d.treeNodes.push({id: rootId, parent: null, label: start, status: 'current', value: 0});
      markPath(d, [start]);
    },
    [],
    'search',
  );
  function permute(path: string[], remaining: string[], depth: number): boolean {
    assertActive(signal);
    if (!remaining.length) {
      rec.count('compare');
      let ok = true;
      for (let i = 0; i < path.length - 1; i++)
        if (!connected(adj, path[i], path[i + 1])) {
          ok = false;
          break;
        }
      if (ok && !connected(adj, path[path.length - 1], path[0])) ok = false;
      const id = nextId++;
      rec.step(
        'check',
        ok ? `Hoán vị ${path.join('-')} tạo chu trình hợp lệ.` : `Hoán vị ${path.join('-')} thiếu cạnh — không hợp lệ.`,
        (d) => {
          d.treeNodes.push({
            id,
            parent: nodeAtDepth[depth - 1],
            label: path[path.length - 1],
            status: ok ? 'best' : 'done',
            value: 0,
          });
          if (ok) markPath(d, path);
        },
        [],
        'leaf',
      );
      if (ok) {
        found = path.slice();
        return true;
      }
      return false;
    }
    for (let i = 0; i < remaining.length; i++) {
      rec.count('visit');
      const next = remaining[i];
      const id = nextId++;
      nodeAtDepth[depth] = id;
      const nextPath = [...path, next];
      rec.step(
        'assign',
        `Xếp ${next} vào vị trí ${depth} của hoán vị.`,
        (d) => {
          d.treeNodes.push({id, parent: nodeAtDepth[depth - 1], label: next, status: 'current', value: 0});
          markPath(d, nextPath);
        },
        [],
        'search',
      );
      if (permute(nextPath, [...remaining.slice(0, i), ...remaining.slice(i + 1)], depth + 1)) return true;
    }
    return false;
  }
  const ok = permute([start], rest, 1);
  rec.step(
    'done',
    ok
      ? `Hoàn tất: tìm được chu trình ${found!.join(' → ')}.`
      : 'Hoàn tất: đã thử hết mọi hoán vị, không có chu trình.',
    (d) => {
      if (ok) markPath(d, [...found!, found![0]]);
      d.note = ok ? 'Tìm được chu trình' : 'Không có chu trình';
    },
    [],
    'done',
  );
  return pack(found);
}
