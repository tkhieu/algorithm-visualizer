import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {dist} from '../../../problems/tsp/checker';
import {assertActive, markTour, pack, type VisualState} from '../shared';
import {buildMst} from '../twice-around-tree/run';

const SAFE_MAX = 12;

function minWeightMatching(
  vertices: number[],
  points: {x: number; y: number}[],
): {pairs: [number, number][]; weight: number} {
  if (!vertices.length) return {pairs: [], weight: 0};
  const [first, ...rest] = vertices;
  let best = {pairs: [] as [number, number][], weight: Infinity};
  for (let i = 0; i < rest.length; i++) {
    const partner = rest[i];
    const remaining = [...rest.slice(0, i), ...rest.slice(i + 1)];
    const sub = minWeightMatching(remaining, points);
    const weight = dist(points[first], points[partner]) + sub.weight;
    if (weight < best.weight) best = {pairs: [[first, partner], ...sub.pairs], weight};
  }
  return best;
}

function eulerianCircuit(multiAdjacency: number[][]): number[] {
  const adj = multiAdjacency.map((list) => [...list]);
  const circuit: number[] = [];
  const stack = [0];
  while (stack.length) {
    const u = stack[stack.length - 1];
    if (adj[u].length) {
      const v = adj[u].pop()!;
      const idx = adj[v].indexOf(u);
      if (idx >= 0) adj[v].splice(idx, 1);
      stack.push(v);
    } else {
      circuit.push(stack.pop()!);
    }
  }
  return circuit.reverse();
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {points} = input;
  const n = points.length;
  if (n > SAFE_MAX) {
    throw new Error(`Christofides (ghép cặp vét cạn) chỉ hỗ trợ đến ${SAFE_MAX} điểm (nhận ${n}).`);
  }
  if (n <= 2) {
    const tour = n === 0 ? [] : n === 1 ? [0] : [0, 1];
    rec.step('done', 'Quá ít điểm — hành trình tầm thường.', (d) => markTour(d, tour), [], 'done');
    return pack(points, tour);
  }
  assertActive(signal);

  const mst = buildMst(points);
  rec.step(
    'mst',
    `Xây cây khung nhỏ nhất qua ${n} điểm.`,
    (d) => {
      d.segments = [];
      for (let u = 0; u < n; u++) for (const v of mst[u]) if (v > u) d.segments.push({from: u, to: v, role: 'tree'});
    },
    [],
    'mst',
  );

  const odd = Array.from({length: n}, (_, i) => i).filter((i) => mst[i].length % 2 === 1);
  rec.step(
    'odd',
    `Các đỉnh bậc lẻ trong MST: ${odd.join(', ')}.`,
    (d) => {
      d.note = `${odd.length} đỉnh bậc lẻ`;
    },
    [],
    'search',
  );

  assertActive(signal);
  const matching = minWeightMatching(odd, points);
  rec.step(
    'matching',
    `Ghép cặp bậc lẻ với tổng khoảng cách nhỏ nhất ${matching.weight.toFixed(2)}: ${matching.pairs.map(([a, b]) => `${a}-${b}`).join(', ')}.`,
    (d) => {
      for (const [a, b] of matching.pairs) d.segments.push({from: a, to: b, role: 'matched'});
    },
    [],
    'search',
  );

  const multi: number[][] = Array.from({length: n}, () => []);
  for (let u = 0; u < n; u++) for (const v of mst[u]) multi[u].push(v);
  for (const [a, b] of matching.pairs) {
    multi[a].push(b);
    multi[b].push(a);
  }
  const euler = eulerianCircuit(multi);
  rec.step(
    'euler',
    `Chu trình Euler trên đa đồ thị: ${euler.join('-')}.`,
    (d) => {
      d.note = 'Đã tìm chu trình Euler';
    },
    [],
    'search',
  );

  const tour: number[] = [];
  const visited = new Array(n).fill(false);
  for (const u of euler) {
    if (visited[u]) {
      rec.step(
        'shortcut',
        `Điểm ${u} đã có trong hành trình — bỏ qua (đường tắt).`,
        (d) => markTour(d, tour),
        [],
        'search',
      );
      continue;
    }
    visited[u] = true;
    tour.push(u);
    rec.step(
      'shortcut',
      `Thêm điểm ${u} vào hành trình.`,
      (d) => markTour(d, tour),
      [{target: `point-${u}`, role: 'current'}],
      'search',
    );
  }

  rec.step(
    'done',
    `Hoàn tất: hành trình Hamilton có độ dài ${pack(points, tour).length.toFixed(2)}.`,
    (d) => {
      markTour(d, tour);
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(points, tour);
}
