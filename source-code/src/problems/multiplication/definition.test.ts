import { it, expect } from 'vitest';
import { problem } from './index';
import { cases } from './cases';
import { generate } from './generators';
import { reference } from './checker';
it('Phép nhân: lược đồ và ví dụ tay', () => {
  expect(problem.check({ a: '123', b: '45' }, { product: '5535' }).ok).toBe(true);
  expect(problem.check({ a: '123', b: '45' }, { product: '5534' }).ok).toBe(false);
  for (const c of cases)
    expect(problem.inputSchema.safeParse(c.input).success).toBe(c.group !== 'invalid');
});
it('chấp nhận tích chính xác dài hơn 40 chữ số', () => {
  const input = generate(1, 'large');
  expect(problem.outputSchema.safeParse({ product: reference(input) }).success).toBe(true);
});
