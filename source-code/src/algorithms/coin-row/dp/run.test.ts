import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check, optimum } from '../../../problems/coin-row/checker';
import { generate } from '../../../problems/coin-row/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('đúng với công thức quy hoạch động tham chiếu trên 150 seed', () => {
  for (let seed = 1; seed <= 150; seed++) {
    const input = generate(seed, 'small');
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.value).toBe(optimum(input.values));
    expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
  }
});

it('dãy rỗng cho kết quả 0', () => {
  const output = algorithm.run({ values: [] }, { rec: new MetricsRecorder(), signal: new AbortController().signal });
  expect(output).toEqual({ value: 0, selected: [] });
});

it('trace tua lại đúng: kết quả cuối khớp output', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const { output, final } = traceRun(algorithm, input);
    expect(final.table.at(-1)?.F).toBe(output.value);
  }
});

it('bước điền bảng có giải thích công thức', () => {
  const { steps } = traceRun(algorithm, { values: [5, 1, 2, 10, 6, 2] });
  const fillStep = steps.find((s) => s.lineId === 'fill' && s.explain.includes('F(6)'));
  expect(fillStep?.explain).toContain('max(');
});
