import {describe, expect, it} from 'vitest';
import {MetricsRecorder} from '../../core/recorder';
import {check} from '../../problems/hamiltonian-circuit/checker';
import {algorithm as exhaustive} from './exhaustive';
import {algorithm as backtracking} from './backtracking';

describe('hamiltonian-circuit review regressions', () => {
  it.each([exhaustive, backtracking])('%s thống nhất quy ước n=1', (algorithm) => {
    const input = {nodes: ['A'], edges: []};
    const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output).toEqual({found: true, circuit: ['A']});
    expect(check(input, output).ok).toBe(true);
  });

  it.each([exhaustive, backtracking])('%s từ chối đường đi qua lại của hai đỉnh', (algorithm) => {
    const input = {nodes: ['A', 'B'], edges: [{from: 'A', to: 'B'}]};
    const output = algorithm.run(input, {rec: new MetricsRecorder(), signal: new AbortController().signal});
    expect(output).toEqual({found: false, circuit: []});
    expect(check(input, output).ok).toBe(true);
  });
});
