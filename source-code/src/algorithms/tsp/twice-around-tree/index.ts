import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'tsp/twice-around-tree',
  problemId: 'tsp',
  title: 'Hai lần cây khung (xấp xỉ)',
  chapter: 12,
  section: '12.3',
  page: 443,
  technique: 'approximation',
  exactness: 'approximate',
  complexity: {time: 'O(n² log n)', space: 'O(n)'},
  views: ['points-2d', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 30},
  initVisual,
  run,
};
