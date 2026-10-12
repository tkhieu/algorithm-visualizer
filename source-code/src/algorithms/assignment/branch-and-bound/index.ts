import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/assignment/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'assignment/branch-and-bound',
  problemId: 'assignment',
  title: 'Nhánh cận',
  chapter: 12,
  section: '12.2',
  page: 433,
  technique: 'branch-and-bound',
  exactness: 'exact',
  complexity: {time: 'O(n!) xấu nhất', space: 'O(n²)'},
  views: ['board', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 9},
  initVisual,
  run,
};
