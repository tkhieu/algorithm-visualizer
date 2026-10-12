import type { RunContext } from '../../../core/contracts'
import type { Input, Output } from '../../../problems/maximum-flow/definition'
import { runFlow, type VisualState } from '../shared'
export function run(input: Input, ctx: RunContext<VisualState>): Output {
  return runFlow(input, ctx, 'bfs')
}
