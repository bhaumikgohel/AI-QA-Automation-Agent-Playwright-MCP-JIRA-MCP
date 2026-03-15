import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // run sequentially
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'freecrm-test-results', open: 'never' }],
    ['json', { outputFile: 'freecrm-test-results/execution_summary.json' }]
  ],
  use: {
    headless: false,
    launchOptions: {
      slowMo: 1000,
    },
    screenshot: 'on',
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
