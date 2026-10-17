import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/graph-coloring/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'graph-coloring/backtracking',
  problemId: 'graph-coloring',
  title: 'Quay lui',
  chapter: 12,
  section: '12.1',
  page: 425,
  technique: 'backtracking',
  exactness: 'exact',
  complexity: {time: 'O(kⁿ) xấu nhất', space: 'O(V)'},
  views: ['graph', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 22},
  /** Giới hạn an toàn do người làm chọn: quay lui vẫn là O(kⁿ) xấu nhất, nhưng việc loại nhánh khi
   * gặp xung đột thường cắt phần lớn cây tìm kiếm trong thực tế, nên cho một ngưỡng n rộng hơn vét
   * cạn. Ở chế độ χ(G) phải thử lại toàn bộ cho nhiều giá trị k liên tiếp (tới chặn trên DSATUR) nên
   * ngưỡng n thấp hơn để tránh treo trình duyệt. */
  precondition(input) {
    const n = input.nodes.length;
    if ((input.mode ?? 'k-coloring') === 'chromatic')
      return n > 12
        ? `Không áp dụng: quay lui tìm χ(G) chỉ an toàn với đồ thị ≤ 12 đỉnh (đồ thị hiện có ${n} đỉnh).`
        : undefined;
    return n > 22
      ? `Không áp dụng: quay lui chỉ an toàn với đồ thị ≤ 22 đỉnh ở chế độ k-coloring (đồ thị hiện có ${n} đỉnh).`
      : undefined;
  },
  initVisual,
  run,
};
