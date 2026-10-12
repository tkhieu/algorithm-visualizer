import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/lcs/definition';
import {assertActive, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {a, b} = input;
  const n = a.length;
  const m = b.length;
  const dp = Array.from({length: n + 1}, () => new Array<number>(m + 1).fill(0));

  rec.step(
    'init',
    'Hàng 0 và cột 0 bằng 0 vì chuỗi rỗng không có dãy con chung.',
    (d) => {
      for (let i = 0; i <= n; i++) {
        d.matrix[i][0] = 0;
        d.computed[i][0] = true;
      }
      for (let j = 0; j <= m; j++) {
        d.matrix[0][j] = 0;
        d.computed[0][j] = true;
      }
    },
    [],
    'build-table',
  );

  for (let i = 1; i <= n; i++) {
    assertActive(signal);
    for (let j = 1; j <= m; j++) {
      rec.count('compare');
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        rec.count('assign');
        rec.step(
          'match',
          `a[${i - 1}]='${a[i - 1]}' = b[${j - 1}]='${b[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`,
          (d) => {
            d.matrix[i][j] = dp[i][j];
            d.computed[i][j] = true;
            d.current = {i, w: j};
            d.dependencies = [[i - 1, j - 1]];
          },
          [{target: `cell-${i}-${j}`, role: 'current'}],
          'build-table',
        );
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        rec.count('assign');
        rec.step(
          'mismatch',
          `a[${i - 1}]='${a[i - 1]}' ≠ b[${j - 1}]='${b[j - 1]}': dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${dp[i][j]}.`,
          (d) => {
            d.matrix[i][j] = dp[i][j];
            d.computed[i][j] = true;
            d.current = {i, w: j};
            d.dependencies = [
              [i - 1, j],
              [i, j - 1],
            ];
          },
          [{target: `cell-${i}-${j}`, role: 'current'}],
          'build-table',
        );
      }
    }
  }

  let i = n;
  let j = m;
  const chars: string[] = [];
  while (i > 0 && j > 0) {
    assertActive(signal);
    if (a[i - 1] === b[j - 1]) {
      chars.push(a[i - 1]);
      rec.step(
        'backtrack',
        `Truy vết: a[${i - 1}] = b[${j - 1}] = '${a[i - 1]}' — thêm vào dãy con.`,
        (d) => {
          d.current = {i, w: j};
          d.backtrack.push([i, j]);
        },
        [{target: `cell-${i}-${j}`, role: 'chosen'}],
        'backtrack',
      );
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      rec.step(
        'backtrack',
        `Truy vết: dp[${i - 1}][${j}] ≥ dp[${i}][${j - 1}] — di chuyển lên.`,
        (d) => {
          d.current = {i, w: j};
          d.backtrack.push([i, j]);
        },
        [],
        'backtrack',
      );
      i--;
    } else {
      rec.step(
        'backtrack',
        `Truy vết: dp[${i}][${j - 1}] > dp[${i - 1}][${j}] — di chuyển sang trái.`,
        (d) => {
          d.current = {i, w: j};
          d.backtrack.push([i, j]);
        },
        [],
        'backtrack',
      );
      j--;
    }
  }
  const subsequence = chars.reverse().join('');
  rec.step(
    'done',
    `Độ dài LCS tối ưu là ${dp[n][m]}: "${subsequence}".`,
    (d) => {
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(dp[n][m], subsequence);
}
