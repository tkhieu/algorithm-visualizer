import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/all-pairs-shortest-path/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'all-pairs-shortest-path/dijkstra-all-sources',
  problemId: 'all-pairs-shortest-path',
  title: 'Dijkstra từ mọi đỉnh',
  chapter: 9,
  section: '9.3',
  page: 333,
  technique: 'greedy',
  exactness: 'exact',
  complexity: { time: 'O(V³+VE)', space: 'O(V²)' },
  views: ['matrix', 'graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
