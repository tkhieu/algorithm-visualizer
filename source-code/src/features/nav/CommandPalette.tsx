import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {CommandDialog,CommandEmpty,CommandGroup,CommandInput,CommandItem,CommandList} from 'cmdk';
import {algorithms,problems} from '../../catalog/manifest';
import {chapters} from '../../catalog/chapters';
import {techniques} from '../../catalog/techniques';

const EDITABLE_TAGS=new Set(['INPUT','TEXTAREA','SELECT']);

/** Ctrl+K hoặc `/` (ngoài ô nhập liệu) mở bảng tìm kiếm toàn catalog theo tên/chương/kỹ thuật. */
export function CommandPalette(){
 const [open,setOpen]=useState(false);
 const navigate=useNavigate();

 useEffect(()=>{
  const onKey=(e:KeyboardEvent)=>{
   const target=e.target as HTMLElement;
   const editable=EDITABLE_TAGS.has(target.tagName)||target.isContentEditable;
   if((e.key==='k'&&(e.metaKey||e.ctrlKey))){e.preventDefault();setOpen(v=>!v)}
   else if(e.key==='/'&&!editable){e.preventDefault();setOpen(true)}
   else if(e.key==='Escape')setOpen(false);
  };
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[]);

 const go=(path:string)=>{setOpen(false);navigate(path)};

 return <CommandDialog open={open} onOpenChange={setOpen} label="Tìm kiếm catalog" className="command-dialog">
  <CommandInput aria-label="Tìm kiếm catalog" placeholder="Tìm bài toán, thuật toán, chương…"/>
  <CommandList>
   <CommandEmpty>Không tìm thấy.</CommandEmpty>
   <CommandGroup heading="Bài toán">
    {problems.map(p=>
     <CommandItem key={p.id} value={`${p.title} ${p.id} ${algorithms.filter(a=>a.problemId===p.id).map(a=>`${a.chapter} ${a.section}`).join(' ')}`} onSelect={()=>go(`/problem/${p.id}`)}>{p.title}{p.status==='planned'&&<span className="muted text-xs ml-2">Sắp có</span>}</CommandItem>
    )}
   </CommandGroup>
   <CommandGroup heading="Thuật toán">
    {algorithms.map(a=>{
     const problemTitle=problems.find(p=>p.id===a.problemId)?.title??a.problemId;
     const techniqueName=techniques.find(t=>t.id===a.technique)?.name??a.technique;
     const chapterName=chapters.find(c=>c.id===a.chapter)?.name??'';
     return <CommandItem key={a.id} value={`${a.id} ${a.title} ${problemTitle} ${techniqueName} ${a.technique} chương ${a.chapter} ${chapterName} §${a.section}`} onSelect={()=>go(a.status==='ready'?`/play/${a.problemId}/${a.id.split('/')[1]}`:`/problem/${a.problemId}`)}>
      {a.title} <span className="muted text-xs ml-2">{problemTitle}{a.status==='planned'?' · sắp có':''}</span>
     </CommandItem>;
    })}
   </CommandGroup>
   <CommandGroup heading="Chương">
    {chapters.map(c=><CommandItem key={c.id} value={`chương ${c.id} ${c.name}`} onSelect={()=>go(`/chapter/${c.id}`)}>Chương {c.id} · {c.name}</CommandItem>)}
   </CommandGroup>
   <CommandGroup heading="Trang">
    <CommandItem value="toàn bộ thuật toán bảng" onSelect={()=>go('/algorithms')}>Toàn bộ thuật toán (bảng)</CommandItem>
    <CommandItem value="toàn bộ bài toán" onSelect={()=>go('/problems')}>Toàn bộ bài toán</CommandItem>
   </CommandGroup>
  </CommandList>
 </CommandDialog>;
}
