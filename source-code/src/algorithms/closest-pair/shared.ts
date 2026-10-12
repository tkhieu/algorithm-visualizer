import type { Input, Output } from '../../problems/closest-pair/definition';
export interface VisualState {
  points: { x: number; y: number }[];
  segments: { from: number; to: number; role?: string }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return { points: input.points.map((p) => ({ x: p.x, y: p.y })), segments: [], note: '' };
}
export function pack(i: number, j: number, distance: number): Output {
  return { i, j, distance };
}
export function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}
export const limits = { maxInputSize: 200, maxSteps: 6000, maxBytes: 3000000 };
export const legend = { 'Đang so sánh': 'Đoạn nối xám', 'Gần nhất hiện tại': 'Đoạn nối đậm' };
