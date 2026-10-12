import type {RunContext} from '../../../core/contracts';
import type {Input, Output} from '../../../problems/n-queens/definition';
import {assertActive, marksFor, pack, type VisualState} from '../shared';
import {valid} from '../../../problems/n-queens/checker';
const SAFE_MAX = 6;
export function run(input: Input, {rec, signal}: RunContext<VisualState>): Output {
  const n = input.n;
  if (n > SAFE_MAX)
    throw new Error(`Vét cạn nⁿ chỉ hỗ trợ n ≤ ${SAFE_MAX} (nhận n=${n}); hãy dùng thuật toán quay lui cho n lớn hơn.`);
  let nextId = 0;
  let solution: number[] | null = null;
  let solutionLeaf: number | null = null;
  const positions: number[] = new Array(n).fill(0);
  const nodeAtRow: number[] = [];
  rec.step(
    'init',
    `Sinh mọi cách đặt n=${n} quân hậu, mỗi hàng chọn một trong ${n} cột.`,
    (d) => {
      d.note = 'Bắt đầu sinh mọi cách đặt';
    },
    [],
    'search',
  );
  function assign(row: number): boolean {
    assertActive(signal);
    for (let col = 0; col < n; col++) {
      rec.count('visit');
      const id = nextId++;
      const parent = row === 0 ? null : nodeAtRow[row - 1];
      positions[row] = col;
      nodeAtRow[row] = id;
      rec.step(
        'assign',
        `Gán cột ${col} cho hàng ${row}.`,
        (d) => {
          d.nodes.push({id, parent, label: `${row}:${col}`, status: 'current', value: 0});
          d.marks = marksFor(n, positions.slice(0, row + 1));
        },
        [{target: `cell-${row}-${col}`, role: 'current'}],
        'search',
      );
      if (row === n - 1) {
        rec.count('compare');
        const ok = valid(positions);
        rec.step(
          'check',
          ok
            ? `Cách đặt ${positions.join(',')} không có hai quân hậu tấn công nhau — nghiệm.`
            : `Cách đặt ${positions.join(',')} có xung đột — bỏ qua.`,
          (d) => {
            const node = d.nodes.find((x) => x.id === id);
            if (node) node.status = ok ? 'best' : 'done';
          },
          ok ? [{target: `cell-${row}-${col}`, role: 'queen'}] : [],
          'leaf',
        );
        if (ok) {
          solution = positions.slice();
          solutionLeaf = id;
          return true;
        }
        continue;
      }
      if (assign(row + 1)) return true;
    }
    return false;
  }
  const ok = assign(0);
  rec.step(
    'done',
    ok ? `Hoàn tất: tìm được nghiệm đầu tiên.` : 'Hoàn tất: đã thử hết mọi cách, không có nghiệm.',
    (d) => {
      if (solutionLeaf !== null) {
        const node = d.nodes.find((x) => x.id === solutionLeaf);
        if (node) node.status = 'best';
      }
      d.note = ok ? 'Tìm được nghiệm' : 'Không có nghiệm';
    },
    [],
    'done',
  );
  return pack(solution);
}
