import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 3, small: 5, medium: 8, large: 11 }[size];
  return {
    coefficients: Array.from({ length: n }, () => Math.floor(r() * 11) - 5),
    x: Math.floor(r() * 7) - 3
  };
}
