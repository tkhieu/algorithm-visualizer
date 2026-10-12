import {defineConfig} from '@playwright/test';
const port=Number(process.env.PLAYWRIGHT_PORT??4174);
const baseURL=`http://127.0.0.1:${port}/kv-test/`;

export default defineConfig({
  testDir:'./e2e-pages',
  use:{baseURL,browserName:'chromium'},
  webServer:{
    command:`VITE_BASE=/kv-test/ npm run build:pages && npm run preview:pages -- --port ${port} --strictPort`,
    url:baseURL,
    reuseExistingServer:false,
    timeout:120000,
  },
});
