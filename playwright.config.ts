import { defineConfig } from "@playwright/test";
if (process.env.FT_CHROMIUM === "/tmp/chromium")
  process.env.FONTCONFIG_PATH ??= "/tmp/fonts";
export default defineConfig({
  testDir: "tests",
  testMatch: "*.spec.ts",
  use: {
    screenshot: "only-on-failure",
    baseURL: process.env.FT_BASE_URL || "http://localhost:5179",
    launchOptions: {
      executablePath: process.env.FT_CHROMIUM || undefined,
      args: [
        ...(process.env.FT_CHROMIUM ? ["--no-sandbox"] : []),
        ...(process.env.FT_HTTP_TEST
          ? [
              "--host-resolver-rules=MAP fishtank.test 127.0.0.1",
              "--no-proxy-server",
            ]
          : []),
      ],
    },
  },
  webServer: process.env.FT_BASE_URL
    ? undefined
    : {
        command: process.env.FT_PRODUCTION
          ? "npm run preview -- --port 5179"
          : "npm run dev -- --port 5179",
        url: "http://localhost:5179",
        reuseExistingServer: !process.env.CI,
      },
});
