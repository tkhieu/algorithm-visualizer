import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
import {rng} from '../../lib/random';

export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = {tiny: 3, small: 5, medium: 8, large: 12}[size];
  const dims = Array.from({length: n + 1}, () => 1 + Math.floor(r() * 30));
  return {dims};
}
