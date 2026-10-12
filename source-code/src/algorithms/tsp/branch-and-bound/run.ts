import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {dist} from '../../../problems/tsp/checker';
import {assertActive, markTour, pack, type VisualState} from '../shared';

// n > SAFE_MAX bị chặn trước khi tới đây bằng precondition của algorithm (index.ts).
export const SAFE_MAX = 10;

interface Node {
  id: number;
  parent: number | null;
  path: number[];
  length: number;
  bound: number;
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {points} = input;
  const n = points.length;
  if (n <= 1) {
    const tour = n === 1 ? [0] : [];
    rec.step('done', 'Chỉ có tối đa một điểm — hành trình tầm thường.', (d) => markTour(d, tour), [], 'done');
    return pack(points, tour);
  }

  let minEdge = Infinity;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) minEdge = Math.min(minEdge, dist(points[i], points[j]));
  const bound = (path: number[], length: number) => length + (n - path.length) * minEdge;

  let nextId = 0;
  const rootId = nextId++;
  const root: Node = {id: rootId, parent: null, path: [0], length: 0, bound: bound([0], 0)};
  const queue: Node[] = [root];
  let best: number[] | null = null;
  let bestLength = Infinity;

  rec.step(
    'init',
    `Cạnh ngắn nhất toàn cục = ${minEdge.toFixed(2)}; cận dưới gốc = ${root.bound.toFixed(2)}.`,
    (d) => {
      d.nodes.push({id: rootId, parent: null, label: '0', status: 'current', value: 0, bound: root.bound});
      markTour(d, [0]);
    },
    [],
    'search',
  );

  while (queue.length) {
    assertActive(signal);
    queue.sort((a, b) => a.bound - b.bound);
    const node = queue.shift()!;
    rec.count('visit');
    if (node.bound >= bestLength) {
      rec.count('prune');
      rec.step(
        'bound',
        `Cắt nhánh tại nút ${node.id}: cận dưới ${node.bound.toFixed(2)} ≥ độ dài tốt nhất ${bestLength.toFixed(2)}.`,
        (d) => {
          const vis = d.nodes.find((x) => x.id === node.id);
          if (vis) vis.status = 'pruned';
        },
        [],
        'search',
      );
      continue;
    }
    rec.step(
      'pop',
      `Xét nút ${node.id}: đường đi ${node.path.join('-')}, cận dưới ${node.bound.toFixed(2)}.`,
      (d) => {
        markTour(d, node.path);
        for (const previous of d.nodes) {
          if (previous.id !== node.id && previous.status === 'current') previous.status = 'done';
        }
        const vis = d.nodes.find((x) => x.id === node.id);
        if (vis) vis.status = 'current';
      },
      [],
      'search',
    );

    if (node.path.length === n) {
      const length = node.length + dist(points[node.path[n - 1]], points[0]);
      rec.count('compare');
      const improved = length < bestLength;
      if (improved) {
        best = node.path.slice();
        bestLength = length;
      }
      rec.step(
        'leaf',
        `Hành trình ${node.path.join('-')} khép vòng về 0: độ dài ${length.toFixed(2)}${improved ? ' — tốt nhất hiện tại' : ''}.`,
        (d) => {
          const vis = d.nodes.find((x) => x.id === node.id);
          if (vis) {
            vis.status = improved ? 'best' : 'done';
            vis.value = length;
          }
          if (improved) markTour(d, [...node.path]);
        },
        [],
        'leaf',
      );
      continue;
    }

    for (let next = 0; next < n; next++) {
      if (node.path.includes(next)) continue;
      const length = node.length + dist(points[node.path[node.path.length - 1]], points[next]);
      const path = [...node.path, next];
      const id = nextId++;
      const child: Node = {id, parent: node.id, path, length, bound: bound(path, length)};
      rec.step(
        'branch',
        `Mở rộng sang điểm ${next}: độ dài ${length.toFixed(2)}, cận dưới ${child.bound.toFixed(2)}.`,
        (d) => {
          d.nodes.push({id, parent: node.id, label: String(next), status: 'open', value: length, bound: child.bound});
        },
        [],
        'search',
      );
      if (child.bound < bestLength) queue.push(child);
      else {
        rec.count('prune');
        rec.step(
          'bound',
          `Cắt nhánh tại nút ${id}: cận dưới ${child.bound.toFixed(2)} ≥ độ dài tốt nhất ${bestLength.toFixed(2)}.`,
          (d) => {
            const vis = d.nodes.find((x) => x.id === id);
            if (vis) vis.status = 'pruned';
          },
          [],
          'search',
        );
      }
    }
  }

  rec.step(
    'done',
    `Hoàn tất: hành trình ngắn nhất có độ dài ${bestLength.toFixed(2)}.`,
    (d) => {
      markTour(d, best ?? [0]);
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(points, best ?? [0]);
}
