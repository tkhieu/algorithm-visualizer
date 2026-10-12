import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/change-making/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'change-making/dp',
  problemId: 'change-making',
  title: 'Quy hoạch động',
  chapter: 8,
  section: '8.1',
  page: 285,
  technique: 'dp',
  exactness: 'exact',
  complexity: { time: 'O(n·A)', space: 'O(A)' },
  views: ['matrix'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
};
