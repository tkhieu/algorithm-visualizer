import {applyPatches,enablePatches, type Patch} from 'immer';
enablePatches();
import type {Step} from '../contracts';
export class TraceStore<V extends object>{
  readonly steps:Step[]=[];
  readonly checkpoints=new Map<number,V>();
  private state:V;
  private cursor=0;
  private bytesSinceCheckpoint=0;
  constructor(initial:V){this.state=initial;this.checkpoints.set(0,initial)}
  get length(){return this.steps.length}
  get position(){return this.cursor}
  get current(){return this.state}
  append(step:Step){
    if(step.seq!==this.steps.length+1)throw new Error('Sai thứ tự bước');
    this.steps.push(step);
    const bytes=JSON.stringify(step.patches).length+JSON.stringify(step.inverse).length;
    this.bytesSinceCheckpoint+=bytes;
    if(step.seq%100===0||this.bytesSinceCheckpoint>=256*1024){this.checkpoints.set(step.seq,this.replayFromNearest(step.seq));this.bytesSinceCheckpoint=0}
  }
  private replayFromNearest(k:number):V{
    const base=Math.max(...[...this.checkpoints.keys()].filter(x=>x<=k));
    let state=this.checkpoints.get(base)!;
    for(let i=base;i<k;i++)state=applyPatches(state,this.steps[i].patches as Patch[]);
    return state;
  }
  seek(k:number):V{
    if(!Number.isInteger(k)||k<0||k>this.length)throw new RangeError('Bước không hợp lệ');
    if(k===this.cursor-1){this.state=applyPatches(this.state,this.steps[k].inverse as Patch[])}
    else if(k===this.cursor+1){this.state=applyPatches(this.state,this.steps[k-1].patches as Patch[])}
    else if(k!==this.cursor){this.state=this.replayFromNearest(k)}
    this.cursor=k;return this.state;
  }
  stepBack(){return this.seek(Math.max(0,this.cursor-1))}
}
