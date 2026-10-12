import type {Input, Output} from '../../problems/coin-collecting/definition';

export interface VisualState {
 rows: number;
 cols: number;
 marks: {row: number; col: number; role: string; label?: string}[];
 note: string;
}

export function initVisual(input: Input): VisualState {
 const coinMarks = input.grid.flatMap((row, r) =>
  row.flatMap((has, c) => has ? [{row: r, col: c, role: 'coin', label: '$'}] : []),
 );
 return {rows: input.grid.length, cols: input.grid[0].length, marks: coinMarks, note: ''};
}
export function pack(value: number, path: [number, number][]): Output {
 return {value, path};
}
export function assertActive(signal: AbortSignal) {
 if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}
export const limits = {maxInputSize: 30, maxSteps: 5000, maxBytes: 2500000};
export const legend = {'Đồng xu': '$', 'Đang tính': 'Viền đậm', 'Đường đi': 'Nền đen'};
