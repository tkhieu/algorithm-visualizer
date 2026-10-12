import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
  problemId: 'tsp',
  project: (_input, output) => output,
  metrics: [
    {id: 'length', label: 'Độ dài hành trình', better: 'lower'},
    {id: 'ms', label: 'Thời gian', better: 'lower'},
  ],
};
