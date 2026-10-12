import type {Verdict} from '../../core/contracts';import {inputSchema,outputSchema,type Input,type Output} from './definition';
export function reference({weights}:Input):number{return weights.indexOf(9)}
export function check(input:Input,output:Output):Verdict{if(!inputSchema.safeParse(input).success)return {ok:false,reason:'Đầu vào không hợp lệ'};if(!outputSchema.safeParse(output).success)return {ok:false,reason:'Đầu ra sai định dạng'};return output.index===reference(input)?{ok:true}:{ok:false,reason:'Vị trí xu giả không đúng'}}
