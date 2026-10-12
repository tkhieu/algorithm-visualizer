import type { Input, Output } from '../../problems/convex-hull/definition';
export interface VisualState {
  points: { x: number; y: number }[];
  segments: { from: number; to: number; role?: string }[];
  hull: number[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return { points: input.points.map((p) => ({ x: p.x, y: p.y })), segments: [], hull: [], note: '' };
}
export function pack(hull: number[]): Output {
  return { hull };
}
export function cross(o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}
export function assertActive(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Đã hủy', 'AbortError');
}
export const limits = { maxInputSize: 120, maxSteps: 8000, maxBytes: 3000000 };
export const legend = { 'Cạnh bao lồi': 'Đoạn nối đậm', 'Bị loại': 'Đoạn nối xám' };
