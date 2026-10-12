import {expect} from 'vitest';
import type {Algorithm} from '../../core/contracts';
import {TraceRecorder} from '../../core/recorder';
import {TraceStore} from '../../core/trace/TraceStore';
export function traceRun<I,O,V extends object>(algo:Algorithm<I,O,V>,input:I){
 const rec=new TraceRecorder<V>(algo.initVisual(input),new Set(algo.pseudocode.map(l=>l.id)),algo.traceLimit);
 const output=algo.run(input,{rec,signal:new AbortController().signal});
 expect(rec.truncated).toBe(false);
 const store=new TraceStore<V>(algo.initVisual(input));
 for(const step of rec.steps)store.append(step);
 const final=store.seek(store.length);
 return {output,steps:rec.steps,store,final};
}
