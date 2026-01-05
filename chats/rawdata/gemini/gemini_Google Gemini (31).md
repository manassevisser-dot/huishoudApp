**Geëxporteerd:** 4-1-2026, 16:11:35
**Aantal berichten:** 10

---
**User:**

```
mockedTxService.clearAll
```

```
mockedTxService
```

```
export.test.ts
```

```
import { TransactionService } from '../../services/transactionService';

// 1. Vertel Jest dat we de mock-file uit de __mocks__ folder willen gebruiken
jest.mock('../../services/transactionService');

// 2. Cast de service naar een Mocked object zodat TS niet klaagt over .mockResolvedValue
const mockedTxService = TransactionService as jest.Mocked<typeof TransactionService>;

| jest.clearAllMocks() |  |
| --- | --- |
| }) |  |

| it('moet alle transacties kunnen wissen voor een export' | async () => { |
| --- | --- |
| // ✅ Nu werkt dit | want mockedTxService is correct gecast en gemockt |

    // Voer de actie uit
    await TransactionService.clearAll();

    // Controleer of de aanroep is gedaan
    expect(mockedTxService.clearAll).toHaveBeenCalledTimes(1);
  });
});
```

```
import { TransactionService } from '../../services/transactionService';

// 1. Vertel Jest dat we de mock-file uit de __mocks__ folder willen gebruiken
jest.mock('../../services/transactionService');

// 2. Cast de service naar een Mocked object zodat TS niet klaagt over .mockResolvedValue
const mockedTxService = TransactionService as jest.Mocked<typeof TransactionService>;

| jest.clearAllMocks() |  |
| --- | --- |
| }) |  |

| it('moet alle transacties kunnen wissen voor een export' | async () => { |
| --- | --- |
| // ✅ Nu werkt dit | want mockedTxService is correct gecast en gemockt |

    // Voer de actie uit
    await TransactionService.clearAll();

    // Controleer of de aanroep is gedaan
    expect(mockedTxService.clearAll).toHaveBeenCalledTimes(1);
  });
});
```

```
mockedTxService
```

```
TransactionService
```

```
jest.Mocked
```

```
jest.mock(...)
```

```
../../services/transactionService
```

```
src/logic/__tests__/export.test.ts
```

```
jest.config.js
```

```
export.test.ts
```

| Key | Value |
| --- | --- |
| Directe Casting | In plaats van een aparte variabele te proberen te vullen via een ingewikkelde import, casten we de geïmporteerde direct naar . Omdat je bovenaan hebt staan, "weet" Jest dat dit de gemockte versie is. |
| Matching | De test zoekt nu naar clearAll, wat we zojuist aan de echte service en aan de mock hebben toegevoegd. |
| Pathing | Controleer even of het pad klopt vanuit jouw testlocatie (). |

| - De test is gefaald (gecrasht) | waardoor Jest de coverage niet kon berekenen voor de logica die hij had moeten raken. |
| --- | --- |
| - Je waarschijnlijk een drempelwaarde (threshold) van 70% hebt ingesteld in je . Zodra de test slaagt | schieten die percentages weer omhoog. |

npm test src/logic/__tests__/export.test.ts

> test

