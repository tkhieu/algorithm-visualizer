import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:process.env.VITE_BASE??'/',plugins:[react()],worker:{format:'es'},test:{environment:'node',include:['src/**/*.test.ts']}});
