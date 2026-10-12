import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/topological-sort/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'topological-sort/dfs-based',
  problemId: 'topological-sort',
  title: 'Dựa trên DFS',
  chapter: 4,
  section: '4.2',
  page: 138,
  technique: 'decrease-and-conquer',
  exactness: 'exact',
  complexity: { time: 'O(V+E)', space: 'O(V)' },
  views: ['graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
