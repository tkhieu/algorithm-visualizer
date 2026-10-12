import type {RunContext} from '../../../core/contracts';import type {Input,Output} from '../../../problems/graph-traversal/definition';import {runTraversal,type VisualState} from '../shared';
export function run(input:Input,ctx:RunContext<VisualState>):Output{return runTraversal(input,ctx,'dfs')}
