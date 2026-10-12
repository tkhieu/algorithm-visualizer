import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check } from '../../../problems/convex-hull/checker';
import { generate } from '../../../problems/convex-hull/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('bao lồi hợp lệ (lồi và chứa mọi điểm) trên 150 seed, mọi cỡ', () => {
  for (let seed = 1; seed <= 150; seed++) {
    for (const size of ['tiny', 'small', 'medium'] as const) {
      const input = generate(seed, size);
      const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
      expect(check(input, output)).toMatchObject({ ok: true });
    }
  }
});

it('điểm nằm trong hình vuông không xuất hiện trong bao lồi', () => {
  const input = {
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
      { x: 5, y: 5 },
    ],
  };
  const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
  expect(check(input, output)).toMatchObject({ ok: true });
  expect(output.hull).not.toContain(4);
  expect(output.hull).toHaveLength(4);
});

it('trace tua lại đúng: hull cuối cùng khớp output', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'tiny');
    const { output, final } = traceRun(algorithm, input);
    expect(final.hull).toEqual(output.hull);
  }
});

it('bước tìm điểm cực trái/cực phải có giải thích tiếng Việt', () => {
  const { steps } = traceRun(algorithm, generate(5, 'small'));
  const extremeStep = steps.find((s) => s.lineId === 'extreme');
  expect(extremeStep?.explain).toContain('cực trái');
});

it('điểm trùng, thẳng hàng và n nhỏ chỉ trả về các cực biên một lần', () => {
  const inputs = [
    { points: [{ x: 1, y: 1 }] },
    {
      points: [
        { x: 1, y: 1 },
        { x: 1, y: 1 },
        { x: 3, y: 3 },
      ],
    },
    {
      points: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 2 },
      ],
    },
  ];
  for (const input of inputs) {
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
    expect(new Set(output.hull).size).toBe(output.hull.length);
  }
  expect(
    algorithm.run(inputs[2], { rec: new MetricsRecorder(), signal: new AbortController().signal }).hull,
  ).toHaveLength(2);
});
