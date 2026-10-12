import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/lcs/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'lcs/memo',
  problemId: 'lcs',
  title: 'Quy hoạch động — có nhớ',
  chapter: 8,
  section: '8.2',
  page: 292,
  technique: 'dp',
  exactness: 'exact',
  complexity: {time: 'O(nm)', space: 'O(nm)'},
  views: ['matrix', 'string-align'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 40},
  initVisual,
  run,
};
