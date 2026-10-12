import {defineConfig} from '@playwright/test';

const port=process.env.PLAYWRIGHT_PAGES_PORT??'4174';

export default defineConfig({
  testDir:'./e2e-pages',
  use:{baseURL:`http://127.0.0.1:${port}/kv-test/`,browserName:'chromium'},
  webServer:{
    command:`VITE_BASE=/kv-test/ npm run build:pages && npm run preview:pages -- --port ${port} --strictPort`,
    url:`http://127.0.0.1:${port}/kv-test/`,
    reuseExistingServer:false,
    timeout:120000,
  },
});
