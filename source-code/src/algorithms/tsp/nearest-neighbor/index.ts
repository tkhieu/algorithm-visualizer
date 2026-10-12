import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'tsp/nearest-neighbor',
  problemId: 'tsp',
  title: 'Láng giềng gần nhất (xấp xỉ)',
  chapter: 12,
  section: '12.3',
  page: 443,
  technique: 'approximation',
  exactness: 'approximate',
  complexity: {time: 'O(n²)', space: 'O(n)'},
  views: ['points-2d', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 30},
  initVisual,
  run,
};
