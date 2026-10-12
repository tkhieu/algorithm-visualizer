import type { ComparisonAdapter } from '../../core/contracts'
import type { Input, Output } from './definition'
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'stable-marriage',
  project: (_i, o) => ({ banDoiCuaNam: o.wifeOfMen }),
  metrics: [{ id: 'ms', label: 'Thời gian', better: 'lower' }],
}