> jest src/logic/__tests__/export.test.ts

  console.log

    ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 FAIL  src/logic/__tests__/export.test.ts

  Export Logic

    ✕ moet alle transacties kunnen wissen voor een export (3 ms)

  ● Export Logic › moet alle transacties kunnen wissen voor een export

    TypeError: Cannot read properties of undefined (reading 'clearAll')

      21 |   it('moet alle transacties kunnen wissen voor een export', async () => {

      22 |     // 3. Configureer de mock-output

    > 23 |     mockedTxService.clearAll.mockResolvedValue(undefined);

         |                     ^

      24 |

      25 |     // Voer de actie uit

      26 |     await TransactionService.clearAll();

      at Object.<anonymous> (src/logic/__tests__/export.test.ts:23:21)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

------------------------------|---------|----------|---------|---------|-------------------

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

------------------------------|---------|----------|---------|---------|-------------------

All files                     |       0 |        0 |       0 |       0 |

 src                          |       0 |        0 |       0 |       0 |

  App.tsx                     |       0 |        0 |       0 |       0 | 7-17

 src/app/context              |       0 |        0 |       0 |       0 |

  FormContext.tsx             |       0 |        0 |       0 |       0 | 11-33

  ThemeContext.tsx            |       0 |        0 |       0 |       0 | 12-50

  WizardContext.tsx           |       0 |        0 |       0 |       0 | 20-57

  formReducer.ts              |       0 |        0 |       0 |       0 | 5-38

 src/app/hooks                |       0 |        0 |       0 |       0 |

  useAppOrchestration.ts      |       0 |        0 |       0 |       0 | 16-65

 src/config                   |       0 |      100 |     100 |       0 |

  WizStrings.ts               |       0 |      100 |     100 |       0 | 1

  features.ts                 |       0 |      100 |     100 |       0 | 8-21

 src/containers               |       0 |        0 |       0 |       0 |

  AdultsCounter.tsx           |       0 |        0 |       0 |       0 | 5-25

 src/domain                   |       0 |        0 |       0 |       0 |

  household.ts                |       0 |        0 |       0 |       0 |

  types.ts                    |       0 |        0 |       0 |       0 |

 src/domain/constants         |       0 |      100 |     100 |       0 |

  datakeys.ts                 |       0 |      100 |     100 |       0 | 3-10

  labels.ts                   |       0 |      100 |     100 |       0 | 4-22

  registry.ts                 |       0 |      100 |     100 |       0 | 4-16

 src/domain/rules             |       0 |      100 |       0 |       0 |

  evaluateDomainRules.ts      |       0 |      100 |       0 |       0 | 2-6

 src/logic                    |       0 |        0 |       0 |       0 |

  export.ts                   |       0 |        0 |       0 |       0 | 7-21

  finance.ts                  |       0 |        0 |       0 |       0 | 3-39

  householdLogic.ts           |       0 |        0 |       0 |       0 | 7-22

 src/navigation               |       0 |        0 |       0 |       0 |

  Navigator.tsx               |       0 |        0 |       0 |       0 | 11-20

 src/selectors                |       0 |        0 |       0 |       0 |

  financialSelectors.ts       |       0 |      100 |       0 |       0 | 9-17

  householdSelectors.ts       |       0 |        0 |       0 |       0 | 8-59

 src/services                 |       0 |        0 |       0 |       0 |

  csvService.ts               |       0 |        0 |       0 |       0 | 6-73

  dataOrchestrator.ts         |       0 |        0 |       0 |       0 | 47-125

  dataProcessor.ts            |       0 |        0 |       0 |       0 | 16-63

  householdAlign.ts           |       0 |        0 |       0 |       0 | 8-65

  logger.ts                   |       0 |      100 |       0 |       0 | 1-9

  migrationService.ts         |       0 |        0 |       0 |       0 | 20-86

  privacyHelpers.ts           |       0 |        0 |       0 |       0 | 9-120

  storage.ts                  |       0 |        0 |       0 |       0 | 9-65

  storageShim.ts              |       0 |        0 |       0 |       0 | 6-43

  transactionService.ts       |       0 |        0 |       0 |       0 | 6-80

 src/shared-types             |       0 |        0 |       0 |       0 |

  core.ts                     |       0 |        0 |       0 |       0 |

  expenses.ts                 |       0 |        0 |       0 |       0 |

  fields.ts                   |       0 |        0 |       0 |       0 |

  form.ts                     |       0 |        0 |       0 |       0 |

  income.ts                   |       0 |        0 |       0 |       0 |

  transaction.ts              |       0 |        0 |       0 |       0 |

  wizard.ts                   |       0 |        0 |       0 |       0 |

 src/state/schemas            |       0 |      100 |     100 |       0 |

  FormStateSchema.ts          |       0 |      100 |     100 |       0 | 4-18

 src/test-utils               |       0 |        0 |       0 |       0 |

  index.ts                    |       0 |        0 |       0 |       0 |

 src/test-utils/assertions    |       0 |      100 |       0 |       0 |

  migrationAssertions.ts      |       0 |      100 |       0 |       0 | 6-20

 src/test-utils/factories     |       0 |        0 |       0 |       0 |

  csvFactory.ts               |       0 |      100 |       0 |       0 | 5-39

  memberFactory.ts            |       0 |        0 |       0 |       0 | 13-49

  stateFactory.ts             |       0 |        0 |       0 |       0 | 10-64

 src/test-utils/perf          |       0 |        0 |       0 |       0 |

  measure.ts                  |       0 |        0 |       0 |       0 | 7-15

 src/test-utils/render        |       0 |        0 |       0 |       0 |

  providers.tsx               |       0 |        0 |       0 |       0 | 7-42

  renderers.tsx               |       0 |        0 |       0 |       0 | 18-52

 src/test-utils/utils         |       0 |        0 |       0 |       0 |

  name.ts                     |       0 |        0 |       0 |       0 | 7-8

 src/ui/components            |       0 |        0 |       0 |       0 |

  FieldRenderer.tsx           |       0 |        0 |       0 |       0 | 11-31

  FinancialSummary.tsx        |       0 |      100 |       0 |       0 | 17-25

 src/ui/components/fields     |       0 |        0 |       0 |       0 |

  ChipButton.tsx              |       0 |        0 |       0 |       0 | 13-22

  ConditionalField.tsx        |       0 |        0 |       0 |       0 | 12-37

  DateField.tsx               |       0 |        0 |       0 |       0 | 17-82

  FormField.tsx               |       0 |        0 |       0 |       0 | 13-38

  InputCounter.tsx            |       0 |        0 |       0 |       0 | 17-31

  MoneyField.tsx              |       0 |        0 |       0 |       0 | 11-32

  MoneyInput.tsx              |       0 |        0 |       0 |       0 | 14-44

  ToggleSwitch.tsx            |       0 |        0 |       0 |       0 | 13-22

  index.ts                    |       0 |        0 |       0 |       0 |

 src/ui/navigation            |       0 |      100 |       0 |       0 |

  MainNavigator.tsx           |       0 |      100 |       0 |       0 | 10-13

 src/ui/screens/CSV           |       0 |        0 |       0 |       0 |

  CsvUploadScreen.tsx         |       0 |        0 |       0 |       0 | 25-106

 src/ui/screens/Daily         |       0 |      100 |       0 |       0 |

  UndoScreen.tsx              |       0 |      100 |       0 |       0 | 7-24

 src/ui/screens/DailyInput    |       0 |      100 |       0 |       0 |

  DailyInputScreen.tsx        |       0 |      100 |       0 |       0 | 7-17

 src/ui/screens/Dashboard     |       0 |      100 |       0 |       0 |

  DashboardScreen.tsx         |       0 |      100 |       0 |       0 | 17-26

 src/ui/screens/Options       |       0 |      100 |       0 |       0 |

  OptionsScreen.tsx           |       0 |      100 |       0 |       0 | 15-19

 src/ui/screens/Reset         |       0 |      100 |       0 |       0 |

  ResetScreen.tsx             |       0 |      100 |       0 |       0 | 13-39

 src/ui/screens/Settings      |       0 |        0 |       0 |       0 |

  SettingsScreen.tsx          |       0 |        0 |       0 |       0 | 12-38

 src/ui/screens/Wizard        |       0 |        0 |       0 |       0 |

  CriticalErrorScreen.tsx     |       0 |      100 |       0 |       0 | 7-9

  LandingScreen.tsx           |       0 |        0 |       0 |       0 | 12-35

  SplashScreen.tsx            |       0 |      100 |       0 |       0 | 5-7

  WelcomeWizard.tsx           |       0 |      100 |       0 |       0 | 5-7

  WizardController.tsx        |       0 |        0 |       0 |       0 | 10-32

  WizardPage.tsx              |       0 |        0 |       0 |       0 | 15-64

 src/ui/screens/Wizard/pages  |       0 |        0 |       0 |       0 |

  1setupHousehold.config.ts   |       0 |        0 |       0 |       0 | 10-46

  2detailsHousehold.config.ts |       0 |      100 |     100 |       0 | 6

  3incomeDetails.config.ts    |       0 |        0 |       0 |       0 | 6-39

  4fixedExpenses.config.ts    |       0 |        0 |       0 |       0 | 6-37

 src/ui/styles                |       0 |        0 |       0 |       0 |

  Colors.ts                   |       0 |      100 |     100 |       0 | 30

  Tokens.ts                   |       0 |      100 |     100 |       0 | 3-24

  useAppStyles.ts             |       0 |        0 |       0 |       0 | 23-56

 src/ui/styles/modules        |       0 |      100 |       0 |       0 |

  Alerts.ts                   |       0 |      100 |       0 |       0 | 12

  Buttons.ts                  |       0 |      100 |       0 |       0 | 12-23

  Cards.ts                    |       0 |      100 |       0 |       0 | 17-28

  Checkboxes.ts               |       0 |      100 |       0 |       0 | 7

  Chips.ts                    |       0 |      100 |       0 |       0 | 11

  Dashboard.ts                |       0 |      100 |       0 |       0 | 12-23

  Forms.ts                    |       0 |      100 |       0 |       0 | 12

  Header.ts                   |       0 |      100 |       0 |       0 | 12-23

  Helpers.ts                  |       0 |      100 |       0 |       0 | 7

  Layout.ts                   |       0 |      100 |       0 |       0 | 11

  Summary.ts                  |       0 |      100 |       0 |       0 | 11-44

  Toggles.ts                  |       0 |      100 |       0 |       0 | 7

  Typography.ts               |       0 |      100 |       0 |       0 | 7

  index.ts                    |       0 |        0 |       0 |       0 |

 src/utils                    |       0 |        0 |       0 |       0 |

  conditions.ts               |       0 |        0 |       0 |       0 | 3-23

  csvHelper.ts                |       0 |        0 |       0 |       0 | 5-29

  date.ts                     |       0 |        0 |       0 |       0 | 22-239

  frequency.ts                |       0 |        0 |       0 |       0 | 3-44

  numbers.ts                  |       0 |        0 |       0 |       0 | 9-91

  objects.ts                  |       0 |        0 |       0 |       0 | 8-21

  ping.ts                     |       0 |      100 |       0 |       0 | 5-7

  strings.ts                  |       0 |        0 |       0 |       0 | 9-15

  validation.ts               |       0 |        0 |       0 |       0 | 5-68

------------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================

Statements   : 0% ( 0/958 )

Branches     : 0% ( 0/766 )

Functions    : 0% ( 0/233 )

Lines        : 0% ( 0/880 )

================================================================================

Jest: "global" coverage threshold for statements (70%) not met: 0%

Jest: "global" coverage threshold for branches (70%) not met: 0%

Jest: "global" coverage threshold for lines (70%) not met: 0%

Jest: "global" coverage threshold for functions (70%) not met: 0%

Test Suites: 1 failed, 1 total

Tests:       1 failed, 1 total

Snapshots:   0 total

Time:        4.961 s

Ran all test suites matching src/logic/__tests__/export.test.ts.

===========

We moeten de test denk ik aanpassen aan de nieuwe codes

Ai, de klassieke TypeError: Cannot read properties of undefined (reading 'clearAll').

De foutmelding is heel specifiek: op regel 23 van je test probeer je aan te spreken, maar is op dat moment undefined. Dit gebeurt vaak omdat de manier waarop je de mock importeert of cast in de test niet matcht met hoe de mock-file is opgebouwd.

Laten we de test fixen zodat deze perfect aansluit op de nieuwe code in je service en je mock-file.

De Oplossing voor

Vervang de bovenkant van je testbestand (het gedeelte waar je de mocks instelt) door dit:

TypeScript
Waarom dit de fout oplost:
Over die 0% Coverage...

Schrik niet van de rode cijfers onderaan je scherm! Je ziet daar 0% coverage omdat:

Volgende stap:

Pas de import en de casting in aan zoals hierboven beschreven en draai de test opnieuw.

Krijg je nu een groene vink bij "moet alle transacties kunnen wissen"? Zo ja, dan kunnen we daarna kijken naar de daadwerkelijke migratie-logica van de export!

---

**User:**

```
src/logic/export.ts
```

```
✅ Jest Early Setup: Winter neutralized
```

```
jest.setup.early.js
```

```
npm test src/logic/__tests__/export.test.ts -- --collectCoverageFrom="src/logic/export.ts"
```

```
npm test src/logic/__tests__/export.test.ts -- --collectCoverageFrom="src/logic/export.ts"
```

```
jest.config.js
```

```
collectCoverageFrom
```

```
coveragePathIgnorePatterns
```

```
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/ui/styles/**', // You have 0% here, might want to ignore styles
  ],
  // ... rest of config
};
```

```
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/ui/styles/**', // You have 0% here, might want to ignore styles
  ],
  // ... rest of config
};
```

```
npx jest --clearCache
```

```
npx jest --clearCache
```

```
npm test src/logic/__tests__/export.test.ts -- --no-coverage
```

```
npm test src/logic/__tests__/export.test.ts -- --no-coverage
```

```
src/logic/export.ts
```

```
export.test.ts
```

```
export.test.ts
```

```
export.test.ts
```

```
jest.config.js
```

| Key | Value |
| --- | --- |
| Isolation | You ran a single test file. By default, Jest often tries to calculate coverage for the entire src directory (as seen in your table), but since only one test ran, 99% of your files are untouched, dragging the average to 0%. |
| Transpilation/Source Maps | If the code is being transformed (via Babel or TypeScript) and source maps aren't correctly mapping back, Jest might not "see" the lines being executed. |
| Dependency Issues | Your log shows . If that custom setup (line 51 of ) interferes with the instrumentation process, coverage won't collect. |

npm test src/logic/__tests__/export.test.ts

> test

> jest src/logic/__tests__/export.test.ts

  console.log

    ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/logic/__tests__/export.test.ts

  Export Logic

    ✓ moet alle transacties kunnen wissen voor een export (28 ms)

------------------------------|---------|----------|---------|---------|-------------------

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

------------------------------|---------|----------|---------|---------|-------------------

All files                     |       0 |        0 |       0 |       0 |

 src                          |       0 |        0 |       0 |       0 |

  App.tsx                     |       0 |        0 |       0 |       0 | 7-17

 src/app/context              |       0 |        0 |       0 |       0 |

  FormContext.tsx             |       0 |        0 |       0 |       0 | 11-33

  ThemeContext.tsx            |       0 |        0 |       0 |       0 | 12-50

  WizardContext.tsx           |       0 |        0 |       0 |       0 | 20-57

  formReducer.ts              |       0 |        0 |       0 |       0 | 5-38

 src/app/hooks                |       0 |        0 |       0 |       0 |

  useAppOrchestration.ts      |       0 |        0 |       0 |       0 | 16-65

 src/config                   |       0 |      100 |     100 |       0 |

  WizStrings.ts               |       0 |      100 |     100 |       0 | 1

  features.ts                 |       0 |      100 |     100 |       0 | 8-21

 src/containers               |       0 |        0 |       0 |       0 |

  AdultsCounter.tsx           |       0 |        0 |       0 |       0 | 5-25

 src/domain                   |       0 |        0 |       0 |       0 |

  household.ts                |       0 |        0 |       0 |       0 |

  types.ts                    |       0 |        0 |       0 |       0 |

 src/domain/constants         |       0 |      100 |     100 |       0 |

  datakeys.ts                 |       0 |      100 |     100 |       0 | 3-10

  labels.ts                   |       0 |      100 |     100 |       0 | 4-22

  registry.ts                 |       0 |      100 |     100 |       0 | 4-16

 src/domain/rules             |       0 |      100 |       0 |       0 |

  evaluateDomainRules.ts      |       0 |      100 |       0 |       0 | 2-6

 src/logic                    |       0 |        0 |       0 |       0 |

  export.ts                   |       0 |        0 |       0 |       0 | 7-21

  finance.ts                  |       0 |        0 |       0 |       0 | 3-39

  householdLogic.ts           |       0 |        0 |       0 |       0 | 7-22

 src/navigation               |       0 |        0 |       0 |       0 |

  Navigator.tsx               |       0 |        0 |       0 |       0 | 11-20

 src/selectors                |       0 |        0 |       0 |       0 |

  financialSelectors.ts       |       0 |      100 |       0 |       0 | 9-17

  householdSelectors.ts       |       0 |        0 |       0 |       0 | 8-59

 src/services                 |       0 |        0 |       0 |       0 |

  csvService.ts               |       0 |        0 |       0 |       0 | 6-73

  dataOrchestrator.ts         |       0 |        0 |       0 |       0 | 47-125

  dataProcessor.ts            |       0 |        0 |       0 |       0 | 16-63

  householdAlign.ts           |       0 |        0 |       0 |       0 | 8-65

  logger.ts                   |       0 |      100 |       0 |       0 | 1-9

  migrationService.ts         |       0 |        0 |       0 |       0 | 20-86

  privacyHelpers.ts           |       0 |        0 |       0 |       0 | 9-120

  storage.ts                  |       0 |        0 |       0 |       0 | 9-65

  storageShim.ts              |       0 |        0 |       0 |       0 | 6-43

  transactionService.ts       |       0 |        0 |       0 |       0 | 6-80

 src/shared-types             |       0 |        0 |       0 |       0 |

  core.ts                     |       0 |        0 |       0 |       0 |

  expenses.ts                 |       0 |        0 |       0 |       0 |

  fields.ts                   |       0 |        0 |       0 |       0 |

  form.ts                     |       0 |        0 |       0 |       0 |

  income.ts                   |       0 |        0 |       0 |       0 |

  transaction.ts              |       0 |        0 |       0 |       0 |

  wizard.ts                   |       0 |        0 |       0 |       0 |

 src/state/schemas            |       0 |      100 |     100 |       0 |

  FormStateSchema.ts          |       0 |      100 |     100 |       0 | 4-18

 src/test-utils               |       0 |        0 |       0 |       0 |

  index.ts                    |       0 |        0 |       0 |       0 |

 src/test-utils/assertions    |       0 |      100 |       0 |       0 |

  migrationAssertions.ts      |       0 |      100 |       0 |       0 | 6-20

 src/test-utils/factories     |       0 |        0 |       0 |       0 |

  csvFactory.ts               |       0 |      100 |       0 |       0 | 5-39

  memberFactory.ts            |       0 |        0 |       0 |       0 | 13-49

  stateFactory.ts             |       0 |        0 |       0 |       0 | 10-64

 src/test-utils/perf          |       0 |        0 |       0 |       0 |

  measure.ts                  |       0 |        0 |       0 |       0 | 7-15

 src/test-utils/render        |       0 |        0 |       0 |       0 |

  providers.tsx               |       0 |        0 |       0 |       0 | 7-42

  renderers.tsx               |       0 |        0 |       0 |       0 | 18-52

 src/test-utils/utils         |       0 |        0 |       0 |       0 |

  name.ts                     |       0 |        0 |       0 |       0 | 7-8

 src/ui/components            |       0 |        0 |       0 |       0 |

  FieldRenderer.tsx           |       0 |        0 |       0 |       0 | 11-31

  FinancialSummary.tsx        |       0 |      100 |       0 |       0 | 17-25

 src/ui/components/fields     |       0 |        0 |       0 |       0 |

  ChipButton.tsx              |       0 |        0 |       0 |       0 | 13-22

  ConditionalField.tsx        |       0 |        0 |       0 |       0 | 12-37

  DateField.tsx               |       0 |        0 |       0 |       0 | 17-82

  FormField.tsx               |       0 |        0 |       0 |       0 | 13-38

  InputCounter.tsx            |       0 |        0 |       0 |       0 | 17-31

  MoneyField.tsx              |       0 |        0 |       0 |       0 | 11-32

  MoneyInput.tsx              |       0 |        0 |       0 |       0 | 14-44

  ToggleSwitch.tsx            |       0 |        0 |       0 |       0 | 13-22

  index.ts                    |       0 |        0 |       0 |       0 |

 src/ui/navigation            |       0 |      100 |       0 |       0 |

  MainNavigator.tsx           |       0 |      100 |       0 |       0 | 10-13

 src/ui/screens/CSV           |       0 |        0 |       0 |       0 |

  CsvUploadScreen.tsx         |       0 |        0 |       0 |       0 | 25-106

 src/ui/screens/Daily         |       0 |      100 |       0 |       0 |

  UndoScreen.tsx              |       0 |      100 |       0 |       0 | 7-24

 src/ui/screens/DailyInput    |       0 |      100 |       0 |       0 |

  DailyInputScreen.tsx        |       0 |      100 |       0 |       0 | 7-17

 src/ui/screens/Dashboard     |       0 |      100 |       0 |       0 |

  DashboardScreen.tsx         |       0 |      100 |       0 |       0 | 17-26

 src/ui/screens/Options       |       0 |      100 |       0 |       0 |

  OptionsScreen.tsx           |       0 |      100 |       0 |       0 | 15-19

 src/ui/screens/Reset         |       0 |      100 |       0 |       0 |

  ResetScreen.tsx             |       0 |      100 |       0 |       0 | 13-39

 src/ui/screens/Settings      |       0 |        0 |       0 |       0 |

  SettingsScreen.tsx          |       0 |        0 |       0 |       0 | 12-38

 src/ui/screens/Wizard        |       0 |        0 |       0 |       0 |

  CriticalErrorScreen.tsx     |       0 |      100 |       0 |       0 | 7-9

  LandingScreen.tsx           |       0 |        0 |       0 |       0 | 12-35

  SplashScreen.tsx            |       0 |      100 |       0 |       0 | 5-7

  WelcomeWizard.tsx           |       0 |      100 |       0 |       0 | 5-7

  WizardController.tsx        |       0 |        0 |       0 |       0 | 10-32

  WizardPage.tsx              |       0 |        0 |       0 |       0 | 15-64

 src/ui/screens/Wizard/pages  |       0 |        0 |       0 |       0 |

  1setupHousehold.config.ts   |       0 |        0 |       0 |       0 | 10-46

  2detailsHousehold.config.ts |       0 |      100 |     100 |       0 | 6

  3incomeDetails.config.ts    |       0 |        0 |       0 |       0 | 6-39

  4fixedExpenses.config.ts    |       0 |        0 |       0 |       0 | 6-37

 src/ui/styles                |       0 |        0 |       0 |       0 |

  Colors.ts                   |       0 |      100 |     100 |       0 | 30

  Tokens.ts                   |       0 |      100 |     100 |       0 | 3-24

  useAppStyles.ts             |       0 |        0 |       0 |       0 | 23-56

 src/ui/styles/modules        |       0 |      100 |       0 |       0 |

  Alerts.ts                   |       0 |      100 |       0 |       0 | 12

  Buttons.ts                  |       0 |      100 |       0 |       0 | 12-23

  Cards.ts                    |       0 |      100 |       0 |       0 | 17-28

  Checkboxes.ts               |       0 |      100 |       0 |       0 | 7

  Chips.ts                    |       0 |      100 |       0 |       0 | 11

  Dashboard.ts                |       0 |      100 |       0 |       0 | 12-23

  Forms.ts                    |       0 |      100 |       0 |       0 | 12

  Header.ts                   |       0 |      100 |       0 |       0 | 12-23

  Helpers.ts                  |       0 |      100 |       0 |       0 | 7

  Layout.ts                   |       0 |      100 |       0 |       0 | 11

  Summary.ts                  |       0 |      100 |       0 |       0 | 11-44

  Toggles.ts                  |       0 |      100 |       0 |       0 | 7

  Typography.ts               |       0 |      100 |       0 |       0 | 7

  index.ts                    |       0 |        0 |       0 |       0 |

 src/utils                    |       0 |        0 |       0 |       0 |

  conditions.ts               |       0 |        0 |       0 |       0 | 3-23

  csvHelper.ts                |       0 |        0 |       0 |       0 | 5-29

  date.ts                     |       0 |        0 |       0 |       0 | 22-239

  frequency.ts                |       0 |        0 |       0 |       0 | 3-44

  numbers.ts                  |       0 |        0 |       0 |       0 | 9-91

  objects.ts                  |       0 |        0 |       0 |       0 | 8-21

  ping.ts                     |       0 |      100 |       0 |       0 | 5-7

  strings.ts                  |       0 |        0 |       0 |       0 | 9-15

  validation.ts               |       0 |        0 |       0 |       0 | 5-68

------------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================

Statements   : 0% ( 0/958 )

Branches     : 0% ( 0/766 )

Functions    : 0% ( 0/233 )

Lines        : 0% ( 0/880 )

================================================================================

Jest: "global" coverage threshold for statements (70%) not met: 0%

Jest: "global" coverage threshold for branches (70%) not met: 0%

Jest: "global" coverage threshold for lines (70%) not met: 0%

Jest: "global" coverage threshold for functions (70%) not met: 0%

Test Suites: 1 passed, 1 total

Tests:       1 passed, 1 total

Snapshots:   0 total

Time:        4.214 s

Ran all test suites matching src/logic/__tests__/export.test.ts.

It looks like your test passed, but your coverage report is reporting 0% across the board, even for the file you are specifically testing (). This is why Jest is throwing errors about failing the 70% coverage threshold.

This usually happens when Jest is tracking coverage for the whole project but isn't properly "connecting" the test you ran to the source files, or when your coverage configuration is too broad.

Why this is happening
How to fix it
1. Target coverage to the file under test

When running a single test, tell Jest to only look at the relevant source file so the percentages are meaningful:

Bash
2. Check your

Ensure your doesn't include files that shouldn't be tested (like types or styles) and that your is set up. A typical setup should look like this:

JavaScript
3. Clear the Jest Cache

Sometimes the instrumentation gets stuck in a bad state.

Bash
4. The "Nuclear" Option (Bypass threshold for now)

If you just want the test to pass in CI/locally without worrying about the total project coverage yet, you can run:

Bash
Recommendation

The fact that shows 0% even though passed suggests that either isn't actually importing the logic from export.ts (perhaps it's mocking it entirely?) or the transformer isn't instrumenting the code.

Would you like me to look at the contents of your and to see why the link between them is broken?

---

**User:**

```
InputCounter.test.tsx
```

```
TypeError: Cannot read properties of undefined (reading 'press')
```

```
fireEvent.press()
```

```
@testing-library/react-native
```

```
@testing-library/react
```

```
fireEvent.click()
```

```
import { fireEvent } from '@testing-library/react-native';
```

```
fireEvent.click(getByTestId(...))
```

```
App.projector.test.tsx
```

```
Unable to find an element with text: /aanmelden/i
```

```
LandingScreen
```

```
<View testID="welcome-wizard" />
```

```
<View testID="welcome-wizard" />
```

```
WelcomeWizard
```

```
LandingScreen
```

```
onboardingState
```

```
renderWithState
```

```
onboardingState
```

```
hasCompletedOnboarding
```

```
isFirstLaunch
```

```
formReducer.test.ts
```

```
Expected: true, Received: false
```

```
newState.isValid
```

```
isValid: true
```

```
src/app/context/formReducer.ts
```

```
case 'RESET_APP':
  return {
    ...initialState,
    isValid: false, // <-- Dit moet waarschijnlijk true zijn
    // ...
  };
```

```
case 'RESET_APP':
  return {
    ...initialState,
    isValid: false, // <-- Dit moet waarschijnlijk true zijn
    // ...
  };
```

```
src/services/storage.ts
```

```
src/ui/screens/Wizard/WizardController.tsx
```

```
jest.config.js
```

```
coverageThreshold
```

```
src/services
```

```
formReducer
```

```
InputCounter
```

| Key | Value |
| --- | --- |
| Oorzaak | Je probeert aan te roepen, maar fireEvent is waarschijnlijk niet goed geïmporteerd of de methode press bestaat niet in de versie van de library die je gebruikt. In is press de correcte methode, maar als je per ongeluk de web-versie () gebruikt, moet het zijn. |
| Oplossing | 1. Controleer je import: |
| 2. Als je in een web | omgeving test, gebruik dan . |

| Key | Value |
| --- | --- |
| Oorzaak | De test verwacht de (met de tekst "aanmelden"), maar de debug-output laat zien dat alleen dit gerenderd wordt:XMLDit betekent dat de app direct naar de springt in plaats van op de te blijven. Waarschijnlijk staat de die je meegeeft aan zo ingesteld dat de app denkt dat de gebruiker de landing al gepasseerd is. |
| Oplossing | Controleer de in regel 15 van je test. Zorg ervoor dat de vlag die bepaalt of de wizard getoond moet worden (bijv. of ) op de juiste waarde staat om de landingpagina te tonen. |

| Key | Value |
| --- | --- |
| Oorzaak | Bij de actie RESET_APP verwacht je dat de state teruggaat naar de beginwaarden, inclusief . De reducer geeft echter false terug. |
| Oplossing | Kijk in . Zoek naar de case voor RESET_APP. Waarschijnlijk staat daar iets als:TypeScript |

| Key | Value |
| --- | --- |
| Herstel de bovenstaande 3 tests | Zodra deze slagen, stijgt je coverage al iets. |
| Focus op ongedekte bestanden | Uit je tabel blijkt dat vitale logica in (30% coverage) en (53% coverage) nauwelijks getest wordt. |
| Threshold tijdelijk verlagen (niet aangeraden) | Als je snel door wilt, kun je in de verlagen, maar het is beter om de kritieke services in aan te vullen met tests. |

npm test

> test

> jest

 FAIL  src/ui/components/__tests__/InputCounter.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

  ● InputCounter › moet de waarde verhogen bij een klik op de plus en action structuur doorgeven

    TypeError: Cannot read properties of undefined (reading 'press')

      15 |     );

      16 |

    > 17 |     fireEvent.press(getByTestId('counter-increment'));

         |               ^

      18 |

      19 |     // Nieuw contract: { fieldId, value }

      20 |     expect(onChange).toHaveBeenCalledWith({ fieldId: 'aantalMensen', value: 2 });

      at Object.<anonymous> (src/ui/components/__tests__/InputCounter.test.tsx:17:15)

 FAIL  src/__tests__/App.projector.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

  ● App Projector Flow › WAI Check: LandingScreen heeft toegankelijke knoppen

    Unable to find an element with text: /aanmelden/i

    <View

      testID="welcome-wizard"

    />

      15 |     const { getByText } = renderWithState(<App />, { state: onboardingState });

      16 |

    > 17 |     expect(getByText(/aanmelden/i)).toBeTruthy();

         |            ^

      18 |   });

      19 |

      20 |   it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:17:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● App Projector Flow › Projector: switch LANDING → WIZARD rendert wizard UI

    Unable to find an element with text: /wizard/i

    <View

      testID="welcome-wizard"

    />

      28 |     });

      29 |

    > 30 |     expect(getByText(/wizard/i)).toBeTruthy();

         |            ^

      31 |   });

      32 | });

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:30:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

 FAIL  src/app/context/__test__/formReducer.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

  ● formReducer — Onderzoeks-integriteit › moet bij RESET_APP de state terugzetten maar de meta-klok laten lopen

    expect(received).toBe(expected) // Object.is equality

    Expected: true

    Received: false

      43 |

      44 |     // Assert: Check of we terug zijn bij de basis (isValid: true, aantalMensen: 1)

    > 45 |     expect(newState.isValid).toBe(true);

         |                              ^

      46 |     expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(1);

      47 |

      48 |     // De timestamp moet wel nu zijn, niet de oude uit de dirtyState

      at Object.<anonymous> (src/app/context/__test__/formReducer.test.ts:45:30)

 PASS  src/ui/screens/Wizard/__tests__/WizardController.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/logic/__tests__/export.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/state/schemas/__tests__/schemas.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/services/__tests__/migration.fixture.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/__tests__/WAI009_FocusManagement.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/__tests__/LandingScreen_Isolation.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/app/hooks/__tests__/useAppOrchestration.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/services/__tests__/dataOrchestrator.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/__tests__/CoreSanity.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/services/__tests__/csvService.integration.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/services/__tests__/storageShim.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/selectors/__tests__/financialFlow.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

    console.log

      Financial VM generated undefined

      at Object.info (src/services/logger.ts:2:46)

    console.log

      Financial VM generated undefined

      at Object.info (src/services/logger.ts:2:46)

 PASS  src/selectors/__tests__/householdSelectors.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/ui/styles/__tests__/useAppStyles.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/utils/__tests__/date.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/utils/__tests__/numbers.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/services/__tests__/migration.members.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/services/__tests__/csvService.test.tsx

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/domain/__tests__/household.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/services/__tests__/storage.migration.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/utils/__tests__/frequency.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/logic/__tests__/finance.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 PASS  src/utils/__tests__/ping.test.ts

  ● Console

    console.log

      ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

