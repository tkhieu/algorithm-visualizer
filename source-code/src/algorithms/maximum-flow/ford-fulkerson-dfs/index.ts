import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/maximum-flow/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'maximum-flow/ford-fulkerson-dfs',
  problemId: 'maximum-flow',
  title: 'Ford–Fulkerson theo DFS',
  chapter: 10,
  section: '10.2',
  page: 361,
  technique: 'iterative-improvement',
  exactness: 'exact',
  complexity: { time: 'O(E·f*)', space: 'O(V+E)' },
  views: ['graph'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
