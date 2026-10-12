import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'matrix-chain',
  project: (_input, output) => output,
  metrics: [
    {id: 'cost', label: 'Số phép nhân', better: 'lower'},
    {id: 'ms', label: 'Thời gian', better: 'lower'},
  ],
};
