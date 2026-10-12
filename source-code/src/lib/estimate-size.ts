/** Kích thước n ước lượng cho biểu đồ và giới hạn trace của nhiều dạng input. */
export function estimateSize(input:unknown):number{
 if(typeof input==='object'&&input){
  const obj=input as Record<string,unknown>;
  for(const key of ['items','values','points','nodes','vertices','matrix','grid','array']){
   if(Array.isArray(obj[key]))return obj[key].length;
  }
  if(typeof obj.text==='string')return obj.text.length;
  if(typeof obj.n==='number'&&Number.isFinite(obj.n))return Math.max(0,obj.n);
 }
 if(Array.isArray(input)||typeof input==='string')return input.length;
 return 0;
}
