import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'sorting/mergesort',
  problemId: 'sorting',
  title: 'Sắp xếp trộn',
  chapter: 5,
  section: '5.1',
  page: 172,
  technique: 'divide-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  views: ['array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 60, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
