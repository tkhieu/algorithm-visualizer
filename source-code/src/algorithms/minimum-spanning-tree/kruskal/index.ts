import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/minimum-spanning-tree/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'minimum-spanning-tree/kruskal',
  problemId: 'minimum-spanning-tree',
  title: 'Thuật toán Kruskal',
  chapter: 9,
  section: '9.2',
  page: 325,
  technique: 'greedy',
  exactness: 'exact',
  complexity: { time: 'O(E log E)', space: 'O(V)' },
  views: ['graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
