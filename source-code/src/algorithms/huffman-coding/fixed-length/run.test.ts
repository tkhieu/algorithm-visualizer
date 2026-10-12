import { it, expect } from 'vitest'
import { algorithm } from './index'
import { generate } from '../../../problems/huffman-coding/generators'
import { optimum, check } from '../../../problems/huffman-coding/checker'
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder'
import { TraceStore } from '../../../core/trace/TraceStore'
it(`${algorithm.id}: mã seed, trace, tiếng Việt`, () => {
  for (let seed = 1; seed <= 40; seed++) {
    const input = generate(seed, 'small'),
      output = algorithm.run(input, {
        rec: new MetricsRecorder(),
        signal: new AbortController().signal,
      })
    expect(check(input, output).ok).toBe(true)
    if (algorithm.id.endsWith('/huffman')) expect(output.weightedBits).toBe(optimum(input))
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
  expect(store.seek(store.length).codes).toEqual(output.codes)
  expect(store.current.weightedBits).toBe(output.weightedBits)
  expect(rec.steps.some((s) => s.explain.includes('ký hiệu') || s.explain.includes('nút'))).toBe(
    true,
  )
})

it('mã cố định dùng ceil(log2 n) bit trên mỗi ký hiệu', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const input = generate(seed, 'tiny'),
      output = algorithm.run(input, {
        rec: new MetricsRecorder(),
        signal: new AbortController().signal,
      })
    const width = Math.max(1, Math.ceil(Math.log2(input.symbols.length)))
    expect(output.codes.every((c) => c.length === width)).toBe(true)
    expect(output.weightedBits).toBe(width * input.symbols.reduce((sum, s) => sum + s.frequency, 0))
  }
})
