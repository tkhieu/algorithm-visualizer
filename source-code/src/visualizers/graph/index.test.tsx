import {describe,it,expect,vi} from 'vitest';
import {render} from '@testing-library/react';
import {GraphView} from './index';
import {fixture} from './fixture';

describe('GraphView',()=>{
 it('vẽ đủ đỉnh và cạnh, đánh dấu vai trò đỉnh',()=>{
  const {getByTestId}=render(<GraphView state={fixture}/>);
  for(const n of fixture.nodes)expect(getByTestId(`node-${n.id}`)).toBeTruthy();
  for(const e of fixture.edges)expect(getByTestId(`edge-${e.from}-${e.to}`)).toBeTruthy();
  expect(getByTestId('node-B').dataset.role).toBe('current');
 });
 it('hiện thông báo khi đồ thị rỗng',()=>{
  const {getByText}=render(<GraphView state={{nodes:[],edges:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
 it('vẽ nhãn luồng và khoảng cách trên bố cục hai phía',()=>{
  const {getByTestId,getByText}=render(<GraphView state={{nodes:[{id:'L',partition:'left',distance:0},{id:'R',partition:'right',distance:3}],edges:[{from:'L',to:'R',directed:true,flow:2,capacity:5}]}}/>);
  expect(getByText('2/5')).toBeTruthy();
  expect(getByText('3')).toBeTruthy();
  expect(getByTestId('node-L').getAttribute('transform')).not.toBe(getByTestId('node-R').getAttribute('transform'));
 });
 it('chuyển sang Canvas khi có hơn 300 đỉnh',()=>{
  const getContext=vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue(null);
  try{
   const nodes=Array.from({length:301},(_,i)=>({id:String(i)}));
   const {getByTestId}=render(<GraphView state={{nodes,edges:[]}}/>);
   expect(getByTestId('graph-view').dataset.renderer).toBe('canvas');
  }finally{getContext.mockRestore()}
 });
});
