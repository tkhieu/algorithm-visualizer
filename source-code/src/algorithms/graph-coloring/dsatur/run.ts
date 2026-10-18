import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/graph-coloring/definition';
import {
  assertActive,
  countColorsUsed,
  effectiveColorLimit,
  markColoring,
  pack,
  smallestAvailableColor,
  type VisualState,
} from '../shared';
import {adjacency} from '../../../problems/graph-coloring/checker';
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {nodes} = input;
  const n = nodes.length;
  const chromatic = input.mode === 'chromatic';
  const k = effectiveColorLimit(input);
  const adj = adjacency(input);
  const degree = nodes.map((v) => nodes.filter((u) => adj.has(`${v}|${u}`)).length);
  const coloring: (number | null)[] = new Array(n).fill(null);
  let nextId = 0;
  let parent: number | null = null;
  let ok = true;
  rec.step(
    'init',
    chromatic
      ? 'Khởi tạo độ bão hoà của mọi đỉnh bằng 0; không giới hạn số màu (chế độ χ(G)).'
      : 'Khởi tạo độ bão hoà của mọi đỉnh bằng 0.',
    (d) => {
      markColoring(d, coloring);
    },
    [],
    'search',
  );
  for (let step = 0; step < n; step++) {
    assertActive(signal);
    let bestIdx = -1,
      bestSat = -1,
      bestDeg = -1;
    for (let i = 0; i < n; i++) {
      if (coloring[i] !== null) continue;
      const usedColors = new Set<number>();
      for (let j = 0; j < n; j++)
        if (coloring[j] !== null && adj.has(`${nodes[i]}|${nodes[j]}`)) usedColors.add(coloring[j] as number);
      const sat = usedColors.size;
      if (sat > bestSat || (sat === bestSat && degree[i] > bestDeg)) {
        bestIdx = i;
        bestSat = sat;
        bestDeg = degree[i];
      }
    }
    const i = bestIdx;
    rec.count('visit');
    rec.step(
      'pick',
      `Chọn đỉnh ${nodes[i]}: độ bão hoà ${bestSat}, bậc ${degree[i]}.`,
      (d) => {
        markColoring(d, coloring, nodes[i]);
      },
      [{target: `node-${nodes[i]}`, role: 'current'}],
      'search',
    );
    const c = smallestAvailableColor(adj, nodes, coloring, k, nodes[i]);
    const id = nextId++;
    if (c === null) {
      ok = false;
      rec.step(
        'fail',
        `Không còn màu nào trong ${k} màu khả dụng cho đỉnh ${nodes[i]}.`,
        (d) => {
          d.treeNodes.push({id, parent, label: `${nodes[i]}:x`, status: 'pruned', value: 0});
        },
        [{target: `node-${nodes[i]}`, role: 'rejected'}],
        'search',
      );
      break;
    }
    coloring[i] = c;
    rec.step(
      'assign',
      `Gán màu ${c} cho đỉnh ${nodes[i]}.`,
      (d) => {
        d.treeNodes.push({id, parent, label: `${nodes[i]}:${c}`, status: 'current', value: c});
        markColoring(d, coloring, nodes[i]);
      },
      [{target: `node-${nodes[i]}`, role: 'current'}],
      'search',
    );
    parent = id;
  }
  const colorsUsed = countColorsUsed(coloring);
  rec.step(
    'done',
    chromatic
      ? `Tô xong, dùng ${colorsUsed} màu — đây là chặn trên của χ(G), chưa chắc tối ưu.`
      : ok
        ? `Tô thành công với tối đa ${k} màu.`
        : 'Cách chọn màu này chưa tìm được cách tô với số màu đã cho.',
    (d) => {
      d.note = chromatic ? `Dùng ${colorsUsed} màu` : ok ? 'Tô thành công' : 'Thất bại';
    },
    [],
    'done',
  );
  return {...pack(ok ? (coloring as number[]) : null), heuristic: true, colorsUsed: ok ? colorsUsed : undefined};
}
