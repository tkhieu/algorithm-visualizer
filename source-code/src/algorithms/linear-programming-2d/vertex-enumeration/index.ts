import type {Algorithm} from '../../../core/contracts';
import type {Input,Output} from '../../../problems/linear-programming-2d/definition';
import {initVisual,limits,type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm:Algorithm<Input,Output,VisualState>={
 id:'linear-programming-2d/vertex-enumeration',
 problemId:'linear-programming-2d',
 title:'Liệt kê đỉnh miền khả thi',
 chapter:10,
 section:'10.1',
 page:346,
 technique:'brute-force',
 exactness:'exact',
 complexity:{time:'O(C(m,n))',space:'O(n)'},
 views:['numeric-plot','matrix'],
 pseudocode,
 legend,
 traceLimit:limits,
 initVisual,
 run,
};
