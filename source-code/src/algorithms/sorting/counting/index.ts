import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'sorting/counting',
  problemId: 'sorting',
  title: 'Sắp xếp đếm phân phối',
  chapter: 7,
  section: '7.1',
  page: 254,
  technique: 'space-time-tradeoff',
  exactness: 'exact',
  complexity: { time: 'O(n+k)', space: 'O(n+k)' },
  views: ['array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 60, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
