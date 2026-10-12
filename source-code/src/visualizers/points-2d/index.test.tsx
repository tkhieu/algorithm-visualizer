import {describe,it,expect} from 'vitest';
import {fireEvent,render} from '@testing-library/react';
import {Points2DView} from './index';
import {fixture} from './fixture';

describe('Points2DView',()=>{
 it('vẽ đủ điểm và đoạn nối',()=>{
  const {getByTestId}=render(<Points2DView state={fixture}/>);
  expect(getByTestId('point-1').dataset.role).toBe('closest');
  expect(getByTestId('segment-1-2')).toBeTruthy();
 });
 it('hiện thông báo khi không có điểm',()=>{
  const {getByText}=render(<Points2DView state={{points:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
 it('vẽ dải, hành trình và cho phép phóng to',()=>{
  const {getByTestId,getByRole}=render(<Points2DView state={{...fixture,strip:{minX:0,maxX:2},tour:[0,1,2,0]}}/>);
  expect(getByTestId('strip')).toBeTruthy();
  expect(getByTestId('tour')).toBeTruthy();
  const before=getByTestId('point-1').getAttribute('cx');
  fireEvent.click(getByRole('button',{name:'Phóng to'}));
  expect(getByTestId('point-1').getAttribute('cx')).not.toBe(before);
 });
});
