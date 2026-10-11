import {create} from 'zustand';import type {VisualKind} from '../core/contracts';
interface PlayerState{cursor:number;playing:boolean;speed:number;view:VisualKind;setCursor:(n:number)=>void;setPlaying:(v:boolean)=>void;setSpeed:(n:number)=>void;setView:(v:VisualKind)=>void;reset:(view:VisualKind)=>void}
export const usePlayerStore=create<PlayerState>(set=>({cursor:0,playing:false,speed:1,view:'matrix',setCursor:cursor=>set({cursor}),setPlaying:playing=>set({playing}),setSpeed:speed=>set({speed}),setView:view=>set({view}),reset:view=>set({cursor:0,playing:false,view})}));
