import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Nhân ma trận: lược đồ và ví dụ tay', () => {
  expect(
    problem.check(
      {
        a: [
          [1, 2],
          [3, 4]
        ],
        b: [
          [1, 0],
          [0, 1]
        ]
      },
      {
        matrix: [
          [1, 2],
          [3, 4]
        ]
      }
    ).ok
  ).toBe(true);
  expect(problem.check({ a: [[2]], b: [[3]] }, { matrix: [[5]] }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
