import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/closest-pair/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'closest-pair/divide-and-conquer',
  problemId: 'closest-pair',
  title: 'Chia để trị theo trục x',
  chapter: 5,
  section: '5.5',
  page: 192,
  technique: 'divide-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n log² n)', space: 'O(n)' },
  views: ['points-2d'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
};