------------------------------|---------|----------|---------|---------|-------------------------

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

------------------------------|---------|----------|---------|---------|-------------------------

All files                     |   49.47 |     41.9 |   48.92 |    50.9 |

 src                          |   66.66 |       50 |     100 |   66.66 |

  App.tsx                     |   66.66 |       50 |     100 |   66.66 | 10,17

 src/app/context              |   52.83 |    38.09 |      60 |   53.84 |

  FormContext.tsx             |      60 |       25 |      50 |   66.66 | 18-23

  ThemeContext.tsx            |   69.56 |    66.66 |      80 |   69.56 | 24-27,34-38,48

  WizardContext.tsx           |       0 |        0 |       0 |       0 | 20-57

  formReducer.ts              |      75 |       60 |     100 |      75 | 32,38

 src/app/hooks                |   85.71 |    58.82 |     100 |   85.71 |

  useAppOrchestration.ts      |   85.71 |    58.82 |     100 |   85.71 | 28-29,45

 src/config                   |       0 |      100 |     100 |       0 |

  WizStrings.ts               |       0 |      100 |     100 |       0 | 1

  features.ts                 |       0 |      100 |     100 |       0 | 8-21

 src/containers               |       0 |        0 |       0 |       0 |

  AdultsCounter.tsx           |       0 |        0 |       0 |       0 | 5-25

 src/domain                   |       0 |        0 |       0 |       0 |

  household.ts                |       0 |        0 |       0 |       0 |

  types.ts                    |       0 |        0 |       0 |       0 |

 src/domain/constants         |   71.42 |      100 |     100 |   71.42 |

  datakeys.ts                 |     100 |      100 |     100 |     100 |

  labels.ts                   |       0 |      100 |     100 |       0 | 4-22

  registry.ts                 |     100 |      100 |     100 |     100 |

 src/domain/rules             |       0 |      100 |       0 |       0 |

  evaluateDomainRules.ts      |       0 |      100 |       0 |       0 | 2-6

 src/logic                    |   78.78 |       50 |   77.77 |   79.31 |

  export.ts                   |       0 |        0 |       0 |       0 | 7-21

  finance.ts                  |     100 |    57.14 |     100 |     100 | 16-35

  householdLogic.ts           |   78.57 |       75 |     100 |      80 | 21-22

 src/navigation               |       0 |        0 |       0 |       0 |

  Navigator.tsx               |       0 |        0 |       0 |       0 | 11-20

 src/selectors                |   68.18 |        0 |   57.14 |   77.77 |

  financialSelectors.ts       |     100 |      100 |     100 |     100 |

  householdSelectors.ts       |   61.11 |        0 |      50 |   71.42 | 47,57-59

 src/services                 |      61 |    53.57 |   60.71 |   62.94 |

  csvService.ts               |   89.65 |    78.12 |    87.5 |   91.66 | 48,73

  dataOrchestrator.ts         |      92 |     62.5 |     100 |      92 | 86-87

  dataProcessor.ts            |    82.6 |    71.87 |      80 |    82.6 | 28,31,37,49

  householdAlign.ts           |       0 |        0 |       0 |       0 | 8-65

  logger.ts                   |   57.14 |      100 |      25 |   57.14 | 3-5

  migrationService.ts         |       0 |        0 |       0 |       0 | 20-86

  privacyHelpers.ts           |   81.63 |    79.68 |     100 |   83.33 | 11-13,42,57,66,69

  storage.ts                  |   27.27 |        0 |      25 |      30 | 10-44

  storageShim.ts              |   43.75 |       25 |   33.33 |   43.75 | 10-18,27,36-43

  transactionService.ts       |   68.75 |    91.66 |      40 |   68.75 | 63-64,73-80

 src/shared-types             |       0 |        0 |       0 |       0 |

  core.ts                     |       0 |        0 |       0 |       0 |

  expenses.ts                 |       0 |        0 |       0 |       0 |

  fields.ts                   |       0 |        0 |       0 |       0 |

  form.ts                     |       0 |        0 |       0 |       0 |

  income.ts                   |       0 |        0 |       0 |       0 |

  transaction.ts              |       0 |        0 |       0 |       0 |

  wizard.ts                   |       0 |        0 |       0 |       0 |

 src/state/schemas            |     100 |      100 |     100 |     100 |

  FormStateSchema.ts          |     100 |      100 |     100 |     100 |

 src/test-utils               |       0 |        0 |       0 |       0 |

  index.ts                    |       0 |        0 |       0 |       0 |

 src/test-utils/assertions    |       0 |      100 |       0 |       0 |

  migrationAssertions.ts      |       0 |      100 |       0 |       0 | 6-20

 src/test-utils/factories     |      65 |    23.07 |      50 |   66.66 |

  csvFactory.ts               |      60 |      100 |      50 |      60 | 9-19

  memberFactory.ts            |   16.66 |        0 |      20 |      20 | 13-41

  stateFactory.ts             |     100 |    85.71 |     100 |     100 | 45

 src/test-utils/perf          |       0 |        0 |       0 |       0 |

  measure.ts                  |       0 |        0 |       0 |       0 | 7-15

 src/test-utils/render        |   68.42 |    55.55 |   85.71 |      75 |

  providers.tsx               |      40 |        0 |   66.66 |   42.85 | 34-42

  renderers.tsx               |     100 |      100 |     100 |     100 |

 src/test-utils/utils         |       0 |        0 |       0 |       0 |

  name.ts                     |       0 |        0 |       0 |       0 | 7-8

 src/ui/components            |       0 |        0 |       0 |       0 |

  FieldRenderer.tsx           |       0 |        0 |       0 |       0 | 11-31

  FinancialSummary.tsx        |       0 |      100 |       0 |       0 | 17-25

 src/ui/components/fields     |   24.39 |    25.88 |    12.5 |   27.39 |

  ChipButton.tsx              |   33.33 |        0 |       0 |   33.33 | 20-22

  ConditionalField.tsx        |    8.33 |        0 |       0 |    8.33 | 18-37

  DateField.tsx               |    12.9 |        0 |       0 |   14.81 | 18-21,25-29,34-37,49-82

  FormField.tsx               |   57.14 |       90 |      25 |   57.14 | 17,30-38

  InputCounter.tsx            |    62.5 |      100 |      25 |     100 |

  MoneyField.tsx              |      25 |        0 |       0 |      25 | 17-32

  MoneyInput.tsx              |    7.14 |        0 |       0 |    8.33 | 21-44

  ToggleSwitch.tsx            |     100 |    66.66 |     100 |     100 | 25-31

  index.ts                    |       0 |        0 |       0 |       0 |

 src/ui/navigation            |       0 |      100 |       0 |       0 |

  MainNavigator.tsx           |       0 |      100 |       0 |       0 | 10-13

 src/ui/screens/CSV           |       0 |        0 |       0 |       0 |

  CsvUploadScreen.tsx         |       0 |        0 |       0 |       0 | 25-106

 src/ui/screens/Daily         |       0 |      100 |       0 |       0 |

  UndoScreen.tsx              |       0 |      100 |       0 |       0 | 7-24

 src/ui/screens/DailyInput    |       0 |      100 |       0 |       0 |

  DailyInputScreen.tsx        |       0 |      100 |       0 |       0 | 7-17

 src/ui/screens/Dashboard     |       0 |      100 |       0 |       0 |

  DashboardScreen.tsx         |       0 |      100 |       0 |       0 | 17-26

 src/ui/screens/Options       |       0 |      100 |       0 |       0 |

  OptionsScreen.tsx           |       0 |      100 |       0 |       0 | 15-19

 src/ui/screens/Reset         |       0 |      100 |       0 |       0 |

  ResetScreen.tsx             |       0 |      100 |       0 |       0 | 13-39

 src/ui/screens/Settings      |       0 |        0 |       0 |       0 |

  SettingsScreen.tsx          |       0 |        0 |       0 |       0 | 12-38

 src/ui/screens/Wizard        |      66 |    68.18 |   58.33 |   65.95 |

  CriticalErrorScreen.tsx     |       0 |      100 |       0 |       0 | 7-9

  LandingScreen.tsx           |    92.3 |       75 |     100 |     100 | 28

  SplashScreen.tsx            |       0 |      100 |       0 |       0 | 5-7

  WelcomeWizard.tsx           |       0 |      100 |       0 |       0 | 5-7

  WizardController.tsx        |   53.84 |       20 |      50 |   53.84 | 16-19,31-32

  WizardPage.tsx              |   93.33 |    84.61 |     100 |   92.85 | 41

 src/ui/screens/Wizard/pages  |   38.09 |    33.33 |      25 |    42.1 |

  1setupHousehold.config.ts   |   55.55 |       50 |      50 |   55.55 | 31-41

  2detailsHousehold.config.ts |     100 |      100 |     100 |     100 |

  3incomeDetails.config.ts    |   33.33 |        0 |       0 |   33.33 | 32-39

  4fixedExpenses.config.ts    |    12.5 |        0 |       0 |   16.66 | 30-37

 src/ui/styles                |     100 |      100 |     100 |     100 |

  Colors.ts                   |     100 |      100 |     100 |     100 |

  Tokens.ts                   |     100 |      100 |     100 |     100 |

  useAppStyles.ts             |     100 |      100 |     100 |     100 |

 src/ui/styles/modules        |     100 |      100 |     100 |     100 |

  Alerts.ts                   |     100 |      100 |     100 |     100 |

  Buttons.ts                  |     100 |      100 |     100 |     100 |

  Cards.ts                    |     100 |      100 |     100 |     100 |

  Checkboxes.ts               |     100 |      100 |     100 |     100 |

  Chips.ts                    |     100 |      100 |     100 |     100 |

  Dashboard.ts                |     100 |      100 |     100 |     100 |

  Forms.ts                    |     100 |      100 |     100 |     100 |

  Header.ts                   |     100 |      100 |     100 |     100 |

  Helpers.ts                  |     100 |      100 |     100 |     100 |

  Layout.ts                   |     100 |      100 |     100 |     100 |

  Summary.ts                  |     100 |      100 |     100 |     100 |

  Toggles.ts                  |     100 |      100 |     100 |     100 |

  Typography.ts               |     100 |      100 |     100 |     100 |

  index.ts                    |       0 |        0 |       0 |       0 |

 src/utils                    |   49.12 |    38.82 |   55.88 |   51.48 |

  conditions.ts               |       0 |        0 |       0 |       0 | 3-23

  csvHelper.ts                |      90 |       80 |     100 |     100 | 12-16

  date.ts                     |    37.5 |    31.42 |      50 |   41.57 | 93-134,166-212,230-239

  frequency.ts                |   88.23 |     87.5 |   66.66 |   93.75 | 10

  numbers.ts                  |      90 |    78.78 |      50 |   89.65 | 9,80-81

  objects.ts                  |     100 |     90.9 |     100 |     100 | 8

  ping.ts                     |     100 |      100 |     100 |     100 |

  strings.ts                  |       0 |        0 |       0 |       0 | 9-15

  validation.ts               |       0 |        0 |       0 |       0 | 5-68

