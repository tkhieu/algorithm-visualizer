import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
 problemId: 'closest-pair',
 project: (_input, output) => output,
 metrics: [
  {id: 'distance', label: 'Khoảng cách', better: 'lower'},
  {id: 'ms', label: 'Thời gian', better: 'lower'},
 ],
};
