import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {NumericPlotView} from './index';
import {fixture} from './fixture';

describe('NumericPlotView',()=>{
 it('vẽ các điểm nghiệm và khoảng',()=>{
  const {getByTestId}=render(<NumericPlotView state={fixture}/>);
  expect(getByTestId('point-0').dataset.role).toBe('root');
  expect(getByTestId('interval-0')).toBeTruthy();
 });
 it('hiện thông báo khi chưa có mẫu',()=>{
  const {getByText}=render(<NumericPlotView state={{domain:[0,1],samples:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
 it('vẽ tiếp tuyến, dây cung, bước lặp và miền khả thi',()=>{
  const line={from:{x:0,y:0},to:{x:1,y:1}};
  const {getByTestId}=render(<NumericPlotView state={{...fixture,tangent:line,secant:line,iterates:[{x:0.5,y:0.25}],feasibleRegion:[{x:0,y:0},{x:1,y:0},{x:1,y:1}]}}/>);
  for(const id of ['tangent','secant','iterate-0','feasible-region'])expect(getByTestId(id)).toBeTruthy();
 });
});
