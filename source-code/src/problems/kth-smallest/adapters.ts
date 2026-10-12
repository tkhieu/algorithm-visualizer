import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'kth-smallest',
  project: (_input, output) => output.value,
  metrics: [{ id: 'ms', label: 'Thời gian', better: 'lower' }]
};
