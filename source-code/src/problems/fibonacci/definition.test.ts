import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Fibonacci: lược đồ và ví dụ tay', () => {
  expect(problem.check({ n: 6 }, { value: 8 }).ok).toBe(true);
  expect(problem.check({ n: 6 }, { value: 9 }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
