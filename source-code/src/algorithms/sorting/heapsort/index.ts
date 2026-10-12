import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'sorting/heapsort',
  problemId: 'sorting',
  title: 'Sắp xếp vun đống',
  chapter: 6,
  section: '6.4',
  page: 226,
  technique: 'transform-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n log n)', space: 'O(1)' },
  views: ['array-bars', 'tree'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 60, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
