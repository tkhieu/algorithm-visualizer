import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/balanced-search-tree/definition';
import { initVisual, runMultiwayInsert, type VisualState } from '../shared';

export { initVisual };
export type { VisualState };
export function run(input: Input, ctx: RunContext<VisualState>): Output {
  return runMultiwayInsert(input, ctx, 3);
}
