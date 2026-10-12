import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/linear-system/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'linear-system/gaussian-elimination',
  problemId: 'linear-system',
  title: 'Khử Gauss',
  chapter: 6,
  section: '6.2',
  page: 208,
  technique: 'transform-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n³)', space: 'O(n²)' },
  views: ['matrix'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 4, maxSteps: 1000, maxBytes: 2000000 },
  initVisual,
  run
};
