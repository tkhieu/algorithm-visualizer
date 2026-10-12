import type {ComparisonAdapter} from '../../core/contracts';import type {Input,Output} from './definition';
export const adapter:ComparisonAdapter<Input,Output>={problemId:'combinatorial-generation',project:(_input,output)=>({loai:output.kind,soLuong:output.objects.length,doiTuong:output.objects}),metrics:[{id:'ms',label:'Thời gian',better:'lower'}]};
