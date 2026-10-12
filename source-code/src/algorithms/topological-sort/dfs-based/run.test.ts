import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/topological-sort/generators'
import { check } from '../../../problems/topological-sort/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: thứ tự hợp lệ trên seed, trace và bước tiếng Việt`, () => {
  for (let seed = 1; seed <= 40; seed++) {
    const input = generate(seed, 'small'),
      output = algorithm.run(input, {
        rec: new MetricsRecorder(),
        signal: new AbortController().signal,
      })
    expect(check(input, output).ok).toBe(true)
  }
  const input = generate(7, 'tiny'),
    initial = algorithm.initVisual(input),
    rec = new TraceRecorder(
      initial,
      new Set(algorithm.pseudocode.map((p) => p.id)),
      algorithm.traceLimit,
    ),
    output = algorithm.run(input, { rec, signal: new AbortController().signal }),
    store = new TraceStore(initial)
  rec.steps.forEach((s) => store.append(s))
  expect(store.seek(store.length).order).toEqual(output.order)
  expect(rec.steps.some((s) => s.explain.includes('đỉnh'))).toBe(true)
})
