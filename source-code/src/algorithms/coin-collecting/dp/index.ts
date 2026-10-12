import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/coin-collecting/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'coin-collecting/dp',
  problemId: 'coin-collecting',
  title: 'Quy hoạch động trên lưới',
  chapter: 8,
  section: '8.1',
  page: 285,
  technique: 'dp',
  exactness: 'exact',
  complexity: { time: 'O(nm)', space: 'O(nm)' },
  views: ['board'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
};
