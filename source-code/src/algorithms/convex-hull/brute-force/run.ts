import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/convex-hull/definition';
import { assertActive, cross, pack, type VisualState } from '../shared';

export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const pts = input.points;
  const unique = new Map<string, number>();
  pts.forEach((p, i) => {
    const key = `${p.x},${p.y}`;
    if (!unique.has(key)) unique.set(key, i);
  });
  const ids = [...unique.values()];
  const extremes = new Set<number>();
  rec.step(
    'start',
    'Bỏ điểm trùng; kiểm tra mọi cặp làm đường đỡ của bao lồi.',
    (d) => {
      d.note = 'Bắt đầu kiểm tra từng cặp';
    },
    [],
    'start',
  );
  if (ids.length <= 2) ids.forEach((i) => extremes.add(i));
  for (let a = 0; a < ids.length; a++)
    for (let b = a + 1; b < ids.length; b++) {
      assertActive(signal);
      const i = ids[a],
        j = ids[b];
      let left = false,
        right = false;
      for (const k of ids) {
        rec.count('compare');
        const value = cross(pts[i], pts[j], pts[k]);
        if (value > 0) left = true;
        if (value < 0) right = true;
      }
      const supporting = !(left && right);
      if (supporting) {
        const collinear = ids.filter((k) => cross(pts[i], pts[j], pts[k]) === 0);
        const axis = pts[i].x !== pts[j].x ? 'x' : 'y';
        collinear.sort((u, v) => pts[u][axis] - pts[v][axis]);
        extremes.add(collinear[0]);
        extremes.add(collinear.at(-1)!);
      }
      rec.step(
        'check',
        `Cặp (${i}, ${j}): ${supporting ? 'đường đỡ bao lồi' : 'không phải đường đỡ'}.`,
        (d) => {
          d.segments = [{ from: i, to: j, role: supporting ? 'hull' : 'rejected' }];
          d.note = supporting ? `Cạnh bao lồi (${i}, ${j})` : `Loại cặp (${i}, ${j})`;
        },
        [],
        'check',
      );
    }
  const order = [...extremes];
  if (order.length > 2) {
    const cx = order.reduce((sum, i) => sum + pts[i].x, 0) / order.length;
    const cy = order.reduce((sum, i) => sum + pts[i].y, 0) / order.length;
    order.sort((i, j) => Math.atan2(pts[i].y - cy, pts[i].x - cx) - Math.atan2(pts[j].y - cy, pts[j].x - cx));
  }
  rec.step(
    'done',
    `Hoàn tất: bao lồi có ${order.length} đỉnh cực biên.`,
    (d) => {
      d.hull = order;
      d.note = `Bao lồi có ${order.length} đỉnh`;
    },
    [],
    'done',
  );
  return pack(order);
}
