import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/matrix-chain/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'matrix-chain/dp',
  problemId: 'matrix-chain',
  title: 'Quy hoạch động — bảng',
  chapter: 8,
  section: '8.3',
  page: 303,
  technique: 'dp',
  exactness: 'exact',
  complexity: {time: 'O(n³)', space: 'O(n²)'},
  views: ['matrix', 'tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 14},
  initVisual,
  run,
};
