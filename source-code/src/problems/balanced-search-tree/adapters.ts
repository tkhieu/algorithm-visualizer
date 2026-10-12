import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'balanced-search-tree',
  project: (_input, output) => output,
  metrics: [
    { id: 'height', label: 'Độ cao', better: 'lower' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
