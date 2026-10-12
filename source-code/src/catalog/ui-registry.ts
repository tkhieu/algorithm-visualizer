import type {ComponentType} from 'react';
import type {ComparisonAdapter,Step,Verdict} from '../core/contracts';
// Quy ước tuỳ chọn: src/problems/<id>/ui.tsx có thể export InputEditor/OutputRenderer/StateInspector để
// thay giao diện mặc định (JSON). File này KHÔNG được import bởi worker (chỉ UI thread), nên không kéo
// React vào worker.
export interface InputEditorProps{input:unknown;onChange:(value:unknown)=>void;disabled?:boolean}
export interface OutputRendererProps{input:unknown;output:unknown;verdict:Verdict;truncated:boolean}
export interface StateInspectorProps{state:unknown;step?:Step}
export interface ProblemUiModule{InputEditor?:ComponentType<InputEditorProps>;OutputRenderer?:ComponentType<OutputRendererProps>;StateInspector?:ComponentType<StateInspectorProps>}

const uiModules=import.meta.glob<ProblemUiModule>('../problems/*/ui.tsx');
const adapterModules=import.meta.glob<{adapter:ComparisonAdapter<unknown,unknown>}>('../problems/*/adapters.ts');

function parseProblemPath(path:string):string|null{
 const m=path.match(/\.\.\/problems\/([^/]+)\/(?:ui\.tsx|adapters\.ts)$/);
 return m?m[1]:null;
}

const uiByProblem:Record<string,()=>Promise<ProblemUiModule>>={};
for(const path in uiModules){const id=parseProblemPath(path);if(id)uiByProblem[id]=uiModules[path]}
const adapterByProblem:Record<string,()=>Promise<{adapter:ComparisonAdapter<unknown,unknown>}>>={};
for(const path in adapterModules){const id=parseProblemPath(path);if(id)adapterByProblem[id]=adapterModules[path]}

export async function loadProblemUi(problemId:string):Promise<ProblemUiModule>{
 return (await uiByProblem[problemId]?.())??{};
}
export async function loadComparisonAdapter(problemId:string):Promise<ComparisonAdapter<unknown,unknown>|undefined>{
 return (await adapterByProblem[problemId]?.())?.adapter;
}
