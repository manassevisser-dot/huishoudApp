const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const prettier = require('eslint-config-prettier');
const globals = require('globals'); // Meestal standaard aanwezig in v9 omgevingen

module.exports = [
  // 1) Globale ignores
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

  // 2) Baseline JS rules
  js.configs.recommended,

  // 3) TypeScript + React + Testing
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.cjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      // ✅ In v9 Flat Config vervangt dit de 'env' sectie
      globals: {
        ...globals.node,    // Herkent 'module', 'require', 'process'
        ...globals.jest,    // Herkent 'describe', 'it', 'expect', 'jest'
        ...globals.browser, // Herkent 'window', 'document'
        __DEV__: true,      // Specifiek voor React Native
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off', // Uitgezet ten gunste van TS versie
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // 4) Prettier integratie
  prettier,
];