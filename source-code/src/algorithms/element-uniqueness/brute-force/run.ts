import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/element-uniqueness/definition';
export type Role = 'compare' | 'found';
export interface VisualState {
  values: number[];
  marks: { index: number; role: Role }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return { values: [...input.values], marks: [], note: '' };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values = input.values;
  const n = values.length;
  rec.step(
    'init',
    'Khởi tạo mảng cần kiểm tra.',
    d => {
      d.values = [...values];
      d.note = 'Bắt đầu so từng cặp';
    },
    [],
    'init',
  );
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      rec.count('compare');
      rec.step(
        'compare',
        `So sánh A[${i}]=${values[i]} với A[${j}]=${values[j]}.`,
        d => {
          d.marks = [
            { index: i, role: 'compare' },
            { index: j, role: 'compare' },
          ];
          d.note = `So sánh vị trí ${i} và ${j}`;
        },
        [
          { target: `bar-${i}`, role: 'compare' },
          { target: `bar-${j}`, role: 'compare' },
        ],
        'scan',
      );
      if (values[i] === values[j]) {
        rec.step(
          'found',
          `A[${i}] = A[${j}] = ${values[i]}: tìm thấy cặp trùng.`,
          d => {
            d.marks = [
              { index: i, role: 'found' },
              { index: j, role: 'found' },
            ];
            d.note = `Trùng giá trị ${values[i]}`;
          },
          [
            { target: `bar-${i}`, role: 'found' },
            { target: `bar-${j}`, role: 'found' },
          ],
          'done',
        );
        return { unique: false, duplicate: values[i] };
      }
    }
  }
  rec.step(
    'done',
    'Không có cặp nào trùng — các phần tử đều duy nhất.',
    d => {
      d.note = 'Duy nhất';
      d.marks = [];
    },
    [],
    'done',
  );
  return { unique: true, duplicate: null };
}
