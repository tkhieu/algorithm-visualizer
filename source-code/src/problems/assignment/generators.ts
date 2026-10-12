import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
import {rng} from '../../lib/random';

export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = {tiny: 3, small: 4, medium: 6, large: 8}[size];
  const cost = Array.from({length: n}, () => Array.from({length: n}, () => Math.floor(r() * 50)));
  return {cost};
}
