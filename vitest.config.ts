import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    root: ".",
    esbuild: {
        tsconfigRaw: "{}"
    },
    test: {
        clearMocks: true,
        globals: true,
        setupFiles: ["dotenv/config"],
        env: {
            NODE_ENV: "test",
            DATABASE_URL: "postgresql://cooking-recipes-user:cooking-recipes-password@localhost:5432/cooking-recipes-test?schema=public"
        }
    },
    resolve: {
        alias: [{ find: "~", replacement: resolve(__dirname, "src") }]
    }
});
