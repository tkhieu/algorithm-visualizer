import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/assignment/definition';
import {assertActive, marksFor, pack, type VisualState} from '../shared';

/**
 * Thuật toán Hungary (Jonker–Volgenant dạng thế vị), O(n³). 1-đánh số nội bộ theo quy ước kinh điển.
 * Không có trong giáo trình Levitin — xem index.ts: exactness 'exact', ghi chú "mở rộng".
 */
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const {cost} = input;
  const n = cost.length;
  if (n === 0) {
    rec.step('done', 'Không có người nào — phân công tầm thường.', (d) => { d.note = 'Hoàn tất'; }, [], 'done');
    return pack(cost, []);
  }

  const INF = Infinity;
  const u = new Array(n + 1).fill(0);
  const v = new Array(n + 1).fill(0);
  const p = new Array(n + 1).fill(0);
  const way = new Array(n + 1).fill(0);

  const partialAssignment = () => {
    const assignment: (number | null)[] = new Array(n).fill(null);
    for (let j = 1; j <= n; j++) if (p[j] > 0) assignment[p[j] - 1] = j - 1;
    return assignment;
  };

  rec.step('init', `Khởi tạo thế vị u[i] = v[j] = 0 cho ${n} hàng và ${n} cột.`, (d) => { d.note = 'Bắt đầu'; }, [], 'search');

  for (let i = 1; i <= n; i++) {
    assertActive(signal);
    p[0] = i;
    let j0 = 0;
    const minv = new Array(n + 1).fill(INF);
    const used = new Array(n + 1).fill(false);
    rec.step(
      'worker',
      `Tìm đường tăng cường cho người ${i - 1}.`,
      (d) => { d.marks = marksFor(cost, partialAssignment()); },
      [{target: `row-${i - 1}`, role: 'current'}],
      'search',
    );
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = INF;
      let j1 = -1;
      for (let j = 1; j <= n; j++) {
        if (!used[j]) {
          const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }
      rec.count('relax');
      rec.step(
        'relax',
        `Chênh lệch nhỏ nhất tìm được là ${delta}; cập nhật thế vị để mở cột ${j1 - 1}.`,
        (d) => {
          d.note = `Mở cột ${j1 - 1}`;
        },
        [],
        'search',
      );
      for (let j = 0; j <= n; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
    rec.step(
      'augment',
      `Đã ghép người ${i - 1} bằng đường tăng cường vừa tìm được.`,
      (d) => { d.marks = marksFor(cost, partialAssignment()); },
      [],
      'search',
    );
  }

  const assignment = partialAssignment().map((j) => j as number);
  rec.step(
    'done',
    `Hoàn tất ghép cặp hoàn hảo; chi phí tối ưu ${pack(cost, assignment).cost}.`,
    (d) => {
      d.marks = marksFor(cost, assignment);
      d.note = 'Hoàn tất';
    },
    [],
    'done',
  );
  return pack(cost, assignment);
}
