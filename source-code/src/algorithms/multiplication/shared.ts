import type { Input } from '../../problems/multiplication/definition';
import type { Recorder } from '../../core/contracts';
export interface VisualState {
  items: { label: string; role?: string }[];
  current?: number;
  note?: string;
}
export function initVisual(input: Input): VisualState {
  return { items: [{ label: `${input.a} × ${input.b}` }], note: 'Bắt đầu nhân' };
}
export const legend = { current: 'Tích trung gian', done: 'Tích cuối' };
export function record(rec: Recorder<VisualState>, lineId: string, explain: string, label: string) {
  rec.step(lineId, explain, (d) => {
    d.items.push({ label });
    d.current = d.items.length - 1;
    d.note = explain;
  });
}
export function finish(rec: Recorder<VisualState>, product: string) {
  rec.step('done', `Tích chính xác là ${product}.`, (d) => {
    d.items.push({ label: product, role: 'done' });
    d.current = d.items.length - 1;
    d.note = `Tích = ${product}`;
  });
  return { product };
}
