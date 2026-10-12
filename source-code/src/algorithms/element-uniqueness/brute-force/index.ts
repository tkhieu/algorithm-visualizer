import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/element-uniqueness/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'element-uniqueness/brute-force',
  problemId: 'element-uniqueness',
  title: 'So từng cặp',
  chapter: 3,
  section: '3.1',
  page: 98,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  views: ['array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 80, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
