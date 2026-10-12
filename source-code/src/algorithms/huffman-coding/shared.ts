import type { Input } from '../../problems/huffman-coding/definition'
import type { TreeVisualState } from '../../visualizers/tree'
export interface VisualState extends TreeVisualState {
  codes: string[]
  weightedBits: number
}
export function initVisual(input: Input): VisualState {
  return {
    nodes: input.symbols.map((s, i) => ({
      id: String(i),
      parent: null,
      label: `${s.label}:${s.frequency}`,
    })),
    codes: Array(input.symbols.length).fill(''),
    weightedBits: 0,
    note: '',
  }
}
export const legend = { 'Đang ghép': 'Nền xám', 'Gốc cây': 'Nền đen' }
export const limits = { maxInputSize: 30, maxSteps: 2500, maxBytes: 3000000 }
