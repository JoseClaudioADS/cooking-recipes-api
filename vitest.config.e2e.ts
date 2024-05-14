import { defineConfig } from "vitest/config";
import vitestConfig from "./vitest.config";

const commonConfig = vitestConfig;

export default defineConfig({
  ...commonConfig,
  test: {
    ...commonConfig.test,
    globalSetup: ["./tests/db/setup.ts"],
  },
});
