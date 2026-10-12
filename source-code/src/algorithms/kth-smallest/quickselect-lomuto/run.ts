import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/kth-smallest/definition';
import { finish, type VisualState } from '../shared';
export function run({ values, k }: Input, { rec, signal }: RunContext<VisualState>): Output {
  const a = [...values],
    target = k - 1;
  let lo = 0,
    hi = a.length - 1;
  while (lo <= hi) {
    if (signal.aborted) throw new Error('Đã huỷ');
    const pivot = a[hi];
    rec.step('pivot', `Chọn chốt ${pivot} tại vị trí ${hi}.`, (d) => {
      d.marks = [{ index: hi, role: 'pivot' }];
      d.ranges = [{ from: lo, to: hi, role: 'active' }];
      d.note = `Chốt ${pivot}`;
    });
    // i là ranh giới đầu tiên của các phần tử lớn hơn chốt.
    let i = lo;
    for (let j = lo; j < hi; j++) {
      rec.count('compare');
      if (a[j] <= pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        rec.count('swap');
        const from = i,
          to = j;
        rec.step('partition', `Đưa ${a[from]} sang phía không lớn hơn chốt.`, (d) => {
          d.values[from] = a[from];
          d.values[to] = a[to];
          d.marks = [{ index: from, role: 'compare' }];
          d.note = `Phân hoạch [${lo}, ${hi}]`;
        });
        i++;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    rec.count('swap');
    rec.step('partition', `Đặt chốt vào vị trí ${i}.`, (d) => {
      d.values[i] = a[i];
      d.values[hi] = a[hi];
      d.marks = [{ index: i, role: 'pivot' }];
      d.note = `Chốt ở ${i}`;
    });
    if (i === target) return finish(rec, target, a[i]);
    if (i > target) hi = i - 1;
    else lo = i + 1;
  }
  throw new Error('Không tìm được phần tử thứ k');
}
