import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/minimum-spanning-tree/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'minimum-spanning-tree/prim',
  problemId: 'minimum-spanning-tree',
  title: 'Thuật toán Prim',
  chapter: 9,
  section: '9.1',
  page: 318,
  technique: 'greedy',
  exactness: 'exact',
  complexity: { time: 'O(VE)', space: 'O(V)' },
  views: ['graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
