import type { Verdict } from '../../core/contracts';
import { inputSchema, outputSchema, type Input, type Output } from './definition';

const EPS = 1e-7;
type Point = { x: number; y: number };
type Line = { a: number; b: number; c: number };
export function allLines(input: Input): Line[] {
  return [{ a: -1, b: 0, c: 0 }, { a: 0, b: -1, c: 0 }, ...input.constraints];
}
function satisfies(lines: Line[], p: Point): boolean {
  return lines.every((l) => l.a * p.x + l.b * p.y <= l.c + EPS);
}
export function feasibleVertices(input: Input): Point[] {
  const lines = allLines(input);
  const result: Point[] = [];
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const [u, v] = [lines[i], lines[j]];
      const det = u.a * v.b - v.a * u.b;
      if (Math.abs(det) <= EPS) continue;
      const p = { x: (u.c * v.b - v.c * u.b) / det, y: (u.a * v.c - v.a * u.c) / det };
      if (satisfies(lines, p) && !result.some((q) => Math.abs(p.x - q.x) < EPS && Math.abs(p.y - q.y) < EPS))
        result.push(p);
    }
  return result;
}
function improvingRay(input: Input): boolean {
  const directions: Point[] = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];
  for (const { a, b } of input.constraints) {
    directions.push({ x: b, y: -a }, { x: -b, y: a });
  }
  return directions.some(
    (d) =>
      d.x >= -EPS &&
      d.y >= -EPS &&
      input.constraints.every((l) => l.a * d.x + l.b * d.y <= EPS) &&
      input.objective.cx * d.x + input.objective.cy * d.y > EPS,
  );
}
export function optimum(input: Input): Output {
  const vertices = feasibleVertices(input);
  if (vertices.length === 0) return { status: 'infeasible', message: 'Bài toán không khả thi' };
  if (improvingRay(input)) return { status: 'unbounded', message: 'Bài toán không bị chặn' };
  let best: Output = {
    status: 'optimal',
    ...vertices[0],
    value: input.objective.cx * vertices[0].x + input.objective.cy * vertices[0].y,
  };
  for (const p of vertices.slice(1)) {
    const value = input.objective.cx * p.x + input.objective.cy * p.y;
    if (best.status === 'optimal' && value > best.value) best = { status: 'optimal', ...p, value };
  }
  return best;
}
export function check(input: Input, output: Output): Verdict {
  if (!inputSchema.safeParse(input).success) return { ok: false, reason: 'Đầu vào không hợp lệ' };
  if (!outputSchema.safeParse(output).success) return { ok: false, reason: 'Đầu ra sai định dạng' };
  const expected = optimum(input);
  if (output.status !== expected.status) return { ok: false, reason: 'Trạng thái bài toán không đúng' };
  if (output.status !== 'optimal' || expected.status !== 'optimal') return { ok: true, optimal: true };
  if (!satisfies(allLines(input), output)) return { ok: false, reason: 'Điểm trả về nằm ngoài miền khả thi' };
  const actual = input.objective.cx * output.x + input.objective.cy * output.y;
  if (Math.abs(actual - output.value) > 1e-4) return { ok: false, reason: 'Giá trị mục tiêu không khớp với (x,y)' };
  return { ok: true, optimal: Math.abs(actual - expected.value) <= 1e-4, score: actual };
}
