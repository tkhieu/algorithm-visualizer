import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
it('Phần tử thứ k: lược đồ và ví dụ tay', () => {
  expect(problem.check({ values: [7, 2, 5, 2], k: 2 }, { value: 2 }).ok).toBe(true);
  expect(problem.check({ values: [7, 2, 5, 2], k: 2 }, { value: 5 }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
