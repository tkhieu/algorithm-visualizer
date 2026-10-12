import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 6, small: 14, medium: 28, large: 50 }[size];
  const spread = seed % 2 === 0 ? Math.max(1, n * 2) : Math.max(1, Math.floor(n / 3));
  const values = Array.from({ length: n }, () => Math.floor(r() * (2 * spread + 1)) - spread);
  return { values };
}
