import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{
 const r=rng(seed);const n={tiny:4,small:5,medium:6,large:7}[size];
 const nodes=Array.from({length:n},(_,i)=>`V${i}`);
 const edges:{from:string;to:string}[]=[];
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(r()<0.55)edges.push({from:nodes[i],to:nodes[j]});
 return {nodes,edges};
}
