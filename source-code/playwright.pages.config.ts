import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir:'./e2e-pages',
  use:{baseURL:'http://127.0.0.1:4174/kv-test/',browserName:'chromium'},
  webServer:{
    command:'VITE_BASE=/kv-test/ npm run build:pages && npm run preview:pages -- --port 4174',
    url:'http://127.0.0.1:4174/kv-test/',
    reuseExistingServer:false,
    timeout:120000,
  },
});
