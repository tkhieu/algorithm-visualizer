import type {ComparisonAdapter} from '../../core/contracts';import type {Input,Output} from './definition';
export const adapter:ComparisonAdapter<Input,Output>={problemId:'root-finding',project:(_input,output)=>output.root,metrics:[{id:'ms',label:'Thời gian',better:'lower'}]};
