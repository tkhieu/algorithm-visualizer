import { it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/matrix-multiplication/generators';
import { reference } from '../../../problems/matrix-multiplication/checker';
import { MetricsRecorder, TraceRecorder } from '../../../core/recorder';
import { TraceStore } from '../../../core/trace/TraceStore';
it('đúng với dữ liệu có seed và trace tua lại đến kết quả', () => {
  for (let seed = 1; seed <= 30; seed++) {
    const input = generate(seed, 'small');
    const expected = reference(input);
    const output = algorithm.run(input, {
      rec: new MetricsRecorder(),
      signal: new AbortController().signal
    });
    expect(output.matrix).toEqual(expected);
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
    expect(final.matrix).toEqual(output.matrix);
    expect(
      rec.steps.every(
        (step) =>
          step.explain.length > 0 && algorithm.pseudocode.some((line) => line.id === step.lineId)
      )
    ).toBe(true);
    expect(rec.steps.at(-1)?.explain).toMatch(/Đã tính xong/);
  }
});
