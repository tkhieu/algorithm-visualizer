import type { ComparisonAdapter } from '../../core/contracts'
import type { Input, Output } from './definition'
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'topological-sort',
  project: (_i, o) => o.order,
  metrics: [{ id: 'ms', label: 'Thời gian', better: 'lower' }],
}
