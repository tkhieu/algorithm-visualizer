import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {dist} from '../../../problems/tsp/checker';
import {assertActive, markTour, pack, type VisualState} from '../shared';

export function buildMst(points: {x: number; y: number}[]): number[][] {
  const n = points.length;
  const adjacency: number[][] = Array.from({length: n}, () => []);
  if (n <= 1) return adjacency;
  const inTree = new Array(n).fill(false);
  const minDist = new Array(n).fill(Infinity);
  const parent = new Array(n).fill(-1);
  minDist[0] = 0;
  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!inTree[i] && (u === -1 || minDist[i] < minDist[u])) u = i;
    inTree[u] = true;
    if (parent[u] !== -1) {
      adjacency[u].push(parent[u]);
      adjacency[parent[u]].push(u);
    }
    for (let v = 0; v < n; v++) {
      if (!inTree[v]) {
        const d = dist(points[u], points[v]);
        if (d < minDist[v]) {
          minDist[v] = d;
          parent[v] = u;
        }
      }
    }
  }
  return adjacency;
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {points} = input;
  const n = points.length;
  if (n <= 1) {
    const tour = n === 1 ? [0] : [];
    rec.step('done', 'Chỉ có tối đa một điểm — hành trình tầm thường.', (d) => markTour(d, tour), [], 'done');
    return pack(points, tour);
  }
  const adjacency = buildMst(points);
  rec.step(
    'mst',
    `Xây cây khung nhỏ nhất qua ${n} điểm bằng thuật toán Prim.`,
    (d) => {
      d.segments = [];
      for (let u = 0; u < n; u++)
        for (const v of adjacency[u]) if (v > u) d.segments.push({from: u, to: v, role: 'tree'});
    },
    [],
    'mst',
  );

  const tour: number[] = [];
  const visited = new Array(n).fill(false);
  function preorder(u: number): void {
    assertActive(signal);
    if (visited[u]) {
      rec.step(
        'skip',
        `Điểm ${u} đã có trong hành trình — bỏ qua (đường tắt).`,
        (d) => markTour(d, tour),
        [],
        'search',
      );
      return;
    }
    visited[u] = true;
    tour.push(u);
    rec.count('visit');
    rec.step(
      'add',
      `Thêm điểm ${u} vào hành trình.`,
      (d) => markTour(d, tour),
      [{target: `point-${u}`, role: 'current'}],
      'search',
    );
    for (const v of adjacency[u]) preorder(v);
  }
  preorder(0);

  rec.step(
    'done',
    `Hoàn tất: khép vòng về điểm xuất phát, độ dài ${pack(points, tour).length.toFixed(2)}.`,
    (d) => {
      markTour(d, tour);
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(points, tour);
}
