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
  traceLimit: {...limits, maxInputSize: 9},
  /** Giới hạn an toàn do người làm chọn, đo lại bằng benchmark sau khi phát hiện quay lui (và
   * ngưỡng n ≤ 22 cũ) không an toàn với MỌI thứ tự đỉnh: loại nhánh khi gặp xung đột chỉ cắt cây
   * tìm kiếm khi gặp vài đỉnh "tự do" (không cạnh, hoặc nói chung không quyết định được tính khả
   * thi) xen trước một lõi khó (ví dụ một clique Kₖ₊₁ không thể tô bằng k màu) — quay lui vẫn thử
   * lại TOÀN BỘ tổ hợp màu của các đỉnh tự do mỗi khi lõi phía sau thất bại, cho dù màu của đỉnh tự
   * do không ảnh hưởng gì đến lõi. Đã đo trên máy làm việc (K_{k+1} + (n−k−1) đỉnh cô lập trước
   * lõi, lõi đứng trước hoặc sau, k = 2..10):
   *   n=9 : xấu nhất 45,6 ms (k=8, lõi K9, không đỉnh cô lập)
   *   n=10: xấu nhất 429  ms (k=9, lõi K10)
   *   n=11: xấu nhất 4885 ms (k=10, lõi K11) — đã sát ngưỡng timeout worker (5 s)
   * Chọn n ≤ 9 để còn dư khoảng 20× so với 1 s ngay cả trên máy chậm hơn máy benchmark, thay vì
   * n ≤ 22 cũ (chỉ benchmark theo một thứ tự, không phải mọi thứ tự). `existsColoring` (oracle của
   * checker.ts) đã benchmark riêng và không có cùng vấn đề này ở bất kỳ n nào thử ở trên (luôn
   * dưới 3 ms) nhờ cách liệt kê theo lớp xử lý clique tối ưu ngay từ đầu, nên không cần giảm thêm
   * CHROMATIC_ORACLE_MAX_N. Ở chế độ χ(G), chặn dưới (clique tham lam) và chặn trên (DSATUR) khớp
   * chính xác cho đúng cấu trúc "clique + đỉnh cô lập" này (đã benchmark tới n=12, luôn < 1 ms) nên
   * giữ ngưỡng n ≤ 12 riêng cho chế độ đó. */
  precondition(input) {
    const n = input.nodes.length;
    if ((input.mode ?? 'k-coloring') === 'chromatic')
      return n > 12
        ? `Không áp dụng: quay lui tìm χ(G) chỉ an toàn với đồ thị ≤ 12 đỉnh (đồ thị hiện có ${n} đỉnh).`
        : undefined;
    return n > 9
      ? `Không áp dụng: quay lui chỉ an toàn với đồ thị ≤ 9 đỉnh ở chế độ k-coloring, vì thứ tự đỉnh ` +
          `xấu (ví dụ nhiều đỉnh cô lập trước một clique không tô được) có thể khiến nó thử lại toàn ` +
          `bộ tổ hợp màu của các đỉnh không liên quan (đồ thị hiện có ${n} đỉnh).`
      : undefined;
  },
  initVisual,
  run,
};
