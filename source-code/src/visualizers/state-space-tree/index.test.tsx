import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {StateSpaceTreeView} from './index';
import {fixture} from './fixture';

describe('StateSpaceTreeView',()=>{
 it('vẽ đủ nút cây',()=>{
  const {getByText}=render(<StateSpaceTreeView state={fixture}/>);
  expect(getByText('L A')).toBeTruthy();
  expect(getByText('R A')).toBeTruthy();
 });
 it('hiện thông báo khi cây rỗng',()=>{
  const {getByText}=render(<StateSpaceTreeView state={{nodes:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
});
