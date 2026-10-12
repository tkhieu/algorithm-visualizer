import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/bipartite-matching/generators'
import { reference, check } from '../../../problems/bipartite-matching/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: seed, trace, tiếng Việt`, () => {
  for (let seed = 1; seed <= 40; seed++) {
    const input = generate(seed, 'small'),
      output = algorithm.run(input, {
        rec: new MetricsRecorder(),
        signal: new AbortController().signal,
      })
    expect(output.size).toBe(reference(input))
    expect(check(input, output)).toMatchObject({ ok: true, optimal: true })
  }
  const input = generate(5, 'tiny'),
    initial = algorithm.initVisual(input),
    rec = new TraceRecorder(
      initial,
      new Set(algorithm.pseudocode.map((p) => p.id)),
      algorithm.traceLimit,
    ),
    output = algorithm.run(input, { rec, signal: new AbortController().signal }),
    store = new TraceStore(initial)
  rec.steps.forEach((s) => store.append(s))
  expect(store.seek(store.length).pairs).toEqual(output.pairs)
  expect(store.current.size).toBe(output.size)
  expect(rec.steps.some((s) => s.explain.includes('cặp') || s.explain.includes('đỉnh'))).toBe(true)
})
