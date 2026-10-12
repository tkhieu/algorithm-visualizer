import type { RunContext } from '../../../core/contracts';
import type { Input, Output } from '../../../problems/linear-programming-2d/definition';
import { assertActive, pack, type VisualState } from '../shared';

const EPS = 1e-9;
type Tableau = { rows: number[][]; basis: number[]; columns: number; artificial: Set<number> };
function tableau(input: Input): Tableau {
  const m = input.constraints.length;
  const columns = 2 + m + input.constraints.filter((l) => l.c < -EPS).length;
  const artificial = new Set<number>();
  const rows: number[][] = [];
  const basis: number[] = [];
  let nextArtificial = 2 + m;
  for (let i = 0; i < m; i++) {
    const { a, b, c } = input.constraints[i];
    const row = new Array<number>(columns + 1).fill(0);
    const sign = c < -EPS ? -1 : 1;
    row[0] = sign * a;
    row[1] = sign * b;
    row[2 + i] = sign;
    row[columns] = sign * c;
    if (sign < 0) {
      row[nextArtificial] = 1;
      artificial.add(nextArtificial);
      basis.push(nextArtificial++);
    } else basis.push(2 + i);
    rows.push(row);
  }
  rows.push(new Array<number>(columns + 1).fill(0));
  return { rows, basis, columns, artificial };
}
function objective(t: Tableau, costs: number[]): void {
  const bottom = t.rows[t.rows.length - 1];
  bottom.fill(0);
  for (let j = 0; j < t.columns; j++) bottom[j] = -(costs[j] ?? 0);
  for (let i = 0; i < t.basis.length; i++) {
    const cost = costs[t.basis[i]] ?? 0;
    for (let j = 0; j <= t.columns; j++) bottom[j] += cost * t.rows[i][j];
  }
}
function pivot(t: Tableau, row: number, col: number): void {
  const { rows, columns } = t;
  const scale = rows[row][col];
  for (let j = 0; j <= columns; j++) rows[row][j] /= scale;
  for (let i = 0; i < rows.length; i++) {
    if (i === row) continue;
    const factor = rows[i][col];
    for (let j = 0; j <= columns; j++) rows[i][j] -= factor * rows[row][j];
  }
  t.basis[row] = col;
}
function snapshot(t: Tableau, d: VisualState, note: string): void {
  d.matrix = t.rows.map((row) => row.map((value) => (Math.abs(value) < EPS ? 0 : Number(value.toFixed(6)))));
  d.computed = t.rows.map((row) => row.map(() => true));
  d.note = note;
  const x = t.basis.indexOf(0),
    y = t.basis.indexOf(1);
  d.points = [{ x: x < 0 ? 0 : t.rows[x][t.columns], y: y < 0 ? 0 : t.rows[y][t.columns], role: 'current' }];
}
export function run(input: Input, { rec, signal }: RunContext<VisualState>): Output {
  const t = tableau(input);
  rec.step(
    'start',
    `Lập bảng đơn hình với ${input.constraints.length} biến dư và ${t.artificial.size} biến giả.`,
    (d) => {
      snapshot(t, d, 'Bảng đơn hình ban đầu');
    },
    [],
    'start',
  );
  function solve(phase: 1 | 2): 'optimal' | 'unbounded' {
    while (true) {
      assertActive(signal);
      const basic = new Set(t.basis);
      // Bland: choose the lowest-index eligible nonbasic variable.
      const entering = Array.from({ length: t.columns }, (_, i) => i).find(
        (j) => !basic.has(j) && (phase === 1 || !t.artificial.has(j)) && t.rows.at(-1)![j] < -EPS,
      );
      if (entering === undefined) return 'optimal';
      let leaving = -1,
        ratio = Infinity;
      for (let i = 0; i < t.basis.length; i++) {
        const coefficient = t.rows[i][entering];
        if (coefficient <= EPS) continue;
        const candidate = t.rows[i][t.columns] / coefficient;
        if (
          candidate < ratio - EPS ||
          (Math.abs(candidate - ratio) <= EPS && (leaving < 0 || t.basis[i] < t.basis[leaving]))
        ) {
          ratio = candidate;
          leaving = i;
        }
      }
      if (leaving < 0) return 'unbounded';
      const old = t.basis[leaving];
      pivot(t, leaving, entering);
      rec.count('compare');
      rec.step(
        'pivot',
        `Pha ${phase}: biến x${entering} vào, x${old} ra ở hàng ${leaving + 1}; ` +
          `tỉ số ${ratio.toFixed(3)}${ratio <= EPS ? ' (suy biến)' : ''}.`,
        (d) => {
          d.current = { i: leaving, w: entering };
          snapshot(t, d, `Pivot x${entering} vào, x${old} ra`);
        },
        [],
        'pivot',
      );
    }
  }
  if (t.artificial.size) {
    const costs = new Array<number>(t.columns).fill(0);
    for (const j of t.artificial) costs[j] = -1;
    objective(t, costs);
    rec.step(
      'phase-one',
      'Pha I: tối đa hoá đối của tổng biến giả để tìm nghiệm khả thi.',
      (d) => {
        snapshot(t, d, 'Pha I: tìm cơ sở khả thi');
      },
      [],
      'phase-one',
    );
    solve(1);
    if (t.rows.at(-1)![t.columns] < -EPS) {
      rec.step(
        'infeasible',
        'Bài toán không khả thi: tổng biến giả không thể về 0.',
        (d) => {
          d.note = 'Không khả thi';
        },
        [],
        'done',
      );
      return { status: 'infeasible', message: 'Bài toán không khả thi' };
    }
    for (let i = t.basis.length - 1; i >= 0; i--) {
      if (!t.artificial.has(t.basis[i])) continue;
      const basic = new Set(t.basis);
      const entering = Array.from({ length: t.columns }, (_, j) => j).find(
        (j) => !t.artificial.has(j) && !basic.has(j) && Math.abs(t.rows[i][j]) > EPS,
      );
      if (entering === undefined) {
        t.rows.splice(i, 1);
        t.basis.splice(i, 1);
      } else pivot(t, i, entering);
    }
  }
  const costs = new Array<number>(t.columns).fill(0);
  costs[0] = input.objective.cx;
  costs[1] = input.objective.cy;
  objective(t, costs);
  rec.step(
    'phase-two',
    'Pha II: tối đa hoá hàm mục tiêu trên cơ sở khả thi.',
    (d) => {
      snapshot(t, d, 'Pha II: tối ưu hàm mục tiêu');
    },
    [],
    'phase-two',
  );
  if (solve(2) === 'unbounded') {
    rec.step(
      'unbounded',
      'Bài toán không bị chặn: có biến vào nhưng không có biến ra.',
      (d) => {
        d.note = 'Không bị chặn';
      },
      [],
      'done',
    );
    return { status: 'unbounded', message: 'Bài toán không bị chặn' };
  }
  const xRow = t.basis.indexOf(0),
    yRow = t.basis.indexOf(1);
  const x = xRow < 0 ? 0 : t.rows[xRow][t.columns];
  const y = yRow < 0 ? 0 : t.rows[yRow][t.columns];
  const result = pack(x, y, input.objective.cx * x + input.objective.cy * y);
  rec.step(
    'done',
    `Nghiệm tối ưu (${x.toFixed(2)}, ${y.toFixed(2)}), giá trị ${result.value.toFixed(2)}.`,
    (d) => {
      snapshot(t, d, `Tối ưu tại (${x.toFixed(2)}, ${y.toFixed(2)})`);
      d.points = [{ x, y, role: 'root' }];
    },
    [],
    'done',
  );
  return result;
}
