import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'lcs',
  project: (_input, output) => output,
  metrics: [
    {id: 'length', label: 'Độ dài LCS', better: 'higher'},
    {id: 'ms', label: 'Thời gian', better: 'lower'},
  ],
};
