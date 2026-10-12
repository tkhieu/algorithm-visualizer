import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'convex-hull',
  project: (_input, output) => output,
  metrics: [
    { id: 'size', label: 'Số đỉnh bao lồi', better: 'lower' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
