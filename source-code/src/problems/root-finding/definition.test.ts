import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Tìm nghiệm: lược đồ và ví dụ tay', () => {
  const input = { c: 1, d: 2, left: 0, right: 2, tolerance: 1e-6 };
  expect(problem.check(input, { root: 1 }).ok).toBe(true);
  expect(problem.check(input, { root: 1.1 }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
