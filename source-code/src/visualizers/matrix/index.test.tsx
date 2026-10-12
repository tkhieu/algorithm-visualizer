import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {MatrixView} from './index';
import {fixture,fixtureInput} from './fixture';

describe('MatrixView',()=>{
 it('vẽ bảng và đánh dấu ô hiện tại/phụ thuộc',()=>{
  const {getByTestId,container}=render(<MatrixView state={fixture} input={fixtureInput}/>);
  expect(getByTestId('current-cell')).toBeTruthy();
  expect(container.querySelectorAll('.dependency-cell')).toHaveLength(1);
  expect(container.querySelectorAll('.backtrack-cell')).toHaveLength(1);
 });
 it('hiện thông báo khi bảng rỗng',()=>{
  const {getByText}=render(<MatrixView state={{matrix:[]}} input={{capacity:0}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
 it('đọc kích thước từ trạng thái của bài toán không có sức chứa',()=>{
  const {getByText,container}=render(<MatrixView state={{matrix:[[1,2,3],[4,5,6]]}}/>);
  expect(getByText('Hàng / Cột')).toBeTruthy();
  expect(container.querySelectorAll('tbody td')).toHaveLength(6);
  expect(container.querySelector('.uncomputed')).toBeNull();
 });
});
