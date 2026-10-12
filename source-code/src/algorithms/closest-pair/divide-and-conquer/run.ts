import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/closest-pair/definition';
import { assertActive, dist, pack, type VisualState } from '../shared';

interface Best {
  i: number;
  j: number;
  distance: number;
}

export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const pts = input.points;
  const order = pts.map((_, i) => i).sort((a, b) => pts[a].x - pts[b].x);

  rec.step(
    'start',
    'Sắp điểm theo trục x, rồi chia để trị.',
    (d) => {
      d.note = 'Sắp điểm theo trục x';
    },
    [],
    'start',
  );

  function bruteRange(indices: number[]): Best {
    let best = Infinity,
      bi = indices[0],
      bj = indices[indices.length - 1];
    for (let a = 0; a < indices.length; a++) {
      for (let b = a + 1; b < indices.length; b++) {
        assertActive(signal);
        rec.count('compare');
        const d = dist(pts[indices[a]], pts[indices[b]]);
        rec.step(
          'compare',
          `So trong nhóm cơ sở: điểm ${indices[a]} và điểm ${indices[b]}: ` + `${d.toFixed(3)}.`,
          (draft) => {
            draft.segments = [{ from: indices[a], to: indices[b], role: 'current' }];
            draft.note = 'So trong nhóm cơ sở';
          },
          [],
          'compare',
        );
        if (d < best) {
          best = d;
          bi = indices[a];
          bj = indices[b];
        }
      }
    }
    return { i: bi, j: bj, distance: best };
  }

  function solve(lo: number, hi: number): Best {
    assertActive(signal);
    const n = hi - lo;
    if (n <= 3) return bruteRange(order.slice(lo, hi));

    const mid = lo + Math.floor(n / 2);
    const midX = pts[order[mid]].x;
    rec.step(
      'split',
      `Chia tại x = ${midX}: ${mid - lo} điểm bên trái, ${hi - mid} điểm bên phải.`,
      (d) => {
        d.note = `Chia tại x = ${midX}`;
      },
      [],
      'split',
    );

    const left = solve(lo, mid);
    const right = solve(mid, hi);
    let best = left.distance <= right.distance ? left : right;
    rec.step(
      'merge',
      `Khoảng cách nhỏ nhất của hai nửa: ${best.distance.toFixed(3)} ` + `(cặp ${best.i}, ${best.j}).`,
      (draft) => {
        draft.segments = [{ from: best.i, to: best.j, role: 'closest' }];
        draft.note = 'Hợp nhất hai nửa';
      },
      [],
      'merge',
    );

    const strip = order
      .slice(lo, hi)
      .filter((idx) => Math.abs(pts[idx].x - midX) < best.distance)
      .sort((a, b) => pts[a].y - pts[b].y);
    for (let a = 0; a < strip.length; a++) {
      for (let b = a + 1; b < strip.length && pts[strip[b]].y - pts[strip[a]].y < best.distance; b++) {
        assertActive(signal);
        rec.count('compare');
        const d = dist(pts[strip[a]], pts[strip[b]]);
        rec.step(
          'strip',
          `So trong dải giữa: điểm ${strip[a]} và điểm ${strip[b]}: ${d.toFixed(3)}.`,
          (draft) => {
            draft.segments = [{ from: strip[a], to: strip[b], role: 'current' }];
            draft.note = 'So trong dải giữa';
          },
          [],
          'strip',
        );
        if (d < best.distance) {
          best = { i: strip[a], j: strip[b], distance: d };
          rec.step(
            'better',
            `Dải giữa cho cặp gần hơn: (${best.i}, ${best.j}) = ${d.toFixed(3)}.`,
            (draft) => {
              draft.segments = [{ from: best.i, to: best.j, role: 'closest' }];
              draft.note = 'Cặp gần nhất mới từ dải giữa';
            },
            [],
            'better',
          );
        }
      }
    }
    return best;
  }

  const result = solve(0, order.length);
  rec.step(
    'done',
    `Hoàn tất: cặp gần nhất (${result.i}, ${result.j}) với khoảng cách ` + `${result.distance.toFixed(3)}.`,
    (draft) => {
      draft.segments = [{ from: result.i, to: result.j, role: 'closest' }];
      draft.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(result.i, result.j, result.distance);
}
