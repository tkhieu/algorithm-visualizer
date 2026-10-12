import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/search-sorted/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'search-sorted/sequential',
  problemId: 'search-sorted',
  title: 'Tìm kiếm tuần tự',
  chapter: 2,
  section: '2.1',
  page: 47,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: { time: 'O(n)', space: 'O(1)' },
  views: ['array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 200, maxSteps: 1000, maxBytes: 2000000 },
  initVisual,
  run
};
