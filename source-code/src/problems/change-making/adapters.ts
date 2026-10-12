import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
 problemId: 'change-making',
 project: (_input, output) => output,
 metrics: [
  {id: 'count', label: 'Số đồng xu', better: 'lower'},
  {id: 'ms', label: 'Thời gian', better: 'lower'},
 ],
};
