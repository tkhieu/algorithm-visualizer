import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/dictionary-hashing/definition';
export interface HashBucketState {
  index: number;
  entries: { key: number; role?: string }[];
  role?: string;
}
export interface VisualState {
  buckets: HashBucketState[];
  note: string;
}
export function initVisual(input: Input): VisualState {
  return {
    buckets: Array.from({ length: input.tableSize }, (_, i) => ({ index: i, entries: [] })),
    note: '',
  };
}
const hash = (k: number, m: number) => ((k % m) + m) % m;
export function run(input: Input, { rec }: RunContext<VisualState>): Output {
  const m = input.tableSize;
  const slots: (number | null)[] = new Array(m).fill(null);
  for (const key of input.keys) {
    const home = hash(key, m);
    rec.count('hash');
    rec.step(
      'hash',
      `h(${key}) = ${key} mod ${m} = ${home}.`,
      d => {
        for (const b of d.buckets) b.role = undefined;
        d.buckets[home].role = 'current';
      },
      [{ target: `bucket-${home}`, role: 'current' }],
      'insert',
    );
    let idx = home,
      probes = 0,
      placed = false;
    while (probes < m) {
      if (slots[idx] === null) {
        placed = true;
        break;
      }
      rec.count('compare');
      rec.step(
        'probe',
        `Ngăn ${idx} đã có khóa ${slots[idx]} — dò sang ngăn kế tiếp.`,
        d => {
          d.buckets[idx].role = 'probed';
        },
        [{ target: `bucket-${idx}`, role: 'probed' }],
        'insert',
      );
      idx = (idx + 1) % m;
      probes++;
    }
    if (!placed) {
      rec.step(
        'full',
        `Bảng đầy — không còn ngăn trống cho khóa ${key}, bỏ qua.`,
        d => {
          d.note = `Bảng đầy, bỏ qua ${key}`;
        },
        [],
        'insert',
      );
      continue;
    }
    slots[idx] = key;
    rec.step(
      'insert',
      `Chèn khóa ${key} vào ngăn ${idx}.`,
      d => {
        d.buckets[idx].entries = [{ key, role: 'current' }];
        d.note = `Chèn ${key} vào ngăn ${idx}`;
      },
      [{ target: `entry-${idx}-0`, role: 'current' }],
      'insert',
    );
  }
  rec.step(
    'done',
    `Đã xét ${input.keys.length} khóa.`,
    d => {
      for (const b of d.buckets) {
        b.role = undefined;
        for (const e of b.entries) e.role = undefined;
      }
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return { buckets: slots.map(s => (s === null ? [] : [s])) };
}
