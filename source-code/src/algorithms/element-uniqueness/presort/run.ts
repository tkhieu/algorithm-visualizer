import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/element-uniqueness/definition';
export type Role = 'compare' | 'found';
export interface VisualState {
  values: number[];
  marks: { index: number; role: Role }[];
  ranges: { from: number; to: number; role: 'sorted' }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return { values: [...input.values], marks: [], ranges: [], note: '' };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const n = input.values.length;
  const sorted = [...input.values].sort((a, b) => a - b);
  rec.count('assign', n);
  rec.step(
    'sort',
    'Sắp xếp mảng trước (O(n log n)).',
    d => {
      d.values = [...sorted];
      d.ranges = [{ from: 0, to: n - 1, role: 'sorted' }];
      d.note = 'Đã sắp xếp';
    },
    [],
    'sort',
  );
  for (let i = 0; i + 1 < n; i++) {
    rec.count('compare');
    rec.step(
      'compare',
      `So sánh hai phần tử liền kề A[${i}]=${sorted[i]} và A[${i + 1}]=${sorted[i + 1]}.`,
      d => {
        d.marks = [
          { index: i, role: 'compare' },
          { index: i + 1, role: 'compare' },
        ];
        d.note = `So sánh vị trí liền kề ${i}, ${i + 1}`;
      },
      [
        { target: `bar-${i}`, role: 'compare' },
        { target: `bar-${i + 1}`, role: 'compare' },
      ],
      'scan',
    );
    if (sorted[i] === sorted[i + 1]) {
      rec.step(
        'found',
        `A[${i}] = A[${i + 1}] = ${sorted[i]}: tìm thấy cặp trùng.`,
        d => {
          d.marks = [
            { index: i, role: 'found' },
            { index: i + 1, role: 'found' },
          ];
          d.note = `Trùng giá trị ${sorted[i]}`;
        },
        [
          { target: `bar-${i}`, role: 'found' },
          { target: `bar-${i + 1}`, role: 'found' },
        ],
        'done',
      );
      return { unique: false, duplicate: sorted[i] };
    }
  }
  rec.step(
    'done',
    'Không có hai phần tử liền kề nào bằng nhau sau khi sắp xếp — các phần tử đều duy nhất.',
    d => {
      d.note = 'Duy nhất';
      d.marks = [];
    },
    [],
    'done',
  );
  return { unique: true, duplicate: null };
}
