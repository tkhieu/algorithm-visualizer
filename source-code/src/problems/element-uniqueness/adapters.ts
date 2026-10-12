import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'element-uniqueness',
  project: (_input, output) => output,
  metrics: [
    { id: 'ops', label: 'Phép so sánh', better: 'lower' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
