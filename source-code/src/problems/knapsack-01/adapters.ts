import type {ComparisonAdapter} from '../../core/contracts';import type {Input,Output} from './definition';
export const adapter:ComparisonAdapter<Input,Output>={problemId:'knapsack-01',project:(_input,output)=>output,metrics:[{id:'value',label:'Giá trị',better:'higher'},{id:'ms',label:'Thời gian',better:'lower'}]};
