import type { Input } from '../../problems/search-sorted/definition';
export interface VisualState {
  values: number[];
  marks: { index: number; role: 'compare' | 'found' }[];
  ranges?: { from: number; to: number; role: 'active' }[];
  note?: string;
}
export function initVisual(input: Input): VisualState {
  return { values: [...input.values], marks: [], note: `Tìm ${input.target}` };
}
export const legend = { compare: 'Vị trí đang so sánh', found: 'Vị trí đầu tiên được tìm thấy' };
export function mark(d: VisualState, index: number, note: string) {
  d.marks = [{ index, role: 'compare' }];
  d.note = note;
}
export function finish(rec: import('../../core/contracts').Recorder<VisualState>, index: number) {
  rec.step('done', index < 0 ? 'Không tìm thấy phần tử.' : `Vị trí đầu tiên là ${index}.`, (d) => {
    d.marks = index < 0 ? [] : [{ index, role: 'found' }];
    d.note = index < 0 ? 'Không tìm thấy' : `Vị trí ${index}`;
  });
}
