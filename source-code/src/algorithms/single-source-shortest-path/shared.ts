import type { Input } from '../../problems/single-source-shortest-path/definition'
import type { GraphVisualState } from '../../visualizers/graph'
export interface VisualState extends GraphVisualState {
  distance: (number | null)[]
  frontier: number[]
  settled: number[]
}
export function initVisual(input: Input): VisualState {
  return {
    nodes: Array.from({ length: input.n }, (_, i) => ({
      id: String(i),
      label: String(i),
      distance: i === input.source ? 0 : '∞',
    })),
    edges: input.edges.map(([a, b, w]) => ({
      from: String(a),
      to: String(b),
      weight: w,
      directed: true,
    })),
    distance: Array.from({ length: input.n }, (_, i) => (i === input.source ? 0 : null)),
    frontier: [input.source],
    settled: [],
    note: '',
  }
}
export const legend = { 'Đã chốt': 'Nền đen', 'Đang xét': 'Nền xám', 'Cạnh cải thiện': 'Nét đậm' }
export const limits = { maxInputSize: 60, maxSteps: 8000, maxBytes: 5000000 }
