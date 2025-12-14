// eslint.config.cjs — ESLint v9 flat config (CommonJS)
// Geen ESM imports; geen comments die JSON-parsers in editors triggeren// Geen ESM imports; geen comments die JSON-parsers in editors triggeren.

const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const prettier = require('eslint-config-prettier');

module.exports = [
  // 1) Globale ignores (vervangt .eslintignore)
  {
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '.expo',
      'package-lock.json',
    ],
  },

  // 2) Baseline JS rules
  js.configs.recommended,

  // 3) TypeScript + React
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      // ✅ Voeg minimale globals toe (geen extra dependency nodig)
      globals: {
        console: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        // Als je RN globals gebruikt (via Metro):
        __DEV__: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'react/prop-types': 'off',
      // ✅ Tijdelijke tolerantie voor "unused" variabelen, mits met underscore
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // 4) Prettier integratie (zet conflicterende ESLint-regels uit)
  prettier,
];
