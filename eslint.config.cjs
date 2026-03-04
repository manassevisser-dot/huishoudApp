const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks'); 
const regexPlugin = require('eslint-plugin-regex');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  {
    // NIEUW: Zorg dat deze instellingen voor ALLE bestanden gelden
    // Dit voorkomt de "could not find plugin" error in latere secties
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'regex': regexPlugin,
      'react-hooks': reactHooksPlugin, 
    },
  },

  // 1️⃣ Globale ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '.expo/',
      'package-lock.json',
      'artifacts/',          // ← NIEUW: Generated files
      'reports/',            // ← NIEUW: Phoenix reports
      'scripts/phoenix/output/', // ← NIEUW: Script output
      'jest.config.ts',        // ← ADD
      'jest.config.js',        // ← ADD
      '**/*.d.ts',             // ← ADD (alle declaration files)
      'scripts/types/**',      // ← ADD (type definitions)
      'src_STABLE_BACKUP/',   // ← NIEUW: Backup folder voor stabiele code
      '_trash/',              // ← NIEUW: Prullenbak voor verwijderde code
      '**/_trash/**',         // ← NIEUW: Prullenbak in subfolders
      '**/__backups__/**',       // ← NIEUW: Backup folders overal
      '*.txt',
      'copy-user-strings-to-wiz.ts',  // ✅ Voeg dit toe
      'collect-user-strings.ts',    // ✅ Voeg dit toe
    ],
  },

  // 2️⃣ Algemene JS/TS-regels + ADR-02 (Type-Safety)
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
        tsconfigRootDir: __dirname, // Cruciaal voor strict-boolean-expressions!
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // === ADR-02: Type-Safety verplicht ===
      '@typescript-eslint/no-explicit-any': 'error', // Verbod op 'any' in prod
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/strict-boolean-expressions': ['warn', {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false
      }],
      
      // === React Hooks rules ===
      'react-hooks/rules-of-hooks': 'error',     // Verplicht: hooks alleen op top-level
      'react-hooks/exhaustive-deps': 'warn',     // Warning voor missende dependencies

      // === ADR-16: Simplicity over Perfection ===
      'max-lines-per-function': ['warn', {
        max: 30,
        skipBlankLines: true,
        skipComments: true
      }],
      'max-params': ['warn', 3], // 4 geeft warning
      'max-depth': ['error', 3], // Max nesting depth
      'complexity': ['warn', 10], // Cyclomatic complexity
      
      // === Bestaande rules ===
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      
      // === ADR-05: Euro formatting guard ===
      'regex/invalid': [
        'error',
        [
          {
            regex: '€\\s*\\$\\{[^}]*toFixed\\(2\\)[^}]*\\}',
            message: '❌ ADR-05: Handmatige euro-formattering verboden. Gebruik formatCurrency(amountCents).',
          },
        ],
      ],
    },
  },

  // 3️⃣ ADR-01: Separation of Concerns (UI mag niet direct in Domain)
  // P3-06: Explicitly block @domain/core imports in UI
  {
    files: ['src/ui/**/!(*.config|*.test|*.spec).{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@domain/core', '@domain/core/*'],
              message: '❌ ADR-01 P3-06: UI mag niet direct @domain/core importeren. Gebruik types via @app/types re-exports.'
            },
            {
              group: ['@domain/interfaces', '@domain/interfaces/*'],
              message: '❌ ADR-01 P3-06: UI mag niet direct @domain/interfaces importeren. Gebruik types via @app/types re-exports.'
            },
            {
              group: ['@domain/*', '!@domain/orchestrators/**'],
              message: '❌ ADR-01: UI componenten mogen niet direct uit @domain importeren. Gebruik de Orchestrator Bridge.'
            },
            {
              group: ['@kernel/*', '../kernel/*', '../../kernel/*'],
              message: '❌ ADR-03: UI mag niet direct kernel-logica importeren. Gebruik orchestrators.'
            }
          ]
        }
      ]
    }
  },

  // 4️⃣ ADR-04: Dumb UI Components (React Native specifiek)
  {
    files: ['src/**/*.{tsx,jsx}'],
    rules: {
      // Verbied HTML tags (React Native gebruikt View/Text)
      'react/forbid-elements': [
        'error',
        {
          forbid: [
            { element: 'div', message: '🚨 ADR-04: Dit is React Native! Gebruik <View> in plaats van <div>' },
            { element: 'span', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text> in plaats van <span>' },
            { element: 'button', message: '🚨 ADR-04: Dit is React Native! Gebruik <TouchableOpacity> of <Pressable>' },
            { element: 'input', message: '🚨 ADR-04: Dit is React Native! Gebruik <TextInput>' },
            { element: 'form', message: '🚨 ADR-04: React Native heeft geen <form>. Gebruik state + onPress handlers' },
            { element: 'a', message: '🚨 ADR-04: Dit is React Native! Gebruik <TouchableOpacity> met onPress' },
            { element: 'p', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text>' },
            { element: 'h1', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text> met style' },
            { element: 'h2', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text> met style' },
            { element: 'h3', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text> met style' },
            { element: 'h4', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text> met style' },
            { element: 'h5', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text> met style' },
            { element: 'h6', message: '🚨 ADR-04: Dit is React Native! Gebruik <Text> met style' },
            { element: 'ul', message: '🚨 ADR-04: React Native heeft geen <ul>. Gebruik <FlatList>' },
            { element: 'ol', message: '🚨 ADR-04: React Native heeft geen <ol>. Gebruik <FlatList>' },
            { element: 'li', message: '🚨 ADR-04: React Native heeft geen <li>. Gebruik <View> items' },
            { element: 'table', message: '🚨 ADR-04: React Native heeft geen <table>. Gebruik <View> layout' },
            { element: 'img', message: '🚨 ADR-04: Dit is React Native! Gebruik <Image> van react-native' },
          ],
        },
      ],
      
      // Verbied className (React Native gebruikt style)
      'react/forbid-component-props': [
        'error',
        {
          forbid: [
            {
              propName: 'className',
              message: '🚨 ADR-04: React Native gebruikt geen className! Gebruik style={styles.xyz} of inline style={{...}}',
            },
          ],
        },
      ],
      
      // Component complexity limits
      'react/jsx-max-depth': ['warn', { max: 5 }],
      'max-lines': ['warn', {
        max: 150,
        skipBlankLines: true,
        skipComments: true
      }],
    },
  },

  // 5️⃣ ADR-11: Testing Pyramid (Verbied vitest)
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'vitest',
              message: '🚨 ADR-11: We gebruiken Jest, niet Vitest! Gebruik @testing-library/react-native',
            },
          ],
          patterns: [
            {
              group: ['@vitest/*'],
              message: '🚨 ADR-11: Vitest packages zijn niet toegestaan. Gebruik Jest!',
            },
          ],
        },
      ],
    },
  },

  // 6️⃣ ADR-03: Domain Logic in Kernel (Pure functions)
  {
    files: ['src/kernel/**/*.{ts,tsx}', 'src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error', // Kernel mag geen side effects
      'no-restricted-globals': ['error', 'window', 'document', 'localStorage'], // Browser API's verboden
      '@typescript-eslint/no-floating-promises': 'error', // Async zonder await = side effect leak
    }
  },

  // 7️⃣ ADR-12: Auditability (Formatting + Linting)
 {
  files: ['src/**/*.{ts,tsx,js,jsx}'],
  rules: {
    // Bestaande rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // NIEUW: Verbied directe console calls (behalve in logger zelf)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.object.name="console"]',
        message: 'Gebruik Logger in plaats van console.console.log',
      },
    ],
    
    // Verbied alert()
    'no-restricted-globals': [
      'error',
      {
        name: 'alert',
        message: 'Gebruik Logger voor user-facing messages',
      },
    ],
    
    // Verbied oude AuditLogger imports
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@adapters/audit/AuditLoggerAdapter',
            importNames: ['AuditLogger', 'logger'],
            message: 'Importeer Logger (hoofdletter) in plaats van AuditLogger/logger',
          },
        ],
      },
    ],
    
    // Verbied verkeerde Logger methods
    'no-restricted-properties': [
      'error',
      {
        object: 'Logger',
        property: 'log',
        message: 'Gebruik specifieke Logger method (error/warning/notice/info/debug) in plaats van Logger.log',
      },
      {
        object: 'Logger',
        property: 'warn',
        message: 'Gebruik Logger.warning() (met -ing) in plaats van Logger.warn()',
      },
    ],
    
    // Optioneel: dwing correcte parameters af
    '@typescript-eslint/no-unsafe-argument': 'error', // vangt verkeerde types af
  },
},

