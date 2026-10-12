import {loadAlgorithm,loadProblem} from '../../catalog/registry';
import {TraceRecorder,MetricsRecorder} from '../recorder';
import type {RunResult,Step} from '../contracts';
import {issues} from './index';
import {estimateSize} from '../../lib/estimate-size';

export async function execute(algoId:string,raw:unknown,tracing:boolean,onStep?:(step:Step)=>void):Promise<RunResult<unknown>>{
 const problemId=algoId.split('/')[0];
 const problem=await loadProblem(problemId);
 if(!problem)return {status:'error',message:'Bài toán không tồn tại'};
 const parsed=problem.inputSchema.safeParse(raw);
 if(!parsed.success)return {status:'invalid-input',issues:issues(parsed.error)};
 const algo=await loadAlgorithm(algoId);
 if(!algo)return {status:'error',message:'Thuật toán không tồn tại'};
 const input=parsed.data;
 const reason=algo.precondition?.(input);
 if(reason)return {status:'not-applicable',reason};
 const rec=tracing
  ?new TraceRecorder(algo.initVisual(input),new Set(algo.pseudocode.map(x=>x.id)),algo.traceLimit,onStep)
  :new MetricsRecorder<ReturnType<typeof algo.initVisual>>();
 if(rec instanceof TraceRecorder){
  const size=estimateSize(input);
  if(size>algo.traceLimit.maxInputSize)rec.truncated=true;
 }
 try{
  const t=performance.now();
  const output=algo.run(input,{rec,signal:new AbortController().signal});
  const ms=performance.now()-t;
  return {status:'ok',output,verdict:problem.check(input,output),counters:rec.counters,ms,truncated:rec instanceof TraceRecorder?rec.truncated:false};
 }catch(e){
  return {status:'error',message:e instanceof Error?e.message:String(e)};
 }
}
