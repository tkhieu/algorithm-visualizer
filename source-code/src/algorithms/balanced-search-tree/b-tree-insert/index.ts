import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/balanced-search-tree/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'balanced-search-tree/b-tree-insert',
  problemId: 'balanced-search-tree',
  title: 'Chèn cây B',
  chapter: 7,
  section: '7.4',
  page: 276,
  technique: 'space-time-tradeoff',
  exactness: 'exact',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  views: ['tree'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 24, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
