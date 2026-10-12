import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/lcs/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'lcs/brute-force',
  problemId: 'lcs',
  title: 'Vét cạn mọi dãy con',
  chapter: 8,
  section: '8.2',
  page: 292,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: {time: 'O(2^(n+m))', space: 'O(n+m)'},
  views: ['matrix', 'string-align'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 16},
  initVisual,
  run,
};
