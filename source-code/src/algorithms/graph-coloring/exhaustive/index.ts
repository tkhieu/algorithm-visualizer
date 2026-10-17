import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/graph-coloring/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run, SAFE_LIMIT} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';
/** Tổng công việc xấu nhất khi chế độ χ(G) thử lại toàn bộ với mọi k = 1..n. */
function chromaticWorstCase(n: number): number {
  let total = 0;
  for (let k = 1; k <= n; k++) total += Math.pow(k, n);
  return total;
}
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'graph-coloring/exhaustive',
  problemId: 'graph-coloring',
  title: 'Vét cạn mọi cách tô',
  chapter: 12,
  section: '12.1',
  page: 425,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: {time: 'O(kⁿ)', space: 'O(V)'},
  views: ['graph', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 6},
  /** Giới hạn an toàn: kⁿ ≤ 200.000 ở chế độ k-coloring (giữ nguyên ngưỡng gốc, chỉ đổi từ throw
   * sang "Không áp dụng"). Ở chế độ χ(G) phải thử lại cho mọi k = 1..n nên dùng tổng Σk^n ≤ cùng
   * ngưỡng — với n = 6 tổng này là 67.171 (an toàn), với n = 7 đã vượt 200.000 (823.543 ở hạng tử
   * k=7 một mình), khớp với ngưỡng "n ≤ 6" đã quan sát trong thực tế trước khi có precondition. */
  precondition(input) {
    const n = input.nodes.length;
    if ((input.mode ?? 'k-coloring') === 'chromatic') {
      const total = chromaticWorstCase(n);
      return total > SAFE_LIMIT
        ? `Không áp dụng: vét cạn tìm χ(G) chỉ an toàn khi Σk^n (k=1..n) ≤ ${SAFE_LIMIT.toLocaleString('vi-VN')} (đồ thị ${n} đỉnh cho tổng ${total.toLocaleString('vi-VN')}).`
        : undefined;
    }
    const total = Math.pow(input.colors, n);
    return total > SAFE_LIMIT
      ? `Không áp dụng: vét cạn chỉ an toàn khi kⁿ ≤ ${SAFE_LIMIT.toLocaleString('vi-VN')} (hiện tại ${input.colors}^${n} = ${total.toLocaleString('vi-VN')}).`
      : undefined;
  },
  initVisual,
  run,
};
