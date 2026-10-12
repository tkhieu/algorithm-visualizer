import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'gcd',
  project: (_input, output) => output.gcd,
  metrics: [{ id: 'ms', label: 'Thời gian', better: 'lower' }]
};
