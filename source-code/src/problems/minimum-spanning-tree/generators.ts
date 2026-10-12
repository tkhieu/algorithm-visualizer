import type { SizeClass } from '../../core/contracts'
import { rng } from '../../lib/random'
import type { Input } from './definition'
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed),
    n = { tiny: 4, small: 7, medium: 14, large: 28 }[size],
    edges: [number, number, number][] = []
  for (let i = 1; i < n; i++) edges.push([i, Math.floor(r() * i), 1 + Math.floor(r() * 20)])
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
      if (
        !edges.some((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)) &&
        r() < 0.13
      )
        edges.push([a, b, 1 + Math.floor(r() * 20)])
  return { n, edges: edges.slice(0, 400) }
}
