import {describe,it,expect} from 'vitest';import {algorithm} from './index';import {algorithm as backtracking} from '../backtracking/index';import {MetricsRecorder,TraceRecorder} from '../../../core/recorder';import {TraceStore} from '../../../core/trace/TraceStore';import {check} from '../../../problems/n-queens/checker';
describe('n-queens/exhaustive',()=>{
 it('đúng và khớp found với quay lui trên n=1..6',()=>{
  for(let n=1;n<=6;n++){
   const output=algorithm.run({n},{rec:new MetricsRecorder(),signal:new AbortController().signal});
   const reference=backtracking.run({n},{rec:new MetricsRecorder(),signal:new AbortController().signal});
   expect(check({n},output).ok,`n=${n}`).toBe(true);
   expect(output.found).toBe(reference.found);
  }
 });
 it('từ chối n vượt giới hạn an toàn',()=>{
  expect(()=>algorithm.run({n:10},{rec:new MetricsRecorder(),signal:new AbortController().signal})).toThrow();
 });
 it('trace tua lại đúng và khớp output cuối trên n=4',()=>{
  const input={n:4};
  const rec=new TraceRecorder(algorithm.initVisual(input),new Set(algorithm.pseudocode.map(l=>l.id)),algorithm.traceLimit);
  const output=algorithm.run(input,{rec,signal:new AbortController().signal});
  expect(rec.truncated).toBe(false);
  const store=new TraceStore(algorithm.initVisual(input));
  for(const step of rec.steps)store.append(step);
  const final=store.seek(rec.steps.length);
  const placed=final.marks.filter(m=>m.role==='queen').map(m=>m.col);
  expect(placed).toEqual(output.positions);
  expect(rec.steps.some(s=>s.explain.includes('nghiệm'))).toBe(true);
 });
});
