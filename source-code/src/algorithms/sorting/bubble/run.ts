import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'compare' | 'swap' | 'current';
export interface VisualState {
  values: number[];
  marks: { index: number; role: Role }[];
  ranges: { from: number; to: number; role: 'sorted' | 'active' }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return { values: [...input.values], marks: [], ranges: [], note: '' };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values = [...input.values];
  const n = values.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh A[${j}]=${values[j]} với A[${j + 1}]=${values[j + 1]}.`,
        d => {
          d.marks = [
            { index: j, role: 'compare' },
            { index: j + 1, role: 'compare' },
          ];
          d.ranges = i > 0 ? [{ from: n - i, to: n - 1, role: 'sorted' }] : [];
        },
        [
          { target: `bar-${j}`, role: 'compare' },
          { target: `bar-${j + 1}`, role: 'compare' },
        ],
        'bubble',
      );
      if (values[j] > values[j + 1]) {
        [values[j], values[j + 1]] = [values[j + 1], values[j]];
        rec.count('swap');
        swapped = true;
        rec.step(
          'swap',
          `A[${j}] > A[${j + 1}]: đổi chỗ.`,
          d => {
            d.values = [...values];
            d.marks = [
              { index: j, role: 'swap' },
              { index: j + 1, role: 'swap' },
            ];
          },
          [
            { target: `bar-${j}`, role: 'swap' },
            { target: `bar-${j + 1}`, role: 'swap' },
          ],
          'bubble',
        );
      }
    }
    if (!swapped) break;
  }
  rec.step(
    'done',
    'Hoàn tất sắp xếp nổi bọt.',
    d => {
      d.marks = [];
      d.ranges = [{ from: 0, to: n - 1, role: 'sorted' }];
      d.note = 'Đã sắp xếp';
    },
    [],
    'done',
  );
  return { sorted: values };
}
