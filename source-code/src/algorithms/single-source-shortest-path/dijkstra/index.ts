import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/single-source-shortest-path/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'single-source-shortest-path/dijkstra',
  problemId: 'single-source-shortest-path',
  title: 'Thuật toán Dijkstra',
  chapter: 9,
  section: '9.3',
  page: 333,
  technique: 'greedy',
  exactness: 'exact',
  complexity: { time: 'O(V²+E)', space: 'O(V)' },
  views: ['graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
