import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const max = { tiny: 5, small: 12, medium: 30, large: 60 }[size];
  return { base: Math.floor(r() * 25) - 12, exponent: Math.floor(r() * (max + 1)) };
}
