import type { ComparisonAdapter } from '../../core/contracts'
import type { Input, Output } from './definition'
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'single-source-shortest-path',
  project: (input, output) => ({
    phamVi: input.edges.every((e) => e[2] === 1)
      ? 'Đồ thị không trọng số: cả hai thuật toán'
      : 'Đồ thị có trọng số: chỉ Dijkstra áp dụng',
    khoangCach: output.distance,
  }),
  metrics: [{ id: 'ms', label: 'Thời gian', better: 'lower' }],
}
