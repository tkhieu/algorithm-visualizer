import type { SizeClass } from '../../core/contracts';
import type { Input } from './definition';
import { rng } from '../../lib/random';
type Node = { id: number; value: number; left: number | null; right: number | null };
function build(
  count: number,
  r: () => number,
  nodes: Node[],
  nextId: { v: number },
): number | null {
  if (count <= 0) return null;
  const id = nextId.v++;
  const node: Node = { id, value: Math.floor(r() * 200) - 100, left: null, right: null };
  nodes.push(node);
  const leftSize = Math.floor(r() * count);
  const rightSize = count - 1 - leftSize;
  node.left = build(leftSize, r, nodes, nextId);
  node.right = build(rightSize, r, nodes, nextId);
  return id;
}
export function generate(seed: number, size: SizeClass): Input {
  const r = rng(seed);
  const n = { tiny: 5, small: 11, medium: 19, large: 27 }[size];
  const nodes: Node[] = [];
  const root = build(n, r, nodes, { v: 0 });
  return { nodes, root };
}
