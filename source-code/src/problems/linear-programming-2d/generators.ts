import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const k = { tiny: 1, small: 2, medium: 3, large: 5 }[size];
  const bx = 10 + Math.floor(r() * 10);
  const by = 10 + Math.floor(r() * 10);
  const constraints = [
    { a: 1, b: 0, c: bx },
    { a: 0, b: 1, c: by },
  ];
  for (let i = 0; i < k; i++) {
    const a = 1 + Math.floor(r() * 4);
    const b = 1 + Math.floor(r() * 4);
    const c = Math.floor((a * bx + b * by) * (0.3 + r() * 0.5));
    constraints.push({ a, b, c });
  }
  const cx = 1 + Math.floor(r() * 9);
  const cy = 1 + Math.floor(r() * 9);
  return { objective: { cx, cy }, constraints };
}
