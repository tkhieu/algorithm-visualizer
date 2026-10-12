import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/assignment/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'assignment/hungarian',
  problemId: 'assignment',
  title: 'Thuật toán Hungary (mở rộng, không có trong giáo trình)',
  chapter: 12,
  section: '12.2',
  page: 433,
  technique: 'iterative-improvement',
  exactness: 'exact',
  complexity: {time: 'O(n³)', space: 'O(n²)'},
  views: ['board', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 60},
  initVisual,
  run,
};
