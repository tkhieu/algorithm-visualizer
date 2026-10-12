import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/kth-smallest/definition';
import { finish, type VisualState } from '../shared';
export function run({ values, k }: Input, { rec, signal }: RunContext<VisualState>): Output {
  if (signal.aborted) throw new Error('Đã huỷ');
  const sorted = [...values].sort((a, b) => {
    rec.count('compare');
    return a - b;
  });
  rec.step('sort', `Sắp xếp ${values.length} phần tử tăng dần.`, (d) => {
    d.values = sorted;
    d.note = 'Dãy đã sắp xếp';
  });
  return finish(rec, k - 1, sorted[k - 1]);
}
