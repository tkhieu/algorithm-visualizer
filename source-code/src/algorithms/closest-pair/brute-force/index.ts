import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/closest-pair/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'closest-pair/brute-force',
  problemId: 'closest-pair',
  title: 'So từng cặp điểm',
  chapter: 5,
  section: '5.5',
  page: 192,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  views: ['points-2d'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
};
