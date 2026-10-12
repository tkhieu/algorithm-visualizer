import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const max = { tiny: 20, small: 200, medium: 10000, large: 1000000 }[size];
  return { a: 1 + Math.floor(r() * max), b: Math.floor(r() * max) };
}
