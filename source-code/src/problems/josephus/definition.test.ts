import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Josephus: lược đồ và ví dụ tay', () => {
  expect(problem.check({ n: 7, k: 3 }, { survivor: 4 }).ok).toBe(true);
  expect(problem.check({ n: 7, k: 3 }, { survivor: 3 }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
