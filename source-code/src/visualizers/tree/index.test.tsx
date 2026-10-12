import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {TreeView} from './index';
import {fixture} from './fixture';

describe('TreeView',()=>{
 it('vẽ đủ nút và giữ vai trò',()=>{
  const {getByTestId}=render(<TreeView state={fixture}/>);
  for(const n of fixture.nodes)expect(getByTestId(`tree-node-${n.id}`)).toBeTruthy();
  expect(getByTestId('tree-node-l').dataset.role).toBe('current');
 });
 it('hiện thông báo khi cây rỗng',()=>{
  const {getByText}=render(<TreeView state={{nodes:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
});
