/// <reference lib="webworker" />
import {execute} from '../core/worker-protocol/execute';import type {RunRequest,RunResponse} from '../core/worker-protocol';import type {Step} from '../core/contracts';
let batch:Step[]=[];let last=performance.now();const send=()=>{if(batch.length){self.postMessage({type:'batch',steps:batch} satisfies RunResponse);batch=[];last=performance.now()}};
self.onmessage=async(event:MessageEvent<RunRequest>)=>{if(event.data.type!=='run')return;batch=[];last=performance.now();const result=await execute(event.data.algoId,event.data.input,true,step=>{batch.push(step);if(batch.length>=500||performance.now()-last>=16)send()});send();self.postMessage({type:'result',result} satisfies RunResponse)};
