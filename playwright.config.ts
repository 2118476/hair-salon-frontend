import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end config. Assumes the frontend dev server is running at http://localhost:3000
 * and the backend + database are up (see the READMEs). Run browsers once with
 * `npx playwright install chromium`, then `npm run e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
