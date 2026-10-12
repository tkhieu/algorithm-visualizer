import type { Input } from '../../problems/gcd/definition';
export interface VisualState {
  items: { label: string; role?: string }[];
  current?: number;
  note?: string;
}
export function initVisual(input: Input): VisualState {
  return { items: [{ label: `(${input.a}, ${input.b})` }], note: 'Bắt đầu tìm ước chung lớn nhất' };
}
export const legend = { current: 'Cặp hoặc ước đang xét', done: 'Kết quả cuối' };
