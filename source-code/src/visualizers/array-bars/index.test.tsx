import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {ArrayBarsView} from './index';
import {fixture} from './fixture';

describe('ArrayBarsView',()=>{
 it('vẽ đủ số cột và đánh dấu đúng vai trò',()=>{
  const {getAllByTestId,getByTestId}=render(<ArrayBarsView state={fixture}/>);
  expect(getAllByTestId(/^bar-/)).toHaveLength(fixture.values.length);
  expect(getByTestId('bar-1').dataset.role).toBe('compare');
  expect(getByTestId('bar-3').dataset.role).toBe('pivot');
 });
 it('hiện thông báo khi mảng rỗng',()=>{
  const {getByText}=render(<ArrayBarsView state={{values:[]}}/>);
  expect(getByText(/sẽ hiện khi bắt đầu chạy/)).toBeTruthy();
 });
 it('vẽ ngoặc cho mảng con đang xét',()=>{
  const {getByTestId}=render(<ArrayBarsView state={{values:[3,1,2],ranges:[{from:1,to:2,role:'active'}]}}/>);
  expect(getByTestId('range-0').dataset.role).toBe('active');
 });
});
