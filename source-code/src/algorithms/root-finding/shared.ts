import type { Input } from '../../problems/root-finding/definition';
import { f } from '../../problems/root-finding/definition';
import type { Recorder } from '../../core/contracts';
export interface VisualState {
  domain: [number, number];
  samples: { x: number; y: number }[];
  points?: { x: number; y: number; role?: string }[];
  intervals?: { from: number; to: number }[];
  tangent?: { from: { x: number; y: number }; to: { x: number; y: number } };
  secant?: { from: { x: number; y: number }; to: { x: number; y: number } };
  iterates?: { x: number; y: number }[];
  note?: string;
}
export function initVisual(input: Input): VisualState {
  return {
    domain: [input.left, input.right],
    samples: Array.from({ length: 81 }, (_, i) => {
      const x = input.left + ((input.right - input.left) * i) / 80;
      return { x, y: f(x, input.c, input.d) };
    }),
    intervals: [{ from: input.left, to: input.right }],
    iterates: [],
    note: 'Khoảng ban đầu kẹp nghiệm'
  };
}
export const legend = { current: 'Ước lượng hiện tại', root: 'Nghiệm cuối' };
export function finish(rec: Recorder<VisualState>, input: Input, root: number) {
  rec.step(
    'done',
    `Nghiệm x ≈ ${root.toPrecision(9)} với sai số không quá ${input.tolerance}.`,
    (d) => {
      d.points = [{ x: root, y: f(root, input.c, input.d), role: 'root' }];
      d.note = `Nghiệm x ≈ ${root.toPrecision(9)}`;
    }
  );
  return { root };
}
