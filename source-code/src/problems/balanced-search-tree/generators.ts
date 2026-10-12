import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 6, small: 12, medium: 18, large: 24 }[size];
  const seen = new Set<number>();
  const keys: number[] = [];
  while (keys.length < n) {
    const v = Math.floor(r() * 500) - 250;
    if (seen.has(v)) continue;
    seen.add(v);
    keys.push(v);
  }
  return { keys };
}
