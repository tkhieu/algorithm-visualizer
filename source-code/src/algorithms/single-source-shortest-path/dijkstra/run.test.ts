import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/single-source-shortest-path/generators'
import { reference } from '../../../problems/single-source-shortest-path/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: seed, trace, tiếng Việt`, () => {
  for (let seed = 1; seed <= 40; seed++) {
    const original = generate(seed, 'small'),
      input = algorithm.id.endsWith('bfs-unweighted')
        ? {
            ...original,
            edges: original.edges.map(([a, b]) => [a, b, 1] as [number, number, number]),
          }
        : original
    const output = algorithm.run(input, {
      rec: new MetricsRecorder(),
      signal: new AbortController().signal,
    })
    expect(output.distance).toEqual(reference(input))
  }
  const original = generate(3, 'tiny'),
    input = {
      ...original,
      edges: original.edges.map(([a, b]) => [a, b, 1] as [number, number, number]),
    },
    initial = algorithm.initVisual(input),
    rec = new TraceRecorder(
      initial,
      new Set(algorithm.pseudocode.map((p) => p.id)),
      algorithm.traceLimit,
    ),
    output = algorithm.run(input, { rec, signal: new AbortController().signal }),
    store = new TraceStore(initial)
  rec.steps.forEach((s) => store.append(s))
  expect(store.seek(store.length).distance).toEqual(output.distance)
  expect(rec.steps.some((s) => s.explain.includes('đỉnh') || s.explain.includes('nguồn'))).toBe(
    true,
  )
})
