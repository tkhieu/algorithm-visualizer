import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 1, small: 2, medium: 3, large: 4 }[size];
  const matrix = () =>
    Array.from({ length: n }, () => Array.from({ length: n }, () => Math.floor(r() * 11) - 5));
  return { a: matrix(), b: matrix() };
}
