import {describe,it,expect} from 'vitest';import {algorithm} from './index';import {algorithm as backtracking} from '../backtracking/index';import {MetricsRecorder,TraceRecorder} from '../../../core/recorder';import {TraceStore} from '../../../core/trace/TraceStore';import {check} from '../../../problems/hamiltonian-circuit/checker';import {generate} from '../../../problems/hamiltonian-circuit/generators';
describe('hamiltonian-circuit/exhaustive',()=>{
 it('khớp với quay lui trên nhiều seed cỡ nhỏ/trung',()=>{
  for(let seed=1;seed<=40;seed++)for(const size of ['tiny','small','medium'] as const){
   const input=generate(seed,size);
   const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
   const reference=backtracking.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
   expect(check(input,output).ok,`seed ${seed} ${size}`).toBe(true);
   expect(output.found).toBe(reference.found);
  }
 });
 it('từ chối đồ thị vượt giới hạn an toàn',()=>{
  const big={nodes:Array.from({length:9},(_,i)=>`V${i}`),edges:[]};
  expect(()=>algorithm.run(big,{rec:new MetricsRecorder(),signal:new AbortController().signal})).toThrow();
 });
 it('trace tua lại đúng và khớp output cuối',()=>{
  const input={nodes:['A','B','C','D'],edges:[{from:'A',to:'B'},{from:'B',to:'C'},{from:'C',to:'D'},{from:'D',to:'A'}]};
  const rec=new TraceRecorder(algorithm.initVisual(input),new Set(algorithm.pseudocode.map(l=>l.id)),algorithm.traceLimit);
  const output=algorithm.run(input,{rec,signal:new AbortController().signal});
  expect(rec.truncated).toBe(false);
  const store=new TraceStore(algorithm.initVisual(input));
  for(const step of rec.steps)store.append(step);
  const final=store.seek(rec.steps.length);
  const pathEdges=final.edges.filter(e=>e.role==='path').length;
  expect(pathEdges).toBe(output.circuit.length);
  expect(rec.steps.some(s=>s.explain.includes('chu trình'))).toBe(true);
 });
});
