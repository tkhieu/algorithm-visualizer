import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/sorting/definition';
export type Role = 'current' | 'place';
export interface VisualState {
  values: number[];
  /** Chỉ số gốc (trước khi sắp) của phần tử hiện đang ở mỗi vị trí — cho thấy tính ổn định. */
  tags: number[];
  marks: { index: number; role: Role }[];
  ranges: { from: number; to: number; role: 'sorted' | 'active' }[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return {
    values: [...input.values],
    tags: input.values.map((_, i) => i),
    marks: [],
    ranges: [],
    note: '',
  };
}
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const values = [...input.values];
  const n = values.length;
  if (n === 0) {
    rec.step('done', 'Dãy rỗng — không cần sắp xếp.', () => {}, [], 'done');
    return { sorted: [] };
  }
  const min = Math.min(...values),
    max = Math.max(...values);
  const k = max - min + 1;
  const dist = new Array<number>(k).fill(0);
  rec.step(
    'range',
    `Giá trị nằm trong [${min},${max}] → cần ${k} ngăn đếm.`,
    d => {
      d.note = `Phạm vi [${min},${max}]`;
    },
    [],
    'count',
  );
  for (let idx = 0; idx < n; idx++) {
    const v = values[idx];
    dist[v - min]++;
    rec.count('assign');
    rec.step(
      'tally',
      `Đếm thêm giá trị ${v} (vị trí ${idx}) vào ngăn ${v - min} (tần suất).`,
      d => {
        d.marks = [{ index: idx, role: 'current' }];
      },
      [{ target: `bar-${idx}`, role: 'current' }],
      'count',
    );
  }
  for (let j = 1; j < k; j++) {
    dist[j] += dist[j - 1];
    rec.count('assign');
    rec.step(
      'distribute',
      `Tích lũy phân phối: ngăn ${j} (giá trị ${j + min}) có ${dist[j]} phần tử ≤ ${j + min}.`,
      d => {
        d.note = `Phân phối tích lũy tại ngăn ${j}: ${dist[j]}`;
      },
      [],
      'distribute',
    );
  }
  const resultArr = new Array<number | null>(n).fill(null);
  const resultTags = new Array<number | null>(n).fill(null);
  for (let idx = n - 1; idx >= 0; idx--) {
    const v = values[idx];
    const j = v - min;
    dist[j]--;
    const pos = dist[j];
    resultArr[pos] = v;
    resultTags[pos] = idx;
    rec.count('assign');
    rec.step(
      'place',
      `Đặt A[${idx}]=${v} vào vị trí ${pos} rồi giảm ngăn ${j} (duyệt phải sang trái để giữ ổn định).`,
      d => {
        d.values = resultArr.map((x, i) => x ?? values[i]);
        d.tags = resultTags.map((x, i) => x ?? i);
        d.marks = [{ index: pos, role: 'place' }];
      },
      [{ target: `bar-${pos}`, role: 'place' }],
      'place',
    );
  }
  rec.step(
    'done',
    'Hoàn tất sắp xếp đếm phân phối (ổn định).',
    d => {
      d.values = resultArr as number[];
      d.tags = resultTags as number[];
      d.marks = [];
      d.ranges = [{ from: 0, to: n - 1, role: 'sorted' }];
      d.note = 'Đã sắp xếp';
    },
    [],
    'done',
  );
  return { sorted: resultArr as number[] };
}
