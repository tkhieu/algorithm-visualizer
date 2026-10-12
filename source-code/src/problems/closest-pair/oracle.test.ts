import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm as brute } from '../../algorithms/closest-pair/brute-force';
import { algorithm as divide } from '../../algorithms/closest-pair/divide-and-conquer';
import { check } from './checker';

it('quét mọi cặp độc lập xác nhận hai thuật toán kể cả điểm trùng', () => {
  const points = [
    { x: 9, y: 9 },
    { x: 0, y: 0 },
    { x: 3, y: 4 },
    { x: 9, y: 9 },
  ];
  const expected = Math.min(
    ...points.flatMap((a, i) => points.slice(i + 1).map((b) => Math.hypot(a.x - b.x, a.y - b.y))),
  );
  for (const algo of [brute, divide]) {
    const output = algo.run({ points }, { rec: new MetricsRecorder(), signal: new AbortController().signal });
    expect(output.distance).toBe(expected);
    expect(check({ points }, output)).toMatchObject({ ok: true, optimal: true });
  }
});
