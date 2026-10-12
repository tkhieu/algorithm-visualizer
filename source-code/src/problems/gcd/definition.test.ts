import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('GCD: lược đồ và ví dụ tay', () => {
  expect(problem.check({ a: 18, b: 12 }, { gcd: 6 }).ok).toBe(true);
  expect(problem.check({ a: 18, b: 12 }, { gcd: 3 }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
