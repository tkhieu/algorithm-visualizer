import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/element-uniqueness/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'element-uniqueness/mode',
  problemId: 'element-uniqueness',
  title: 'Tìm mode bằng sắp xếp trước',
  chapter: 6,
  section: '6.1',
  page: 202,
  technique: 'transform-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  views: ['array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 80, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
