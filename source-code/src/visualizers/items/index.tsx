/**
 * View "items": danh sách đối tượng rời rạc có trạng thái (vật trong túi, ứng viên trong tập...).
 */
export type ItemStatus='waiting'|'considered'|'taken'|'rejected';
export interface ItemsVisualState{items:ItemStatus[]}
export interface ItemsInput{items:unknown[]}
const statusLabel:Record<ItemStatus,string>={waiting:'Chờ',considered:'Đang xét',taken:'Đã chọn',rejected:'Bỏ'};
type WeightedItem={name:string;weight:number;value:number};
function isWeighted(item:unknown):item is WeightedItem{
 return typeof item==='object'&&item!==null&&'name' in item&&typeof item.name==='string'&&'weight' in item&&typeof item.weight==='number'&&'value' in item&&typeof item.value==='number';
}
export function ItemsView({state,input,compact=false}:{state:ItemsVisualState;input:ItemsInput;compact?:boolean}){
 const shown=input.items.slice(0,compact?8:input.items.length);
 const weighted=shown.every(isWeighted);
 const label=(item:unknown)=>typeof item==='object'&&item!==null&&'label' in item&&typeof item.label==='string'?item.label:typeof item==='string'||typeof item==='number'?String(item):JSON.stringify(item);
 return <div className="overflow-auto max-h-[440px]"><table className="w-full text-sm border-collapse"><thead><tr className="border-b"><th className="text-left p-2">{weighted?'Vật':'Đối tượng'}</th>{weighted&&<><th>Khối lượng</th><th>Giá trị</th><th>Tỷ lệ</th></>}<th>Trạng thái</th></tr></thead><tbody>{shown.map((item,i)=>{const status=state.items[i]??'waiting';return <tr key={i} className={`border-b ${status==='taken'?'bg-neutral-900 text-white':status==='considered'?'bg-neutral-200':status==='rejected'?'bg-neutral-50 text-neutral-500':''}`}><td className="p-2">{weighted?(item as WeightedItem).name:label(item)}</td>{weighted&&<><td className="text-center">{(item as WeightedItem).weight}</td><td className="text-center">{(item as WeightedItem).value}</td><td className="text-center">{((item as WeightedItem).value/(item as WeightedItem).weight).toFixed(2)}</td></>}<td className="text-center">{statusLabel[status]}</td></tr>})}</tbody></table></div>;
}
