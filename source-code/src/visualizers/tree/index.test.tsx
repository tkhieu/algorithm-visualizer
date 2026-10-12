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
 it('con duy nhất bên trái (side L) và bên phải (side R) được vẽ ở hai vị trí khác nhau',()=>{
  const leftOnly={nodes:[{id:'p1',parent:null,label:'5'},{id:'cl',parent:'p1',label:'3',side:'L' as const}]};
  const rightOnly={nodes:[{id:'p2',parent:null,label:'5'},{id:'cr',parent:'p2',label:'3',side:'R' as const}]};
  const {getByTestId}=render(<><TreeView state={leftOnly}/><TreeView state={rightOnly}/></>);
  expect(getByTestId('tree-node-cl').getAttribute('style')).not.toBe(getByTestId('tree-node-cr').getAttribute('style'));
 });
 it('vẽ chú thích phụ (sub) dưới nhãn chính khi được cung cấp',()=>{
  const state={nodes:[{id:'p',parent:null,label:'5',sub:'+1'}]};
  const {getByTestId}=render(<TreeView state={state}/>);
  expect(getByTestId('tree-node-p-sub').textContent).toBe('+1');
 });
});
