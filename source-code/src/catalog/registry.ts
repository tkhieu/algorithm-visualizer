import type {Algorithm} from '../core/contracts';
import type {Input,Output} from '../problems/knapsack-01/definition';
import type {VisualState} from '../algorithms/knapsack-01/shared';
type KnapsackAlgorithm=Algorithm<Input,Output,VisualState>;
type AlgorithmModule={algorithm:KnapsackAlgorithm};
export const registry:Record<string,()=>Promise<AlgorithmModule>>={
 'knapsack-01/exhaustive':()=>import('../algorithms/knapsack-01/exhaustive'),
 'knapsack-01/dp-table':()=>import('../algorithms/knapsack-01/dp-table'),
 'knapsack-01/dp-memo':()=>import('../algorithms/knapsack-01/dp-memo'),
 'knapsack-01/branch-and-bound':()=>import('../algorithms/knapsack-01/branch-and-bound'),
 'knapsack-01/greedy-approx':()=>import('../algorithms/knapsack-01/greedy-approx')
};
export async function loadAlgorithm(id:string):Promise<KnapsackAlgorithm|undefined>{return (await registry[id]?.())?.algorithm}
