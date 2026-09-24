import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: false,
  reporter: [['list']],
  webServer: {
    command: 'npx http-server dist/ankit-portfolio/browser -p 4300 -s',
    port: 4300,
    reuseExistingServer: true,
    timeout: 60000,
  },
  use: {
    baseURL: 'http://localhost:4300',
  },
});
