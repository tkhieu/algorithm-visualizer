import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/optimal-bst/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'optimal-bst/dp',
  problemId: 'optimal-bst',
  title: 'Quy hoạch động',
  chapter: 8,
  section: '8.3',
  page: 297,
  technique: 'dp',
  exactness: 'exact',
  complexity: { time: 'O(n³)', space: 'O(n²)' },
  views: ['matrix', 'tree'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
};
