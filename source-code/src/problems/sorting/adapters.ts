import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'sorting',
  project: (_input, output) => output,
  metrics: [
    { id: 'ops', label: 'Phép so sánh + đổi chỗ', better: 'lower' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
