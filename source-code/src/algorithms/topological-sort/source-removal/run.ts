import type { RunContext } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/topological-sort/definition'
import { runTopo, type VisualState } from '../shared'
export function run(input: Input, ctx: RunContext<VisualState>): Output {
  return runTopo(input, ctx, 'source-removal')
}
