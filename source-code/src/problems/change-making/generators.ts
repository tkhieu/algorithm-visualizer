import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
const universe=[2,3,4,5,10,20,25,50];
export function generate(seed:number,size:SizeClass):Input{
 const r=rng(seed);
 const k={tiny:2,small:3,medium:4,large:5}[size];
 const amountMax={tiny:20,small:50,medium:120,large:300}[size];
 const pool=[...universe];
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 const coins=[1,...pool.slice(0,k)].sort((a,b)=>a-b);
 const amount=1+Math.floor(r()*amountMax);
 return {amount,coins};
}
