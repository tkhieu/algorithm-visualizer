import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'tsp/exhaustive',
  problemId: 'tsp',
  title: 'Vét cạn mọi hoán vị',
  chapter: 3,
  section: '3.4',
  page: 115,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: {time: 'O(n!)', space: 'O(n)'},
  views: ['points-2d', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 8},
  initVisual,
  run,
};
