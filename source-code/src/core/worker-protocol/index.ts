import type {RunResult,Step,OpName} from '../contracts';import type {Input,Output} from '../../problems/knapsack-01/definition';
export type RunRequest={type:'run';algoId:string;input:unknown};
export type RunResponse={type:'batch';steps:Step[]}|{type:'result';result:RunResult<Output>};
export type BenchRequest={type:'bench';algoId:string;input:unknown;warmup:number;repeats:number};
export type BenchResponse={type:'bench-result';result:RunResult<Output>;medianMs:number;counters:Record<OpName,number>};
export type WorkerInput=RunRequest|BenchRequest;
export const runTimeout=(algoId:string)=>algoId.endsWith('/exhaustive')?10000:5000;
export function issues(error:{issues:{path:PropertyKey[];message:string}[]}){return error.issues.map(x=>`${x.path.join('.')}: ${x.message}`)}
export type {Input};
