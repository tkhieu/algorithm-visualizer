import type {SizeClass} from '../../core/contracts';import type {Input} from './definition';import {rng} from '../../lib/random';
export function generate(seed:number,size:SizeClass):Input{const r=rng(seed);const tolerance={tiny:1e-3,small:1e-5,medium:1e-6,large:1e-8}[size];return {c:1+Math.floor(r()*10),d:Math.floor(r()*41)-20,left:-10,right:10,tolerance}}
