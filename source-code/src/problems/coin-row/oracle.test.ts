import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm as dp } from '../../algorithms/coin-row/dp';
import { algorithm as memo } from '../../algorithms/coin-row/memo';
import { algorithm as exhaustive } from '../../algorithms/coin-row/exhaustive';
import { check } from './checker';

it('liệt kê tập con không kề nhau kiểm chứng ba thuật toán', () => {
  const values = [4, 9, 2, 8, 5, 7];
  let best = 0;
  for (let mask = 0; mask < 1 << values.length; mask++) {
    if ((mask & (mask << 1)) !== 0) continue;
    const sum = values.reduce((acc, value, i) => acc + (mask & (1 << i) ? value : 0), 0);
    best = Math.max(best, sum);
  }
  for (const algo of [dp, memo, exhaustive]) {
    const output = algo.run({ values }, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.value).toBe(best);
    expect(check({ values }, output)).toMatchObject({ ok: true, optimal: true });
  }
});
