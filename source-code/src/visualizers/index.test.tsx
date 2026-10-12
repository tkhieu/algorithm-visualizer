import { it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Visualizer } from './index';
import { fixture as graphFixture } from './graph/fixture';
it('hiển thị state của thuật toán mới khi view cũ chưa được đặt lại', () => {
  const sequence = render(<Visualizer kind="matrix" state={{ items: [{ label: 'ƯCLN 6' }] }} />);
  expect(sequence.getByTestId('sequence-view')).toBeTruthy();
  sequence.unmount();
  const matrix = render(
    <Visualizer
      kind="sequence"
      state={{
        matrix: [
          [1, 2],
          [3, 4]
        ]
      }}
    />
  );
  expect(matrix.getByText('3')).toBeTruthy();
});

it('giữ khung chờ khi state chưa khớp với bất kỳ view nào', () => {
  const pending = render(<Visualizer kind="graph" state={{}} />);
  expect(pending.getByText('Đang chuyển dạng trực quan…')).toBeTruthy();
});

it('chọn graph khi state mới có cả nodes và edges', () => {
  const graph = render(<Visualizer kind="tree" state={graphFixture} />);
  expect(graph.getByTestId('graph-view')).toBeTruthy();
});