------------------------------|---------|----------|---------|---------|-------------------------

=============================== Coverage summary ===============================

Statements   : 49.47% ( 474/958 )

Branches     : 41.9% ( 321/766 )

Functions    : 48.92% ( 114/233 )

Lines        : 50.9% ( 448/880 )

================================================================================

Jest: "global" coverage threshold for statements (70%) not met: 49.47%

Jest: "global" coverage threshold for branches (70%) not met: 41.9%

Jest: "global" coverage threshold for lines (70%) not met: 50.9%

Jest: "global" coverage threshold for functions (70%) not met: 48.92%

Summary of all failing tests

 FAIL  src/ui/components/__tests__/InputCounter.test.tsx

  ● InputCounter › moet de waarde verhogen bij een klik op de plus en action structuur doorgeven

    TypeError: Cannot read properties of undefined (reading 'press')

      15 |     );

      16 |

    > 17 |     fireEvent.press(getByTestId('counter-increment'));

         |               ^

      18 |

      19 |     // Nieuw contract: { fieldId, value }

      20 |     expect(onChange).toHaveBeenCalledWith({ fieldId: 'aantalMensen', value: 2 });

      at Object.<anonymous> (src/ui/components/__tests__/InputCounter.test.tsx:17:15)

 FAIL  src/__tests__/App.projector.test.tsx

  ● App Projector Flow › WAI Check: LandingScreen heeft toegankelijke knoppen

    Unable to find an element with text: /aanmelden/i

    <View

      testID="welcome-wizard"

    />

      15 |     const { getByText } = renderWithState(<App />, { state: onboardingState });

      16 |

    > 17 |     expect(getByText(/aanmelden/i)).toBeTruthy();

         |            ^

      18 |   });

      19 |

      20 |   it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:17:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● App Projector Flow › Projector: switch LANDING → WIZARD rendert wizard UI

    Unable to find an element with text: /wizard/i

    <View

      testID="welcome-wizard"

    />

      28 |     });

      29 |

    > 30 |     expect(getByText(/wizard/i)).toBeTruthy();

         |            ^

      31 |   });

      32 | });

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:30:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

 FAIL  src/app/context/__test__/formReducer.test.ts

  ● formReducer — Onderzoeks-integriteit › moet bij RESET_APP de state terugzetten maar de meta-klok laten lopen

    expect(received).toBe(expected) // Object.is equality

    Expected: true

    Received: false

      43 |

      44 |     // Assert: Check of we terug zijn bij de basis (isValid: true, aantalMensen: 1)

    > 45 |     expect(newState.isValid).toBe(true);

         |                              ^

      46 |     expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(1);

      47 |

      48 |     // De timestamp moet wel nu zijn, niet de oude uit de dirtyState

      at Object.<anonymous> (src/app/context/__test__/formReducer.test.ts:45:30)

Test Suites: 3 failed, 23 passed, 26 total

Tests:       4 failed, 69 passed, 73 total

Snapshots:   0 total

Time:        14.959 s, estimated 23 s

Ran all test suites.

Het lijkt erop dat er drie specifieke problemen zijn in je testsuite, naast het feit dat de totale code-dekking onder de drempelwaarde van 70% is gezakt.

Hier is de analyse en de oplossing per falende test:

1.

Fout:

2.

Fout:

3.

Fout: (bij )

4. Coverage Threshold

Je tests falen nu ook op de Global Threshold. Jest blokkeert de build omdat je op ~50% dekking zit terwijl 70% vereist is.

Strategie voor herstel:

Zal ik een specifiek codefragment van de of de test bekijken om de exacte fix te schrijven?

---

**User:**

```
<View testID="welcome-wizard" />
```

```
<View testID="welcome-wizard" />
```

```
LandingScreen
```

```
WelcomeWizard
```

```
renderWithState
```

```
// Waarschijnlijk staat er dit in App.tsx:
if (loading) {
  return <View testID="welcome-wizard" />;
}
```

```
// Waarschijnlijk staat er dit in App.tsx:
if (loading) {
  return <View testID="welcome-wizard" />;
}
```

```
LandingScreen
```

```
it('WAI Check: LandingScreen heeft toegankelijke knoppen', async () => {
  const onboardingState = makePhoenixState({
    status: 'ONBOARDING',
    activeStep: 'LANDING'
  });

  const { getByText, debug } = renderWithState(<App />, { state: onboardingState });

  // Dit print de huidige HTML/Boom in je console:
  debug();

  expect(getByText(/aanmelden/i)).toBeTruthy();
});
```

```
it('WAI Check: LandingScreen heeft toegankelijke knoppen', async () => {
  const onboardingState = makePhoenixState({
    status: 'ONBOARDING',
    activeStep: 'LANDING'
  });

  const { getByText, debug } = renderWithState(<App />, { state: onboardingState });

  // Dit print de huidige HTML/Boom in je console:
  debug();

  expect(getByText(/aanmelden/i)).toBeTruthy();
});
```

```
<View testID="welcome-wizard" />
```

```
wizardState
```

```
renderWithState
```

```
LandingScreen
```

```
src/__tests__/LandingScreen.test.tsx
```

```
import { renderWithState } from '@test-utils/index';
import LandingScreen from '../ui/screens/Wizard/LandingScreen';

it('LandingScreen heeft de juiste teksten', () => {
  const { getByText } = renderWithState(<LandingScreen />);
  expect(getByText(/aanmelden/i)).toBeTruthy();
  expect(getByText(/inloggen/i)).toBeTruthy();
});
```

```
import { renderWithState } from '@test-utils/index';
import LandingScreen from '../ui/screens/Wizard/LandingScreen';

it('LandingScreen heeft de juiste teksten', () => {
  const { getByText } = renderWithState(<LandingScreen />);
  expect(getByText(/aanmelden/i)).toBeTruthy();
  expect(getByText(/inloggen/i)).toBeTruthy();
});
```

```
useAppOrchestration
```

```
renderWithState
```

```
await waitFor(() => ...)
```

| Key | Value |
| --- | --- |
| Check App.tsx regels 10 en 17 | De coverage map laat zien dat deze lijnen "uncovered" zijn. Dit zijn waarschijnlijk de plekken waar de switch-logica voor de schermen staat. |
| Mocking | Controleer of of useForm in je App.tsx correct de state ophalen uit de provider die opzet. |
| Timing | Als App.tsx een useEffect gebruikt om de state te laden, moet je in je test wellicht een gebruiken. |

npm test src/__tests__/App.projector.test.tsx

> test

> jest src/__tests__/App.projector.test.tsx

  console.log

    ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

 FAIL  src/__tests__/App.projector.test.tsx

  App Projector Flow

    ✕ WAI Check: LandingScreen heeft toegankelijke knoppen (139 ms)

    ✕ Projector: switch LANDING → WIZARD rendert wizard UI (5 ms)

  ● App Projector Flow › WAI Check: LandingScreen heeft toegankelijke knoppen

    Unable to find an element with text: /aanmelden/i

    <View

      testID="welcome-wizard"

    />

      15 |     const { getByText } = renderWithState(<App />, { state: onboardingState });

      16 |

    > 17 |     expect(getByText(/aanmelden/i)).toBeTruthy();

         |            ^

      18 |   });

      19 |

      20 |   it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:17:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● App Projector Flow › Projector: switch LANDING → WIZARD rendert wizard UI

    Unable to find an element with text: /wizard/i

    <View

      testID="welcome-wizard"

    />

      28 |     });

      29 |

    > 30 |     expect(getByText(/wizard/i)).toBeTruthy();

         |            ^

      31 |   });

      32 | });

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:30:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

------------------------------|---------|----------|---------|---------|-------------------

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

------------------------------|---------|----------|---------|---------|-------------------

