import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/exponentiation/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'exponentiation/naive',
  problemId: 'exponentiation',
  title: 'Nhân lặp n lần',
  chapter: 6,
  section: '6.5',
  page: 234,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: { time: 'O(n)', space: 'O(1)' },
  views: ['sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 60, maxSteps: 1000, maxBytes: 2000000 },
  initVisual,
  run
};
