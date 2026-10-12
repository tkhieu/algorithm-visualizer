import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/lcs/definition';
import {assertActive, pack, type VisualState} from '../shared';

const SAFE_TOTAL = 16;

/**
 * Đệ quy thuần theo đúng công thức LCS nhưng không nhớ kết quả — độ phức tạp mũ O(2^(n+m)).
 * Giữ nguyên cấu trúc đệ quy của DP (match / hai nhánh mismatch) để minh hoạ vì sao cần quy hoạch động.
 */
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {a, b} = input;
  const n = a.length;
  const m = b.length;
  if (n + m > SAFE_TOTAL) {
    throw new Error(
      `Vét cạn chỉ hỗ trợ tổng độ dài hai chuỗi ≤ ${SAFE_TOTAL} (nhận ${n + m}); hãy dùng quy hoạch động cho chuỗi dài hơn.`,
    );
  }

  function solve(i: number, j: number): string {
    assertActive(signal);
    rec.count('recurse');
    if (i === 0 || j === 0) {
      rec.step(
        'check',
        `solve(${i},${j}) = "" (một chuỗi rỗng).`,
        (d) => {
          d.current = {i, w: j};
        },
        [],
        'search',
      );
      return '';
    }
    if (a[i - 1] === b[j - 1]) {
      const sub = solve(i - 1, j - 1) + a[i - 1];
      rec.step(
        'branch',
        `a[${i - 1}]='${a[i - 1]}' = b[${j - 1}]='${b[j - 1]}': nối thêm vào kết quả.`,
        (d) => {
          d.current = {i, w: j};
        },
        [{target: `cell-${i}-${j}`, role: 'current'}],
        'search',
      );
      return sub;
    }
    rec.count('compare');
    const left = solve(i - 1, j);
    const right = solve(i, j - 1);
    const best = left.length >= right.length ? left : right;
    rec.step(
      'compare',
      `a[${i - 1}] ≠ b[${j - 1}]: so sánh nhánh bỏ a[${i - 1}] (dài ${left.length}) và bỏ b[${j - 1}] (dài ${right.length}); chọn dài ${best.length}.`,
      (d) => {
        d.current = {i, w: j};
      },
      [],
      'search',
    );
    return best;
  }

  const subsequence = solve(n, m);
  rec.step(
    'done',
    `Độ dài LCS tối ưu là ${subsequence.length}: "${subsequence}".`,
    (d) => {
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(subsequence.length, subsequence);
}
