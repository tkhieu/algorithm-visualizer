import type {SizeClass} from '../../core/contracts';
import type {Input} from './definition';
import {rng} from '../../lib/random';

const ALPHABET = 'ABCD';

export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = {tiny: 4, small: 6, medium: 10, large: 16}[size];
  const word = (len: number) => Array.from({length: len}, () => ALPHABET[Math.floor(r() * ALPHABET.length)]).join('');
  return {a: word(n), b: word(n)};
}
