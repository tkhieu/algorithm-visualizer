import {it,expect} from 'vitest';
import {algorithm} from './index';
import {check,optimum} from '../../../problems/coin-collecting/checker';
import {generate} from '../../../problems/coin-collecting/generators';
import {traceRun} from '../test-utils';
import {MetricsRecorder} from '../../../core/recorder';

it('đúng với công thức quy hoạch động tham chiếu trên 150 seed',()=>{
 for(let seed=1;seed<=150;seed++){
  const input=generate(seed,'small');
  const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
  expect(output.value).toBe(optimum(input.grid));
  expect(check(input,output)).toMatchObject({ok:true,optimal:true});
 }
});

it('lưới 1x1 trả về đúng',()=>{
 const output=algorithm.run({grid:[[true]]},{rec:new MetricsRecorder(),signal:new AbortController().signal});
 expect(output).toEqual({value:1,path:[[0,0]]});
});

it('trace tua lại đúng trên lưới nhỏ: đường đi hợp lệ',()=>{
 for(let seed=1;seed<=20;seed++){
  const input=generate(seed,'tiny');
  const {output}=traceRun(algorithm,input);
  expect(check(input,output)).toMatchObject({ok:true});
 }
});

it('bước thăm ô có giải thích tiếng Việt',()=>{
 const {steps}=traceRun(algorithm,{grid:[[false,true],[true,false]]});
 const visitStep=steps.find(s=>s.lineId==='visit');
 expect(visitStep?.explain).toContain('Thăm ô');
});
