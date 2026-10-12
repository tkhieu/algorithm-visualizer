import type { SizeClass } from '../../core/contracts'
import { rng } from '../../lib/random'
import type { Input } from './definition'
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed),
    n = { tiny: 4, small: 8, medium: 16, large: 30 }[size],
    order = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const edges: [number, number][] = []
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) if (r() < 0.14) edges.push([order[i], order[j]])
  return { n, edges: edges.slice(0, 300) }
}
