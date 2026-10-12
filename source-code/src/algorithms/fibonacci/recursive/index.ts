import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/fibonacci/definition';
import { initVisual, type VisualState } from '../shared';
import { run } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'fibonacci/recursive',
  problemId: 'fibonacci',
  title: 'Đệ quy thuần',
  chapter: 2,
  section: '2.5',
  page: 80,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: { time: 'O(φⁿ)', space: 'O(n)' },
  views: ['tree', 'sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 20, maxSteps: 150000, maxBytes: 30000000 },
  initVisual,
  run
};
