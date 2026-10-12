import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Hệ tuyến tính: lược đồ và ví dụ tay', () => {
  expect(
    problem.check(
      {
        a: [
          [2, 0],
          [0, 3]
        ],
        b: [4, 9]
      },
      { solution: [2, 3] }
    ).ok
  ).toBe(true);
  expect(
    problem.check(
      {
        a: [
          [2, 0],
          [0, 3]
        ],
        b: [4, 9]
      },
      { solution: [2, 2] }
    ).ok
  ).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
