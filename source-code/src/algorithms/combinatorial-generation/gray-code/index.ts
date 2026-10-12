import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/combinatorial-generation/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'combinatorial-generation/gray-code',
  problemId: 'combinatorial-generation',
  title: 'Mã Gray nhị phân',
  chapter: 4,
  section: '4.3',
  page: 144,
  technique: 'decrease-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(2ⁿ)', space: 'O(n)' },
  views: ['sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 5, maxSteps: 1000, maxBytes: 2000000 },
  initVisual,
  run
};
