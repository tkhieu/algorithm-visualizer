import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/convex-hull/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'convex-hull/quickhull',
  problemId: 'convex-hull',
  title: 'QuickHull',
  chapter: 5,
  section: '5.5',
  page: 192,
  technique: 'divide-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n log n) TB', space: 'O(n)' },
  views: ['points-2d'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
};
