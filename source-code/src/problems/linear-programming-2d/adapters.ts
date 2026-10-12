import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
 problemId: 'linear-programming-2d',
 project: (_input, output) => output,
 metrics: [
  {id: 'value', label: 'Giá trị mục tiêu', better: 'higher'},
  {id: 'ms', label: 'Thời gian', better: 'lower'},
 ],
};
