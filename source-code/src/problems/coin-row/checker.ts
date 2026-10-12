import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';
// Weighted independent set on a bipartite path = total weight minus minimum vertex cover.
// Compute the cover through an s-t minimum cut, independent of the row DP recurrence.
export function optimum(values: number[]): number {
  const n = values.length,
    source = n,
    sink = n + 1;
  const capacity = Array.from({ length: n + 2 }, () => new Array<number>(n + 2).fill(0));
  const total = values.reduce((sum, value) => sum + value, 0);
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      capacity[source][i] = values[i];
      for (const j of [i - 1, i + 1]) if (j >= 0 && j < n) capacity[i][j] = total + 1;
    } else capacity[i][sink] = values[i];
  }
  let flow = 0;
  while (true) {
    const parent = new Array<number>(n + 2).fill(-1);
    parent[source] = source;
    const queue = [source];
    for (let head = 0; head < queue.length && parent[sink] < 0; head++) {
      const u = queue[head];
      for (let v = 0; v < n + 2; v++) {
        if (parent[v] < 0 && capacity[u][v] > 0) {
          parent[v] = u;
          queue.push(v);
        }
      }
    }
    if (parent[sink] < 0) break;
    let pushed = Infinity;
    for (let v = sink; v !== source; v = parent[v]) pushed = Math.min(pushed, capacity[parent[v]][v]);
    for (let v = sink; v !== source; v = parent[v]) {
      capacity[parent[v]][v] -= pushed;
      capacity[v][parent[v]] += pushed;
    }
    flow += pushed;
  }
  return total - flow;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const sel = output.selected;
  if (new Set(sel).size !== sel.length || sel.some((i) => i >= input.values.length))
    return { ok: false, reason: 'Chỉ số đồng xu trùng hoặc ngoài phạm vi' };
  const sorted = [...sel].sort((a, b) => a - b);
  for (let k = 0; k + 1 < sorted.length; k++)
    if (sorted[k + 1] - sorted[k] < 2) return { ok: false, reason: 'Có hai đồng xu liền kề cùng được chọn' };
  const sum = sel.reduce((s, i) => s + input.values[i], 0);
  if (sum !== output.value) return { ok: false, reason: 'Tổng giá trị không khớp với tập chọn' };
  const best = optimum(input.values);
  return { ok: true, optimal: output.value === best, score: output.value, ratio: best === 0 ? 1 : output.value / best };
}
