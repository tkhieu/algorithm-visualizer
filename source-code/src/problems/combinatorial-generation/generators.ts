import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const max = { tiny: 2, small: 3, medium: 4, large: 5 }[size];
  return { n: 1 + Math.floor(r() * max) };
}
