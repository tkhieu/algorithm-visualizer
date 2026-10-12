import {benchWorker} from '../worker-protocol/client';
export async function benchPool(jobs:{id:string;algoId:string;input:unknown}[],onResult:(id:string,result:Awaited<ReturnType<typeof benchWorker>>)=>void){
 let next=0;
 const count=Math.max(1,(navigator.hardwareConcurrency||2)-1);
 await Promise.all(Array.from({length:Math.min(count,jobs.length)},async()=>{
  while(next<jobs.length){
   const job=jobs[next++];
   const result=await benchWorker(job.algoId,job.input);
   onResult(job.id,result);
  }
 }));
}
