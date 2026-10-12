import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
export function reference({values,k}:Input):number{return [...values].sort((a,b)=>a-b)[k-1]}
export function check(input:Input,output:Output):Verdict{if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};return output.value===reference(input)?{ok:true}:{ok:false,reason:'Phần tử thứ k không đúng'}}
