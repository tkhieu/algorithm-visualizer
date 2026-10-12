import type { SizeClass } from '../../core/contracts'
import { rng } from '../../lib/random'
import type { Input } from './definition'
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed),
    n = { tiny: 4, small: 7, medium: 13, large: 24 }[size]
  return {
    symbols: Array.from({ length: n }, (_, i) => ({
      label: `K${i + 1}`,
      frequency: 1 + Math.floor(r() * 30),
    })),
  }
}
