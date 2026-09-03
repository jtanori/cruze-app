/** Playwright Configuration for CRUZE */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code
  // failOnIgnoredTests: true,
  // Reporter to use, also configure via env var PLAYWRIGHT_REPORTER
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  // Configure web browser and mobile device emulation
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Headless mode
    headless: true,

    // Context viewport
    viewport: { width: 375, height: 667 }, // iPhone 8/SE

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Configure projects different browsers
  projects: [
    {
      name: 'Chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['iPhone 8'],
      },
    },
  ],
});