All files                     |    6.57 |     2.48 |    6.43 |    6.93 |

 src                          |   66.66 |       50 |     100 |   66.66 |

  App.tsx                     |   66.66 |       50 |     100 |   66.66 | 10,17

 src/app/context              |   35.84 |    19.04 |      40 |   36.53 |

  FormContext.tsx             |      60 |       25 |      50 |   66.66 | 18-23

  ThemeContext.tsx            |   56.52 |       50 |      60 |   56.52 | 24-27,34-38,46-50

  WizardContext.tsx           |       0 |        0 |       0 |       0 | 20-57

  formReducer.ts              |       0 |        0 |       0 |       0 | 5-38

 src/app/hooks                |   71.42 |    41.17 |     100 |   71.42 |

  useAppOrchestration.ts      |   71.42 |    41.17 |     100 |   71.42 | 22-23,28-29,45,62

 src/config                   |       0 |      100 |     100 |       0 |

  WizStrings.ts               |       0 |      100 |     100 |       0 | 1

  features.ts                 |       0 |      100 |     100 |       0 | 8-21

 src/containers               |       0 |        0 |       0 |       0 |

  AdultsCounter.tsx           |       0 |        0 |       0 |       0 | 5-25

 src/domain                   |       0 |        0 |       0 |       0 |

  household.ts                |       0 |        0 |       0 |       0 |

  types.ts                    |       0 |        0 |       0 |       0 |

 src/domain/constants         |   28.57 |      100 |     100 |   28.57 |

  datakeys.ts                 |     100 |      100 |     100 |     100 |

  labels.ts                   |       0 |      100 |     100 |       0 | 4-22

  registry.ts                 |       0 |      100 |     100 |       0 | 4-16

 src/domain/rules             |       0 |      100 |       0 |       0 |

  evaluateDomainRules.ts      |       0 |      100 |       0 |       0 | 2-6

 src/logic                    |       0 |        0 |       0 |       0 |

  export.ts                   |       0 |        0 |       0 |       0 | 7-21

  finance.ts                  |       0 |        0 |       0 |       0 | 3-39

  householdLogic.ts           |       0 |        0 |       0 |       0 | 7-22

 src/navigation               |       0 |        0 |       0 |       0 |

  Navigator.tsx               |       0 |        0 |       0 |       0 | 11-20

 src/selectors                |       0 |        0 |       0 |       0 |

  financialSelectors.ts       |       0 |      100 |       0 |       0 | 9-17

  householdSelectors.ts       |       0 |        0 |       0 |       0 | 8-59

 src/services                 |    2.75 |        0 |    1.78 |    3.04 |

  csvService.ts               |       0 |        0 |       0 |       0 | 6-73

  dataOrchestrator.ts         |       0 |        0 |       0 |       0 | 47-125

  dataProcessor.ts            |       0 |        0 |       0 |       0 | 16-63

  householdAlign.ts           |       0 |        0 |       0 |       0 | 8-65

  logger.ts                   |   42.85 |      100 |       0 |   42.85 | 2-5

  migrationService.ts         |       0 |        0 |       0 |       0 | 20-86

  privacyHelpers.ts           |       0 |        0 |       0 |       0 | 9-120

  storage.ts                  |   27.27 |        0 |      25 |      30 | 10-44

  storageShim.ts              |       0 |        0 |       0 |       0 | 6-43

  transactionService.ts       |       0 |        0 |       0 |       0 | 6-80

 src/shared-types             |       0 |        0 |       0 |       0 |

  core.ts                     |       0 |        0 |       0 |       0 |

  expenses.ts                 |       0 |        0 |       0 |       0 |

  fields.ts                   |       0 |        0 |       0 |       0 |

  form.ts                     |       0 |        0 |       0 |       0 |

  income.ts                   |       0 |        0 |       0 |       0 |

  transaction.ts              |       0 |        0 |       0 |       0 |

  wizard.ts                   |       0 |        0 |       0 |       0 |

 src/state/schemas            |       0 |      100 |     100 |       0 |

  FormStateSchema.ts          |       0 |      100 |     100 |       0 | 4-18

 src/test-utils               |       0 |        0 |       0 |       0 |

  index.ts                    |       0 |        0 |       0 |       0 |

 src/test-utils/assertions    |       0 |      100 |       0 |       0 |

  migrationAssertions.ts      |       0 |      100 |       0 |       0 | 6-20

 src/test-utils/factories     |      35 |     3.84 |   16.66 |   33.33 |

  csvFactory.ts               |      20 |      100 |       0 |      20 | 9-39

  memberFactory.ts            |       0 |        0 |       0 |       0 | 13-49

  stateFactory.ts             |   66.66 |    14.28 |   66.66 |    62.5 | 19-41

 src/test-utils/perf          |       0 |        0 |       0 |       0 |

  measure.ts                  |       0 |        0 |       0 |       0 | 7-15

 src/test-utils/render        |   36.84 |    16.66 |   28.57 |   43.75 |

  providers.tsx               |      20 |        0 |       0 |   28.57 | 8,34-42

  renderers.tsx               |   55.55 |       30 |      50 |   55.55 | 43-52

 src/test-utils/utils         |       0 |        0 |       0 |       0 |

  name.ts                     |       0 |        0 |       0 |       0 | 7-8

 src/ui/components            |       0 |        0 |       0 |       0 |

  FieldRenderer.tsx           |       0 |        0 |       0 |       0 | 11-31

  FinancialSummary.tsx        |       0 |      100 |       0 |       0 | 17-25

 src/ui/components/fields     |       0 |        0 |       0 |       0 |

  ChipButton.tsx              |       0 |        0 |       0 |       0 | 13-22

  ConditionalField.tsx        |       0 |        0 |       0 |       0 | 12-37

  DateField.tsx               |       0 |        0 |       0 |       0 | 17-82

  FormField.tsx               |       0 |        0 |       0 |       0 | 13-38

  InputCounter.tsx            |       0 |        0 |       0 |       0 | 17-31

  MoneyField.tsx              |       0 |        0 |       0 |       0 | 11-32

  MoneyInput.tsx              |       0 |        0 |       0 |       0 | 14-44

  ToggleSwitch.tsx            |       0 |        0 |       0 |       0 | 13-22

  index.ts                    |       0 |        0 |       0 |       0 |

 src/ui/navigation            |       0 |      100 |       0 |       0 |

  MainNavigator.tsx           |       0 |      100 |       0 |       0 | 10-13

 src/ui/screens/CSV           |       0 |        0 |       0 |       0 |

  CsvUploadScreen.tsx         |       0 |        0 |       0 |       0 | 25-106

 src/ui/screens/Daily         |       0 |      100 |       0 |       0 |

  UndoScreen.tsx              |       0 |      100 |       0 |       0 | 7-24

 src/ui/screens/DailyInput    |       0 |      100 |       0 |       0 |

  DailyInputScreen.tsx        |       0 |      100 |       0 |       0 | 7-17

 src/ui/screens/Dashboard     |       0 |      100 |       0 |       0 |

  DashboardScreen.tsx         |       0 |      100 |       0 |       0 | 17-26

 src/ui/screens/Options       |       0 |      100 |       0 |       0 |

  OptionsScreen.tsx           |       0 |      100 |       0 |       0 | 15-19

 src/ui/screens/Reset         |       0 |      100 |       0 |       0 |

  ResetScreen.tsx             |       0 |      100 |       0 |       0 | 13-39

 src/ui/screens/Settings      |       0 |        0 |       0 |       0 |

  SettingsScreen.tsx          |       0 |        0 |       0 |       0 | 12-38

 src/ui/screens/Wizard        |       0 |        0 |       0 |       0 |

  CriticalErrorScreen.tsx     |       0 |      100 |       0 |       0 | 7-9

  LandingScreen.tsx           |       0 |        0 |       0 |       0 | 12-35

  SplashScreen.tsx            |       0 |      100 |       0 |       0 | 5-7

  WelcomeWizard.tsx           |       0 |      100 |       0 |       0 | 5-7

  WizardController.tsx        |       0 |        0 |       0 |       0 | 10-32

  WizardPage.tsx              |       0 |        0 |       0 |       0 | 15-64

 src/ui/screens/Wizard/pages  |       0 |        0 |       0 |       0 |

  1setupHousehold.config.ts   |       0 |        0 |       0 |       0 | 10-46

  2detailsHousehold.config.ts |       0 |      100 |     100 |       0 | 6

  3incomeDetails.config.ts    |       0 |        0 |       0 |       0 | 6-39

  4fixedExpenses.config.ts    |       0 |        0 |       0 |       0 | 6-37

 src/ui/styles                |       0 |        0 |       0 |       0 |

  Colors.ts                   |       0 |      100 |     100 |       0 | 30

  Tokens.ts                   |       0 |      100 |     100 |       0 | 3-24

  useAppStyles.ts             |       0 |        0 |       0 |       0 | 23-56

 src/ui/styles/modules        |       0 |      100 |       0 |       0 |

  Alerts.ts                   |       0 |      100 |       0 |       0 | 12

  Buttons.ts                  |       0 |      100 |       0 |       0 | 12-23

  Cards.ts                    |       0 |      100 |       0 |       0 | 17-28

  Checkboxes.ts               |       0 |      100 |       0 |       0 | 7

  Chips.ts                    |       0 |      100 |       0 |       0 | 11

  Dashboard.ts                |       0 |      100 |       0 |       0 | 12-23

  Forms.ts                    |       0 |      100 |       0 |       0 | 12

  Header.ts                   |       0 |      100 |       0 |       0 | 12-23

  Helpers.ts                  |       0 |      100 |       0 |       0 | 7

  Layout.ts                   |       0 |      100 |       0 |       0 | 11

  Summary.ts                  |       0 |      100 |       0 |       0 | 11-44

  Toggles.ts                  |       0 |      100 |       0 |       0 | 7

  Typography.ts               |       0 |      100 |       0 |       0 | 7

  index.ts                    |       0 |        0 |       0 |       0 |

 src/utils                    |    1.31 |     1.06 |    2.94 |    0.99 |

  conditions.ts               |       0 |        0 |       0 |       0 | 3-23

  csvHelper.ts                |       0 |        0 |       0 |       0 | 5-29

  date.ts                     |       0 |        0 |       0 |       0 | 22-239

  frequency.ts                |       0 |        0 |       0 |       0 | 3-44

  numbers.ts                  |       0 |        0 |       0 |       0 | 9-91

  objects.ts                  |   27.27 |    18.18 |      50 |   22.22 | 11-21

  ping.ts                     |       0 |      100 |       0 |       0 | 5-7

  strings.ts                  |       0 |        0 |       0 |       0 | 9-15

  validation.ts               |       0 |        0 |       0 |       0 | 5-68

------------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================

Statements   : 6.57% ( 63/958 )

Branches     : 2.48% ( 19/766 )

Functions    : 6.43% ( 15/233 )

Lines        : 6.93% ( 61/880 )

================================================================================

Jest: "global" coverage threshold for statements (70%) not met: 6.57%

Jest: "global" coverage threshold for branches (70%) not met: 2.48%

Jest: "global" coverage threshold for lines (70%) not met: 6.93%

Jest: "global" coverage threshold for functions (70%) not met: 6.43%

Test Suites: 1 failed, 1 total

Tests:       2 failed, 2 total

Snapshots:   0 total

Time:        3.775 s

Ran all test suites matching src/__tests__/App.projector.test.tsx.

import * as React from 'react';

// Importeer renderWithState in plaats van de standaard render

import { renderWithState } from '@test-utils/index';

import App from '../App';

import { makePhoenixState } from '@test-utils/index';

describe('App Projector Flow', () => {

  it('WAI Check: LandingScreen heeft toegankelijke knoppen', async () => {

    const onboardingState = makePhoenixState({

      status: 'ONBOARDING', // Dwingt hem weg van Dashboard

      activeStep: 'LANDING'

    });

    // Gebruik renderWithState om de 'initialState' prop error te omzeilen

    const { getByText } = renderWithState(<App />, { state: onboardingState });

    expect(getByText(/aanmelden/i)).toBeTruthy();

  });

  it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {

    const wizardState = makePhoenixState({

      status: 'IN_PROGRESS',

      activeStep: 'WIZARD'

    });

    const { getByText } = renderWithState(<App />, {

      state: wizardState

    });

    expect(getByText(/wizard/i)).toBeTruthy();

  });

});

==============

import * as React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStyles } from '../../styles/useAppStyles';

import { useForm } from '../../../app/context/FormContext';

interface Props {

  onSignup?: () => void;

  onSignin?: () => void;

}

const LandingScreen: React.FC<Props> = ({ onSignup, onSignin }) => {

  const { styles } = useAppStyles();

  const insets = useSafeAreaInsets();

  const { dispatch } = useForm();

  // Phoenix 2025 logica: Start de wizard flow

  const handleStart = () => {

    if (onSignup) onSignup();

    dispatch({

      type: 'SET_STEP',

      payload: 'WIZARD'

    });

  };

  // Phoenix 2025 logica: Ga direct naar dashboard/inloggen

  const handleLogin = () => {

    if (onSignin) onSignin();

    dispatch({

      type: 'SET_STEP',

      payload: 'DASHBOARD'

    });

  };

  return (

    <View style={[styles.container, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>

      <View testID="welcome-wizard" style={styles.pageContainer}>

        <Text style={styles.pageTitle}>Welkom</Text>

        <Text style={styles.summaryDetail}>

          Start met het instellen van uw huishouding of ga direct naar het dashboard.

        </Text>

      </View>

      <View testID = "wizard-container" style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>

        <TouchableOpacity

          testID="signup-button"

          style={styles.button}

          onPress={handleStart}

          accessibilityLabel="Aanmelden voor Phoenix"

          accessibilityRole="button"

        >

          <Text style={styles.buttonText}>Aanmelden</Text>

        </TouchableOpacity>

        <TouchableOpacity

          testID="login-button"

          style={[styles.button, styles.secondaryButton]}

          onPress={handleLogin}

          accessibilityLabel="Inloggen op dashboard"

          accessibilityRole="button"

        >

          <Text style={styles.secondaryButtonText}>Inloggen</Text>

        </TouchableOpacity>

      </View>

    </View>

  );

};

export default LandingScreen;

Het lijkt erop dat je een mismatch hebt tussen wat de test verwacht te zien en wat er daadwerkelijk door de App component wordt gerenderd.

In de test output zien we dit resultaat van de render:

HTML

Dit betekent dat de App component op dit moment alleen een lege View met de testID "welcome-wizard" rendert, en niet de of componenten die de tekst "Aanmelden" of "Wizard" bevatten.

De Oorzaak

De oorzaak ligt zeer waarschijnlijk in App.tsx (of de orchestrator die de schermen kiest). Hoewel je in de test de state injecteert via , negeert de App component deze state of rendert hij een placeholder/container die nog niet gevuld is.

Hier zijn de stappen om dit op te lossen:

1. Controleer App.tsx

Kijk naar de render-logica in App.tsx. Het lijkt erop dat daar zoiets staat als:

TypeScript

Omdat de test de App rendert, komt hij waarschijnlijk terecht in een "Loading" state of een tak waar de schermen (, etc.) nog niet zijn gemount.

2. Pas de Test aan (debuggen)

Gebruik debug() om te zien wat er precies gerenderd wordt. Pas je test aan:

TypeScript
3. Waarom faalt de tweede test?

In de tweede test verwacht je de tekst /wizard/i, maar je ziet in de output weer exact dezelfde lege View: .

Dit bevestigt dat App niet reageert op de die je meegeeft. Controleer of de state wel correct koppelt aan de specifieke Context provider die App.tsx gebruikt om te bepalen welk scherm getoond moet worden.

4. Directe Scherm-test (Aanbevolen)

Als je de logica van het wilt testen (zoals de WAI check), is het vaak betrouwbaarder om de component direct te testen in plaats van via de hele App wrapper, tenzij je specifiek de navigatie-logica wilt testen.

Voorbeeld voor :

TypeScript
Samenvattend advies:

Zal ik je helpen met de specifieke code in App.tsx om te zien waarom de routing daar niet doorslaat?

---

**User:**

```
if (status === 'ONBOARDING') {
  return <View testID="welcome-wizard" />;
}
```

```
if (status === 'ONBOARDING') {
  return <View testID="welcome-wizard" />;
}
```

```
getByText(/aanmelden/i)
```

```
useAppOrchestration
```

```
<View testID="welcome-wizard" />
```

```
<View testID="welcome-wizard" />
```

```
LandingScreen.tsx
```

```
WizardController.tsx
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';
import LandingScreen from './ui/screens/Wizard/LandingScreen'; // Voorbeeld import
import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard'; // Voorbeeld import
import SplashScreen from './ui/screens/Wizard/SplashScreen';

export default function App() {
  const { status } = useAppOrchestration(undefined);

  switch (status) {
    case 'HYDRATING':
      return <SplashScreen />;
    case 'ONBOARDING':
      // Hier moet de tekst "aanmelden" of "wizard" ergens in voorkomen
      return <LandingScreen />;
    case 'READY':
      return <MainNavigator />; // Of je hoofd-app
    default:
      return <View testID="error-state" />;
  }
}
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';
import LandingScreen from './ui/screens/Wizard/LandingScreen'; // Voorbeeld import
import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard'; // Voorbeeld import
import SplashScreen from './ui/screens/Wizard/SplashScreen';

export default function App() {
  const { status } = useAppOrchestration(undefined);

  switch (status) {
    case 'HYDRATING':
      return <SplashScreen />;
    case 'ONBOARDING':
      // Hier moet de tekst "aanmelden" of "wizard" ergens in voorkomen
      return <LandingScreen />;
    case 'READY':
      return <MainNavigator />; // Of je hoofd-app
    default:
      return <View testID="error-state" />;
  }
}
```

```
LandingScreen
```

npm test src/__tests__/App.projector.test.tsx

> test

> jest src/__tests__/App.projector.test.tsx

  console.log

    ✅ Jest Early Setup: Winter neutralized & React Native mocked.

      at Object.<anonymous> (jest.setup.early.js:51:9)

  ● <View

      testID="welcome-wizard"

    />

 FAIL  src/__tests__/App.projector.test.tsx

  App Projector Flow

    ✕ WAI Check: LandingScreen heeft toegankelijke knoppen (154 ms)

    ✕ Projector: switch LANDING → WIZARD rendert wizard UI (19 ms)

  ● App Projector Flow › WAI Check: LandingScreen heeft toegankelijke knoppen

    Unable to find an element with text: /aanmelden/i

    <View

      testID="welcome-wizard"

    />

      17 |     debug();

      18 |

    > 19 |     expect(getByText(/aanmelden/i)).toBeTruthy();

         |            ^

      20 |   });

      21 |

      22 |

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:19:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● App Projector Flow › Projector: switch LANDING → WIZARD rendert wizard UI

    Unable to find an element with text: /wizard/i

    <View

      testID="welcome-wizard"

    />

      31 |     });

      32 |

    > 33 |     expect(getByText(/wizard/i)).toBeTruthy();

         |            ^

      34 |   });

      35 | });

      at Object.<anonymous> (src/__tests__/App.projector.test.tsx:33:12)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

