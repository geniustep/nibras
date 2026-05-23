import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "admission.spec.ts",
  fullyParallel: false,
  retries: 0,
  timeout: 60_000,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    locale: "ar-MA",
  },
  ...(process.env.SKIP_WEB_SERVER
    ? {}
    : {
        webServer: {
          command: "npm run dev -- --hostname 127.0.0.1",
          url: "http://127.0.0.1:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
      }),
});
