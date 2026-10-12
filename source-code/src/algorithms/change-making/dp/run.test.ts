import { it, expect } from 'vitest';
import { algorithm } from './index';
import { check, optimum } from '../../../problems/change-making/checker';
import { generate } from '../../../problems/change-making/generators';
import { traceRun } from '../test-utils';
import { MetricsRecorder } from '../../../core/recorder';

it('đúng với công thức quy hoạch động tham chiếu trên 150 seed', () => {
  for (let seed = 1; seed <= 150; seed++) {
    const input = generate(seed, 'small');
    const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.count).toBe(optimum(input.amount, input.coins));
    expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
  }
});

it('ví dụ tham lam thất bại vẫn cho kết quả tối ưu 2', () => {
  const input = { amount: 6, coins: [1, 3, 4] };
  const output = algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
  expect(output.count).toBe(2);
});

it('số tiền 0 cho kết quả 0 đồng', () => {
  const output = algorithm.run(
    { amount: 0, coins: [1, 5] },
    { rec: new MetricsRecorder(), signal: new AbortController().signal },
  );
  expect(output).toEqual({ count: 0, coins: [] });
});

it('trace tua lại đúng: ô cuối bảng khớp số đồng tối ưu', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const { output, final } = traceRun(algorithm, input);
    expect(final.matrix[0][input.amount]).toBe(output.count === 0 ? 0 : output.count);
  }
});

it('bước điền bảng có giải thích công thức', () => {
  const { steps } = traceRun(algorithm, { amount: 6, coins: [1, 3, 4] });
  const fillStep = steps.find((s) => s.lineId === 'fill' && s.explain.includes('F(6)'));
  expect(fillStep?.explain).toBeDefined();
});
