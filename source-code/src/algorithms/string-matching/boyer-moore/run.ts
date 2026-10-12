import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/string-matching/definition';
import { assertActive, pack, type VisualState } from '../shared';

// Bảng hậu tố tốt "mạnh" (strong good-suffix), dựng bằng border của pattern đảo — khác với
// bảng d2 trong giáo trình Levitin (chỉ dựa trên hậu tố khớp dài nhất, không xét border): bảng
// mạnh cho dịch chuyển lớn hơn hoặc bằng d2 trong mọi trường hợp. shift[j + 1] áp dụng sau khi
// mismatch tại vị trí j.
export function goodSuffixShifts(pattern: string): number[] {
  const m = pattern.length;
  const shift = new Array<number>(m + 1).fill(0);
  const border = new Array<number>(m + 1).fill(0);
  let i = m,
    j = m + 1;
  border[i] = j;
  while (i > 0) {
    while (j <= m && pattern[i - 1] !== pattern[j - 1]) {
      if (shift[j] === 0) shift[j] = j - i;
      j = border[j];
    }
    i--;
    j--;
    border[i] = j;
  }
  j = border[0];
  for (i = 0; i <= m; i++) {
    if (shift[i] === 0) shift[i] = j;
    if (i === j) j = border[j];
  }
  return shift;
}

export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const { text, pattern } = input;
  const n = text.length,
    m = pattern.length;
  const positions: number[] = [];
  const badSymbol: Record<string, number> = {};
  for (let i = 0; i < m; i++) badSymbol[pattern[i]] = i;
  const goodSuffix = goodSuffixShifts(pattern);
  rec.step(
    'start',
    `Bảng ký tự xấu: ${JSON.stringify(badSymbol)}; bảng hậu tố tốt: ${goodSuffix.join(', ')}.`,
    (d) => {
      d.shiftTable = { ...badSymbol };
      d.goodSuffixTable = [...goodSuffix];
      d.note = `Ký tự xấu: ${JSON.stringify(badSymbol)}; hậu tố tốt: ${goodSuffix.join(', ')}`;
    },
    [],
    'start',
  );

  let s = 0;
  while (s + m <= n) {
    assertActive(signal);
    rec.step(
      'shift',
      `Đặt mẫu tại vị trí ${s}.`,
      (d) => {
        d.shift = s;
        d.comparisons = [];
        d.note = `Dịch mẫu tới vị trí ${s}`;
      },
      [],
      'shift',
    );
    let k = m - 1;
    while (k >= 0) {
      assertActive(signal);
      rec.count('compare');
      const match = text[s + k] === pattern[k];
      rec.step(
        'compare',
        `So sánh T[${s + k}] = '${text[s + k]}' với P[${k}] = '${pattern[k]}': ` + `${match ? 'khớp' : 'không khớp'}.`,
        (d) => {
          d.comparisons = [...d.comparisons, { patternIndex: k, match }];
          d.note = match ? 'Khớp, tiếp tục sang trái' : 'Không khớp';
        },
        [{ target: `pattern-${k}`, role: match ? 'match' : 'mismatch' }],
        'compare',
      );
      if (!match) break;
      k--;
    }
    if (k < 0) {
      positions.push(s);
      rec.step(
        'match',
        `Khớp hoàn toàn tại vị trí ${s}.`,
        (d) => {
          d.note = `Tìm thấy tại vị trí ${s}`;
        },
        [],
        'match',
      );
    }
    const badShift = k < 0 ? 1 : Math.max(1, k - (badSymbol[text[s + k]] ?? -1));
    const suffixShift = goodSuffix[k + 1];
    const chosen = Math.max(badShift, suffixShift);
    rec.step(
      'shift-by',
      `Bảng ký tự xấu: ${badShift}; bảng hậu tố tốt: ${suffixShift}; ` + `chọn dịch max = ${chosen} ô.`,
      (d) => {
        d.chosenShift = chosen;
        d.note = `Dịch ${chosen} ô`;
      },
      [],
      'shift-by',
    );
    s += chosen;
  }
  rec.step(
    'done',
    `Hoàn tất: tìm thấy ${positions.length} vị trí.`,
    (d) => {
      d.note = `Tìm thấy ${positions.length} vị trí`;
    },
    [],
    'done',
  );
  return pack(positions);
}
