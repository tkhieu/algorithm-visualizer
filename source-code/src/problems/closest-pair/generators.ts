import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 4, small: 10, medium: 30, large: 80 }[size];
  const span = { tiny: 20, small: 50, medium: 200, large: 500 }[size];
  const points = Array.from({ length: n }, () => ({
    x: Math.round((r() * 2 - 1) * span),
    y: Math.round((r() * 2 - 1) * span),
  }));
  return { points };
}
