import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/closest-pair/definition';
import {assertActive, dist, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
 const pts = input.points;
 let best = Infinity, bi = 0, bj = 1;

 rec.step('start', 'So từng cặp điểm để tìm khoảng cách nhỏ nhất.', d => {
  d.note = 'Bắt đầu so từng cặp điểm';
 }, [], 'start');

 for (let i = 0; i < pts.length; i++) {
  for (let j = i + 1; j < pts.length; j++) {
   assertActive(signal);
   rec.count('compare');
   const d = dist(pts[i], pts[j]);
   rec.step('compare', `So khoảng cách điểm ${i} và điểm ${j}: ${d.toFixed(3)}.`, draft => {
    draft.segments = [{from: i, to: j, role: 'current'}];
    draft.note = `So điểm ${i} và điểm ${j}`;
   }, [], 'compare');

   if (d < best) {
    best = d; bi = i; bj = j;
    rec.step('better', `Cặp (${i}, ${j}) có khoảng cách nhỏ hơn: ${d.toFixed(3)}.`, draft => {
     draft.segments = [{from: i, to: j, role: 'closest'}];
     draft.note = `Cặp gần nhất hiện tại: ${i}, ${j}`;
    }, [], 'better');
   }
  }
 }

 rec.step('done', `Hoàn tất: cặp gần nhất (${bi}, ${bj}) với khoảng cách ${best.toFixed(3)}.`, draft => {
  draft.segments = [{from: bi, to: bj, role: 'closest'}];
  draft.note = 'Hoàn tất';
 }, [], 'done');
 return pack(bi, bj, best);
}
