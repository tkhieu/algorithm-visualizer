import type { SizeClass } from '../../core/contracts'
import { rng } from '../../lib/random'
import type { Input } from './definition'
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed),
    n = { tiny: 4, small: 7, medium: 12, large: 20 }[size],
    edges: [number, number, number][] = []
  for (let a = 0; a < n; a++)
    for (let b = 0; b < n; b++)
      if (a !== b && r() < 0.16) edges.push([a, b, 1 + Math.floor(r() * 12)])
  return { n, edges: edges.slice(0, 250), source: 0, sink: n - 1 }
}
