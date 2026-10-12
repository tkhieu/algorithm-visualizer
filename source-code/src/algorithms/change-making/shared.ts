import type { Input, Output } from '../../problems/change-making/definition';

export interface VisualState {
  matrix: (number | string | null)[][];
  computed: boolean[][];
  current: { i: number; w: number } | null;
  note: string;
}

export function initVisual(input: Input): VisualState {
  return {
    matrix: [new Array<number | string | null>(input.amount + 1).fill(null)],
    computed: [new Array<boolean>(input.amount + 1).fill(false)],
    current: null,
    note: '',
  };
}
export function pack(used: number[]): Output {
  return { count: used.length, coins: [...used].sort((a, b) => a - b) };
}
export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}
export const limits = { maxInputSize: 1000, maxSteps: 4000, maxBytes: 2000000 };
export const legend = { 'Đang tính': 'Viền đậm', 'Không đổi được': '∞' };
