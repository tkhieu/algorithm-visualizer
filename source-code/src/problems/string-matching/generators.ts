import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
const alphabet = ['A', 'B', 'C', 'D'];
function randomString(r: () => number, n: number): string {
  return Array.from({ length: n }, () => alphabet[Math.floor(r() * alphabet.length)]).join('');
}
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 8, small: 16, medium: 40, large: 120 }[size];
  const m = { tiny: 2, small: 3, medium: 5, large: 8 }[size];
  const text = randomString(r, n);
  const fromText = r() < 0.6 && n >= m;
  const start = Math.floor(r() * (n - m + 1));
  const pattern = fromText ? text.slice(start, start + m) : randomString(r, m);
  return { text, pattern };
}
