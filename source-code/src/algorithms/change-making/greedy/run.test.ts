import {it,expect} from 'vitest';
import {algorithm} from './index';
import {check} from '../../../problems/change-making/checker';
import {generate} from '../../../problems/change-making/generators';
import {traceRun} from '../test-utils';
import {MetricsRecorder} from '../../../core/recorder';

it('luôn khả thi (tổng đúng số tiền) trên 150 seed',()=>{
 for(let seed=1;seed<=150;seed++){
  const input=generate(seed,'small');
  const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
  expect(check(input,output)).toMatchObject({ok:true});
 }
});

it('ví dụ kinh điển: tham lam cho 3 đồng (4+1+1) trong khi tối ưu là 2',()=>{
 const input={amount:6,coins:[1,3,4]};
 const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
 expect(check(input,output)).toMatchObject({ok:true,optimal:false,score:3});
});

it('hệ tiền chuẩn (1,5,10,25): tham lam đạt tối ưu',()=>{
 const input={amount:63,coins:[1,5,10,25]};
 const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
 expect(check(input,output)).toMatchObject({ok:true,optimal:true});
});

it('trace tua lại đúng: tổng các đồng khớp số tiền',()=>{
 for(let seed=1;seed<=20;seed++){
  const input=generate(seed,'small');
  const {output,final}=traceRun(algorithm,input);
  expect(final.current?.w).toBe(0);
  expect(output.coins.reduce((s,c)=>s+c,0)).toBe(input.amount);
 }
});

it('bước lấy đồng xu có giải thích tiếng Việt',()=>{
 const {steps}=traceRun(algorithm,{amount:6,coins:[1,3,4]});
 const takeStep=steps.find(s=>s.lineId==='take');
 expect(takeStep?.explain).toContain('Dùng đồng');
});
