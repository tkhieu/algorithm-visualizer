import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/matrix-chain/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'matrix-chain/exhaustive',
  problemId: 'matrix-chain',
  title: 'Vét cạn mọi cách đặt ngoặc',
  chapter: 8,
  section: '8.3',
  page: 303,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: {time: 'O(4ⁿ/n^1.5)', space: 'O(n)'},
  views: ['matrix', 'tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 10},
  initVisual,
  run,
};
