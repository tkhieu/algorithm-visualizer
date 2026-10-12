import type { Algorithm } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/stable-marriage/definition'
import { initVisual, limits, type VisualState } from '../shared'
import { run } from './run'
import { pseudocode } from './pseudocode'
import { legend } from './legend'
export const algorithm: Algorithm<Input, Output, VisualState> = {
  id: 'stable-marriage/gale-shapley-men-propose',
  problemId: 'stable-marriage',
  title: 'Gale–Shapley (nam đề xuất)',
  chapter: 10,
  section: '10.4',
  page: 380,
  technique: 'iterative-improvement',
  exactness: 'exact',
  complexity: { time: 'O(n²)', space: 'O(n²)' },
  views: ['sequence', 'board'],
  pseudocode,
  legend,
  traceLimit: limits,
  initVisual,
  run,
}
