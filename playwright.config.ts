import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',                        // where the tests live
  fullyParallel: true,                       // run tests in parallel
  forbidOnly: !!process.env.CI,              // fail CI if a test.only is left in the code
  retries: process.env.CI ? 2 : 0,           // retry failed tests twice in CI, not locally
  workers: process.env.CI ? 1 : undefined,   // one worker in CI, automatic locally
  reporter: process.env.CI ? [['github'], ['html']] : 'html', // in CI, also show errors as GitHub annotations

  /* Shared settings for all tests */
  use: {
    baseURL: 'https://www.saucedemo.com',    // lets tests use page.goto('/')
    testIdAttribute: 'data-test',            // getByTestId() reads saucedemo's data-test attributes
    trace: 'on-first-retry',                 // record a trace when a test is retried
    screenshot: 'only-on-failure',           // save a screenshot when a test fails
  },

  /* Browsers to run the tests in */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    //{ name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    //{ name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});