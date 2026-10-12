import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';

type P = { x: number; y: number };
function cross(o: P, a: P, b: P): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}
// Monotone chain is independent of either edge enumeration or QuickHull.
export function extremeIndices(points: P[]): number[] {
  const unique = new Map<string, number>();
  points.forEach((p, i) => {
    const key = `${p.x},${p.y}`;
    if (!unique.has(key)) unique.set(key, i);
  });
  const ids = [...unique.values()].sort((i, j) => points[i].x - points[j].x || points[i].y - points[j].y);
  if (ids.length <= 1) return ids;
  const half = (order: number[]) => {
    const stack: number[] = [];
    for (const i of order) {
      while (stack.length >= 2 && cross(points[stack.at(-2)!], points[stack.at(-1)!], points[i]) <= 0) stack.pop();
      stack.push(i);
    }
    return stack;
  };
  return [...half(ids).slice(0, -1), ...half([...ids].reverse()).slice(0, -1)];
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const hull = output.hull;
  if (new Set(hull).size !== hull.length || hull.some((i) => i >= input.points.length)) {
    return { ok: false, reason: 'Chỉ số đỉnh trùng hoặc ngoài phạm vi' };
  }
  const expected = extremeIndices(input.points);
  const actualKeys = hull.map((i) => `${input.points[i].x},${input.points[i].y}`);
  const expectedKeys = new Set(expected.map((i) => `${input.points[i].x},${input.points[i].y}`));
  if (actualKeys.length !== expectedKeys.size || actualKeys.some((key) => !expectedKeys.has(key))) {
    return { ok: false, reason: 'Tập đỉnh cực biên không đúng' };
  }
  if (hull.length > 2) {
    let sign = 0;
    for (let i = 0; i < hull.length; i++) {
      const cr = cross(
        input.points[hull[i]],
        input.points[hull[(i + 1) % hull.length]],
        input.points[hull[(i + 2) % hull.length]],
      );
      if (cr === 0 || (sign && Math.sign(cr) !== sign))
        return { ok: false, reason: 'Thứ tự đỉnh không tạo đa giác lồi' };
      sign = Math.sign(cr);
    }
  }
  return { ok: true, optimal: true, score: hull.length };
}
