import type {ComparisonAdapter} from '../../core/contracts';
import type {Input, Output} from './definition';

export const adapter: ComparisonAdapter<Input, Output> = {
 problemId: 'coin-collecting',
 project: (_input, output) => output,
 metrics: [
  {id: 'value', label: 'Số đồng xu', better: 'higher'},
  {id: 'ms', label: 'Thời gian', better: 'lower'},
 ],
};
