import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {HashTableView} from './index';
import {fixture} from './fixture';

describe('HashTableView',()=>{
 it('vẽ đủ giỏ và đánh dấu mục hiện tại',()=>{
  const {getByTestId}=render(<HashTableView state={fixture}/>);
  expect(getByTestId('entry-0-1').dataset.role).toBe('current');
  expect(getByTestId('bucket-1')).toBeTruthy();
 });
 it('hiện thông báo khi chưa có giỏ',()=>{
  const {getByText}=render(<HashTableView state={{buckets:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
 it('đánh dấu cả ô trống đang được dò',()=>{
  const {getByTestId}=render(<HashTableView state={{buckets:[{index:0,entries:[],role:'probed'}]}}/>);
  expect(getByTestId('bucket-0').dataset.role).toBe('probed');
 });
});
