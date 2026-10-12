import type { Algorithm } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/nim/definition';
import { run, initVisual, type VisualState } from './run';
import { pseudocode } from './pseudocode';
import { legend } from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'nim/winning-strategy',
  problemId: 'nim',
  title: 'Chiến lược thắng bằng XOR',
  chapter: 4,
  section: '4.5',
  page: 158,
  technique: 'transform-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(n log m)', space: 'O(1)' },
  views: ['sequence'],
  pseudocode,
  legend,
  traceLimit: { maxInputSize: 10, maxSteps: 100, maxBytes: 200000 },
  initVisual,
  run
};
