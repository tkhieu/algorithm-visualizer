import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/coin-row/definition';
import {assertActive, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const values = input.values;
 const n = values.length;
 const memo = new Array<number | undefined>(n + 1).fill(undefined);
 memo[0] = 0;

 function solve(i: number): number {
  assertActive(signal);
  if (memo[i] !== undefined) {
   rec.step('memo-hit', `F(${i}) đã có trong bộ nhớ: ${memo[i]}.`, d => {
    d.current = i - 1 >= 0 ? i - 1 : undefined;
    d.note = `F(${i}) = ${memo[i]} (đã nhớ)`;
   }, [], 'call');
   return memo[i]!;
  }

  rec.count('recurse');
  rec.step('call', `Gọi đệ quy F(${i}).`, d => {
   d.current = i - 1 >= 0 ? i - 1 : undefined;
   d.note = `Gọi F(${i})`;
  }, [], 'call');

  const left = solve(i - 1);
  const right = (i >= 2 ? solve(i - 2) : 0) + values[i - 1];
  const value = Math.max(left, right);
  memo[i] = value;
  const prevIndex = i - 2 >= 0 ? i - 2 : 0;
  rec.step('compute', `F(${i}) = max(F(${i - 1})=${left}, F(${prevIndex})+c${i}=${right}) = ${value}.`, d => {
   d.table = [...d.table, {i, F: value}];
   d.current = i - 1;
   d.note = `F(${i}) = ${value}`;
  }, [{target: `item-${i - 1}`, role: 'current'}], 'fill');
  return value;
 }

 const total = n === 0 ? 0 : solve(n);
 const selected: number[] = [];
 let i = n;
 while (i > 0) {
  assertActive(signal);
  const prev = memo[i - 1]!;
  const take = memo[i] !== prev;
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

 rec.step('done', `Hoàn tất: tổng tối ưu ${total}.`, d => {
  d.note = `Tổng tối ưu ${total}`;
 }, [], 'done');
 return pack(total, selected);
}
