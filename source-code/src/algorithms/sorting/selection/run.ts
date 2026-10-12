import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'compare' | 'swap' | 'current' | 'sorted';
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
    let minIdx = i;
    rec.step(
      'start',
      `Tìm phần tử nhỏ nhất trong A[${i}..${n - 1}].`,
      d => {
        d.marks = [{ index: i, role: 'current' }];
        d.ranges = i > 0 ? [{ from: 0, to: i - 1, role: 'sorted' }] : [];
      },
      [{ target: `bar-${i}`, role: 'current' }],
      'select',
    );
    for (let j = i + 1; j < n; j++) {
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh A[${j}]=${values[j]} với nhỏ nhất hiện tại A[${minIdx}]=${values[minIdx]}.`,
        d => {
          d.marks = [
            { index: minIdx, role: 'current' },
            { index: j, role: 'compare' },
          ];
        },
        [
          { target: `bar-${minIdx}`, role: 'current' },
          { target: `bar-${j}`, role: 'compare' },
        ],
        'select',
      );
      if (values[j] < values[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [values[i], values[minIdx]] = [values[minIdx], values[i]];
      rec.count('swap');
      rec.step(
        'swap',
        `Đổi chỗ A[${i}] và A[${minIdx}].`,
        d => {
          d.values = [...values];
          d.marks = [
            { index: i, role: 'swap' },
            { index: minIdx, role: 'swap' },
          ];
        },
        [
          { target: `bar-${i}`, role: 'swap' },
          { target: `bar-${minIdx}`, role: 'swap' },
        ],
        'select',
      );
    }
  }
  rec.step(
    'done',
    'Hoàn tất sắp xếp chọn.',
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
