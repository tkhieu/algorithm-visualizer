import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 1, small: 2, medium: 3, large: 4 }[size];
  const a = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Math.floor(r() * 5) - 2)
  );
  for (let i = 0; i < n; i++)
    a[i][i] = a[i].reduce((sum, x, j) => sum + (j === i ? 0 : Math.abs(x)), 0) + 2;
  const solution = Array.from({ length: n }, () => Math.floor(r() * 7) - 3);
  const b = a.map((row) => row.reduce((sum, x, j) => sum + x * solution[j], 0));
  return { a, b };
}
