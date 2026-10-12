import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/string-matching/definition';
import {assertActive, pack, type VisualState} from '../shared';

function buildShiftTable(pattern: string): Record<string, number> {
 const m = pattern.length;
 const table: Record<string, number> = {};
 for (let i = 0; i < m - 1; i++) table[pattern[i]] = m - 1 - i;
 return table;
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const {text, pattern} = input;
 const n = text.length, m = pattern.length;
 const table = buildShiftTable(pattern);
 const positions: number[] = [];

 rec.step('table', `Xây bảng dịch Horspool: với mỗi ký tự trong ${m - 1} ký tự đầu của mẫu, ` +
  'lưu khoảng cách tới cuối mẫu.', d => {
  d.shiftTable = {...table};
  d.note = 'Xây bảng dịch';
 }, [], 'table');

 let s = 0;
 while (s + m <= n) {
  assertActive(signal);
  rec.step('shift', `Đặt mẫu tại vị trí ${s}.`, d => {
   d.shift = s;
   d.comparisons = [];
   d.note = `Dịch mẫu tới vị trí ${s}`;
  }, [], 'shift');

  let j = m - 1;
  while (j >= 0) {
   assertActive(signal);
   rec.count('compare');
   const match = text[s + j] === pattern[j];
   rec.step('compare', `So sánh từ phải sang trái: T[${s + j}] = '${text[s + j]}' với ` +
    `P[${j}] = '${pattern[j]}': ${match ? 'khớp' : 'không khớp'}.`, d => {
    d.comparisons = [...d.comparisons, {patternIndex: j, match}];
    d.note = match ? 'Khớp, tiếp tục sang trái' : 'Không khớp';
   }, [{target: `pattern-${j}`, role: match ? 'match' : 'mismatch'}], 'compare');
   if (!match) break;
   j--;
  }

  const lastChar = text[s + m - 1];
  const shift = table[lastChar] ?? m;
  if (j < 0) {
   positions.push(s);
   rec.step('match', `Khớp hoàn toàn tại vị trí ${s}.`, d => {
    d.note = `Tìm thấy tại vị trí ${s}`;
   }, [], 'match');
  }
  rec.step('shift-by', `Dịch ${shift} ô theo bảng dịch của ký tự cuối cửa sổ '${lastChar}'.`, d => {
   d.note = `Dịch ${shift} ô`;
  }, [], 'shift-by');
  s += shift;
 }

 rec.step('done', `Hoàn tất: tìm thấy ${positions.length} vị trí.`, d => {
  d.note = `Tìm thấy ${positions.length} vị trí`;
 }, [], 'done');
 return pack(positions);
}
