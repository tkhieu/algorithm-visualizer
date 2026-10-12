import type { SizeClass } from '../../core/contracts'
import { rng } from '../../lib/random'
import type { Input } from './definition'
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed),
    n = { tiny: 3, small: 6, medium: 12, large: 22 }[size],
    edges: [number, number][] = []
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (r() < 0.22) edges.push([a, b])
  return { left: n, right: n, edges: edges.slice(0, 300) }
}
