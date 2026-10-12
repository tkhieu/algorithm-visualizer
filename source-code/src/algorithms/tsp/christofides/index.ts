import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'tsp/christofides',
  problemId: 'tsp',
  title: 'Christofides (xấp xỉ)',
  chapter: 12,
  section: '12.3',
  page: 443,
  technique: 'approximation',
  exactness: 'approximate',
  complexity: {time: 'O(n³)', space: 'O(n²)'},
  views: ['points-2d', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 12},
  initVisual,
  run,
};
