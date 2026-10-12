import {it,expect} from 'vitest';
import {algorithm} from './index';
import {check,optimum} from '../../../problems/coin-row/checker';
import {generate} from '../../../problems/coin-row/generators';
import {traceRun} from '../test-utils';
import {MetricsRecorder} from '../../../core/recorder';

it('đúng với công thức quy hoạch động tham chiếu trên 150 seed',()=>{
 for(let seed=1;seed<=150;seed++){
  const input=generate(seed,'small');
  const output=algorithm.run(input,{rec:new MetricsRecorder(),signal:new AbortController().signal});
  expect(output.value).toBe(optimum(input.values));
  expect(check(input,output)).toMatchObject({ok:true,optimal:true});
 }
});

it('dãy rỗng cho kết quả 0',()=>{
 const output=algorithm.run({values:[]},{rec:new MetricsRecorder(),signal:new AbortController().signal});
 expect(output).toEqual({value:0,selected:[]});
});

it('trace tua lại đúng trên dãy nhỏ: kết quả cuối khớp output',()=>{
 for(let seed=1;seed<=20;seed++){
  const input=generate(seed,'tiny');
  const {output,final}=traceRun(algorithm,input);
  const takenCount=final.items.filter(it=>it.role==='taken').length;
  expect(takenCount).toBe(output.selected.length);
 }
});

it('bước nhánh có giải thích tiếng Việt',()=>{
 const {steps}=traceRun(algorithm,{values:[5,1,2]});
 const branchStep=steps.find(s=>s.lineId==='branch');
 expect(branchStep?.explain).toContain('Xét đồng xu');
});
