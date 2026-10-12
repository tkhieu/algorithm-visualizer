import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Đa thức: lược đồ và ví dụ tay', () => {
  expect(problem.check({ coefficients: [2, 3, 1], x: 2 }, { value: 12 }).ok).toBe(true);
  expect(problem.check({ coefficients: [2, 3, 1], x: 2 }, { value: 11 }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
