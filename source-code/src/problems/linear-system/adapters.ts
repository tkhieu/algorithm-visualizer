import type {ComparisonAdapter} from '../../core/contracts';import type {Input,Output} from './definition';
export const adapter:ComparisonAdapter<Input,Output>={problemId:'linear-system',project:(_input,output)=>output.solution,metrics:[{id:'ms',label:'Thời gian',better:'lower'}]};
