import type {Input, Output} from '../../problems/lcs/definition';

export interface VisualState {
  matrix: (number | string | null)[][];
  computed: boolean[][];
  current: {i: number; w: number} | null;
  dependencies: [number, number][];
  backtrack: [number, number][];
  text: string;
  pattern: string;
  shift: number;
  comparisons: {patternIndex: number; match: boolean}[];
  note: string;
}

export function initVisual(input: Input): VisualState {
  const n = input.a.length;
  const m = input.b.length;
  return {
    matrix: Array.from({length: n + 1}, () => new Array<number | string | null>(m + 1).fill(null)),
    computed: Array.from({length: n + 1}, () => new Array<boolean>(m + 1).fill(false)),
    current: null,
    dependencies: [],
    backtrack: [],
    text: input.a,
    pattern: input.b,
    shift: 0,
    comparisons: [],
    note: '',
  };
}

export function pack(length: number, subsequence: string): Output {
  return {length, subsequence};
}

export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}

export const limits = {maxSteps: 5000, maxBytes: 2500000};
