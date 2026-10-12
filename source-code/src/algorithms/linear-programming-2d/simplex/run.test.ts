import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check, optimum } from '../../../problems/linear-programming-2d/checker';
import { generate } from '../../../problems/linear-programming-2d/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('đúng với bộ liệt kê đỉnh tham chiếu trên 150 seed', () => {
  for (let seed = 1; seed <= 150; seed++) {
    const input = generate(seed, 'small');
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    const best = optimum(input);
    if (output.status !== 'optimal' || best.status !== 'optimal') throw new Error('Seed phải có nghiệm tối ưu');
    expect(output.value).toBeCloseTo(best.value, 3);
    expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
  }
});

it('ví dụ Levitin: tối ưu tại (2,6) giá trị 36', () => {
  const input = {
    objective: { cx: 3, cy: 5 },
    constraints: [
      { a: 1, b: 0, c: 4 },
      { a: 0, b: 2, c: 12 },
      { a: 3, b: 2, c: 18 },
    ],
  };
  const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
  if (output.status !== 'optimal') throw new Error('Ví dụ phải có nghiệm tối ưu');
  expect(output.value).toBeCloseTo(36);
  expect(output.x).toBeCloseTo(2);
  expect(output.y).toBeCloseTo(6);
});

it('trace tua lại đúng: đỉnh gốc cuối cùng khớp output', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const { output, final } = traceRun(algorithm, input);
    const rootPoint = final.points.find((p) => p.role === 'root');
    if (output.status !== 'optimal') throw new Error('Seed phải có nghiệm tối ưu');
    expect(rootPoint?.x).toBeCloseTo(output.x, 3);
    expect(rootPoint?.y).toBeCloseTo(output.y, 3);
  }
});

it('bước di chuyển có giải thích tiếng Việt', () => {
  const { steps } = traceRun(algorithm, {
    objective: { cx: 3, cy: 5 },
    constraints: [
      { a: 1, b: 0, c: 4 },
      { a: 0, b: 2, c: 12 },
      { a: 3, b: 2, c: 18 },
    ],
  });
  const pivotStep = steps.find((s) => s.lineId === 'pivot');
  expect(pivotStep?.explain).toContain('biến');
});

it('pha I báo vô nghiệm, pha II báo không bị chặn và pivot suy biến', () => {
  const run = (constraints: { a: number; b: number; c: number }[]) =>
    traceRun(algorithm, {
      objective: { cx: 1, cy: 1 },
      constraints,
    });
  const infeasible = run([{ a: 1, b: 0, c: -1 }]);
  expect(infeasible.output).toMatchObject({ status: 'infeasible', message: 'Bài toán không khả thi' });
  expect(infeasible.steps.at(-1)?.explain).toContain('không khả thi');
  const unbounded = run([{ a: -1, b: -1, c: -1 }]);
  expect(unbounded.output).toMatchObject({ status: 'unbounded', message: 'Bài toán không bị chặn' });
  expect(unbounded.steps.at(-1)?.explain).toContain('không bị chặn');
  const degenerate = run([
    { a: 1, b: 0, c: 0 },
    { a: 0, b: 1, c: 2 },
    { a: 1, b: 1, c: 2 },
  ]);
  expect(degenerate.output.status).toBe('optimal');
  expect(degenerate.steps.some((step) => step.lineId === 'pivot' && step.explain.includes('suy biến'))).toBe(true);
  expect(degenerate.steps.some((step) => step.lineId === 'phase-two')).toBe(true);
});

it('hai pha khớp oracle đỉnh/tia trên 300 miền với vế phải âm và suy biến', () => {
  let state = 113;
  const random = (range: number) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state % range;
  };
  for (let trial = 0; trial < 300; trial++) {
    const input = {
      objective: { cx: random(7) - 3, cy: random(7) - 3 },
      constraints: Array.from({ length: 1 + random(5) }, () => ({
        a: random(7) - 3,
        b: random(7) - 3,
        c: random(11) - 5,
      })),
    };
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    const expected = optimum(input);
    expect(output.status).toBe(expected.status);
    if (output.status === 'optimal' && expected.status === 'optimal')
      expect(output.value).toBeCloseTo(expected.value, 4);
    expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
  }
});
