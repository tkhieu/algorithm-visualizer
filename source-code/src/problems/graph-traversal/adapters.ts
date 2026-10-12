import type { ComparisonAdapter } from '../../core/contracts'
import type { Input, Output } from './definition'
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'graph-traversal',
  project: (_i, o) => ({ soDinh: o.order.length, thuTu: o.order }),
  metrics: [{ id: 'ms', label: 'Thời gian', better: 'lower' }],
}
