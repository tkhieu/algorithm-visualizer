import type { SizeClass } from '../../core/contracts'
import { rng } from '../../lib/random'
import type { Input } from './definition'
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed),
    n = { tiny: 3, small: 5, medium: 10, large: 18 }[size]
  function permutation() {
    const a = Array.from({ length: n }, (_, i) => i)
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }
  return {
    men: Array.from({ length: n }, permutation),
    women: Array.from({ length: n }, permutation),
  }
}
