import { it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/combinatorial-generation/generators';
import { reference, check } from '../../../problems/combinatorial-generation/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
it('đúng với dữ liệu có seed và trace tua lại đến kết quả', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const input = generate(seed, 'small');
    const output = algorithm.run(input, {
      rec: new MetricsRecorder(),
      signal: new AbortController().signal
    });
    expect(check(input, output).ok).toBe(true);
    expect(output.objects.map((x) => x.join(',')).sort()).toEqual(
      reference(input.n, output.kind)
        .map((x) => x.join(','))
        .sort()
    );
    const initial = algorithm.initVisual(input);
    const rec = new TraceRecorder(
      initial,
      new Set(algorithm.pseudocode.map((x) => x.id)),
      algorithm.traceLimit
    );
    const traced = algorithm.run(input, { rec, signal: new AbortController().signal });
    expect(traced).toEqual(output);
    expect(rec.truncated).toBe(false);
    const store = new TraceStore(initial);
    rec.steps.forEach((step) => store.append(step));
    const final = store.seek(store.length);
    expect(final.items.length).toBe(output.objects.length);
    expect(final.items.at(-1)?.role).toBe('done');
    expect(
      rec.steps.every(
        (step) =>
          step.explain.length > 0 && algorithm.pseudocode.some((line) => line.id === step.lineId)
      )
    ).toBe(true);
    expect(rec.steps.at(-1)?.explain).toMatch(/Đã sinh đủ/);
  }
});
