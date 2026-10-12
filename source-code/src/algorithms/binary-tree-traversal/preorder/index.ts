import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/binary-tree-traversal/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'binary-tree-traversal/preorder',
  problemId: 'binary-tree-traversal',
  title: 'Duyệt trước',
  chapter: 5,
  section: '5.3',
  page: 182,
  technique: 'divide-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n)', space: 'O(h)' },
  views: ['tree'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 31, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
