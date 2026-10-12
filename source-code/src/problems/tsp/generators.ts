import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
import {rng} from '../../lib/random';

export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = {tiny: 4, small: 6, medium: 8, large: 12}[size];
  const points = Array.from({length: n}, () => ({
    x: Math.round((r() * 200 - 100) * 10) / 10,
    y: Math.round((r() * 200 - 100) * 10) / 10,
  }));
  return {points};
}
