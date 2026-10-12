import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/matrix-multiplication/definition';
import { finish, type VisualState } from '../shared';
export function run({ a, b }: Input, { rec, signal }: RunContext<VisualState>): Output {
  const n = a.length,
    c = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++) {
        if (signal.aborted) throw new Error('Đã huỷ');
        c[i][j] += a[i][k] * b[k][j];
        rec.count('assign');
        rec.step(
          'accumulate',
          `C[${i},${j}] cộng A[${i},${k}]×B[${k},${j}] = ${a[i][k]}×${b[k][j]}, được ${c[i][j]}.`,
          (d) => {
            d.matrix[i][j] = c[i][j];
            d.current = { i, w: j };
            d.note = `Đang tính C[${i},${j}]`;
          }
        );
      }
  return finish(rec, c);
}
