import type { TestCase } from '../../core/contracts';
import type { Input } from './definition';
import { generate } from './generators';
import { optimum } from './checker';

const raw: TestCase<Input>[] = [
  {
    id: 'normal-1',
    name: 'Hệ tiền chuẩn (tham lam đúng)',
    group: 'normal',
    input: { amount: 63, coins: [1, 5, 10, 25] },
  },
  { id: 'normal-2', name: 'Ngẫu nhiên nhỏ', group: 'normal', input: generate(1, 'small') },
  { id: 'edge-zero', name: 'Số tiền 0', group: 'edge', input: { amount: 0, coins: [1, 5] } },
  { id: 'edge-single-coin', name: 'Chỉ một mệnh giá', group: 'edge', input: { amount: 7, coins: [1] } },
  { id: 'small-1', name: 'Tập nhỏ 1', group: 'small', input: generate(7, 'tiny') },
  { id: 'small-2', name: 'Tập nhỏ 2', group: 'small', input: generate(13, 'small') },
  { id: 'large-1', name: 'Tập lớn 1', group: 'large', input: generate(21, 'large') },
  { id: 'large-2', name: 'Tập lớn 2', group: 'large', input: generate(22, 'large') },
  { id: 'special-greedy', name: 'Tham lam thất bại', group: 'special', input: { amount: 6, coins: [1, 3, 4] } },
  { id: 'invalid-amount', name: 'Số tiền âm', group: 'invalid', input: { amount: -5, coins: [1, 5] } },
  { id: 'invalid-no-coins', name: 'Không có mệnh giá', group: 'invalid', input: { amount: 5, coins: [] } },
];

export const cases: TestCase<Input>[] = raw.map((c) => {
  if (c.group === 'invalid') return c;
  const input = c.input as Input;
  return { ...c, expected: optimum(input.amount, input.coins) };
});
