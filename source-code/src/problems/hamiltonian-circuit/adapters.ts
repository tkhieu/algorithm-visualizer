import type {ComparisonAdapter} from '../../core/contracts';import type {Input,Output} from './definition';
export const adapter:ComparisonAdapter<Input,Output>={problemId:'hamiltonian-circuit',project:(_input,output)=>output,metrics:[{id:'found',label:'Có chu trình',better:'higher'},{id:'ms',label:'Thời gian',better:'lower'}]};
