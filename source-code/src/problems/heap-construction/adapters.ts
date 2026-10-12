import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'heap-construction',
  project: (_input, output) => output,
  metrics: [
    { id: 'swaps', label: 'Số lần đổi chỗ', better: 'lower' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
