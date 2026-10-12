import type { ComparisonAdapter } from '../../core/contracts';
import type { Input, Output } from './definition';
export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'dictionary-hashing',
  project: (_input, output) => output,
  metrics: [
    { id: 'probes', label: 'Số phép dò/thêm', better: 'lower' },
    { id: 'ms', label: 'Thời gian', better: 'lower' },
  ],
};
