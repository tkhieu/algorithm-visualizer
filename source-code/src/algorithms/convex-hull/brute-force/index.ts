import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/convex-hull/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'convex-hull/brute-force',
  problemId: 'convex-hull',
  title: 'Kiểm tra từng cạnh',
  chapter: 3,
  section: '3.3',
  page: 108,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: { time: 'O(n³)', space: 'O(n)' },
  views: ['points-2d'],
  pseudocode,
  legend,
  traceLimit: { ...limits, maxInputSize: 40 },
  initVisual,
  run,
};
