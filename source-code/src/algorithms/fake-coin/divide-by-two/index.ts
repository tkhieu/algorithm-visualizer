import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/fake-coin/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'fake-coin/divide-by-two',
  problemId: 'fake-coin',
  title: 'Chia đôi mỗi lần cân',
  chapter: 4,
  section: '4.4',
  page: 150,
  technique: 'divide-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(log n)', space: 'O(log n)' },
  views: ['sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 200, maxSteps: 1000, maxBytes: 2000000 },
  initVisual,
  run
};
