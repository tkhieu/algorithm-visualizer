import {it,expect} from 'vitest';import {render} from '@testing-library/react';import {Visualizer} from './index';
it('hiển thị state của thuật toán mới khi view cũ chưa được đặt lại',()=>{
 const sequence=render(<Visualizer kind="matrix" state={{items:[{label:'ƯCLN 6'}]}}/>);
 expect(sequence.getByTestId('sequence-view')).toBeTruthy();
 sequence.unmount();
 const matrix=render(<Visualizer kind="sequence" state={{matrix:[[1,2],[3,4]]}}/>);
 expect(matrix.getByText('3')).toBeTruthy();
});
