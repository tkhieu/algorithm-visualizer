import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const tableSize = { tiny: 5, small: 7, medium: 11, large: 13 }[size];
  const n = Math.max(1, Math.round(tableSize * 0.7));
  const keys = Array.from({ length: n }, () => Math.floor(r() * 100));
  return { tableSize, keys };
}
