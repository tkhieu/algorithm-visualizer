import type { Input } from '../../problems/all-pairs-shortest-path/definition'
import type { MatrixVisualState } from '../../visualizers/matrix'
import type { GraphVisualState } from '../../visualizers/graph'
export interface VisualState extends MatrixVisualState, GraphVisualState {
  distance: (number | null)[][]
}
export function initVisual(input: Input): VisualState {
  const dist = Array.from({ length: input.n }, (_, i) =>
    Array.from({ length: input.n }, (_, j) => (i === j ? 0 : (null as number | null))),
  )
  for (const [a, b, w] of input.edges) dist[a][b] = Math.min(dist[a][b] ?? Infinity, w)
  return {
    matrix: dist.map((row) => row.map((x) => x ?? '∞')),
    distance: dist,
    nodes: Array.from({ length: input.n }, (_, i) => ({ id: String(i), label: String(i) })),
    edges: input.edges.map(([a, b, w]) => ({
      from: String(a),
      to: String(b),
      weight: w,
      directed: true,
    })),
    note: '',
  }
}
export const legend = { 'Đường được cải thiện': 'Ô viền đậm' }
export const limits = { maxInputSize: 35, maxSteps: 45000, maxBytes: 16000000 }
