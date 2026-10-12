import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
import {rng} from '../../lib/random';
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = {tiny: 4, small: 6, medium: 10, large: 16}[size];
  const values = Array.from({length: n}, () => 1 + Math.floor(r() * 30));
  let target: number;
  if (r() < 0.5) {
    const subset = values.filter(() => r() < 0.5);
    target = subset.reduce((s, v) => s + v, 0);
  } else target = Math.floor(r() * values.reduce((s, v) => s + v, 0));
  return {values, target};
}
