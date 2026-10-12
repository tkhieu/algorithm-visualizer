import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/all-pairs-shortest-path/generators'
import { reference } from '../../../problems/all-pairs-shortest-path/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: seed, trace, tiếng Việt`, () => {
  for (let seed = 1; seed <= 35; seed++) {
    const input = generate(seed, 'small')
    expect(
      algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal })
        .distance,
    ).toEqual(reference(input))
  }
  const input = generate(2, 'tiny'),
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
  expect(
    rec.steps.some((s) => s.explain.includes('khoảng cách') || s.explain.includes('đường')),
  ).toBe(true)
})
