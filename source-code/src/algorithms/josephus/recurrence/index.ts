import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/josephus/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'josephus/recurrence',
  problemId: 'josephus',
  title: 'Công thức truy hồi',
  chapter: 4,
  section: '4.4',
  page: 150,
  technique: 'decrease-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n)', space: 'O(1)' },
  views: ['sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 200, maxSteps: 1000, maxBytes: 2000000 },
  initVisual,
  run
};
