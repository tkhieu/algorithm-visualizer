import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/search-sorted/definition';
import { mark, finish, type VisualState } from '../shared';
export function run({ values, target }: Input, { rec, signal }: RunContext<VisualState>): Output {
  let index = -1;
  for (let i = 0; i < values.length; i++) {
    if (signal.aborted) throw new Error('Đã huỷ');
    rec.count('compare');
    rec.step('probe', `So sánh a[${i}]=${values[i]} với ${target}.`, (d) =>
      mark(d, i, `Đang xét vị trí ${i}`)
    );
    if (values[i] === target) {
      index = i;
      break;
    }
    if (values[i] > target) break;
  }
  finish(rec, index);
  return { index };
}
