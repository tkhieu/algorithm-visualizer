import {create} from 'zustand';
export const useTestcaseStore=create<{running:boolean;setRunning:(v:boolean)=>void}>(set=>({running:false,setRunning:running=>set({running})}));
