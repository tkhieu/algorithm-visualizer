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
  const n = ids.length;
  if (n === 1) {
    const hull = [ids[0]];
    rec.step(
      'done',
      'Chỉ có một điểm phân biệt.',
      (d) => {
        d.hull = hull;
        d.note = 'Một đỉnh';
      },
      [],
      'done',
    );
    return pack(hull);
  }
  let a = ids[0],
    b = ids[0];
  for (const i of ids.slice(1)) {
    if (pts[i].x < pts[a].x || (pts[i].x === pts[a].x && pts[i].y < pts[a].y)) a = i;
    if (pts[i].x > pts[b].x || (pts[i].x === pts[b].x && pts[i].y > pts[b].y)) b = i;
  }

  rec.step(
    'extreme',
    `Tìm điểm cực trái (${a}) và cực phải (${b}) theo x.`,
    (d) => {
      d.segments = [{ from: a, to: b, role: 'hull' }];
      d.note = `Điểm cực trái ${a}, cực phải ${b}`;
    },
    [],
    'extreme',
  );

  const rest = ids.filter((i) => i !== a && i !== b);
  const left = rest.filter((i) => cross(pts[a], pts[b], pts[i]) > 0);
  const right = rest.filter((i) => cross(pts[a], pts[b], pts[i]) < 0);
  rec.step(
    'partition',
    `Chia các điểm còn lại theo hai phía của đoạn ${a}${b}: ` +
      `${left.length} điểm phía trên, ${right.length} điểm phía dưới.`,
    (d) => {
      d.note = `Phân hoạch: ${left.length} trên, ${right.length} dưới`;
    },
    [],
    'partition',
  );

  function quickHull(set: number[], p: number, q: number): number[] {
    assertActive(signal);
    if (set.length === 0) return [];

    let far = set[0],
      farDist = cross(pts[p], pts[q], pts[far]);
    for (const idx of set) {
      rec.count('compare');
      const d = cross(pts[p], pts[q], pts[idx]);
      if (d > farDist) {
        far = idx;
        farDist = d;
      }
    }

    rec.step(
      'farthest',
      `Điểm xa nhất khỏi đoạn ${p}${q} là ${far}.`,
      (d) => {
        d.segments = [
          { from: p, to: q, role: 'checking' },
          { from: p, to: far, role: 'hull' },
          { from: far, to: q, role: 'hull' },
        ];
        d.note = `Điểm xa nhất: ${far}`;
      },
      [{ target: `point-${far}`, role: 'extreme' }],
      'farthest',
    );

    const s1 = set.filter((i) => i !== far && cross(pts[p], pts[far], pts[i]) > 0);
    const s2 = set.filter((i) => i !== far && cross(pts[far], pts[q], pts[i]) > 0);
    return [...quickHull(s1, p, far), far, ...quickHull(s2, far, q)];
  }

  const upper = quickHull(left, a, b);
  const lower = quickHull(right, b, a);
  const hull = [a, ...upper, b, ...lower];
  rec.step(
    'done',
    `Hoàn tất: bao lồi có ${hull.length} đỉnh.`,
    (d) => {
      d.hull = hull;
      d.note = `Bao lồi có ${hull.length} đỉnh`;
    },
    [],
    'done',
  );
  return pack(hull);
}
