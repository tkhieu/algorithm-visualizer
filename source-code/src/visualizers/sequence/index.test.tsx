import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {SequenceView} from './index';
import {fixture} from './fixture';

describe('SequenceView',()=>{
 it('vẽ đủ phần tử và bảng truy hồi',()=>{
  const {getByTestId,getByText}=render(<SequenceView state={fixture}/>);
  expect(getByTestId('seq-2').dataset.role).toBe('current');
  expect(getByText('F')).toBeTruthy();
 });
 it('hiện thông báo khi dãy rỗng',()=>{
  const {getByText}=render(<SequenceView state={{items:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
 it('đánh dấu vị trí hiện tại và vị trí vừa đổi',()=>{
  const {getByTestId}=render(<SequenceView state={{items:[{label:'1'},{label:'2'},{label:'3'}],current:1,changedPositions:[2]}}/>);
  expect(getByTestId('seq-1').dataset.role).toBe('current');
  expect(getByTestId('seq-2').dataset.role).toBe('changed');
 });
});
