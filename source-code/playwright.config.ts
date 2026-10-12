import { defineConfig } from '@playwright/test';
const port=Number(process.env.PLAYWRIGHT_PORT)||5173;
export default defineConfig({testDir:'./e2e',use:{baseURL:`http://127.0.0.1:${port}`,browserName:'chromium'},webServer:{command:`npm run dev -- --port ${port}`,url:`http://127.0.0.1:${port}`,reuseExistingServer:!process.env.CI,timeout:30000}});
