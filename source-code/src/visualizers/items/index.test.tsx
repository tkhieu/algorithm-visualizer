import {describe,it,expect} from 'vitest';
import {render} from '@testing-library/react';
import {ItemsView} from './index';
import {fixture,fixtureInput} from './fixture';

describe('ItemsView',()=>{
 it('vẽ đủ vật và trạng thái tiếng Việt',()=>{
  const {getByText}=render(<ItemsView state={fixture} input={fixtureInput}/>);
  expect(getByText('Đã chọn')).toBeTruthy();
  expect(getByText('Bỏ')).toBeTruthy();
  expect(getByText('Chờ')).toBeTruthy();
 });
 it('vẽ được danh sách đối tượng không có khối lượng và giá trị',()=>{
  const {getByText,queryByText}=render(<ItemsView state={{items:['considered','taken']}} input={{items:[{label:'Ứng viên A'},{label:'Ứng viên B'}]}}/>);
  expect(getByText('Ứng viên A')).toBeTruthy();
  expect(getByText('Đối tượng')).toBeTruthy();
  expect(queryByText('Khối lượng')).toBeNull();
 });
});
