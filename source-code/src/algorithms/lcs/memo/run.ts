import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/lcs/definition';
import {assertActive, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {a, b} = input;
  const n = a.length;
  const m = b.length;
  const memo = Array.from({length: n + 1}, () => new Array<number | null>(m + 1).fill(null));

  function solve(i: number, j: number): number {
    assertActive(signal);
    if (i === 0 || j === 0) {
      rec.step(
        'call',
        `solve(${i},${j}) = 0 (một chuỗi rỗng).`,
        (d) => {
          d.matrix[i][j] = 0;
          d.computed[i][j] = true;
          d.current = {i, w: j};
        },
        [],
        'call',
      );
      return 0;
    }
    if (memo[i][j] !== null) {
      rec.step(
        'call',
        `solve(${i},${j}) đã có trong bảng nhớ: ${memo[i][j]}.`,
        (d) => {
          d.current = {i, w: j};
        },
        [],
        'call',
      );
      return memo[i][j]!;
    }
    rec.count('recurse');
    let result: number;
    if (a[i - 1] === b[j - 1]) {
      result = solve(i - 1, j - 1) + 1;
      rec.step(
        'match',
        `a[${i - 1}]='${a[i - 1]}' = b[${j - 1}]='${b[j - 1]}': solve(${i},${j}) = solve(${i - 1},${j - 1}) + 1 = ${result}.`,
        (d) => {
          d.current = {i, w: j};
        },
        [],
        'call',
      );
    } else {
      result = Math.max(solve(i - 1, j), solve(i, j - 1));
      rec.step(
        'mismatch',
        `a[${i - 1}]='${a[i - 1]}' ≠ b[${j - 1}]='${b[j - 1]}': solve(${i},${j}) = max(solve(${i - 1},${j}), solve(${i},${j - 1})) = ${result}.`,
        (d) => {
          d.current = {i, w: j};
        },
        [],
        'call',
      );
    }
    memo[i][j] = result;
    rec.count('assign');
    rec.step(
      'memoize',
      `Nhớ solve(${i},${j}) = ${result}.`,
      (d) => {
        d.matrix[i][j] = result;
        d.computed[i][j] = true;
      },
      [{target: `cell-${i}-${j}`, role: 'current'}],
      'call',
    );
    return result;
  }

  const best = solve(n, m);

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
    } else if ((memo[i - 1][j] ?? 0) >= (memo[i][j - 1] ?? 0)) {
      rec.step(
        'backtrack',
        `Truy vết: solve(${i - 1},${j}) ≥ solve(${i},${j - 1}) — di chuyển lên.`,
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
        `Truy vết: solve(${i},${j - 1}) > solve(${i - 1},${j}) — di chuyển sang trái.`,
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
    `Độ dài LCS tối ưu là ${best}: "${subsequence}".`,
    (d) => {
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(best, subsequence);
}
