import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/dictionary-hashing/definition';
import { initVisual, run, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'dictionary-hashing/linear-probing',
  problemId: 'dictionary-hashing',
  title: 'Băm với dò tuyến tính',
  chapter: 7,
  section: '7.3',
  page: 270,
  technique: 'space-time-tradeoff',
  exactness: 'exact',
  complexity: { time: 'O(1) TB', space: 'O(n)' },
  views: ['hash-table'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 40, maxSteps: 5000, maxBytes: 2500000 },
  initVisual,
  run,
};
