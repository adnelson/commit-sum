import importPlugin from "eslint-plugin-import";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["**/dist", "**/node_modules"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      import: importPlugin,
      "@typescript-eslint": typescriptPlugin,
    },
    // settings: {
    //   "import/resolver": {
    //     typescript: {
    //       alwaysTryTypes: true,
    //       project: ["./tsconfig.json", "./apps/*/tsconfig.json"],
    //     },
    //   },
    // },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Already handled by typescript-eslint
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/first": "error",
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.js"],
  },
];
