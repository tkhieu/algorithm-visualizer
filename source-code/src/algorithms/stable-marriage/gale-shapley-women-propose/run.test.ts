import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/stable-marriage/generators'
import { check } from '../../../problems/stable-marriage/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: ổn định trên seed, trace, tiếng Việt`, () => {
  for (let seed = 1; seed <= 40; seed++) {
    const input = generate(seed, 'small'),
      output = algorithm.run(input, {
        rec: new MetricsRecorder(),
        signal: new AbortController().signal,
      })
    expect(check(input, output).ok).toBe(true)
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
  expect(store.seek(store.length).wifeOfMen).toEqual(output.wifeOfMen)
  expect(rec.steps.some((s) => s.explain.includes('đề xuất'))).toBe(true)
})

it('đối chiếu mọi ghép cặp bền vững trên seed nhỏ', () => {
  for (let seed = 1; seed <= 35; seed++) {
    const input = generate(seed, 'tiny'),
      n = input.men.length,
      output = algorithm.run(input, {
        rec: new MetricsRecorder(),
        signal: new AbortController().signal,
      })
    const stable: number[][] = []
    function enumerate(prefix: number[], unused: number[]) {
      if (!unused.length) {
        if (check(input, { wifeOfMen: prefix }).ok) stable.push([...prefix])
        return
      }
      for (const w of unused)
        enumerate(
          [...prefix, w],
          unused.filter((x) => x !== w),
        )
    }
    enumerate(
      [],
      Array.from({ length: n }, (_, i) => i),
    )
    expect(stable.length).toBeGreaterThan(0)
    expect(stable).toContainEqual(output.wifeOfMen)
    for (const alternative of stable) {
      if (algorithm.id.endsWith('/gale-shapley-men-propose'))
        for (let m = 0; m < n; m++)
          expect(input.men[m].indexOf(output.wifeOfMen[m])).toBeLessThanOrEqual(
            input.men[m].indexOf(alternative[m]),
          )
      else
        for (let w = 0; w < n; w++) {
          const chosen = output.wifeOfMen.indexOf(w),
            other = alternative.indexOf(w)
          expect(input.women[w].indexOf(chosen)).toBeLessThanOrEqual(input.women[w].indexOf(other))
        }
    }
  }
})
