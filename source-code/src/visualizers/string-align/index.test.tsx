import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {StringAlignView} from './index';
import {fixture} from './fixture';

describe('StringAlignView',()=>{
 it('vẽ đủ ký tự và đánh dấu so khớp',()=>{
  const {getByTestId}=render(<StringAlignView state={fixture}/>);
  expect(getByTestId('pattern-3').dataset.match).toBe('false');
  expect(getByTestId('pattern-2').dataset.match).toBe('true');
 });
 it('ẩn bảng dịch ở chế độ compact',()=>{
  const {queryByText}=render(<StringAlignView state={fixture} compact/>);
  expect(queryByText(/Bảng dịch/)).toBeNull();
 });
});
