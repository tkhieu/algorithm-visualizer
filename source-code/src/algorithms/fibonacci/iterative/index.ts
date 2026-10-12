import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/fibonacci/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'fibonacci/iterative',
  problemId: 'fibonacci',
  title: 'Lặp từ dưới lên',
  chapter: 2,
  section: '2.5',
  page: 80,
  technique: 'decrease-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n)', space: 'O(1)' },
  views: ['tree', 'sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 20, maxSteps: 150000, maxBytes: 30000000 },
  initVisual,
  run
};
