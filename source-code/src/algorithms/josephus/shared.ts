import type { Input } from '../../problems/josephus/definition';
import type { Recorder } from '../../core/contracts';
export interface VisualState {
  items: { label: string; role?: string }[];
  current?: number;
  note?: string;
}
export function initVisual(input: Input): VisualState {
  return {
    items: Array.from({ length: input.n }, (_, i) => ({ label: String(i + 1) })),
    note: 'Vòng tròn ban đầu'
  };
}
export const legend = { current: 'Người đang xét', done: 'Người sống sót' };
export function finish(rec: Recorder<VisualState>, survivor: number) {
  rec.step('done', `Người sống sót mang số ${survivor}.`, (d) => {
    d.items[survivor - 1].role = 'done';
    d.current = survivor - 1;
    d.note = `Sống sót: ${survivor}`;
  });
  return { survivor };
}
