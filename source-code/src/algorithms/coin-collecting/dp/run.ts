import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/coin-collecting/definition';
import {assertActive, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const grid = input.grid;
 const rows = grid.length, cols = grid[0].length;
 const dp = Array.from({length: rows}, () => new Array<number>(cols).fill(0));

 rec.step('init', 'F(0,0) = đồng xu tại ô xuất phát.', d => {
  d.marks = [...d.marks, {row: 0, col: 0, role: 'current', label: String(grid[0][0] ? 1 : 0)}];
  d.note = 'Khởi tạo F(0,0)';
 }, [], 'fill');
 dp[0][0] = grid[0][0] ? 1 : 0;

 for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
   if (i === 0 && j === 0) continue;
   assertActive(signal);
   rec.count('compare');
   const up = i > 0 ? dp[i - 1][j] : -Infinity;
   const left = j > 0 ? dp[i][j - 1] : -Infinity;
   const coin = grid[i][j] ? 1 : 0;
   dp[i][j] = coin + Math.max(up, left);
   const upLabel = up === -Infinity ? '—' : up;
   const leftLabel = left === -Infinity ? '—' : left;
   rec.step('fill', `F(${i},${j}) = ${coin} + max(trên=${upLabel}, trái=${leftLabel}) = ${dp[i][j]}.`, d => {
    d.marks = [...d.marks, {row: i, col: j, role: 'current', label: String(dp[i][j])}];
    d.note = `F(${i},${j}) = ${dp[i][j]}`;
   }, [], 'fill');
  }
 }

 const path: [number, number][] = [];
 let i = rows - 1, j = cols - 1;
 while (i > 0 || j > 0) {
  path.push([i, j]);
  assertActive(signal);
  const up = i > 0 ? dp[i - 1][j] : -Infinity;
  const left = j > 0 ? dp[i][j - 1] : -Infinity;
  rec.step('trace', `Truy vết tại ô (${i},${j}).`, d => {
   d.marks = [...d.marks, {row: i, col: j, role: 'path'}];
   d.note = `Truy vết (${i},${j})`;
  }, [], 'backtrack');
  if (up >= left) i--; else j--;
 }
 path.push([0, 0]);
 path.reverse();

 const value = dp[rows - 1][cols - 1];
 rec.step('done', `Hoàn tất: thu được ${value} đồng xu.`, d => {
  d.marks = [...d.marks, {row: 0, col: 0, role: 'path'}];
  d.note = `Thu được ${value} đồng xu`;
 }, [], 'done');
 return pack(value, path);
}
