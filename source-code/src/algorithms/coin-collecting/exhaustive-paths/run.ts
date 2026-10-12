import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/coin-collecting/definition';
import {assertActive, pack, type VisualState} from '../shared';

interface Result {value: number; cells: [number, number][]}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const grid = input.grid;
 const rows = grid.length, cols = grid[0].length;

 function solve(i: number, j: number): Result {
  assertActive(signal);
  rec.count('recurse');
  const here = grid[i][j] ? 1 : 0;
  rec.step('visit', `Thăm ô (${i},${j}).`, d => {
   d.marks = [...d.marks.filter(m => m.role !== 'current'), {row: i, col: j, role: 'current'}];
   d.note = `Thăm ô (${i},${j})`;
  }, [], 'search');

  if (i === rows - 1 && j === cols - 1) return {value: here, cells: [[i, j]]};

  let best: Result | null = null;
  if (i < rows - 1) {
   const r = solve(i + 1, j);
   best = {value: here + r.value, cells: [[i, j], ...r.cells]};
  }
  if (j < cols - 1) {
   const r = solve(i, j + 1);
   const cand: Result = {value: here + r.value, cells: [[i, j], ...r.cells]};
   if (best === null || cand.value > best.value) best = cand;
  }
  return best!;
 }

 const result = solve(0, 0);
 rec.step('done', `Hoàn tất: tốt nhất trong mọi đường đi là ${result.value} đồng xu.`, d => {
  d.marks = [
   ...d.marks.filter(m => m.role !== 'current'),
   ...result.cells.map(([r, c]) => ({row: r, col: c, role: 'path'})),
  ];
  d.note = `Tốt nhất: ${result.value} đồng xu`;
 }, [], 'done');
 return pack(result.value, result.cells);
}
