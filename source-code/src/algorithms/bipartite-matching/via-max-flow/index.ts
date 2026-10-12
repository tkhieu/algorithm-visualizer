import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/bipartite-matching/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'bipartite-matching/via-max-flow',
  problemId: 'bipartite-matching',
  title: 'Quy về luồng cực đại',
  chapter: 10,
  section: '10.3',
  page: 372,
  technique: 'iterative-improvement',
  exactness: 'exact',
  complexity: { time: 'O(V³)', space: 'O(V²)' },
  views: ['graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
