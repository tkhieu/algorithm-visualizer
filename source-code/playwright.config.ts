import { defineConfig } from '@playwright/test';
const port = process.env.E2E_PORT ?? '5173';
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: './e2e',
  use: { baseURL, browserName: 'chromium' },
  webServer: {
    command: process.env.E2E_PORT ? `npm run dev -- --port ${port} --strictPort` : 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI && !process.env.E2E_PORT,
    timeout: 30000
  }
});
