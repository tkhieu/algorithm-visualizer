import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/change-making/definition';
import {assertActive, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const {amount, coins} = input;
 const sorted = [...coins].sort((a, b) => b - a);
 let remaining = amount;
 const used: number[] = [];

 rec.step('start', `Sắp mệnh giá giảm dần: ${sorted.join(', ')}.`, d => {
  d.note = 'Sắp mệnh giá giảm dần';
 }, [], 'start');

 for (const c of sorted) {
  while (remaining >= c) {
   assertActive(signal);
   rec.count('assign');
   const before = remaining;
   used.push(c);
   remaining -= c;
   rec.step('take', `Dùng đồng ${c} (còn ${before} trước khi lấy), còn lại ${remaining}.`, d => {
    d.matrix[0][before] = c;
    d.computed[0][before] = true;
    d.current = {i: 0, w: remaining};
    d.note = `Dùng đồng ${c}, còn ${remaining}`;
   }, [], 'take');
  }
 }

 const leftover = remaining > 0 ? `, còn dư ${remaining} không đổi được` : '';
 rec.step('done', `Hoàn tất: dùng ${used.length} đồng xu${leftover}.`, d => {
  d.note = `Dùng ${used.length} đồng xu`;
 }, [], 'done');
 return pack(used);
}
