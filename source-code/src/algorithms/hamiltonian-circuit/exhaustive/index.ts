import type {Algorithm} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/hamiltonian-circuit/definition';
import {initVisual, limits, type VisualState} from '../shared';
import {run} from './run';
import {pseudocode} from './pseudocode';
import {legend} from './legend';
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'hamiltonian-circuit/exhaustive',
  problemId: 'hamiltonian-circuit',
  title: 'Vét cạn mọi hoán vị',
  chapter: 12,
  section: '12.1',
  page: 426,
  technique: 'brute-force',
  exactness: 'exact',
  complexity: {time: 'O(n!)', space: 'O(n)'},
  views: ['graph', 'state-space-tree'],
  pseudocode,
  legend,
  traceLimit: {...limits, maxInputSize: 8},
  initVisual,
  run,
};
