import type { Patch } from 'immer';
import type { z } from 'zod';
export type SizeClass='tiny'|'small'|'medium'|'large';
export type CaseGroup='normal'|'edge'|'small'|'large'|'special'|'invalid';
export interface TestCase<I>{id:string;name:string;group:CaseGroup;input:I|unknown;expected?:unknown;note?:string}
export type Verdict={ok:true;optimal?:boolean;score?:number;ratio?:number}|{ok:false;reason:string};
export interface Problem<I,O>{id:string;title:string;statement:string;inputSchema:z.ZodType<I>;outputSchema:z.ZodType<O>;constraints:string[];generate(seed:number,size:SizeClass):I;cases:TestCase<I>[];check(input:I,output:O):Verdict;objective?:{sense:'min'|'max';score(input:I,output:O):number}}
// ~10 view kind dùng chung cho toàn bộ catalog. Mỗi algorithm chỉ khai báo kind nào nó dùng được;
// shape chi tiết của state cho mỗi kind nằm ở src/visualizers/<kind>/index.tsx (xem docs/adding-an-algorithm.md).
export type VisualKind='matrix'|'state-space-tree'|'items'|'array-bars'|'graph'|'tree'|'string-align'|'points-2d'|'numeric-plot'|'hash-table'|'sequence'|'board';
export type OpName='compare'|'swap'|'assign'|'visit'|'relax'|'prune'|'hash'|'recurse';
export const opNames:OpName[]=['compare','swap','assign','visit','relax','prune','hash','recurse'];
// role không khép kín thành enum: mỗi visualizer tự định nghĩa vai trò đánh dấu riêng (compare/swap/pivot/visited/...).
export type Mark={target:string;role:string};
export type Legend=Record<string,string>;
export interface Step{seq:number;lineId:string;explain:string;marks:Mark[];patches:Patch[];inverse:Patch[];phase?:string}
export interface Recorder<V>{readonly tracing:boolean;step(lineId:string,explain:string,mutate:(draft:V)=>void,marks?:Mark[],phase?:string):void;count(op:OpName,n?:number):void}
export interface RunContext<V>{rec:Recorder<V>;signal:AbortSignal}
export interface Algorithm<I,O,V>{id:string;problemId:string;title:string;chapter:number;section:string;page?:number;technique:string;exactness:'exact'|'approximate'|'heuristic';complexity:{time:string;space:string};views:VisualKind[];pseudocode:{id:string;text:string;indent:number}[];legend?:Legend;traceLimit:{maxInputSize:number;maxSteps:number;maxBytes:number};initVisual(input:I):V;run(input:I,ctx:RunContext<V>):O}
export type RunResult<O>={status:'ok';output:O;verdict:Verdict;counters:Record<OpName,number>;ms:number;truncated:boolean}|{status:'invalid-input';issues:string[]}|{status:'timeout'|'cancelled'}|{status:'error';message:string};
export interface ComparisonAdapter<I,O,Q=unknown>{problemId:string;query?:z.ZodType<Q>;project(input:I,output:O,query?:Q):unknown;metrics:{id:string;label:string;better:'higher'|'lower'}[]}
