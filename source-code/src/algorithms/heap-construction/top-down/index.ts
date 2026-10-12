import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/heap-construction/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'heap-construction/top-down',
  problemId: 'heap-construction',
  title: 'Xây đống từ trên xuống',
  chapter: 6,
  section: '6.4',
  page: 226,
  technique: 'transform-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n log n)', space: 'O(1)' },
  views: ['tree', 'array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 40, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
