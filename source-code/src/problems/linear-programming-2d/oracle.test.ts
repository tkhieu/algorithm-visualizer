import { expect, it } from 'vitest';
import { MetricsRecorder } from '../../core/recorder';
import { algorithm as simplex } from '../../algorithms/linear-programming-2d/simplex';
import { algorithm as vertices } from '../../algorithms/linear-programming-2d/vertex-enumeration';
import { check } from './checker';
import type { Input } from './definition';

it('nghiệm tay (2,6,36) và các trạng thái đặc biệt xác nhận hai thuật toán', () => {
  const cases: { input: Input; status: string; value?: number }[] = [
    {
      input: {
        objective: { cx: 3, cy: 5 },
        constraints: [
          { a: 1, b: 0, c: 4 },
          { a: 0, b: 2, c: 12 },
          { a: 3, b: 2, c: 18 },
        ],
      },
      status: 'optimal',
      value: 36,
    },
    { input: { objective: { cx: 1, cy: 1 }, constraints: [{ a: 1, b: 0, c: -1 }] }, status: 'infeasible' },
    { input: { objective: { cx: 1, cy: 1 }, constraints: [{ a: -1, b: -1, c: -1 }] }, status: 'unbounded' },
  ];
  for (const { input, status, value } of cases)
    for (const algo of [simplex, vertices]) {
      const output = algo.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal });
      expect(output.status).toBe(status);
      if (output.status === 'optimal') expect(output.value).toBeCloseTo(value!, 5);
      expect(check(input, output)).toMatchObject({ ok: true, optimal: true });
    }
});
