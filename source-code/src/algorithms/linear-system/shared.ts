import type { Input } from '../../problems/linear-system/definition';
import type { Recorder } from '../../core/contracts';
export interface VisualState {
  matrix: number[][];
  current?: { i: number; w: number } | null;
  note?: string;
}
export function initVisual(input: Input): VisualState {
  return { matrix: input.a.map((row, i) => [...row, input.b[i]]), note: 'Ma trận mở rộng [A|b]' };
}
export const legend = { current: 'Phần tử đang biến đổi', done: 'Cột nghiệm' };
export function finish(rec: Recorder<VisualState>, solution: number[]) {
  rec.step(
    'done',
    `Nghiệm của hệ là (${solution.map((x) => Number(x.toFixed(6))).join(', ')}).`,
    (d) => {
      for (let i = 0; i < solution.length; i++) d.matrix[i][solution.length] = solution[i];
      d.current = null;
      d.note = 'Cột cuối là nghiệm';
    }
  );
  return { solution };
}
