import type { Input } from '../../problems/minimum-spanning-tree/definition'
import type { GraphVisualState } from '../../visualizers/graph'
export interface VisualState extends GraphVisualState {
  edgeIndices: number[]
  weight: number
  components: number[]
}
export function initVisual(input: Input): VisualState {
  return {
    nodes: Array.from({ length: input.n }, (_, i) => ({ id: String(i), label: String(i) })),
    edges: input.edges.map(([a, b, w]) => ({ from: String(a), to: String(b), weight: w })),
    edgeIndices: [],
    weight: 0,
    components: [],
    note: '',
  }
}
export const legend = { 'Cạnh cây khung': 'Nét đậm', 'Đỉnh trong cây': 'Nền đen' }
export const limits = { maxInputSize: 60, maxSteps: 4000, maxBytes: 4000000 }
