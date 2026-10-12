import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check } from '../../../problems/closest-pair/checker';
import { generate } from '../../../problems/closest-pair/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('đúng với vét cạn tham chiếu trên 150 seed, mọi cỡ', () => {
  for (let seed = 1; seed <= 150; seed++) {
    for (const size of ['tiny', 'small', 'medium'] as const) {
      const input = generate(seed, size);
      const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
      expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
    }
  }
});

it('xử lý đúng các điểm trùng nhau (khoảng cách 0)', () => {
  const input = {
    points: [
      { x: 5, y: 5 },
      { x: 5, y: 5 },
      { x: -9, y: 1 },
      { x: 12, y: -3 },
    ],
  };
  const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
  expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
  expect(output.distance).toBe(0);
});

it('trace tua lại đúng: đoạn nối cuối cùng trùng với cặp trả về', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const { output, final } = traceRun(algorithm, input);
    expect(final.segments.at(-1)).toEqual({ from: output.i, to: output.j, role: 'closest' });
  }
});

it('bước chia giải thích đúng điểm chia theo x', () => {
  const { steps } = traceRun(algorithm, generate(5, 'medium'));
  const splitStep = steps.find((s) => s.lineId === 'split');
  expect(splitStep?.explain).toMatch(/Chia tại x/);
});
