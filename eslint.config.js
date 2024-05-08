import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigESLint from "eslint-config-eslint";


export default [
    { languageOptions: { globals: globals.node }},
    { ignores: ["eslint.config.js", "node_modules"]},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintConfigESLint
];
  