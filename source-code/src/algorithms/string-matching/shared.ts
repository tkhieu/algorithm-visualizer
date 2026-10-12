import type { Input, Output } from '../../problems/string-matching/definition';

export interface VisualState {
  text: string;
  pattern: string;
  shift: number;
  comparisons: { patternIndex: number; match: boolean }[];
  shiftTable?: Record<string, number>;
  goodSuffixTable?: number[];
  chosenShift?: number;
  note: string;
}

export function initVisual(input: Input): VisualState {
  return { text: input.text, pattern: input.pattern, shift: 0, comparisons: [], note: '' };
}
export function pack(positions: number[]): Output {
  return { positions: [...positions].sort((a, b) => a - b) };
}
export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}
export const limits = { maxInputSize: 400, maxSteps: 5000, maxBytes: 2500000 };
export const legend = { Khớp: 'Nền đen', 'Không khớp': 'Viền đậm', 'Bảng dịch': 'Danh sách bên dưới' };
