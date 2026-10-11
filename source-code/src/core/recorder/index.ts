import {enablePatches,produceWithPatches, type Draft} from 'immer';
import {opNames,type Mark,type OpName,type Recorder,type Step} from '../contracts';
enablePatches();
export class MetricsRecorder<V> implements Recorder<V>{
  readonly tracing:boolean=false;
  readonly counters=Object.fromEntries(opNames.map(k=>[k,0])) as Record<OpName,number>;
  step(_lineId:string,_explain:string,_mutate:(draft:V)=>void,_marks:Mark[]=[],_phase?:string):void{void _lineId;void _explain;void _mutate;void _marks;void _phase}
  count(op:OpName,n=1){this.counters[op]+=n}
}
export class TraceRecorder<V> extends MetricsRecorder<V>{
  override readonly tracing=true;
  readonly steps:Step[]=[];
  truncated=false;
  private state:V;
  private bytes=0;
  constructor(initial:V,private lineIds:ReadonlySet<string>,private limits:{maxSteps:number;maxBytes:number},private onStep?:(step:Step)=>void){super();this.state=initial}
  override step(lineId:string,explain:string,mutate:(draft:V)=>void,marks:Mark[]=[],phase?:string){
    if(!this.lineIds.has(lineId))throw new Error(`Dòng mã giả không tồn tại: ${lineId}`);
    if(this.truncated)return;
    if(this.steps.length>=this.limits.maxSteps){this.truncated=true;return}
    const [next,patches,inverse]=produceWithPatches(this.state,(draft:Draft<V>)=>mutate(draft as V));
    const step:Step={seq:this.steps.length+1,lineId,explain,marks,patches,inverse,phase};
    const bytes=JSON.stringify(step).length;
    if(this.bytes+bytes>this.limits.maxBytes){this.truncated=true;return}
    this.bytes+=bytes;this.state=next;this.steps.push(step);this.onStep?.(step);
  }
}