------------------------------|---------|----------|---------|---------|-------------------

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

------------------------------|---------|----------|---------|---------|-------------------

All files                     |    6.57 |     2.48 |    6.43 |    6.93 |

 src                          |   66.66 |       50 |     100 |   66.66 |

  App.tsx                     |   66.66 |       50 |     100 |   66.66 | 10,17

 src/app/context              |   35.84 |    19.04 |      40 |   36.53 |

  FormContext.tsx             |      60 |       25 |      50 |   66.66 | 18-23

  ThemeContext.tsx            |   56.52 |       50 |      60 |   56.52 | 24-27,34-38,46-50

  WizardContext.tsx           |       0 |        0 |       0 |       0 | 20-57

  formReducer.ts              |       0 |        0 |       0 |       0 | 5-38

 src/app/hooks                |   71.42 |    41.17 |     100 |   71.42 |

  useAppOrchestration.ts      |   71.42 |    41.17 |     100 |   71.42 | 22-23,28-29,45,62

 src/config                   |       0 |      100 |     100 |       0 |

  WizStrings.ts               |       0 |      100 |     100 |       0 | 1

  features.ts                 |       0 |      100 |     100 |       0 | 8-21

 src/containers               |       0 |        0 |       0 |       0 |

  AdultsCounter.tsx           |       0 |        0 |       0 |       0 | 5-25

 src/domain                   |       0 |        0 |       0 |       0 |

  household.ts                |       0 |        0 |       0 |       0 |

  types.ts                    |       0 |        0 |       0 |       0 |

 src/domain/constants         |   28.57 |      100 |     100 |   28.57 |

  datakeys.ts                 |     100 |      100 |     100 |     100 |

  labels.ts                   |       0 |      100 |     100 |       0 | 4-22

  registry.ts                 |       0 |      100 |     100 |       0 | 4-16

 src/domain/rules             |       0 |      100 |       0 |       0 |

  evaluateDomainRules.ts      |       0 |      100 |       0 |       0 | 2-6

 src/logic                    |       0 |        0 |       0 |       0 |

  export.ts                   |       0 |        0 |       0 |       0 | 7-21

  finance.ts                  |       0 |        0 |       0 |       0 | 3-39

  householdLogic.ts           |       0 |        0 |       0 |       0 | 7-22

 src/navigation               |       0 |        0 |       0 |       0 |

  Navigator.tsx               |       0 |        0 |       0 |       0 | 11-20

 src/selectors                |       0 |        0 |       0 |       0 |

  financialSelectors.ts       |       0 |      100 |       0 |       0 | 9-17

  householdSelectors.ts       |       0 |        0 |       0 |       0 | 8-59

 src/services                 |    2.75 |        0 |    1.78 |    3.04 |

  csvService.ts               |       0 |        0 |       0 |       0 | 6-73

  dataOrchestrator.ts         |       0 |        0 |       0 |       0 | 47-125

  dataProcessor.ts            |       0 |        0 |       0 |       0 | 16-63

  householdAlign.ts           |       0 |        0 |       0 |       0 | 8-65

  logger.ts                   |   42.85 |      100 |       0 |   42.85 | 2-5

  migrationService.ts         |       0 |        0 |       0 |       0 | 20-86

  privacyHelpers.ts           |       0 |        0 |       0 |       0 | 9-120

  storage.ts                  |   27.27 |        0 |      25 |      30 | 10-44

  storageShim.ts              |       0 |        0 |       0 |       0 | 6-43

  transactionService.ts       |       0 |        0 |       0 |       0 | 6-80

 src/shared-types             |       0 |        0 |       0 |       0 |

  core.ts                     |       0 |        0 |       0 |       0 |

  expenses.ts                 |       0 |        0 |       0 |       0 |

  fields.ts                   |       0 |        0 |       0 |       0 |

  form.ts                     |       0 |        0 |       0 |       0 |

  income.ts                   |       0 |        0 |       0 |       0 |

  transaction.ts              |       0 |        0 |       0 |       0 |

  wizard.ts                   |       0 |        0 |       0 |       0 |

 src/state/schemas            |       0 |      100 |     100 |       0 |

  FormStateSchema.ts          |       0 |      100 |     100 |       0 | 4-18

 src/test-utils               |       0 |        0 |       0 |       0 |

  index.ts                    |       0 |        0 |       0 |       0 |

 src/test-utils/assertions    |       0 |      100 |       0 |       0 |

  migrationAssertions.ts      |       0 |      100 |       0 |       0 | 6-20

 src/test-utils/factories     |      35 |     3.84 |   16.66 |   33.33 |

  csvFactory.ts               |      20 |      100 |       0 |      20 | 9-39

  memberFactory.ts            |       0 |        0 |       0 |       0 | 13-49

  stateFactory.ts             |   66.66 |    14.28 |   66.66 |    62.5 | 19-41

 src/test-utils/perf          |       0 |        0 |       0 |       0 |

  measure.ts                  |       0 |        0 |       0 |       0 | 7-15

 src/test-utils/render        |   36.84 |    16.66 |   28.57 |   43.75 |

  providers.tsx               |      20 |        0 |       0 |   28.57 | 8,34-42

  renderers.tsx               |   55.55 |       30 |      50 |   55.55 | 43-52

 src/test-utils/utils         |       0 |        0 |       0 |       0 |

  name.ts                     |       0 |        0 |       0 |       0 | 7-8

 src/ui/components            |       0 |        0 |       0 |       0 |

  FieldRenderer.tsx           |       0 |        0 |       0 |       0 | 11-31

  FinancialSummary.tsx        |       0 |      100 |       0 |       0 | 17-25

 src/ui/components/fields     |       0 |        0 |       0 |       0 |

  ChipButton.tsx              |       0 |        0 |       0 |       0 | 13-22

  ConditionalField.tsx        |       0 |        0 |       0 |       0 | 12-37

  DateField.tsx               |       0 |        0 |       0 |       0 | 17-82

  FormField.tsx               |       0 |        0 |       0 |       0 | 13-38

  InputCounter.tsx            |       0 |        0 |       0 |       0 | 17-31

  MoneyField.tsx              |       0 |        0 |       0 |       0 | 11-32

  MoneyInput.tsx              |       0 |        0 |       0 |       0 | 14-44

  ToggleSwitch.tsx            |       0 |        0 |       0 |       0 | 13-22

  index.ts                    |       0 |        0 |       0 |       0 |

 src/ui/navigation            |       0 |      100 |       0 |       0 |

  MainNavigator.tsx           |       0 |      100 |       0 |       0 | 10-13

 src/ui/screens/CSV           |       0 |        0 |       0 |       0 |

  CsvUploadScreen.tsx         |       0 |        0 |       0 |       0 | 25-106

 src/ui/screens/Daily         |       0 |      100 |       0 |       0 |

  UndoScreen.tsx              |       0 |      100 |       0 |       0 | 7-24

 src/ui/screens/DailyInput    |       0 |      100 |       0 |       0 |

  DailyInputScreen.tsx        |       0 |      100 |       0 |       0 | 7-17

 src/ui/screens/Dashboard     |       0 |      100 |       0 |       0 |

  DashboardScreen.tsx         |       0 |      100 |       0 |       0 | 17-26

 src/ui/screens/Options       |       0 |      100 |       0 |       0 |

  OptionsScreen.tsx           |       0 |      100 |       0 |       0 | 15-19

 src/ui/screens/Reset         |       0 |      100 |       0 |       0 |

  ResetScreen.tsx             |       0 |      100 |       0 |       0 | 13-39

 src/ui/screens/Settings      |       0 |        0 |       0 |       0 |

  SettingsScreen.tsx          |       0 |        0 |       0 |       0 | 12-38

 src/ui/screens/Wizard        |       0 |        0 |       0 |       0 |

  CriticalErrorScreen.tsx     |       0 |      100 |       0 |       0 | 7-9

  LandingScreen.tsx           |       0 |        0 |       0 |       0 | 12-35

  SplashScreen.tsx            |       0 |      100 |       0 |       0 | 5-7

  WelcomeWizard.tsx           |       0 |      100 |       0 |       0 | 5-7

  WizardController.tsx        |       0 |        0 |       0 |       0 | 10-32

  WizardPage.tsx              |       0 |        0 |       0 |       0 | 15-64

 src/ui/screens/Wizard/pages  |       0 |        0 |       0 |       0 |

  1setupHousehold.config.ts   |       0 |        0 |       0 |       0 | 10-46

  2detailsHousehold.config.ts |       0 |      100 |     100 |       0 | 6

  3incomeDetails.config.ts    |       0 |        0 |       0 |       0 | 6-39

  4fixedExpenses.config.ts    |       0 |        0 |       0 |       0 | 6-37

 src/ui/styles                |       0 |        0 |       0 |       0 |

  Colors.ts                   |       0 |      100 |     100 |       0 | 30

  Tokens.ts                   |       0 |      100 |     100 |       0 | 3-24

  useAppStyles.ts             |       0 |        0 |       0 |       0 | 23-56

 src/ui/styles/modules        |       0 |      100 |       0 |       0 |

  Alerts.ts                   |       0 |      100 |       0 |       0 | 12

  Buttons.ts                  |       0 |      100 |       0 |       0 | 12-23

  Cards.ts                    |       0 |      100 |       0 |       0 | 17-28

  Checkboxes.ts               |       0 |      100 |       0 |       0 | 7

  Chips.ts                    |       0 |      100 |       0 |       0 | 11

  Dashboard.ts                |       0 |      100 |       0 |       0 | 12-23

  Forms.ts                    |       0 |      100 |       0 |       0 | 12

  Header.ts                   |       0 |      100 |       0 |       0 | 12-23

  Helpers.ts                  |       0 |      100 |       0 |       0 | 7

  Layout.ts                   |       0 |      100 |       0 |       0 | 11

  Summary.ts                  |       0 |      100 |       0 |       0 | 11-44

  Toggles.ts                  |       0 |      100 |       0 |       0 | 7

  Typography.ts               |       0 |      100 |       0 |       0 | 7

  index.ts                    |       0 |        0 |       0 |       0 |

 src/utils                    |    1.31 |     1.06 |    2.94 |    0.99 |

  conditions.ts               |       0 |        0 |       0 |       0 | 3-23

  csvHelper.ts                |       0 |        0 |       0 |       0 | 5-29

  date.ts                     |       0 |        0 |       0 |       0 | 22-239

  frequency.ts                |       0 |        0 |       0 |       0 | 3-44

  numbers.ts                  |       0 |        0 |       0 |       0 | 9-91

  objects.ts                  |   27.27 |    18.18 |      50 |   22.22 | 11-21

  ping.ts                     |       0 |      100 |       0 |       0 | 5-7

  strings.ts                  |       0 |        0 |       0 |       0 | 9-15

  validation.ts               |       0 |        0 |       0 |       0 | 5-68

------------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================

Statements   : 6.57% ( 63/958 )

Branches     : 2.48% ( 19/766 )

Functions    : 6.43% ( 15/233 )

Lines        : 6.93% ( 61/880 )

================================================================================

Jest: "global" coverage threshold for statements (70%) not met: 6.57%

Jest: "global" coverage threshold for branches (70%) not met: 2.48%

Jest: "global" coverage threshold for lines (70%) not met: 6.93%

Jest: "global" coverage threshold for functions (70%) not met: 6.43%

Test Suites: 1 failed, 1 total

Tests:       2 failed, 2 total

Snapshots:   0 total

Time:        4.31 s

Ran all test suites matching src/__tests__/App.projector.test.tsx.

===========

import React from 'react';

import { View } from 'react-native';

import { useAppOrchestration } from './app/hooks/useAppOrchestration';

// Simpele weergave voor de test-suite

export default function App() {

  const { status } = useAppOrchestration(undefined);

  if (status === 'HYDRATING') {

    return <View testID="splash-screen" />;

  }

  if (status === 'ONBOARDING') {

    return <View testID="welcome-wizard" />;

  }

  return <View testID="app-ready" />;

}

Het lijkt erop dat je tests falen omdat de App.tsx die je onderaan deelt momenteel een "skeleton" of placeholder-versie is. De test probeert tekst te vinden zoals "aanmelden" of "wizard", maar je component rendert alleen een lege <View>.

Hier zijn de drie belangrijkste redenen waarom de test faalt en hoe je dit oplost:

1. De component rendert geen tekst

In je App.tsx staat:

TypeScript

De test voert uit. Omdat er alleen een lege View wordt gerenderd zonder kinderen (children), kan Jest de tekst nooit vinden.

Oplossing: Je moet de werkelijke schermen importeren en renderen in plaats van de lege Views.

