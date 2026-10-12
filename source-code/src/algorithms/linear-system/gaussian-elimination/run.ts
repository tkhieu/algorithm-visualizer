import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/linear-system/definition';
import { finish, type VisualState } from '../shared';
export function run({ a, b }: Input, { rec, signal }: RunContext<VisualState>): Output {
  const n = a.length,
    m = a.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k++) {
    if (signal.aborted) throw new Error('Đã huỷ');
    let pivot = k;
    for (let i = k + 1; i < n; i++) {
      rec.count('compare');
      if (Math.abs(m[i][k]) > Math.abs(m[pivot][k])) pivot = i;
    }
    if (pivot !== k) {
      [m[k], m[pivot]] = [m[pivot], m[k]];
      rec.count('swap');
      rec.step('pivot', `Đổi hàng ${k} với hàng ${pivot} để chọn chốt lớn hơn.`, (d) => {
        d.matrix = m.map((row) => [...row]);
        d.current = { i: k, w: k };
        d.note = `Chốt hàng ${k}`;
      });
    } else
      rec.step('pivot', `Chọn phần tử ${m[k][k]} ở hàng ${k} làm chốt.`, (d) => {
        d.current = { i: k, w: k };
        d.note = `Chốt ${m[k][k]}`;
      });
    for (let i = k + 1; i < n; i++) {
      const factor = m[i][k] / m[k][k];
      for (let j = k; j <= n; j++) m[i][j] -= factor * m[k][j];
      rec.count('assign', n - k + 1);
      rec.step(
        'eliminate',
        `Khử A[${i},${k}] bằng cách trừ ${factor.toFixed(4)} lần hàng ${k}.`,
        (d) => {
          d.matrix = m.map((row) => [...row]);
          d.current = { i, w: k };
          d.note = `Đã khử hàng ${i}`;
        }
      );
    }
  }
  const solution = Array<number>(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = m[i][n];
    for (let j = i + 1; j < n; j++) sum -= m[i][j] * solution[j];
    solution[i] = sum / m[i][i];
    rec.count('assign');
    rec.step('back-substitute', `Thế ngược, x[${i}] = ${solution[i]}.`, (d) => {
      d.matrix[i][n] = solution[i];
      d.current = { i, w: n };
      d.note = `x[${i}] = ${solution[i]}`;
    });
  }
  return finish(rec, solution);
}
