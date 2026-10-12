import {it,expect} from 'vitest';
import {algorithm} from './index';
import {check} from '../../../problems/closest-pair/checker';
import {generate} from '../../../problems/closest-pair/generators';
import {traceRun} from '../test-utils';
import {MetricsRecorder} from '../../../core/recorder';

it('đúng với vét cạn tham chiếu trên 150 seed',()=>{
 for(let seed=1;seed<=150;seed++){
  const input=generate(seed,'small');
  const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
  expect(check(input,output)).toMatchObject({ok:true,optimal:true});
 }
});

it('trace tua lại đúng: đoạn nối cuối cùng trùng với cặp trả về',()=>{
 for(let seed=1;seed<=20;seed++){
  const input=generate(seed,'small');
  const {output,final}=traceRun(algorithm,input);
  expect(final.segments.at(-1)).toEqual({from:output.i,to:output.j,role:'closest'});
 }
});

it('bước so sánh có giải thích khoảng cách',()=>{
 const {steps}=traceRun(algorithm,{points:[{x:0,y:0},{x:3,y:4}]});
 const compareStep=steps.find(s=>s.lineId==='compare');
 expect(compareStep?.explain).toMatch(/So khoảng cách điểm/);
});
