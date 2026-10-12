import { it, expect } from 'vitest';
import { algorithm } from './index';
import { generate } from '../../../problems/root-finding/generators';
import { check, reference } from '../../../problems/root-finding/checker';
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
    expect(check(input, output).ok).toBe(true);
    expect(Math.abs(output.root - expected)).toBeLessThanOrEqual(input.tolerance);
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
    expect(final.points?.[0].x).toBe(output.root);
    expect(
      rec.steps.every(
        (step) =>
          step.explain.length > 0 && algorithm.pseudocode.some((line) => line.id === step.lineId)
      )
    ).toBe(true);
    expect(rec.steps.at(-1)?.explain).toMatch(/Nghiệm x/);
  }
});
it('báo không hội tụ bằng tiếng Việt khi Newton dao động vô hạn (input ngoài hợp đồng c>0)', () => {
  // Ví dụ kinh điển x³−2x+2 dao động 0↔1↔0… mãi không hội tụ khi bắt đầu từ x0=0. Với contract
  // thật (c>0, hàm tăng ngặt) điều này không xảy ra (xem comment trong run.ts), nhưng run() phải
  // vẫn an toàn và báo rõ bằng tiếng Việt thay vì treo hoặc trả nghiệm sai mà không cảnh báo nếu
  // có ai gọi trực tiếp với input ngoài hợp đồng.
  const input = { c: -2, d: -2, left: -1, right: 1, tolerance: 1e-8 };
  const rec = new TraceRecorder(
    algorithm.initVisual(input),
    new Set(algorithm.pseudocode.map((x) => x.id)),
    algorithm.traceLimit
  );
  const output = algorithm.run(input, { rec, signal: new AbortController().signal });
  expect([0, 1]).toContain(output.root);
  const warning = rec.steps.find((s) => s.lineId === 'no-converge');
  expect(warning).toBeDefined();
  expect(warning?.explain).toMatch(/Không hội tụ/);
});
