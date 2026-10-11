import type {Algorithm} from '../core/contracts';
import type {Input,Output} from '../problems/knapsack-01/definition';
import type {VisualState} from '../algorithms/knapsack-01/shared';
export type AlgorithmSummary=Pick<Algorithm<Input,Output,VisualState>,'id'|'problemId'|'title'|'chapter'|'section'|'page'|'technique'|'exactness'|'complexity'|'views'>;
export const manifest:AlgorithmSummary[]=[
 {id:'knapsack-01/exhaustive',problemId:'knapsack-01',title:'Vét cạn',chapter:3,section:'3.4',page:118,technique:'brute-force',exactness:'exact',complexity:{time:'O(2ⁿ)',space:'O(n)'},views:['state-space-tree','items']},
 {id:'knapsack-01/dp-table',problemId:'knapsack-01',title:'Quy hoạch động — bảng',chapter:8,section:'8.2',page:292,technique:'dp',exactness:'exact',complexity:{time:'O(nW)',space:'O(nW)'},views:['matrix','items']},
 {id:'knapsack-01/dp-memo',problemId:'knapsack-01',title:'Quy hoạch động — nhớ',chapter:8,section:'8.2',page:292,technique:'dp',exactness:'exact',complexity:{time:'O(nW)',space:'O(nW)'},views:['matrix','state-space-tree','items']},
 {id:'knapsack-01/branch-and-bound',problemId:'knapsack-01',title:'Nhánh cận — ưu tiên cận trên',chapter:12,section:'12.2',page:436,technique:'branch-and-bound',exactness:'exact',complexity:{time:'O(2ⁿ) xấu nhất',space:'O(2ⁿ)'},views:['state-space-tree','items']},
 {id:'knapsack-01/greedy-approx',problemId:'knapsack-01',title:'Tham lam theo tỷ lệ — xấp xỉ',chapter:12,section:'12.3',page:453,technique:'greedy',exactness:'approximate',complexity:{time:'O(n log n)',space:'O(n)'},views:['items']}
];
