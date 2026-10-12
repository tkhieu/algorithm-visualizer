import type {ComparisonAdapter} from '../../core/contracts';import type {Input,Output} from './definition';
export const adapter:ComparisonAdapter<Input,Output>={problemId:'search-sorted',project:(_input,output)=>output.index,metrics:[{id:'ms',label:'Thời gian',better:'lower'}]};
