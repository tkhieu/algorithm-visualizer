import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/graph-coloring/definition';
import {assertActive, dsaturUpperBound, greedyCliqueLowerBound, markColoring, pack, type VisualState} from '../shared';
import {adjacency, connected} from '../../../problems/graph-coloring/checker';

/** Một lượt quay lui đầy đủ cho một giá trị k cố định — dùng lại nguyên vẹn ở chế độ k-coloring
 * (một lượt duy nhất) và ở chế độ chromatic (gọi lại với k tăng dần, mỗi lượt là một cây con riêng
 * trong state-space-tree, nối vào một root riêng của lượt đó). */
function solveForK(
  nodes: string[],
  adj: Set<string>,
  k: number,
  rootId: number,
  nextIdRef: {id: number},
  rec: RunContext<VisualState>['rec'],
  signal: AbortSignal,
): number[] | null {
  const n = nodes.length;
  const coloring: (number | null)[] = new Array(n).fill(null);
  const nodeAtDepth: number[] = [];
  let found: number[] | null = null;
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
      const id = nextIdRef.id++;
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
          markColoring(d, coloring);
        },
        [],
        'search',
      );
    }
    return false;
  }
  solve(0);
  return found;
}

function runChromatic(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {nodes} = input;
  const n = nodes.length;
  const adj = adjacency(input);
  const nextIdRef = {id: 0};
  if (n === 0) {
    rec.step('done', 'Đồ thị rỗng: χ(G) = 0.', (d) => {
      markColoring(d, []);
      d.note = 'χ(G) = 0';
    }, [], 'done');
    return {found: true, coloring: [], colorsUsed: 0, chromaticExact: true};
  }
  const clique = greedyCliqueLowerBound(input);
  const lowerBound = Math.max(1, clique.length);
  rec.step(
    'lowerBound',
    clique.length > 1
      ? `Chặn dưới: tìm được một clique {${clique.join(', ')}} ⇒ χ(G) ≥ ${lowerBound}.`
      : `Không tìm được clique lớn hơn 1 đỉnh ⇒ chặn dưới mặc định χ(G) ≥ ${lowerBound}.`,
    (d) => {
      d.note = `Chặn dưới ${lowerBound}`;
    },
    clique.map((v) => ({target: `node-${v}`, role: 'current'})),
    'search',
  );
  const upperBound = Math.max(lowerBound, dsaturUpperBound(input));
  rec.step(
    'upperBound',
    `Chặn trên: DSATUR tô xong bằng ${upperBound} màu ⇒ χ(G) ≤ ${upperBound}.`,
    (d) => {
      d.note = `Chặn trên ${upperBound}`;
    },
    [],
    'search',
  );
  for (let k = lowerBound; k <= upperBound; k++) {
    const rootId = nextIdRef.id++;
    rec.step(
      'tryK',
      `Thử k = ${k}.`,
      (d) => {
        d.treeNodes.push({id: rootId, parent: null, label: `k=${k}`, status: 'current', value: k});
      },
      [],
      'search',
    );
    const result = solveForK(nodes, adj, k, rootId, nextIdRef, rec, signal);
    if (result) {
      rec.step(
        'foundChromatic',
        `k = ${k} khả thi — đây chính là χ(G) (mọi k < ${k} đã bị quay lui chứng minh vô nghiệm).`,
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
  // Không thể xảy ra: k = n luôn khả thi (mỗi đỉnh một màu riêng), nên upperBound ≥ n sẽ luôn tìm được nghiệm.
  return {found: false, coloring: []};
}

export function run(input: Input, ctx: RunContext<VisualState>): Output {
  if (input.mode === 'chromatic') return runChromatic(input, ctx);
  const {rec, signal} = ctx;
  const {nodes, colors: k} = input;
  const n = nodes.length;
  if (n === 0) {
    rec.step('done', 'Đồ thị rỗng có cách tô rỗng hợp lệ.', (d) => {
      markColoring(d, []);
      d.note = 'Tô thành công';
    }, [], 'done');
    return pack([]);
  }
  const adj = adjacency(input);
  const nextIdRef = {id: 0};
  const rootId = nextIdRef.id++;
  rec.step(
    'init',
    `Tô ${n} đỉnh theo thứ tự cho sẵn.`,
    (d) => {
      d.treeNodes.push({id: rootId, parent: null, label: '∅', status: 'current', value: 0});
      markColoring(d, new Array(n).fill(null));
    },
    [],
    'search',
  );
  const found = solveForK(nodes, adj, k, rootId, nextIdRef, rec, signal);
  rec.step(
    'done',
    found ? 'Tô thành công với số màu đã cho.' : 'Đã thử hết mọi khả năng — không thể tô.',
    (d) => {
      d.note = found ? 'Tô thành công' : 'Không thể tô';
    },
    [],
    'done',
  );
  return pack(found);
}
