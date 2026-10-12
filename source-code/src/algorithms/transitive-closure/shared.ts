import type { Input } from '../../problems/transitive-closure/definition'
import type { MatrixVisualState } from '../../visualizers/matrix'
import type { GraphVisualState } from '../../visualizers/graph'
export interface VisualState extends MatrixVisualState, GraphVisualState {
  reachable: boolean[][]
}
export function initVisual(input: Input): VisualState {
  const reachable = Array.from({ length: input.n }, (_, i) =>
    Array.from({ length: input.n }, (_, j) => i === j),
  )
  for (const [a, b] of input.edges) reachable[a][b] = true
  return {
    matrix: reachable.map((row) => row.map((x) => (x ? 1 : 0))),
    reachable,
    nodes: Array.from({ length: input.n }, (_, i) => ({ id: String(i), label: String(i) })),
    edges: input.edges.map(([a, b]) => ({ from: String(a), to: String(b), directed: true })),
    note: 'Ma trận kề và đường đi độ dài 0.',
  }
}
export const legend = { 'Ô đang xét': 'Viền đậm', 'Đã tìm thấy đường': 'Giá trị 1' }
export const limits = { maxInputSize: 35, maxSteps: 45000, maxBytes: 15000000 }
