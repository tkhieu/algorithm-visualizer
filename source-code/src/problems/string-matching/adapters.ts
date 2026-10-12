import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'string-matching',
  project: (_input, output) => output,
  metrics: [
    { id: 'count', label: 'Số vị trí khớp', better: 'higher' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
