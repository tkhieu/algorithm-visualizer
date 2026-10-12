import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'sorting/bubble',
  problemId: 'sorting',
  title: 'Sắp xếp nổi bọt',
  chapter: 3,
  section: '3.1',
  page: 98,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  views: ['array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 60, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
