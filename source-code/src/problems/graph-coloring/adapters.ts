import type {ComparisonAdapter} from '../../core/contracts';import type {Input,Output} from './definition';
export const adapter:ComparisonAdapter<Input,Output>={problemId:'graph-coloring',project:(_input,output)=>output,metrics:[{id:'found',label:'Tô được',better:'higher'},{id:'ms',label:'Thời gian',better:'lower'}]};
