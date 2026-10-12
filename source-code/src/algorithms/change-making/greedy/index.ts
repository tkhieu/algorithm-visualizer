import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/change-making/definition';
import { initVisual, limits, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';

export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'change-making/greedy',
  problemId: 'change-making',
  title: 'Tham lam (có thể sai)',
  chapter: 8,
  section: '8.1',
  page: 285,
  technique: 'greedy',
  exactness: 'approximate',
  complexity: { time: 'O(n)', space: 'O(1)' },
  views: ['matrix'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
};
