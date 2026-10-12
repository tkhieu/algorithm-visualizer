import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 3, small: 9, medium: 40, large: 150 }[size];
  const weights = Array<9 | 10>(n).fill(10);
  weights[Math.floor(r() * n)] = 9;
  return { weights };
}
