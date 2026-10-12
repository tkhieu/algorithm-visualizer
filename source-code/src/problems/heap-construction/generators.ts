import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 6, small: 14, medium: 24, large: 36 }[size];
  const values = Array.from({ length: n }, () => Math.floor(r() * 200) - 100);
  return { values };
}
