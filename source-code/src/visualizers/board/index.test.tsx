import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {BoardView} from './index';
import {fixture} from './fixture';

describe('BoardView',()=>{
 it('vẽ đủ ô lưới và đánh dấu quân hậu',()=>{
  const {getByTestId}=render(<BoardView state={fixture}/>);
  expect(getByTestId('cell-0-1').dataset.role).toBe('queen');
  expect(getByTestId('cell-1-3').dataset.role).toBe('attacked');
  expect(getByTestId('cell-3-3')).toBeTruthy();
 });
 it('hiện thông báo khi chưa có kích thước',()=>{
  const {getByText}=render(<BoardView state={{rows:0,marks:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
});
