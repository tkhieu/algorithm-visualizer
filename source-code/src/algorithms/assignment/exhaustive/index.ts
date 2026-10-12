import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/assignment/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'assignment/exhaustive',
  problemId: 'assignment',
  title: 'Vét cạn mọi phân công',
  chapter: 3,
  section: '3.4',
  page: 115,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: {time: 'O(n!)', space: 'O(n)'},
  views: ['board', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 8},
  initVisual,
  run,
};
