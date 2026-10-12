import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/search-sorted/definition';
import { mark, finish, type VisualState } from '../shared';
export function run({ values, target }: Input, { rec, signal }: RunContext<VisualState>): Output {
  let lo = 0,
    hi = values.length - 1,
    index = -1;
  while (lo <= hi && target >= values[lo] && target <= values[hi]) {
    if (signal.aborted) throw new Error('Đã huỷ');
    const span = values[hi] - values[lo];
    // Ước lượng vị trí theo tỷ lệ giá trị; dãy đồng giá trị dùng đầu khoảng.
    const pos = span === 0 ? lo : lo + Math.floor(((target - values[lo]) * (hi - lo)) / span);
    rec.count('compare');
    rec.step(
      'probe',
      `Nội suy vị trí ${pos} trong [${lo}, ${hi}], giá trị ${values[pos]}.`,
      (d) => {
        mark(d, pos, `Nội suy tại ${pos}`);
        d.ranges = [{ from: lo, to: hi, role: 'active' }];
      }
    );
    if (values[pos] === target) {
      index = pos;
      hi = pos - 1;
    } else if (values[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  finish(rec, index);
  return { index };
}
