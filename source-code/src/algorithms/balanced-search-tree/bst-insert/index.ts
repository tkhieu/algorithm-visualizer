import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/balanced-search-tree/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'balanced-search-tree/bst-insert',
  problemId: 'balanced-search-tree',
  title: 'Chèn cây tìm kiếm nhị phân',
  chapter: 4,
  section: '4.5',
  page: 158,
  technique: 'decrease-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(h)', space: 'O(1)' },
  views: ['tree'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 24, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
