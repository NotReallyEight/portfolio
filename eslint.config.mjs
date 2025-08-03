import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import _import from "eslint-plugin-import";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: fixupConfigRules(
      compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:react-hooks/recommended"
      )
    ),

    plugins: {
      react,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11Y,
      "import": fixupPluginRules(_import),
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: "tsconfig.json",
      },
    },

    rules: {
      "accessor-pairs": "warn",
      "array-bracket-newline": ["warn", "consistent"],
      "array-callback-return": "warn",
      "array-element-newline": ["warn", "consistent"],
      "arrow-body-style": "warn",
      "computed-property-spacing": "warn",
      "consistent-return": "warn",
      "curly": ["warn", "multi"],
      "default-case-last": "warn",
      "default-case": "warn",
      "dot-location": ["warn", "property"],
      "eqeqeq": ["warn", "smart"],
      "global-require": "off",
      "grouped-accessor-pairs": "warn",
      "guard-for-in": "warn",
      "import/extensions": "off",
      "import/newline-after-import": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-import-module-exports": "off",
      "import/no-unresolved": "off",
      "import/order": "off",
      "new-parens": "warn",
      "no-alert": "warn",
      "no-async-promise-executor": "off",
      "no-await-in-loop": "warn",
      "no-caller": "warn",
      "no-case-declarations": "off",
      "no-console": "off",
      "no-constructor-return": "warn",
      "no-duplicate-imports": "warn",

      "no-else-return": [
        "warn",
        {
          allowElseIf: false,
        },
      ],

      "no-extend-native": "warn",
      "no-extra-bind": "warn",
      "no-floating-decimal": "warn",
      "no-implicit-coercion": "warn",
      "no-iterator": "warn",
      "no-labels": "warn",
      "no-lone-blocks": "warn",
      "no-lonely-if": "warn",
      "no-mixed-spaces-and-tabs": "off",
      "no-multi-spaces": "warn",
      "no-multi-str": "warn",
      "no-multiple-empty-lines": "warn",
      "no-new-func": "warn",
      "no-new-wrappers": "warn",
      "no-new": "warn",
      "no-octal-escape": "warn",
      "no-process-exit": "off",
      "no-promise-executor-return": "warn",
      "no-proto": "warn",
      "no-return-assign": "warn",
      "no-self-compare": "warn",
      "no-sequences": "warn",
      "no-template-curly-in-string": "warn",
      "no-throw-literal": "warn",
      "no-undef-init": "warn",
      "no-unmodified-loop-condition": "warn",

      "no-unneeded-ternary": [
        "warn",
        {
          defaultAssignment: false,
        },
      ],

      "no-unreachable-loop": "warn",
      "no-unsafe-optional-chaining": "warn",
      "no-unused-expressions": "warn",
      "no-useless-backreference": "warn",
      "no-useless-call": "warn",
      "no-useless-computed-key": "warn",
      "no-useless-concat": "warn",
      "no-useless-rename": "warn",
      "no-useless-return": "warn",
      "no-var": "warn",
      "no-void": "off",
      "no-warning-comments": "warn",
      "no-whitespace-before-property": "warn",
      "object-shorthand": "warn",
      "one-var-declaration-per-line": "warn",
      "operator-assignment": "warn",
      "prefer-arrow-callback": "warn",
      "prefer-const": "warn",
      "prefer-destructuring": "warn",
      "prefer-numeric-literals": "warn",
      "prefer-promise-reject-errors": "warn",
      "prefer-regex-literals": "warn",
      "prefer-rest-params": "warn",
      "prefer-spread": "warn",
      "prefer-template": "warn",
      "react-refresh/only-export-components": "warn",
      "react/destructuring-assignment": "off",
      "react/function-component-definition": "off",
      "react/jsx-filename-extension": "off",
      "react/react-in-jsx-scope": "off",
      "react/require-default-props": "off",
      "react/state-in-constructor": "off",
      "semi-spacing": "warn",
      "semi-style": "warn",
      "sort-vars": "warn",
      "symbol-description": "warn",
      "wrap-iife": ["warn", "inside"],

      "yoda": [
        "warn",
        "never",
        {
          exceptRange: true,
        },
      ],

      "@typescript-eslint/array-type": "warn",
      "@typescript-eslint/class-literal-property-style": "warn",
      "@typescript-eslint/consistent-type-assertions": "warn",
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/member-ordering": "warn",
      "@typescript-eslint/no-confusing-non-null-assertion": "warn",
      "@typescript-eslint/no-confusing-void-expression": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extraneous-class": "warn",
      "@typescript-eslint/no-implied-eval": "off",
      "@typescript-eslint/no-loop-func": "warn",
      "@typescript-eslint/no-loss-of-precision": "warn",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-shadow": "warn",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-unnecessary-qualifier": "warn",
      "@typescript-eslint/no-unnecessary-type-constraint": "warn",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-use-before-define": "warn",
      "@typescript-eslint/no-useless-constructor": "warn",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "warn",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-includes": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-string-starts-ends-with": "warn",
      "@typescript-eslint/prefer-ts-expect-error": "warn",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/return-await": "warn",
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "warn",
      "@typescript-eslint/unified-signatures": "warn",
    },
  },
]);
