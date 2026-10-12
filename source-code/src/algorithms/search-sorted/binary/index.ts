import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/search-sorted/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'search-sorted/binary',
  problemId: 'search-sorted',
  title: 'Tìm kiếm nhị phân',
  chapter: 4,
  section: '4.4',
  page: 150,
  technique: 'decrease-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  views: ['array-bars'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 200, maxSteps: 1000, maxBytes: 2000000 },
  initVisual,
  run
};
