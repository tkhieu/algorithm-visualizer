import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/string-matching/definition';
import {assertActive, pack, type VisualState} from '../shared';

function lastOccurrenceBefore(pattern: string, ch: string, before: number): number {
 for (let i = before - 1; i >= 0; i--) if (pattern[i] === ch) return i;
 return -1;
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const {text, pattern} = input;
 const n = text.length, m = pattern.length;
 const positions: number[] = [];

 rec.step('start', 'Boyer–Moore (quy tắc ký tự xấu): so sánh mẫu từ phải sang trái tại mỗi vị trí dịch.', d => {
  d.note = 'Bắt đầu Boyer–Moore';
 }, [], 'start');

 let s = 0;
 while (s + m <= n) {
  assertActive(signal);
  rec.step('shift', `Đặt mẫu tại vị trí ${s}.`, d => {
   d.shift = s;
   d.comparisons = [];
   d.note = `Dịch mẫu tới vị trí ${s}`;
  }, [], 'shift');

  let k = m - 1;
  while (k >= 0) {
   assertActive(signal);
   rec.count('compare');
   const match = text[s + k] === pattern[k];
   rec.step('compare', `So sánh từ phải sang trái: T[${s + k}] = '${text[s + k]}' với ` +
    `P[${k}] = '${pattern[k]}': ${match ? 'khớp' : 'không khớp'}.`, d => {
    d.comparisons = [...d.comparisons, {patternIndex: k, match}];
    d.note = match ? 'Khớp, tiếp tục sang trái' : 'Không khớp, áp dụng quy tắc ký tự xấu';
   }, [{target: `pattern-${k}`, role: match ? 'match' : 'mismatch'}], 'compare');
   if (!match) break;
   k--;
  }

  if (k < 0) {
   positions.push(s);
   rec.step('match', `Khớp hoàn toàn tại vị trí ${s}.`, d => {
    d.note = `Tìm thấy tại vị trí ${s}`;
   }, [], 'match');
   rec.step('shift-by', 'Dịch 1 ô để không bỏ sót các lần khớp chồng lấp.', d => {
    d.note = 'Dịch 1 ô';
   }, [], 'shift-by');
   s += 1;
  } else {
   const c = text[s + k];
   const last = lastOccurrenceBefore(pattern, c, k);
   const shift = Math.max(1, k - last);
   rec.step('shift-by', `Ký tự xấu '${c}' xuất hiện gần nhất ở vị trí ${last} trong mẫu ` +
    `(trước vị trí ${k}); dịch ${shift} ô.`, d => {
    d.note = `Dịch ${shift} ô`;
   }, [], 'shift-by');
   s += shift;
  }
 }

 rec.step('done', `Hoàn tất: tìm thấy ${positions.length} vị trí.`, d => {
  d.note = `Tìm thấy ${positions.length} vị trí`;
 }, [], 'done');
 return pack(positions);
}
