import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 5, small: 12, medium: 30, large: 70 }[size];
  const span = { tiny: 60, small: 150, medium: 400, large: 900 }[size];
  const points = Array.from({ length: n }, () => ({
    x: Math.round((r() * 2 - 1) * span),
    y: Math.round((r() * 2 - 1) * span),
  }));
  return { points };
}
