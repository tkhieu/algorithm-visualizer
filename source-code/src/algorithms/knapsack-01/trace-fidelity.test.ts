import {describe,it,expect} from 'vitest';
import type {Algorithm} from '../../core/contracts';
import {TraceRecorder} from '../../core/recorder';
import {TraceStore} from '../../core/trace/TraceStore';
import type {Input,Output} from '../../problems/knapsack-01/definition';
import {generate} from '../../problems/knapsack-01/generators';
import type {VisualState} from './shared';
import {algorithm as branchAndBound} from './branch-and-bound';
import {algorithm as exhaustive} from './exhaustive';
import {algorithm as memo} from './dp-memo';

const example:Input={capacity:7,items:[{name:'A',weight:3,value:4},{name:'B',weight:4,value:5},{name:'C',weight:5,value:6}]};
const edgeInputs:Input[]=[{capacity:0,items:[]},{capacity:5,items:[{name:'A',weight:5,value:8}]},{capacity:10,items:[{name:'A',weight:2,value:0},{name:'B',weight:3,value:0}]}];
type ItemStatus=VisualState['items'][number];

function trace(algo:Algorithm<Input,Output,VisualState>,input:Input){
 const rec=new TraceRecorder(algo.initVisual(input),new Set(algo.pseudocode.map(line=>line.id)),algo.traceLimit);
 const output=algo.run(input,{rec,signal:new AbortController().signal});
 expect(rec.truncated).toBe(false);
 const store=new TraceStore(algo.initVisual(input));
 for(const step of rec.steps)store.append(step);
 return {output,steps:rec.steps,store};
}

function branchPath(input:Input,state:VisualState,id:number):ItemStatus[]{
 const statuses:ItemStatus[]=input.items.map(()=>'waiting');
 const byId=new Map(state.nodes.map(node=>[node.id,node]));
 let node=byId.get(id);
 while(node?.parent!==null&&node){
  const take=node.label.startsWith('L ');
  const index=input.items.findIndex(item=>item.name===node!.label.slice(2));
  expect(index).toBeGreaterThanOrEqual(0);
  statuses[index]=take?'taken':'rejected';
  node=byId.get(node.parent);
 }
 return statuses;
}

function exhaustivePath(input:Input,state:VisualState,id:number):ItemStatus[]{
 const statuses:ItemStatus[]=input.items.map(()=>'waiting');
 const byId=new Map(state.nodes.map(node=>[node.id,node]));
 let node=byId.get(id);
 while(node?.parent!==null&&node){
  const parent=byId.get(node.parent)!;
  const itemIndex=Number(parent.label.split('/')[0]);
  const siblings=state.nodes.filter(candidate=>candidate.parent===parent.id).sort((a,b)=>a.id-b.id);
  statuses[itemIndex]=siblings[0].id===node.id?'rejected':'taken';
  node=parent;
 }
 return statuses;
}

function bestNeverPruned(input:Input){
 const {steps,store}=trace(branchAndBound,input);
 const everBest=new Set<number>();
 for(const step of steps){
  const state=store.seek(step.seq);
  for(const node of state.nodes)if(node.status==='best')everBest.add(node.id);
  for(const node of state.nodes)if(everBest.has(node.id))expect(node.status,`nút ${node.id}, bước ${step.seq}`).not.toBe('pruned');
  if(step.lineId==='prune')for(const mark of step.marks)for(const id of everBest)expect(mark.target,`bước cắt ${step.seq}`).not.toBe(`node-${id}`);
 }
}

describe('trung thực của trace cây trạng thái',()=>{
 it('nhánh cận không cắt nút từng là best trên ví dụ sức chứa 7',()=>bestNeverPruned(example));
 it('nhánh cận không cắt nút từng là best trên 120 seed',()=>{for(let seed=1;seed<=120;seed++)bestNeverPruned(generate(seed,'small'))});
 it('nhánh cận kết thúc với đúng một best khớp tập vật trả về trên 120 seed và ví dụ',()=>{for(const input of [example,...edgeInputs,...Array.from({length:120},(_,i)=>generate(i+1,'small'))]){const {output,steps,store}=trace(branchAndBound,input);const state=store.seek(steps.length);const best=state.nodes.filter(node=>node.status==='best');expect(best,`input ${JSON.stringify(input)}`).toHaveLength(1);const selected=branchPath(input,state,best[0].id).flatMap((status,i)=>status==='taken'?[i]:[]);expect(selected).toEqual(output.selected)}});
 it('nhánh cận giải thích đúng cắt do cận, quá cân và hoàn tất lá',()=>{
  const inputs=[example,{capacity:5,items:[{name:'A',weight:5,value:8}]},{capacity:1,items:[{name:'A',weight:2,value:8}]},...Array.from({length:10},(_,i)=>generate(i+1,'small'))];
  const steps=inputs.flatMap(input=>trace(branchAndBound,input).steps);
  expect(steps.some(step=>step.lineId==='finish'&&step.explain.includes('là lá'))).toBe(true);
  expect(steps.some(step=>step.lineId==='prune'&&step.marks.some(mark=>mark.target.startsWith('item-')))).toBe(true);
  expect(steps.some(step=>step.lineId==='prune'&&step.marks.some(mark=>mark.target.startsWith('node-')))).toBe(true);
  for(const step of steps){
   if(step.lineId==='prune'&&step.marks.some(mark=>mark.target.startsWith('item-')))expect(step.explain).toContain('vượt sức chứa');
   if(step.lineId==='prune'&&step.marks.some(mark=>mark.target.startsWith('node-')))expect(step.explain).toContain('cận trên');
   if(step.lineId==='finish')expect(step.explain).not.toContain('Cắt nhánh');
  }
 });
 it('đệ quy có nhớ không tạo nút cây mới cho ô đã nhớ khi truy vết',()=>{const {steps,store}=trace(memo,example);const hits=steps.filter(step=>step.phase==='backtrack'&&step.lineId==='call');expect(hits.length).toBeGreaterThan(0);for(const hit of hits){const before=store.seek(hit.seq-1).nodes.length;const after=store.seek(hit.seq).nodes.length;expect(after).toBe(before)}});
 it('đệ quy có nhớ không để nút current sau khi chạy',()=>{for(let seed=1;seed<=50;seed++){const {steps,store}=trace(memo,generate(seed,'small'));expect(store.seek(steps.length).nodes.some(node=>node.status==='current'),`seed ${seed}`).toBe(false)}});
 it('nhánh cận hiển thị trạng thái vật đúng theo đường đi nút đang xem',()=>{for(let seed=1;seed<=30;seed++){const input=generate(seed,'small');const {steps,store}=trace(branchAndBound,input);for(const step of steps){const state=store.seek(step.seq);if(state.focusNode!==null)expect(state.items,`seed ${seed}, bước ${step.seq}`).toEqual(branchPath(input,state,state.focusNode))}}});
 it('vét cạn hiển thị trạng thái vật đúng theo đường đi nút đang xem',()=>{for(let seed=1;seed<=30;seed++){const input=generate(seed,'small');const {steps,store}=trace(exhaustive,input);for(const step of steps){const state=store.seek(step.seq);if(state.focusNode!==null)expect(state.items,`seed ${seed}, bước ${step.seq}`).toEqual(exhaustivePath(input,state,state.focusNode))}}});
});
