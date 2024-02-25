module.exports = {
  plugins: [
    "import",
    "simple-import-sort",
    "prettier",
    "testing-library",
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
    },
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
  ],
  ignorePatterns: ["build/**/*", "*.cjs"],
  env: { es6: true },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "linebreak-style":
      process.platform === "win32" ? ["error", "windows"] : ["error", "unix"],
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          ["^\\u0000"],
          ["^react", "^@?\\w"],
          ["^(~shared)(/.*|$)"],
          ["^(~)(/.*|$)"],
          ["^(~typings)(/.*|$)"],
          [
            "^(~assets|~theme)(/.*|$)",
            "^(~contexts)(/.*|$)",
            "^(~constants)(/.*|$)",
            "^(~hooks)(/.*|$)",
            "^(~utils)(/.*|$)",
            "^(~services)(/.*|$)",
            "^(~components)(/.*|$)",
            "^(~templates)(/.*|$)",
          ],
          ["^(~pages)(/.*|$)", "^(~features)(/.*|$)"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    // Clean Code specific rules
    "id-length": ["error", { min: 2 }],
    "max-lines": ["error", 300],
    complexity: ["error", 10],
    "max-depth": ["error", 4],
    "max-nested-callbacks": ["error", 3],
    "max-params": ["error", 4],
    "max-statements": ["error", 15],
    // camelcase: "error",
    "new-cap": "error",
    "no-mixed-operators": "error",
    "no-warning-comments": [
      "warn",
      {
        terms: ["todo", "fixme"],
        location: "start", // Checks only the start of comments
      },
    ],
    "no-nested-ternary": "error",
    "no-unneeded-ternary": "error",
    "spaced-comment": ["error", "always"],
    "multiline-comment-style": ["error", "starred-block"],
    "no-throw-literal": "error",
    "handle-callback-err": "error",
    "no-redeclare": "error",
    "no-dupe-keys": "error",
    "no-duplicate-imports": "error",
    "no-useless-rename": "error",
    "no-var": "error",
    // TypeScript specific rules
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
