import {create} from 'zustand';
export type SyncMode='independent'|'progress'|'phase'|'step';
export const useCompareStore=create<{sync:SyncMode;setSync:(v:SyncMode)=>void}>(set=>({sync:'independent',setSync:sync=>set({sync})}));
