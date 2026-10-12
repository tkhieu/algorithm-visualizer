import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/fake-coin/definition';
import { weigh, finish, type VisualState } from '../shared';
export function run({ weights }: Input, { rec, signal }: RunContext<VisualState>): Output {
  let candidates = weights.map((_, i) => i);
  while (candidates.length > 1) {
    if (signal.aborted) throw new Error('Đã huỷ');
    const k = Math.max(1, Math.floor(candidates.length / 3));
    const left = candidates.slice(0, k),
      right = candidates.slice(k, 2 * k),
      rest = candidates.slice(2 * k);
    const result = weigh(weights, left, right, rec);
    candidates = result < 0 ? left : result > 0 ? right : rest;
    rec.step('narrow', `Sau phép chia ba, còn ${candidates.length} xu nghi vấn.`, (d) => {
      d.note = `Còn ${candidates.length} ứng viên`;
      d.current = candidates[0];
    });
  }
  return finish(candidates[0], rec);
}
