import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/graph-traversal/generators'
import { check } from '../../../problems/graph-traversal/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: seeded random, trace và lời giải thích`, () => {
  for (let seed = 1; seed <= 40; seed++) {
    const input = generate(seed, 'small')
    const output = algorithm.run(input, {
      rec: new MetricsRecorder(),
      signal: new AbortController().signal,
    })
    const expected = new Set<number>([input.start]),
      queue = [input.start]
    for (let i = 0; i < queue.length; i++)
      for (const [a, b] of input.edges)
        if (a === queue[i] && !expected.has(b)) {
          expected.add(b)
          queue.push(b)
        }
    expect(new Set(output.order)).toEqual(expected)
    expect(check(input, output).ok).toBe(true)
  }
  const input = generate(11, 'tiny'),
    initial = algorithm.initVisual(input)
  const rec = new TraceRecorder(
    initial,
    new Set(algorithm.pseudocode.map((p) => p.id)),
    algorithm.traceLimit,
  )
  const output = algorithm.run(input, { rec, signal: new AbortController().signal })
  const store = new TraceStore(initial)
  rec.steps.forEach((s) => store.append(s))
  expect(store.seek(store.length).order).toEqual(output.order)
  expect(store.current.parent).toEqual(output.parent)
  expect(rec.steps.some((s) => s.explain.includes('đỉnh'))).toBe(true)
})

it('BFS lấy đỉnh theo mức', () => {
  const input = {
    n: 4,
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ] as [number, number][],
    start: 0,
  }
  const output = algorithm.run(input, {
    rec: new MetricsRecorder(),
    signal: new AbortController().signal,
  })
  expect(output).toEqual({ order: [0, 1, 2, 3], parent: [null, 0, 0, 1] })
})
