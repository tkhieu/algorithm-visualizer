import {it,expect} from 'vitest';
import {algorithm} from './index';
import {check,optimum} from '../../../problems/linear-programming-2d/checker';
import {generate} from '../../../problems/linear-programming-2d/generators';
import {traceRun} from '../test-utils';
import {MetricsRecorder} from '../../../core/recorder';

it('đúng với bộ liệt kê đỉnh tham chiếu trên 150 seed', () => {
 for (let seed = 1; seed <= 150; seed++) {
  const input = generate(seed, 'small');
  const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
  const best = optimum(input);
  expect(output.value).toBeCloseTo(best.value, 3);
  expect(check(input, output)).toMatchObject({ok: true, optimal: true});
 }
});

it('ví dụ Levitin: tối ưu tại (2,6) giá trị 36', () => {
 const input = {
  objective: {cx: 3, cy: 5},
  constraints: [{a: 1, b: 0, c: 4}, {a: 0, b: 2, c: 12}, {a: 3, b: 2, c: 18}],
 };
 const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
 expect(output.value).toBeCloseTo(36);
 expect(output.x).toBeCloseTo(2);
 expect(output.y).toBeCloseTo(6);
});

it('trace tua lại đúng: đỉnh gốc cuối cùng khớp output', () => {
 for (let seed = 1; seed <= 20; seed++) {
  const input = generate(seed, 'small');
  const {output, final} = traceRun(algorithm, input);
  const rootPoint = final.points.find(p => p.role === 'root');
  expect(rootPoint?.x).toBeCloseTo(output.x, 3);
  expect(rootPoint?.y).toBeCloseTo(output.y, 3);
 }
});

it('bước kiểm tra giao điểm có giải thích tiếng Việt', () => {
 const {steps} = traceRun(algorithm, {
  objective: {cx: 3, cy: 5},
  constraints: [{a: 1, b: 0, c: 4}, {a: 0, b: 2, c: 12}, {a: 3, b: 2, c: 18}],
 });
 const checkStep = steps.find(s => s.lineId === 'check');
 expect(checkStep?.explain).toContain('Giao điểm của đường');
});
