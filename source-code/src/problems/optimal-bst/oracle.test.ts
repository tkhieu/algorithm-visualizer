import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm as dp } from '../../algorithms/optimal-bst/dp';
import { algorithm as exhaustive } from '../../algorithms/optimal-bst/exhaustive';
import { check } from './checker';

it('liệt kê mọi cây tìm kiếm nhị phân kiểm chứng hai thuật toán', () => {
  const freq = [3, 1, 7, 2, 5];
  function costs(lo: number, hi: number, depth: number): number[] {
    if (lo > hi) return [0];
    const result: number[] = [];
    for (let root = lo; root <= hi; root++)
      for (const left of costs(lo, root - 1, depth + 1)) {
        for (const right of costs(root + 1, hi, depth + 1)) result.push(freq[root] * depth + left + right);
      }
    return result;
  }
  const best = Math.min(...costs(0, freq.length - 1, 1));
  for (const algo of [dp, exhaustive]) {
    const output = algo.run({ freq }, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.cost).toBe(best);
    expect(check({ freq }, output)).toMatchObject({ ok: true, optimal: true });
  }
});
