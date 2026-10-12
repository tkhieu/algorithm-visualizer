import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/tsp/definition';
import {dist} from '../../../problems/tsp/checker';
import {assertActive, markTour, pack, type VisualState} from '../shared';

export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {points} = input;
  const n = points.length;
  if (n <= 1) {
    const tour = n === 1 ? [0] : [];
    rec.step('done', 'Chỉ có tối đa một điểm — hành trình tầm thường.', (d) => markTour(d, tour), [], 'done');
    return pack(points, tour);
  }
  const tour = [0];
  const visited = new Set([0]);
  rec.step('init', 'Bắt đầu từ điểm 0.', (d) => markTour(d, tour), [], 'search');
  while (tour.length < n) {
    assertActive(signal);
    const current = tour[tour.length - 1];
    let nearest = -1;
    let nearestDist = Infinity;
    for (let i = 0; i < n; i++) {
      if (visited.has(i)) continue;
      rec.count('compare');
      const d = dist(points[current], points[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    }
    rec.step(
      'nearest',
      `Điểm gần ${current} nhất trong các điểm chưa thăm là ${nearest} (khoảng cách ${nearestDist.toFixed(2)}).`,
      (d) => markTour(d, tour),
      [{target: `point-${nearest}`, role: 'current'}],
      'search',
    );
    tour.push(nearest);
    visited.add(nearest);
    rec.step('move', `Di chuyển đến điểm ${nearest}.`, (d) => markTour(d, tour), [], 'search');
  }
  rec.step(
    'done',
    `Hoàn tất: quay về điểm xuất phát 0, độ dài ${pack(points, tour).length.toFixed(2)}.`,
    (d) => {
      markTour(d, tour);
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(points, tour);
}
