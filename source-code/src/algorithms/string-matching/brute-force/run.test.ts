import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check } from '../../../problems/string-matching/checker';
import { generate } from '../../../problems/string-matching/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('so khớp vét cạn đúng với vét cạn tham chiếu trên 150 seed', () => {
  for (let seed = 1; seed <= 150; seed++) {
    const input = generate(seed, 'small');
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(check(input, output)).toMatchObject({ ok: true });
  }
});

it('trace tua lại đúng: số bước "match" khớp số vị trí trả về', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const { output, steps } = traceRun(algorithm, input);
    const matchSteps = steps.filter((s) => s.lineId === 'match');
    expect(matchSteps.length).toBe(output.positions.length);
  }
});

it('bước giải thích nêu rõ ký tự đang so sánh', () => {
  const { steps } = traceRun(algorithm, { text: 'ABCABC', pattern: 'ABC' });
  const compareStep = steps.find((s) => s.lineId === 'compare');
  expect(compareStep?.explain).toMatch(/So sánh T\[\d+\]/);
});
