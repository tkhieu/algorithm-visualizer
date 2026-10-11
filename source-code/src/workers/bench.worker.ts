/// <reference lib="webworker" />
import {execute} from '../core/worker-protocol/execute';
import type {BenchRequest,BenchResponse} from '../core/worker-protocol';
const zeros={compare:0,swap:0,assign:0,visit:0,relax:0,prune:0,hash:0,recurse:0};
self.onmessage=async(event:MessageEvent<BenchRequest>)=>{const {algoId,input}=event.data;const result=await execute(algoId,input,false);self.postMessage({type:'bench-result',result,medianMs:result.status==='ok'?result.ms:0,counters:result.status==='ok'?result.counters:zeros} satisfies BenchResponse)};
