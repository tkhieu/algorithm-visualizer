import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/multiplication/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'multiplication/russian-peasant',
  problemId: 'multiplication',
  title: 'Nhân kiểu nông dân Nga',
  chapter: 4,
  section: '4.4',
  page: 150,
  technique: 'decrease-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  views: ['sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 40, maxSteps: 10000, maxBytes: 20000000 },
  initVisual,
  run
};
