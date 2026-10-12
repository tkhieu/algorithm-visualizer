import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/subset-sum/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'subset-sum/backtracking',
  problemId: 'subset-sum',
  title: 'Quay lui',
  chapter: 12,
  section: '12.1',
  page: 427,
  technique: 'backtracking',
  exactness: 'exact',
  complexity: {time: 'O(2ⁿ) xấu nhất', space: 'O(n)'},
  views: ['state-space-tree', 'matrix'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 14},
  initVisual,
  run,
};
