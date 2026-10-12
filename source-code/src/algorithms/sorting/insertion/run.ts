import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'compare' | 'current' | 'shift';
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
  for (let i = 1; i < n; i++) {
    const key = values[i];
    rec.step(
      'start',
      `Chèn A[${i}]=${key} vào đoạn đã sắp A[0..${i - 1}].`,
      d => {
        d.marks = [{ index: i, role: 'current' }];
        d.ranges = [{ from: 0, to: i - 1, role: 'sorted' }];
      },
      [{ target: `bar-${i}`, role: 'current' }],
      'insert',
    );
    let j = i - 1;
    while (j >= 0) {
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh A[${j}]=${values[j]} với khóa ${key}.`,
        d => {
          d.marks = [{ index: j, role: 'compare' }];
        },
        [{ target: `bar-${j}`, role: 'compare' }],
        'insert',
      );
      if (values[j] <= key) break;
      values[j + 1] = values[j];
      rec.count('assign');
      rec.step(
        'shift',
        `Dời A[${j}] sang vị trí ${j + 1}.`,
        d => {
          d.values = [...values];
          d.marks = [{ index: j + 1, role: 'shift' }];
        },
        [{ target: `bar-${j + 1}`, role: 'shift' }],
        'insert',
      );
      j--;
    }
    values[j + 1] = key;
    rec.step(
      'place',
      `Đặt khóa ${key} vào vị trí ${j + 1}.`,
      d => {
        d.values = [...values];
        d.marks = [{ index: j + 1, role: 'current' }];
      },
      [{ target: `bar-${j + 1}`, role: 'current' }],
      'insert',
    );
  }
  rec.step(
    'done',
    'Hoàn tất sắp xếp chèn.',
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