2. De hook status

In de testuitvoer zie je onder het kopje FAIL de volgende output van de debug() opdracht:

HTML

Dit bevestigt dat de hook de status ONBOARDING teruggeeft. De logica van je hook werkt dus wel, maar de UI is nog niet gekoppeld.

3. Coverage Threshold Failure

Je ziet ook een foutmelding over Coverage thresholds. Je project staat ingesteld op minimaal 70% dekking, maar je zit momenteel op ~6%. Dit komt omdat veel bestanden (zoals en ) momenteel 0% dekking hebben omdat ze niet worden aangeroepen in de huidige App.tsx.

Hoe fix je dit?

Pas je App.tsx aan zodat de echte navigatie of schermen worden geladen. Het zou er ongeveer zo uit moeten zien:

TypeScript
Check ook je Mocking

Als de tekst "aanmelden" bevat, maar je hebt in je testomgeving de vertalingen (i18n) niet goed gemockt, kan het zijn dat de test alsnog faalt omdat hij de ruwe vertaalsleutel ziet in plaats van de tekst.

Wil je dat ik help met het schrijven van de juiste imports en de switch-case voor je App.tsx op basis van je mappenstructuur?

---

**User:**

```
src/ui/screens/Wizard/
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';

| import SplashScreen from './ui/screens/Wizard/SplashScreen' |  |
| --- | --- |
| import LandingScreen from './ui/screens/Wizard/LandingScreen' |  |
| import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard' |  |
| import MainNavigator from './ui/navigation/MainNavigator' |  |

export default function App() {
  const { status } = useAppOrchestration(undefined);

| // De orchestrator bepaalt welk deel van de app getoond wordt | // De orchestrator bepaalt welk deel van de app getoond wordt |
| --- | --- |
| switch (status) { | switch (status) { |
| case 'HYDRATING': | case 'HYDRATING': |
| return <SplashScreen />; | return <SplashScreen />; |

| case 'ONBOARDING': | case 'ONBOARDING': |
| --- | --- |
| // De test verwacht hier tekst zoals "aanmelden" of "wizard" | // De test verwacht hier tekst zoals "aanmelden" of "wizard" |
| // Waarschijnlijk start de LandingScreen de flow | // Waarschijnlijk start de LandingScreen de flow |
| return <LandingScreen />; | return <LandingScreen />; |

    case 'READY':
      return <MainNavigator />;

    default:
      // Fallback voor onvoorziene statussen
      return <SplashScreen />;
  }
}
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';

| import SplashScreen from './ui/screens/Wizard/SplashScreen' |  |
| --- | --- |
| import LandingScreen from './ui/screens/Wizard/LandingScreen' |  |
| import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard' |  |
| import MainNavigator from './ui/navigation/MainNavigator' |  |

export default function App() {
  const { status } = useAppOrchestration(undefined);

| // De orchestrator bepaalt welk deel van de app getoond wordt | // De orchestrator bepaalt welk deel van de app getoond wordt |
| --- | --- |
| switch (status) { | switch (status) { |
| case 'HYDRATING': | case 'HYDRATING': |
| return <SplashScreen />; | return <SplashScreen />; |

| case 'ONBOARDING': | case 'ONBOARDING': |
| --- | --- |
| // De test verwacht hier tekst zoals "aanmelden" of "wizard" | // De test verwacht hier tekst zoals "aanmelden" of "wizard" |
| // Waarschijnlijk start de LandingScreen de flow | // Waarschijnlijk start de LandingScreen de flow |
| return <LandingScreen />; | return <LandingScreen />; |

    case 'READY':
      return <MainNavigator />;

    default:
      // Fallback voor onvoorziene statussen
      return <SplashScreen />;
  }
}
```

```
Unable to find an element with text: /aanmelden/i
```

```
<View testID="welcome-wizard" />
```

```
LandingScreen
```

```
Unable to find an element with text: /wizard/i
```

```
WelcomeWizard
```

```
LandingScreen.tsx
```

```
/aanmelden/i
```

```
LandingScreen.tsx
```

```
WizStrings.ts
```

```
LandingScreen.tsx
```

| - Fout: Oorzaak: Je rendeerde een lege .Oplossing: bevat (waarschijnlijk) de knop met de tekst "Aanmelden". Door dit scherm te renderen | kan de test de knop vinden. |
| --- | --- |
| - Oplossing: bevat (waarschijnlijk) de knop met de tekst "Aanmelden". Door dit scherm te renderen | kan de test de knop vinden. |
| - Fout: Oorzaak: Idem als hierboven.Oplossing: Zodra de status in de test verspringt naar de wizard-fase | wordt de echte gerenderd die deze tekst bevat. |
| - Oplossing: Zodra de status in de test verspringt naar de wizard-fase | wordt de echte gerenderd die deze tekst bevat. |
| - Coverage Threshold (70%)Door de echte schermen en navigators te importeren | stijgt je code coverage direct aanzienlijk. De "Uncovered Lines" in je rapport (zoals regels 12-35) worden nu namelijk wel uitgevoerd tijdens de test. |
| - Door de echte schermen en navigators te importeren | stijgt je code coverage direct aanzienlijk. De "Uncovered Lines" in je rapport (zoals regels 12-35) worden nu namelijk wel uitgevoerd tijdens de test. |

| Key | Value |
| --- | --- |
| Oorzaak | Je rendeerde een lege . |
| Oplossing | bevat (waarschijnlijk) de knop met de tekst "Aanmelden". Door dit scherm te renderen, kan de test de knop vinden. |

| Key | Value |
| --- | --- |
| Oorzaak | Idem als hierboven. |
| Oplossing | Zodra de status in de test verspringt naar de wizard-fase, wordt de echte gerenderd die deze tekst bevat. |

- Door de echte schermen en navigators te importeren, stijgt je code coverage direct aanzienlijk. De "Uncovered Lines" in je rapport (zoals  regels 12-35) worden nu namelijk wel uitgevoerd tijdens de test.

ja

Om de tests te laten slagen, moeten we de "lege" schermen in App.tsx vervangen door de daadwerkelijke componenten uit je mappenstructuur. Op basis van je coverage-rapport zie ik dat de schermen al bestaan in .

Hier is de verbeterde versie van App.tsx die de orchestratie-status koppelt aan de juiste UI:

TypeScript
Waarom dit de fouten oplost:
Volgende stap

Als de test na deze wijziging nog steeds faalt op de tekst , dan komt dat waarschijnlijk doordat de tekst in hoofdlettergevoelig is of via een vertaalbestand () loopt.

Zal ik de controleren om te zien of de tekst daar exact overeenkomt met wat de test verwacht?

---

**User:**

```
LandingScreen
```

```
LandingScreen
```

```
LandingScreen.tsx
```

```
dispatch({ type: 'SET_STEP', ... })
```

```
FormContext
```

```
/aanmelden/i
```

```
LandingScreen
```

```
<Text style={styles.buttonText}>Aanmelden</Text>
```

```
LandingScreen
```

```
WelcomeWizard
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';
import { useForm } from './app/context/FormContext';

| import SplashScreen from './ui/screens/Wizard/SplashScreen' |  |
| --- | --- |
| import LandingScreen from './ui/screens/Wizard/LandingScreen' |  |
| import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard' |  |
| import MainNavigator from './ui/navigation/MainNavigator' |  |

| const { status } = useAppOrchestration(undefined) |  |
| --- | --- |
| const { state } = useForm() | // Haal de huidige stap uit de context |

| if (status === 'HYDRATING') { | if (status === 'HYDRATING') { |
| --- | --- |
| return <SplashScreen />; | return <SplashScreen />; |
| } | } |

| if (status === 'ONBOARDING') { | if (status === 'ONBOARDING') { |
| --- | --- |
| // Als de gebruiker op 'Aanmelden' heeft geklikt, is de step 'WIZARD' | // Als de gebruiker op 'Aanmelden' heeft geklikt, is de step 'WIZARD' |
| if (state.step === 'WIZARD') { | if (state.step === 'WIZARD') { |
| return <WelcomeWizard />; | return <WelcomeWizard />; |
| } | } |

| // Standaard landingsscherm binnen de onboarding fase | // Standaard landingsscherm binnen de onboarding fase |
| --- | --- |
| return <LandingScreen />; | return <LandingScreen />; |
| } | } |

  return <MainNavigator />;
}
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';
import { useForm } from './app/context/FormContext';

| import SplashScreen from './ui/screens/Wizard/SplashScreen' |  |
| --- | --- |
| import LandingScreen from './ui/screens/Wizard/LandingScreen' |  |
| import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard' |  |
| import MainNavigator from './ui/navigation/MainNavigator' |  |

| const { status } = useAppOrchestration(undefined) |  |
| --- | --- |
| const { state } = useForm() | // Haal de huidige stap uit de context |

| if (status === 'HYDRATING') { | if (status === 'HYDRATING') { |
| --- | --- |
| return <SplashScreen />; | return <SplashScreen />; |
| } | } |

| if (status === 'ONBOARDING') { | if (status === 'ONBOARDING') { |
| --- | --- |
| // Als de gebruiker op 'Aanmelden' heeft geklikt, is de step 'WIZARD' | // Als de gebruiker op 'Aanmelden' heeft geklikt, is de step 'WIZARD' |
| if (state.step === 'WIZARD') { | if (state.step === 'WIZARD') { |
| return <WelcomeWizard />; | return <WelcomeWizard />; |
| } | } |

| // Standaard landingsscherm binnen de onboarding fase | // Standaard landingsscherm binnen de onboarding fase |
| --- | --- |
| return <LandingScreen />; | return <LandingScreen />; |
| } | } |

  return <MainNavigator />;
}
```

```
LandingScreen
```

```
handleStart
```

```
SET_STEP: 'WIZARD'
```

```
state.step === 'WIZARD'
```

```
WelcomeWizard
```

```
LandingScreen
```

```
WelcomeWizard
```

```
MainNavigator
```

```
WelcomeWizard.tsx
```

| - WAI Check: Wanneer de test start | is de status ONBOARDING en state.step nog leeg/default. De wordt gerenderd. De test vindt nu de tekst "Aanmelden". |
| --- | --- |
| - Flow Switch: Wanneer de test op de knop klikt | voert de dispatch uit. |
| - Render Wizard: De App component her-rendert | ziet dat en toont de . De test vindt nu de tekst "wizard" (die waarschijnlijk in dat component staat). |

import * as React from 'react';

import { View, Text, TouchableOpacity } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppStyles } from '../../styles/useAppStyles';

import { useForm } from '../../../app/context/FormContext';

interface Props {

  onSignup?: () => void;

  onSignin?: () => void;

}

const LandingScreen: React.FC<Props> = ({ onSignup, onSignin }) => {

  const { styles } = useAppStyles();

  const insets = useSafeAreaInsets();

  const { dispatch } = useForm();

  // Phoenix 2025 logica: Start de wizard flow

  const handleStart = () => {

    if (onSignup) onSignup();

    dispatch({

      type: 'SET_STEP',

      payload: 'WIZARD'

    });

  };

  // Phoenix 2025 logica: Ga direct naar dashboard/inloggen

  const handleLogin = () => {

    if (onSignin) onSignin();

    dispatch({

      type: 'SET_STEP',

      payload: 'DASHBOARD'

    });

  };

  return (

    <View style={[styles.container, { paddingBottom: Math.max(20, insets.bottom + 8) }]}>

      <View testID="welcome-wizard" style={styles.pageContainer}>

        <Text style={styles.pageTitle}>Welkom</Text>

        <Text style={styles.summaryDetail}>

          Start met het instellen van uw huishouding of ga direct naar het dashboard.

        </Text>

      </View>

      <View testID = "wizard-container" style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>

        <TouchableOpacity

          testID="signup-button"

          style={styles.button}

          onPress={handleStart}

          accessibilityLabel="Aanmelden voor Phoenix"

          accessibilityRole="button"

        >

          <Text style={styles.buttonText}>Aanmelden</Text>

        </TouchableOpacity>

        <TouchableOpacity

          testID="login-button"

          style={[styles.button, styles.secondaryButton]}

          onPress={handleLogin}

          accessibilityLabel="Inloggen op dashboard"

          accessibilityRole="button"

        >

          <Text style={styles.secondaryButtonText}>Inloggen</Text>

        </TouchableOpacity>

      </View>

    </View>

  );

};

export default LandingScreen;

Je hebt de goed opgezet met de juiste tekstlabels ("Aanmelden"), maar de test faalt nog steeds omdat de orchestratie-status in App.tsx en de acties in niet synchroon lopen met wat de test verwacht.

Hier zijn de drie specifieke problemen en de oplossingen:

1. De "Status" vs. "Step" mismatch

In je App.tsx kijk je naar status (waarschijnlijk uit een orchestrator die bepaalt of de app laadt), maar in gebruik je .

Als de test de knop "Aanmelden" indrukt, verwacht de test dat de UI verandert naar de Wizard. In je huidige App.tsx logica blijft de app echter hangen op ONBOARDING (de LandingScreen) omdat de status van de hook niet verandert door een dispatch van de .

2. Tekst Matcher

De test zoekt naar . In je staat: . Dit zou moeten werken, mits het scherm daadwerkelijk gerenderd wordt door App.tsx.

3. De Oplossing (Code)

Pas je App.tsx aan om de flow van de naar de mogelijk te maken. We voegen een lokale state of een check op de context toe:

TypeScript
Waarom dit nu gaat werken:
Over de Coverage

Omdat je nu , en daadwerkelijk importeert en gebruikt, zal je coverage percentage direct omhoog schieten richting de vereiste 70%.

Zal ik je helpen bij het controleren van de om zeker te weten dat daar de tekst "wizard" in voorkomt voor de tweede teststap?

---

**User:**

```
src/shared-types/form.ts
```

```
FormContext.tsx
```

```
// In src/shared-types/form.ts of FormContext.tsx
export interface FormState {
  // ... andere eigenschappen zoals household, income, etc.
  step?: 'LANDING' | 'WIZARD' | 'DASHBOARD'; // Voeg deze regel toe
}
```

```
// In src/shared-types/form.ts of FormContext.tsx
export interface FormState {
  // ... andere eigenschappen zoals household, income, etc.
  step?: 'LANDING' | 'WIZARD' | 'DASHBOARD'; // Voeg deze regel toe
}
```

```
formReducer.ts
```

```
// In src/app/context/formReducer.ts
case 'SET_STEP':
  return {
    ...state,
    step: action.payload, // Zorg dat dit in de state wordt opgeslagen
  };
```

