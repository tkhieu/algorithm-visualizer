import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/linear-programming-2d/definition';
import {assertActive, orderByAngle, pack, type VisualState} from '../shared';

interface Line {a: number; b: number; c: number}
const EPS = 1e-6;

function collectFeasibleVertices(lines: Line[]): {x: number; y: number}[] {
 const satisfiesAll = (x: number, y: number) => lines.every(l => l.a * x + l.b * y <= l.c + 1e-4);
 const vertices: {x: number; y: number}[] = [];
 for (let i = 0; i < lines.length; i++) {
  for (let j = i + 1; j < lines.length; j++) {
   const l1 = lines[i], l2 = lines[j];
   const det = l1.a * l2.b - l2.a * l1.b;
   if (Math.abs(det) < EPS) continue;
   const x = (l1.c * l2.b - l2.c * l1.b) / det;
   const y = (l1.a * l2.c - l2.a * l1.c) / det;
   if (!satisfiesAll(x, y)) continue;
   if (!vertices.some(v => Math.abs(v.x - x) < 1e-4 && Math.abs(v.y - y) < 1e-4)) vertices.push({x, y});
  }
 }
 return vertices;
}

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const lines: Line[] = [{a: -1, b: 0, c: 0}, {a: 0, b: -1, c: 0}, ...input.constraints];
 const polygon = orderByAngle(collectFeasibleVertices(lines));
 const n = polygon.length;
 const value = (v: {x: number; y: number}) => input.objective.cx * v.x + input.objective.cy * v.y;

 rec.step('start', `Sắp ${n} đỉnh miền khả thi quanh biên; xuất phát từ đỉnh 0.`, d => {
  d.points = polygon.map((v, i) => ({x: v.x, y: v.y, role: i === 0 ? 'current' : 'vertex'}));
  d.feasibleRegion = [...polygon];
  d.note = 'Xuất phát từ đỉnh 0';
 }, [], 'start');

 let current = 0;
 if (n > 0) {
  let improved = true;
  while (improved) {
   assertActive(signal);
   improved = false;
   const next = (current + 1) % n;
   const prev = (current - 1 + n) % n;
   rec.count('compare');
   if (value(polygon[next]) > value(polygon[current]) + EPS) {
    current = next;
    improved = true;
   } else if (value(polygon[prev]) > value(polygon[current]) + EPS) {
    current = prev;
    improved = true;
   }
   rec.step('walk', `Tại đỉnh ${current} (giá trị ${value(polygon[current]).toFixed(2)}); ` +
    `${improved ? 'di chuyển sang đỉnh kề tốt hơn' : 'không còn đỉnh kề tốt hơn, dừng'}.`, d => {
    d.points = polygon.map((v, i) => ({x: v.x, y: v.y, role: i === current ? 'current' : 'vertex'}));
    d.note = `Đỉnh hiện tại: ${current}`;
   }, [], 'walk');
  }
 }

 const best = n > 0 ? polygon[current] : {x: 0, y: 0};
 const bestValue = n > 0 ? value(best) : 0;

 rec.step('done', `Hoàn tất: đỉnh tối ưu (${best.x.toFixed(2)}, ${best.y.toFixed(2)}), ` +
  `giá trị ${bestValue.toFixed(2)}.`, d => {
  d.points = polygon.map((v, i) => ({x: v.x, y: v.y, role: i === current ? 'root' : 'vertex'}));
  d.note = `Tối ưu tại (${best.x.toFixed(2)}, ${best.y.toFixed(2)})`;
 }, [], 'done');

 return pack(best.x, best.y, bestValue);
}
