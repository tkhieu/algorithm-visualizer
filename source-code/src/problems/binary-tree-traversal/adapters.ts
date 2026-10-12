import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'binary-tree-traversal',
  project: (_input, output) => output,
  metrics: [
    { id: 'visits', label: 'Số đỉnh thăm', better: 'lower' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
