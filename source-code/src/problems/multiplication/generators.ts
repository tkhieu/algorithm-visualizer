import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{const r=rng(seed);const n={tiny:2,small:5,medium:12,large:24}[size];const number=()=>String(1+Math.floor(r()*9))+Array.from({length:n-1},()=>Math.floor(r()*10)).join('');return {a:number(),b:number()}}
