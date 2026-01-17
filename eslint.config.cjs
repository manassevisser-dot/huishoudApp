// eslint.config.cjs
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const regexPlugin = require('eslint-plugin-regex');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  // 1️⃣ Globale ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '.expo/',
      'package-lock.json',
    ],
  },

  // 2️⃣ Algemene JS/TS-regels
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
        __DEV__: 'readonly',
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      regex: regexPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react/prop-types': 'off',
      'no-unused-vars': 'off',

      // 🔹 Verbied handmatige euro-formatting
      'regex/invalid': [
        'error',
        [
          {
            regex: '€\\s*\\$\\{[^}]*toFixed\\(2\\)[^}]*\\}',
            message:
              '❌ Handmatige euro-formattering verboden. Gebruik formatCurrency(amountCents).',
          },
        ],
      ],
    },
  },

  // 3️⃣ Prettier als laatste
  prettierConfig,
];
