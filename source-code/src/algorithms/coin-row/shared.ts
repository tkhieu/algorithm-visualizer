import type { Input, Output } from '../../problems/coin-row/definition';
export interface VisualState {
  items: { label: string; role?: string }[];
  current?: number;
  table: { i: number; F: number }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return {
    items: input.values.map((v) => ({ label: String(v) })),
    current: undefined,
    table: [{ i: 0, F: 0 }],
    note: '',
  };
}
export function pack(value: number, selected: number[]): Output {
  return { value, selected: [...selected].sort((a, b) => a - b) };
}
export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}
export const limits = { maxInputSize: 60, maxSteps: 4000, maxBytes: 2000000 };
export const legend = { 'Đang xét': 'Nền đen', 'Đã chọn': 'Viền đậm', 'Bỏ qua': 'Mờ' };
