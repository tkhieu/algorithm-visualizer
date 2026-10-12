import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/coin-row/definition';
import {assertActive, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const values = input.values;
 const n = values.length;
 const dp = new Array<number>(n + 1).fill(0);

 rec.step('init', 'F(0) = 0: chưa xét đồng xu nào.', d => {
  d.table = [{i: 0, F: 0}];
  d.note = 'F(0) = 0';
 }, [], 'fill');

 for (let i = 1; i <= n; i++) {
  assertActive(signal);
  rec.count('compare');
  const left = dp[i - 1];
  const right = (i >= 2 ? dp[i - 2] : 0) + values[i - 1];
  dp[i] = Math.max(left, right);
  const prevIndex = i - 2 >= 0 ? i - 2 : 0;
  rec.step('fill', `F(${i}) = max(F(${i - 1})=${left}, F(${prevIndex})+c${i}=${right}) = ${dp[i]}.`, d => {
   d.table = [...d.table, {i, F: dp[i]}];
   d.current = i - 1;
   d.note = `F(${i}) = ${dp[i]}`;
  }, [{target: `item-${i - 1}`, role: 'current'}], 'fill');
 }

 const selected: number[] = [];
 let i = n;
 while (i > 0) {
  assertActive(signal);
  const take = dp[i] !== dp[i - 1];
  if (take) {
   selected.push(i - 1);
   rec.step('take', `Chọn đồng xu ${i} (giá trị ${values[i - 1]}) khi truy vết.`, d => {
    d.items = d.items.map((it, idx) => idx === i - 1 ? {...it, role: 'taken'} : it);
    d.current = i - 1;
    d.note = `Chọn đồng xu ${i}`;
   }, [{target: `item-${i - 1}`, role: 'taken'}], 'backtrack');
   i -= 2;
  } else {
   rec.step('skip', `Bỏ qua đồng xu ${i} khi truy vết.`, d => {
    d.items = d.items.map((it, idx) => idx === i - 1 ? {...it, role: 'skipped'} : it);
    d.current = i - 1;
    d.note = `Bỏ qua đồng xu ${i}`;
   }, [{target: `item-${i - 1}`, role: 'skipped'}], 'backtrack');
   i -= 1;
  }
 }

 rec.step('done', `Hoàn tất: tổng tối ưu ${dp[n]}.`, d => {
  d.note = `Tổng tối ưu ${dp[n]}`;
 }, [], 'done');
 return pack(dp[n], selected);
}
