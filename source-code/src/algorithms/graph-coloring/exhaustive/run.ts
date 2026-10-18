import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/graph-coloring/definition';
import {assertActive, markColoring, pack, type VisualState} from '../shared';
import {adjacency, connected} from '../../../problems/graph-coloring/checker';
/** Ngưỡng an toàn do người làm chọn cho kⁿ (xem `precondition` trong index.ts để biết cách dùng ở
 * chế độ k-coloring và chế độ χ(G)). */
export const SAFE_LIMIT = 200000;
/** Một lượt vét cạn đầy đủ cho một giá trị k cố định, với root/id riêng của lượt đó. */
function bruteForceForK(
  nodes: string[],
  adj: Set<string>,
  k: number,
  rootId: number,
  nextIdRef: {id: number},
  rec: RunContext<VisualState>['rec'],
  signal: AbortSignal,
): number[] | null {
  const n = nodes.length;
  let found: number[] | null = null;
  const coloring: number[] = new Array(n).fill(0);
  function assign(v: number, parent: number): boolean {
    assertActive(signal);
    for (let c = 0; c < k; c++) {
      rec.count('visit');
      coloring[v] = c;
      const id = nextIdRef.id++;
      rec.step(
        'assign',
        `Gán màu ${c} cho đỉnh ${nodes[v]}.`,
        (d) => {
          d.treeNodes.push({id, parent, label: `${nodes[v]}:${c}`, status: 'current', value: 0});
          const tentative = coloring.map((value, index) => (index <= v ? value : null));
          markColoring(d, tentative, nodes[v]);
        },
        [{target: `node-${nodes[v]}`, role: 'current'}],
        'search',
      );
      if (v === n - 1) {
        rec.count('compare');
        let ok = true;
        for (let i = 0; i < n && ok; i++)
          for (let j = i + 1; j < n && ok; j++)
            if (connected(adj, nodes[i], nodes[j]) && coloring[i] === coloring[j]) ok = false;
        rec.step(
          'check',
          ok
            ? `Cách tô ${coloring.join(',')} hợp lệ — nghiệm.`
            : `Cách tô ${coloring.join(',')} có hai đỉnh kề cùng màu.`,
          (d) => {
            const node = d.treeNodes.find((x) => x.id === id);
            if (node) node.status = ok ? 'best' : 'done';
            if (ok) markColoring(d, coloring);
          },
          [],
          'leaf',
        );
        if (ok) {
          found = coloring.slice();
          return true;
        }
        continue;
      }
      if (assign(v + 1, id)) return true;
    }
    return false;
  }
  assign(0, rootId);
  return found;
}

function runChromatic(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {nodes} = input;
  const n = nodes.length;
  const adj = adjacency(input);
  const nextIdRef = {id: 0};
  for (let k = 1; k <= n; k++) {
    const rootId = nextIdRef.id++;
    rec.step(
      'tryK',
      `Thử k = ${k}: vét cạn mọi cách tô ${n} đỉnh bằng ${k} màu.`,
      (d) => {
        d.treeNodes.push({id: rootId, parent: null, label: `k=${k}`, status: 'current', value: k});
      },
      [],
      'search',
    );
    const result = bruteForceForK(nodes, adj, k, rootId, nextIdRef, rec, signal);
    if (result) {
      rec.step(
        'foundChromatic',
        `k = ${k} khả thi — đây chính là χ(G) (mọi k < ${k} đã bị vét cạn chứng minh vô nghiệm).`,
        (d) => {
          const root = d.treeNodes.find((x) => x.id === rootId);
          if (root) root.status = 'best';
          markColoring(d, result);
          d.note = `χ(G) = ${k}`;
        },
        [],
        'done',
      );
      return {found: true, coloring: result, colorsUsed: k, chromaticExact: true};
    }
    rec.step(
      'tryK',
      `k = ${k} không khả thi — tăng k và thử lại.`,
      (d) => {
        const root = d.treeNodes.find((x) => x.id === rootId);
        if (root) root.status = 'done';
      },
      [],
      'search',
    );
  }
  // Không thể xảy ra: k = n luôn khả thi (mỗi đỉnh một màu riêng).
  return {found: false, coloring: []};
}

export function run(input: Input, ctx: RunContext<VisualState>): Output {
  const {rec, signal} = ctx;
  const {nodes} = input;
  const n = nodes.length;
  if (n === 0) {
    rec.step('done', 'Đồ thị rỗng có cách tô rỗng hợp lệ.', (d) => {
      markColoring(d, []);
      d.note = 'Tô thành công';
    }, [], 'done');
    return (input.mode === 'chromatic' ? {found: true, coloring: [], colorsUsed: 0, chromaticExact: true} : pack([]));
  }
  if (input.mode === 'chromatic') return runChromatic(input, ctx);
  const {colors: k} = input;
  const adj = adjacency(input);
  const nextIdRef = {id: 0};
  const rootId = nextIdRef.id++;
  rec.step(
    'init',
    `Sinh mọi cách tô ${n} đỉnh bằng ${k} màu.`,
    (d) => {
      d.treeNodes.push({id: rootId, parent: null, label: '∅', status: 'current', value: 0});
    },
    [],
    'search',
  );
  const found = bruteForceForK(nodes, adj, k, rootId, nextIdRef, rec, signal);
  rec.step(
    'done',
    found ? 'Hoàn tất: tìm được cách tô hợp lệ.' : 'Hoàn tất: đã thử hết mọi cách, không thể tô.',
    (d) => {
      if (found) markColoring(d, found);
      d.note = found ? 'Tô thành công' : 'Không thể tô';
    },
    [],
    'done',
  );
  return pack(found);
}