// Extra: specifiek voor test bestanden (meer flexibiliteit)
{
  files: ['src/**/*.test.{ts,tsx,js,jsx}'],
  rules: {
    // In tests mag je nog console.log gebruiken voor debugging
    'no-console': 'off',
    'no-restricted-syntax': 'off',
  },
},

  // 8️⃣ ADR-16: Magic Numbers (Gebruik constanten)
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-magic-numbers': ['warn', {
        ignore: [0, 1, 2, -1, 100], // Common values toegestaan
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true
      }]
    }
  },

  // 🧪 Test files: Allow 'any' types
 {
  files: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
    '**/test-utils/**/*.{ts,tsx}',
    '**/__mocks__/**/*.{ts,tsx}',
  ],
  rules: {
    // --- Type-safety (ADR-02 relaxatie voor tests) ---
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',

    // --- Stijl & complexiteit (tests mogen lang/messy zijn) ---
    'max-lines-per-function': 'off',
    'complexity': 'off',
    'no-magic-numbers': 'off',
    'max-lines': 'off',  // ← Tests mogen langer zijn dan 150 regels
   

    // --- Variabelen (tests gebruiken vaak fixtures) ---
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    
    // === ✅ ADR-05: Euro formatting UIT voor tests ===
    'regex/invalid': 'off',  // ← DIT ZET DE EURO FORMATTING UIT VOOR TESTS
  },
},
  
  // 🔧 Files with legitimate magic numbers
  {
    files: [
      '**/DateField.tsx',
      '**/dateFormatting.ts',
      '**/DateHydrator.ts',
      '**/LocalNoonClock.ts',
      '**/*date*.{ts,tsx}',
      '**/*time*.{ts,tsx}',
      '**/numbers.ts',
      '**/frequency.ts',
      '**/ageRules.ts',
      '**/ageBoundaryRules.ts',
      '**/fieldConstraints.ts',
      '**/conditions.ts',
      '**/*.test.{ts,tsx}',
    ],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
  
  // 🎯 useAppStyles: Type-assembly boundary — spreadt meerdere make*-functies samen
  // no-unsafe-assignment is hier structureel onvermijdbaar: de re-export keten van
  // make* functies levert intersection-types die TypeScript niet kan verifieren via
  // StyleSheet.create(). Runtime is correct; de cast via applyShadows() is de bewuste grens.
  {
    files: ['**/useAppStyles.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off', // Type-assembly boundary — zie @remarks
      '@typescript-eslint/no-unsafe-call':       'off', // Idem — make* via re-export keten
    },
  },

// 🚧 AuditLoggerAdapter: De logger zelf — mag console gebruiken en heeft structureel 4 params nodig
  {
    files: ['**/AuditLoggerAdapter.ts'],
    rules: {
      'no-restricted-syntax':    'off', // Adapter IS de logger — mag console.* aanroepen
      'no-console':              'off', // Idem — alle log-levels vereisen console.error/warn/log/debug
      'no-magic-numbers':        'off', // RFC 5424 levels (0-7) zijn inherent numeriek; benoemde constanten zijn uitzondering
      'max-params':              'off', // log() en createEvent() hebben structureel 4 params (RFC 5424 contract)
      'max-lines-per-function':  'off', // routeToConsole() switch is inherent lang
      'complexity':              'off', // Routing-logica heeft inherent hoge complexiteit
    },
  },

// 🚧 DateField: Complex component needing refactor
  {
    files: ['**/DateField.tsx'],
    rules: {
      'max-lines-per-function': 'off',
      'complexity': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
    },
  },
// 🚧 Wizard screens: Complex components needing refactor
{
  files: [
    '**/WizardPage.tsx',
    '**/WizardController.tsx',
    '**/CsvUploadScreen.tsx',
  ],
  rules: {
    'max-lines-per-function': 'off',
    'complexity': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'warn',
  }
},
// 🎯 Reducer files: hogere limieten voor complexiteit
{
  files: [
    '**/formReducer.ts', 
    '**/*Reducer.ts',
    '**/DynamicEntry.tsx',
  ],
  rules: {
    'max-lines-per-function': 'off',      // Zet helemaal uit
    'complexity': 'off',                   // Zet helemaal uit
    'max-lines': 'off',                    // Ook max-lines uitzetten
    'max-depth': 'off',                     // Eventueel ook nesting depth
  },
},
  // 9️⃣ Prettier als laatste
  // LET OP: Gebruik de spread operator als prettierConfig een object is
  ...(Array.isArray(prettierConfig) ? prettierConfig : [prettierConfig]),
];