import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  esbuild: {
    tsconfigRaw: "{}",
  },
  test: {
    clearMocks: true,
    globals: true,
    setupFiles: ["dotenv/config"],
    env: {
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "src") }],
  },
});
