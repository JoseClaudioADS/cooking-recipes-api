import pluginJs from "@eslint/js";
import eslintConfigESLint from "eslint-config-eslint";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
    { languageOptions: { globals: globals.node }},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintConfigESLint,
    { ignores: ["eslint.config.js", "node_modules"]},
    { 
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-useless-constructor": "off",
        }
    },
];
  