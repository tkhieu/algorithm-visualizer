import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/subset-sum/definition';
import {assertActive, pack, type VisualState} from '../shared';
// n > SAFE_MAX bị chặn trước khi tới đây bằng precondition của algorithm (index.ts), nên hiện
// Vietnamese "Không áp dụng" trên UI thay vì ném lỗi; run() không tự kiểm tra lại giới hạn này.
export const SAFE_MAX = 12;
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {values, target} = input;
  const n = values.length;
  if (target === 0) {
    rec.step('done', 'Tập con rỗng có tổng bằng 0.', (d) => {
      d.note = 'Tìm được tập con rỗng';
    }, [], 'done');
    return pack([]);
  }
  let nextId = 0;
  let found: number[] | null = null;
  const rootId = nextId++;
  rec.step(
    'init',
    `Sinh mọi tập con của ${n} phần tử bằng lấy/bỏ từng phần tử.`,
    (d) => {
      d.nodes.push({id: rootId, parent: null, label: '∅', status: 'current', value: 0});
    },
    [],
    'search',
  );
  function visit(i: number, sum: number, chosen: number[], parent: number): boolean {
    assertActive(signal);
    if (i === n) {
      rec.count('compare');
      const ok = sum === target;
      const id = nextId++;
      rec.step(
        'check',
        ok ? `Tập con tổng = ${sum} = S — nghiệm.` : `Tập con tổng = ${sum} ≠ S.`,
        (d) => {
          d.nodes.push({id, parent, label: `Σ=${sum}`, status: ok ? 'best' : 'done', value: sum});
        },
        [],
        'leaf',
      );
      if (ok) {
        found = chosen.slice();
        return true;
      }
      return false;
    }
    for (const take of [true, false]) {
      rec.count('visit');
      const id = nextId++;
      const newSum = sum + (take ? values[i] : 0);
      const newChosen = take ? [...chosen, i] : chosen;
      rec.step(
        'branch',
        `${take ? 'Lấy' : 'Bỏ'} phần tử ${i} (giá trị ${values[i]}).`,
        (d) => {
          d.nodes.push({id, parent, label: `${take ? '+' : '-'}${values[i]}`, status: 'current', value: newSum});
        },
        [],
        'search',
      );
      if (visit(i + 1, newSum, newChosen, id)) return true;
    }
    return false;
  }
  const ok = visit(0, 0, [], rootId);
  rec.step(
    'done',
    ok ? `Hoàn tất: tìm được tập con tổng ${target}.` : 'Hoàn tất: đã thử hết mọi tập con, không có nghiệm.',
    (d) => {
      d.note = ok ? 'Tìm được tập con' : 'Không có tập con';
    },
    [],
    'done',
  );
  return pack(found);
}
