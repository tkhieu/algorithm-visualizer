import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const [lo, hi] = { tiny: [0, 5], small: [6, 10], medium: [11, 15], large: [16, 20] }[size];
  return { n: lo + Math.floor(r() * (hi - lo + 1)) };
}