```
// In src/app/context/formReducer.ts
case 'SET_STEP':
  return {
    ...state,
    step: action.payload, // Zorg dat dit in de state wordt opgeslagen
  };
```

```
npm test src/__tests__/App.projector.test.tsx
```

```
FormContext.tsx
```

| Key | Value |
| --- | --- |
| Type Safety | Zonder deze aanpassing zal je build falen, ook al lijkt de logica te werken. |
| State Persistence | Als de reducer de step niet opslaat, zal App.tsx nooit weten dat de gebruiker op "Aanmelden" heeft geklikt, waardoor de test blijft hangen op het landingsscherm en de tekst /wizard/i nooit zal vinden. |

[{

"resource": "/home/user/pre7/src/ui/screens/Wizard/LandingScreen.tsx",

"owner": "typescript",

"code": "2339",

"severity": 8,

"message": "Property 'step' does not exist on type 'FormState'.",

"source": "ts",

"startLineNumber": 20,

"startColumn": 15,

"endLineNumber": 20,

"endColumn": 19

}]

De TypeScript-fout 2339 geeft aan dat de property step niet is gedefinieerd in je FormState type-definitie. Hoewel je de actie SET_STEP wel aanroept, "weet" TypeScript niet dat de state deze waarde ook daadwerkelijk bijhoudt.

Om dit op te lossen, moeten we twee bestanden aanpassen: het bestand waar je types staan en de reducer.

1. Update de Type Definitie

Zoek het bestand waar FormState is gedefinieerd (waarschijnlijk of direct in ).

Voeg step toe aan de interface:

TypeScript
2. Update de Reducer

Zorg ervoor dat de de actie SET_STEP ook daadwerkelijk verwerkt en de state bijwerkt.

TypeScript
Strategische aanpassing voor App.tsx

Als je de types liever niet direct aanpast in de gedeelde domein-logica, kun je de navigatie in App.tsx ook afhankelijk maken van de orchestrator-hook, mits deze de navigatie-logica ondersteunt.

Echter, de meest robuuste manier in jouw huidige architectuur is het toevoegen van step aan de FormState.

Waarom dit belangrijk is voor je tests:
Volgende stap

Nadat je de FormState hebt geüpdatet, kun je de test opnieuw draaien met:

Wil je dat ik meekijk naar de om te zien hoe we de step daar veilig kunnen initialiseren?

---

**User:**

| Test Stap | Actie | State (activeStep) | Resultaat |
| --- | --- | --- | --- |
| Start | Render App | Initieel (bijv. 'LANDING') | LandingScreen toont "Aanmelden" (✅ WAI Check) |
| Klik | Druk op "Aanmelden" | Wordt 'WIZARD' via dispatch | App her-rendert |
| Vervolg | Render App | 'WIZARD' | WelcomeWizard toont "wizard" (✅ Switch Check) |

```
FormStateSchema
```

```
LandingScreen
```

```
LandingScreen.tsx
```

```
LandingScreen.tsx
```

```
// Verander 'step' naar 'activeStep'
const handleStart = () => {
  if (onSignup) onSignup();
  dispatch({
    type: 'SET_STEP',
    payload: 'WIZARD' // Dit wordt de waarde van activeStep
  });
};
```

```
// Verander 'step' naar 'activeStep'
const handleStart = () => {
  if (onSignup) onSignup();
  dispatch({
    type: 'SET_STEP',
    payload: 'WIZARD' // Dit wordt de waarde van activeStep
  });
};
```

```
formReducer.ts
```

```
case 'SET_STEP':
  return {
    ...state,
    activeStep: action.payload, // Gebruik hier activeStep conform je schema
  };
```

```
case 'SET_STEP':
  return {
    ...state,
    activeStep: action.payload, // Gebruik hier activeStep conform je schema
  };
```

```
WelcomeWizard
```

```
export default function App() {
  const { status } = useAppOrchestration(undefined);
  const { state } = useForm();

| if (status === 'HYDRATING') { | if (status === 'HYDRATING') { |
| --- | --- |
| return <SplashScreen />; | return <SplashScreen />; |
| } | } |

| if (status === 'ONBOARDING') { | if (status === 'ONBOARDING') { |
| --- | --- |
| // Gebruik activeStep uit je Zod schema | // Gebruik activeStep uit je Zod schema |
| if (state.activeStep === 'WIZARD') { | if (state.activeStep === 'WIZARD') { |
| return <WelcomeWizard />; | return <WelcomeWizard />; |
| } | } |

    return <LandingScreen />;
  }

  return <MainNavigator />;
}
```

```
export default function App() {
  const { status } = useAppOrchestration(undefined);
  const { state } = useForm();

| if (status === 'HYDRATING') { | if (status === 'HYDRATING') { |
| --- | --- |
| return <SplashScreen />; | return <SplashScreen />; |
| } | } |

| if (status === 'ONBOARDING') { | if (status === 'ONBOARDING') { |
| --- | --- |
| // Gebruik activeStep uit je Zod schema | // Gebruik activeStep uit je Zod schema |
| if (state.activeStep === 'WIZARD') { | if (state.activeStep === 'WIZARD') { |
| return <WelcomeWizard />; | return <WelcomeWizard />; |
| } | } |

    return <LandingScreen />;
  }

  return <MainNavigator />;
}
```

```
activeStep: z.string()
```

```
LandingScreen
```

```
FormContext
```

```
FormContext.tsx
```

import { z } from 'zod';

// 1. Veiligheid voor geld-items (centen)

const MoneyItemSchema = z.object({

  fieldId: z.string(),

  label: z.string().optional(),

  amount: z.number().int(),

});

// 2. Voorkomt de ".map is not a function" error door defaults

const MoneyListSchema = z

  .object({

    items: z.array(MoneyItemSchema).default([]),

  })

  .default({ items: [] });

// 3. Het volledige schema (Veilig & Robuust)

export const FormStateSchema = z

  .object({

    schemaVersion: z.literal('1.0'),

    activeStep: z.string(),

    currentPageId: z.string(),

    isValid: z.boolean().default(true),

    // Data blok met de juiste namen voor jouw project

    data: z.object({

      setup: z.object({

        aantalMensen: z.number().default(1),

        aantalVolwassen: z.number().default(1),

        autoCount: z.string().default('Nee'),

      }).default({ aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Nee' }),

      household: z.object({

        members: z.array(z.any()).default([]),

      }).default({ members: [] }),

      finance: z.object({

        income: MoneyListSchema,

        expenses: MoneyListSchema,

      }).default({

        income: { items: [] },

        expenses: { items: [] }

      }),

    }),

    meta: z.object({

      lastModified: z.string(),

      version: z.number().default(1),

    }),

  })

  .passthrough();

export type FormState = z.infer<typeof FormStateSchema>;

Dankzij het dat je deelt, zien we precies waar de mismatch zit. TypeScript klaagt omdat je in de probeert te dispatchen naar step, terwijl je Zod-schema spreekt over activeStep.

Om de TypeScript-fout op te lossen en de test te laten slagen, moeten we de namen synchroniseren.

1. Fix de Reducer (en TypeScript error)

In je (en waarschijnlijk je reducer) moet je step veranderen naar activeStep. Omdat FormState automatisch wordt gegenereerd vanuit je Zod-schema (z.infer), zal de foutmelding verdwijnen zodra je de juiste property-naam gebruikt.

Pas je aan:

TypeScript

Pas je Reducer aan ():

TypeScript
2. Update de flow in App.tsx

Nu we weten dat de state activeStep heet, kunnen we de App.tsx definitief maken. De test faalde omdat de "knop-klik" de state wel veranderde, maar de App component niet wist dat hij naar de moest switchen.

TypeScript
Waarom dit de test "Projector Flow" fixt:
Exporteren naar Spreadsheets
Een kleine waarschuwing over activeStep

In je Zod-schema staat . Als de initiële waarde van activeStep leeg is of iets anders dan 'WIZARD', zal hij altijd de tonen. Zorg ervoor dat je een zinnige default waarde meegeeft bij het opstarten.

Zal ik je helpen om de SET_STEP actie en de initiële state in je correct te configureren zodat de types 100% aansluiten?

---

**User:**

```
LandingScreen.tsx
```

```
LandingScreen.tsx
```

```
// src/ui/screens/Wizard/LandingScreen.tsx

| if (onSignup) onSignup() |  |
| --- | --- |
| }) |  |
| } |  |

const handleLogin = () => {
  if (onSignin) onSignin();
  dispatch({
    type: 'SET_STEP',
    payload: 'DASHBOARD'
  });
};
```

```
// src/ui/screens/Wizard/LandingScreen.tsx

| if (onSignup) onSignup() |  |
| --- | --- |
| }) |  |
| } |  |

const handleLogin = () => {
  if (onSignin) onSignin();
  dispatch({
    type: 'SET_STEP',
    payload: 'DASHBOARD'
  });
};
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';
import { useForm } from './app/context/FormContext';

| import SplashScreen from './ui/screens/Wizard/SplashScreen' |  |
| --- | --- |
| import LandingScreen from './ui/screens/Wizard/LandingScreen' |  |
| import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard' |  |
| import MainNavigator from './ui/navigation/MainNavigator' |  |

| const { status } = useAppOrchestration(undefined) |  |
| --- | --- |
| const { state } = useForm() |  |

| // 1. App is aan het laden (database/storage) | // 1. App is aan het laden (database/storage) |
| --- | --- |
| if (status === 'HYDRATING') { | if (status === 'HYDRATING') { |
| return <SplashScreen />; | return <SplashScreen />; |
| } | } |

| // 2. Gebruiker is nieuw (geen data gevonden) | // 2. Gebruiker is nieuw (geen data gevonden) |
| --- | --- |
| if (status === 'ONBOARDING') { | if (status === 'ONBOARDING') { |
| // Check of de gebruiker op "Aanmelden" heeft geklikt | // Check of de gebruiker op "Aanmelden" heeft geklikt |
| if (state.activeStep === 'WIZARD') { | if (state.activeStep === 'WIZARD') { |
| return <WelcomeWizard />; | return <WelcomeWizard />; |
| } | } |

| // Zo niet, toon het startpunt | // Zo niet, toon het startpunt |
| --- | --- |
| return <LandingScreen />; | return <LandingScreen />; |
| } | } |

  // 3. Gebruiker is bekend of klaar met onboarden
  return <MainNavigator />;
}
```

```
import React from 'react';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';
import { useForm } from './app/context/FormContext';

| import SplashScreen from './ui/screens/Wizard/SplashScreen' |  |
| --- | --- |
| import LandingScreen from './ui/screens/Wizard/LandingScreen' |  |
| import WelcomeWizard from './ui/screens/Wizard/WelcomeWizard' |  |
| import MainNavigator from './ui/navigation/MainNavigator' |  |

| const { status } = useAppOrchestration(undefined) |  |
| --- | --- |
| const { state } = useForm() |  |

| // 1. App is aan het laden (database/storage) | // 1. App is aan het laden (database/storage) |
| --- | --- |
| if (status === 'HYDRATING') { | if (status === 'HYDRATING') { |
| return <SplashScreen />; | return <SplashScreen />; |
| } | } |

| // 2. Gebruiker is nieuw (geen data gevonden) | // 2. Gebruiker is nieuw (geen data gevonden) |
| --- | --- |
| if (status === 'ONBOARDING') { | if (status === 'ONBOARDING') { |
| // Check of de gebruiker op "Aanmelden" heeft geklikt | // Check of de gebruiker op "Aanmelden" heeft geklikt |
| if (state.activeStep === 'WIZARD') { | if (state.activeStep === 'WIZARD') { |
| return <WelcomeWizard />; | return <WelcomeWizard />; |
| } | } |

| // Zo niet, toon het startpunt | // Zo niet, toon het startpunt |
| --- | --- |
| return <LandingScreen />; | return <LandingScreen />; |
| } | } |

  // 3. Gebruiker is bekend of klaar met onboarden
  return <MainNavigator />;
}
```

```
Unable to find an element with text: /aanmelden/i
```

```
if (status === 'ONBOARDING') {
  return <View testID="welcome-wizard" />; // <-- DIT was de boosdoener
}
```

```
if (status === 'ONBOARDING') {
  return <View testID="welcome-wizard" />; // <-- DIT was de boosdoener
}
```

```
return <LandingScreen />;
```

```
LandingScreen.tsx
```

```
LandingScreen
```

```
state.activeStep === 'WIZARD'
```

```
WelcomeWizard
```

```
formReducer.ts
```

- De test start op .
- Hij vindt de tekst "Aanmelden" (Test 1 slaagt).
- Hij klikt op de knop, de state wordt WIZARD.
- App.tsx ziet  en switcht naar .
- Hij vindt de tekst "wizard" (Test 2 slaagt).

ik zie dit niet in landingscreen

// Verander 'step' naar 'activeStep'

const handleStart = () => {

  if (onSignup) onSignup();

  dispatch({

    type: 'SET_STEP',

    payload: 'WIZARD' // Dit wordt de waarde van activeStep

  });

};

export default function App() {

  const { status } = useAppOrchestration(undefined);

  const { state } = useForm();

  if (status === 'HYDRATING') {

    return <SplashScreen />;

  }

  if (status === 'ONBOARDING') {

    // Gebruik activeStep uit je Zod schema

    if (state.activeStep === 'WIZARD') {

      return <WelcomeWizard />;

    }

    return <LandingScreen />;

  }

  return <MainNavigator />;

}

Dat klopt, de code die ik eerder gaf was het voorstel om de fout op te lossen. In jouw huidige staat nu nog step (wat de rode kringel veroorzaakt), en in je App.tsx staat nog de oude code met de lege <View>.

Laten we ze nu stap voor stap fysiek aanpassen zodat de types kloppen en de test slaagt.

Stap 1: Pas aan

Verander op regel 20 step naar activeStep. Dit lost je TypeScript-fout op.

TypeScript
Stap 2: Pas App.tsx aan

Vervang je huidige App.tsx volledig door deze versie. Deze versie "luistert" naar de klik op de knop in het landingsscherm.

TypeScript
Stap 3: Waarom zie je dit nu pas?

De reden dat de test faalde met de melding , was omdat je in je vorige App.tsx dit had staan:

TypeScript

Jest zag alleen een lege blauwe/witte box zonder tekst. Door nu te doen, "ziet" de test de knoppen en de tekst die je in je hebt gedefinieerd.

Wat gebeurt er als je nu de test draait?

Zal ik je helpen de te controleren om er zeker van te zijn dat SET_STEP ook echt de activeStep invult in de state?