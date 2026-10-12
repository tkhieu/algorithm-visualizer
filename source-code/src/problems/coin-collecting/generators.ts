import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const [rows, cols] = { tiny: [2, 2], small: [3, 3], medium: [4, 5], large: [6, 6] }[size];
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => r() < 0.4));
  return { grid };
}
