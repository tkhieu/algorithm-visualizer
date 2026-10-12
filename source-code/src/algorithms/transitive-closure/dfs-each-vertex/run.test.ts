import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/transitive-closure/generators'
import { reference, check } from '../../../problems/transitive-closure/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: ma trận seed và trace`, () => {
  for (let seed = 1; seed <= 35; seed++) {
    const input = generate(seed, 'small'),
      output = algorithm.run(input, {
        rec: new MetricsRecorder(),
        signal: new AbortController().signal,
      })
    expect(output.reachable).toEqual(reference(input))
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
  expect(store.seek(store.length).reachable).toEqual(output.reachable)
  expect(rec.steps.some((s) => s.explain.includes('đường'))).toBe(true)
})

it('DFS từ mỗi đỉnh đồng ý với Warshall độc lập', () => {
  for (let seed = 1; seed <= 35; seed++) {
    const input = generate(seed, 'small'),
      matrix = Array.from({ length: input.n }, (_, i) =>
        Array.from({ length: input.n }, (_, j) => i === j),
      )
    for (const [a, b] of input.edges) matrix[a][b] = true
    for (let k = 0; k < input.n; k++)
      for (let i = 0; i < input.n; i++)
        for (let j = 0; j < input.n; j++)
          matrix[i][j] = matrix[i][j] || (matrix[i][k] && matrix[k][j])
    expect(
      algorithm.run(input, { rec: new MetricsRecorder(), signal: new AbortController().signal })
        .reachable,
    ).toEqual(matrix)
  }
})
