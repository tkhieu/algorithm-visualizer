import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/subset-sum/definition';
import {assertActive, pack, type VisualState} from '../shared';
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {values, target} = input;
  const n = values.length;
  const dp = Array.from({length: n + 1}, () => new Array<boolean>(target + 1).fill(false));
  dp[0][0] = true;
  rec.step(
    'init',
    'dp[0][0] = true (tổng rỗng đạt được 0); các dp[0][s] khác đều false.',
    (d) => {
      d.matrix = Array.from({length: n + 1}, () => new Array<number | null>(target + 1).fill(null));
      d.computed = Array.from({length: n + 1}, () => new Array<boolean>(target + 1).fill(false));
      for (let s = 0; s <= target; s++) {
        d.matrix[0][s] = s === 0 ? 1 : 0;
        d.computed[0][s] = true;
      }
    },
    [],
    'build-table',
  );
  for (let i = 1; i <= n; i++) {
    assertActive(signal);
    for (let s = 0; s <= target; s++) {
      rec.count('compare');
      const without = dp[i - 1][s];
      const withTaken = s >= values[i - 1] && dp[i - 1][s - values[i - 1]];
      dp[i][s] = without || withTaken;
      rec.count('assign');
      rec.step(
        'cell',
        `dp[${i}][${s}]: bỏ phần tử ${i} → ${without}; lấy phần tử ${i} (giá trị ${values[i - 1]}) → ${s >= values[i - 1] ? withTaken : 'không áp dụng'}; kết quả = ${dp[i][s]}.`,
        (d) => {
          d.matrix[i][s] = dp[i][s] ? 1 : 0;
          d.computed[i][s] = true;
          d.current = {i, w: s};
        },
        [{target: `cell-${i}-${s}`, role: 'current'}],
        'build-table',
      );
    }
  }
  let indices: number[] | null = null;
  if (dp[n][target]) {
    indices = [];
    let s = target;
    for (let i = n; i > 0; i--) {
      assertActive(signal);
      const take = s >= values[i - 1] && dp[i - 1][s - values[i - 1]] && !dp[i - 1][s];
      rec.step(
        'backtrack',
        `${take ? 'Chọn' : 'Bỏ'} phần tử ${i} khi truy vết tại dp[${i}][${s}].`,
        (d) => {
          d.current = {i, w: s};
          d.backtrack.push([i, s]);
        },
        [{target: `item-${i - 1}`, role: take ? 'chosen' : 'rejected'}],
        'backtrack',
      );
      if (take) {
        indices.push(i - 1);
        s -= values[i - 1];
      }
    }
  }
  rec.step(
    'done',
    indices ? `Tìm được tập con, tổng = ${target}.` : 'Không có tập con.',
    (d) => {
      d.note = indices ? 'Tìm được tập con' : 'Không có tập con';
    },
    [],
    'done',
  );
  return pack(indices);
}
