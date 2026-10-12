import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'matrix-multiplication',
  project: (_input, output) => output.matrix,
  metrics: [{ id: 'ms', label: 'Thời gian', better: 'lower' }]
};
