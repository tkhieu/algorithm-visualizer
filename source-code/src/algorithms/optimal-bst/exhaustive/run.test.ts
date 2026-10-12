import {it,expect} from 'vitest';
import {algorithm} from './index';
import {check,optimum} from '../../../problems/optimal-bst/checker';
import {generate} from '../../../problems/optimal-bst/generators';
import {traceRun} from '../test-utils';
import {MetricsRecorder} from '../../../core/recorder';

it('đúng với công thức quy hoạch động tham chiếu trên 150 seed',()=>{
 for(let seed=1;seed<=150;seed++){
  const input=generate(seed,'small');
  const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
  expect(output.cost).toBe(optimum(input.freq));
  expect(check(input,output)).toMatchObject({ok:true,optimal:true});
 }
});

it('ví dụ Levitin 4 khoá cho chi phí 170',()=>{
 const output=algorithm.run({freq:[10,20,40,30]},{rec:new MetricsRecorder(),signal:new AbortController().signal});
 expect(output.cost).toBe(170);
});

it('trace tua lại đúng trên dãy nhỏ: nodes cuối khớp số khoá',()=>{
 for(let seed=1;seed<=20;seed++){
  const input=generate(seed,'tiny');
  const {final}=traceRun(algorithm,input);
  expect(final.nodes.length).toBe(input.freq.length);
 }
});

it('bước thử gốc có giải thích tiếng Việt',()=>{
 const {steps}=traceRun(algorithm,{freq:[10,20,40,30]});
 const tryStep=steps.find(s=>s.lineId==='try');
 expect(tryStep?.explain).toContain('Thử mọi gốc');
});
