import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
 problemId: 'optimal-bst',
 project: (_input, output) => output,
 metrics: [
  {id: 'cost', label: 'Chi phí', better: 'lower'},
  {id: 'ms', label: 'Thời gian', better: 'lower'},
 ],
};
