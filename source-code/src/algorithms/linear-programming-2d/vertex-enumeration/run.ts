import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/linear-programming-2d/definition';
import {assertActive, orderByAngle, pack, type VisualState} from '../shared';

interface Line {a: number; b: number; c: number}
const EPS = 1e-6;

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const lines: Line[] = [{a: -1, b: 0, c: 0}, {a: 0, b: -1, c: 0}, ...input.constraints];
 const satisfiesAll = (x: number, y: number) => lines.every(l => l.a * x + l.b * y <= l.c + 1e-4);

 rec.step('start', `Liệt kê giao điểm của mọi cặp trong ${lines.length} đường ràng buộc.`, d => {
  d.note = 'Bắt đầu liệt kê đỉnh';
 }, [], 'start');

 const vertices: {x: number; y: number}[] = [];
 for (let i = 0; i < lines.length; i++) {
  for (let j = i + 1; j < lines.length; j++) {
   assertActive(signal);
   rec.count('compare');
   const l1 = lines[i], l2 = lines[j];
   const det = l1.a * l2.b - l2.a * l1.b;
   if (Math.abs(det) < EPS) continue;
   const x = (l1.c * l2.b - l2.c * l1.b) / det;
   const y = (l1.a * l2.c - l2.a * l1.c) / det;
   const feasible = satisfiesAll(x, y);
   const isNewVertex = !vertices.some(v => Math.abs(v.x - x) < 1e-4 && Math.abs(v.y - y) < 1e-4);
   if (feasible && isNewVertex) vertices.push({x, y});

   rec.step('check', `Giao điểm của đường ${i + 1} và ${j + 1}: (${x.toFixed(2)}, ${y.toFixed(2)}) ` +
    `${feasible ? 'khả thi' : 'không khả thi'}.`, d => {
    d.points = vertices.map(v => ({x: v.x, y: v.y, role: 'vertex'}));
    d.feasibleRegion = orderByAngle(vertices);
    d.note = feasible ? `Đỉnh khả thi (${x.toFixed(2)}, ${y.toFixed(2)})` : 'Giao điểm không khả thi';
   }, [], 'check');
  }
 }

 let best = {x: 0, y: 0, value: -Infinity};
 for (const v of vertices) {
  const value = input.objective.cx * v.x + input.objective.cy * v.y;
  if (value > best.value) best = {x: v.x, y: v.y, value};
 }

 rec.step('done', `Hoàn tất: đỉnh tối ưu (${best.x.toFixed(2)}, ${best.y.toFixed(2)}), ` +
  `giá trị ${best.value.toFixed(2)}.`, d => {
  d.points = vertices.map(v => ({
   x: v.x,
   y: v.y,
   role: Math.abs(v.x - best.x) < 1e-4 && Math.abs(v.y - best.y) < 1e-4 ? 'root' : 'vertex',
  }));
  d.feasibleRegion = orderByAngle(vertices);
  d.note = `Tối ưu tại (${best.x.toFixed(2)}, ${best.y.toFixed(2)})`;
 }, [], 'done');

 return pack(best.x, best.y, best.value);
}
