import type {TestCase} from '../../core/contracts';import type {Input} from './definition';import {generate} from './generators';import {optimum} from './checker';
const item=(weight:number,value:number,name:string)=>({name,weight,value});
const raw:TestCase<Input>[]=[
{id:'normal-1',name:'Ví dụ cơ bản',group:'normal',input:{capacity:7,items:[item(1,1,'A'),item(3,4,'B'),item(4,5,'C'),item(5,7,'D')]}},
{id:'normal-2',name:'Nhiều cách chọn',group:'normal',input:generate(42,'small')},
{id:'edge-empty',name:'Không có vật',group:'edge',input:{capacity:10,items:[]}},
{id:'edge-zero',name:'Túi không có chỗ',group:'edge',input:{capacity:0,items:[item(1,5,'A')]}},
{id:'edge-single',name:'Một vật vừa túi',group:'edge',input:{capacity:5,items:[item(5,9,'A')]}},
{id:'small-1',name:'Tập nhỏ 1',group:'small',input:generate(7,'tiny')},
{id:'small-2',name:'Tập nhỏ 2',group:'small',input:generate(19,'small')},
{id:'large-1',name:'Tập lớn 1',group:'large',input:generate(104,'large')},
{id:'large-2',name:'Tập lớn 2',group:'large',input:generate(105,'large')},
{id:'special-greedy',name:'Tham lam không tối ưu',group:'special',input:{capacity:50,items:[item(10,60,'A'),item(20,100,'B'),item(30,120,'C')]}},
{id:'special-tie',name:'Nhiều nghiệm tối ưu',group:'special',input:{capacity:5,items:[item(5,8,'A'),item(5,8,'B')]}},
{id:'invalid-negative',name:'Khối lượng âm',group:'invalid',input:{capacity:5,items:[item(-1,8,'A')]}},
{id:'invalid-capacity',name:'Sức chứa âm',group:'invalid',input:{capacity:-1,items:[]}},
];
export const cases:TestCase<Input>[]=raw.map(c=>c.group==='invalid'?c:{...c,expected:optimum(c.input as Input)});
