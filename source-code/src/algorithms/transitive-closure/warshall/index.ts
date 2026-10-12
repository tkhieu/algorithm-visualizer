import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/transitive-closure/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'transitive-closure/warshall',
  problemId: 'transitive-closure',
  title: 'Thuật toán Warshall',
  chapter: 8,
  section: '8.4',
  page: 304,
  technique: 'dp',
  exactness: 'exact',
  complexity: { time: 'O(V³)', space: 'O(V²)' },
  views: ['matrix', 'graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
