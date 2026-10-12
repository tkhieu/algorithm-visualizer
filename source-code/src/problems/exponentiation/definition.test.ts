import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Lũy thừa: lược đồ và ví dụ tay', () => {
  expect(problem.check({ base: 2, exponent: 5 }, { value: '32' }).ok).toBe(true);
  expect(problem.check({ base: 2, exponent: 5 }, { value: '31' }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
