**Geëxporteerd:** 4-1-2026, 16:12:43
**Aantal berichten:** 4

---
**User:**

| Directory/File | Status | Priority |
| --- | --- | --- |
| src/config/ | 0% | Low: Mostly static strings and feature flags. |
| src/containers/ | 0% | High: Logic-heavy components like AdultsCounter need unit tests. |
| src/ui/screens/CSV/ | 23% | High: CsvUploadScreen is complex; missing coverage for line 34-103 (likely the upload logic). |
| src/ui/components/fields/ | ~28% | Medium: DateField and MoneyInput have very low coverage and are prone to bugs. |

```
moet transacties laden en de omschrijvingen tonen
```

```
it('moet transacties laden en de omschrijvingen tonen', async () => {
  // your test code
}, 10000); // Set to 10 seconds
```

```
it('moet transacties laden en de omschrijvingen tonen', async () => {
  // your test code
}, 10000); // Set to 10 seconds
```

```
// Ensure your service mock resolves
jest.spyOn(transactionService, 'getTransactions').mockResolvedValue(mockData);
```

```
// Ensure your service mock resolves
jest.spyOn(transactionService, 'getTransactions').mockResolvedValue(mockData);
```

```
ThemeContext.tsx
```

```
storageShim.ts
```

```
UndoScreen.test.tsx
```

```
AdultsCounter.tsx
```

- The component is waiting for an async operation (like a mock API call) that never resolves.
- The test involves heavy rendering or multiple waitFor calls that stack up.
- There is an infinite loop in a useEffect or a state update.

| - (Lines 24-27 | 34-38): Likely edge cases for theme switching. |
| --- | --- |
| - logger.ts (Lines 13-21 | 26-32): The error handling/logging logic isn't being triggered in tests. |

npm test -- --coverage

> test

> jest --coverage

 PASS  src/services/__tests__/idempotency.test.ts (5.701 s)

 PASS  src/services/__tests__/migration.members.test.ts

 PASS  src/logic/__tests__/finance.test.ts

 PASS  src/services/__tests__/privacyHelpers.test.ts

 PASS  src/utils/__tests__/date.test.ts

 PASS  src/ui/screens/Wizard/pages/__tests__/wizardConfigs.test.ts

 PASS  src/utils/__tests__/frequency.test.ts

 PASS  src/utils/__tests__/numbers.test.ts

 PASS  src/app/hooks/__tests__/useAppOrchestration.test.tsx

 PASS  src/selectors/__tests__/householdSelectors.test.ts

 PASS  src/services/__tests__/csvService.test.tsx

 PASS  src/logic/__tests__/export.test.ts

 FAIL  src/ui/screens/Daily/__tests__/UndoScreen.test.tsx (12.544 s)

  ● UndoScreen Integratie Tests › moet transacties laden en de omschrijvingen tonen (met snapshot)

    thrown: "Exceeded timeout of 5000 ms for a test.

    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jes

tjs.io/docs/api#testname-fn-timeout."

      40 |   afterEach(cleanup);

      41 |

    > 42 |   it('moet transacties laden en de omschrijvingen tonen (met snapshot)', async () => {

         |   ^

      43 |     const mockData = [

      44 |       { id: '1', amount: 12.5, description: 'Boodschappen' },

      45 |       { id: '2', amount: 45.0, description: 'Tanken' },

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:42:3

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:35:1)

 PASS  src/app/context/__test__/formReducer.test.ts

 PASS  src/services/__tests__/csvService.integration.test.ts

 PASS  src/__tests__/WAI009_FocusManagement.test.tsx

 PASS  src/services/__tests__/migrationService.test.ts

 PASS  src/utils/__tests__/validation.test.ts

 PASS  src/services/__tests__/householdAlign.test.ts

 PASS  src/utils/__tests__/conditions.test.ts

 PASS  src/__tests__/ScreenSanity.test.tsx

 PASS  src/services/__tests__/storage.test.ts

 PASS  src/ui/screens/Wizard/__tests__/WizardController.test.tsx

 PASS  src/services/__tests__/storageShim.test.ts

 PASS  src/__tests__/LandingScreen_Isolation.test.tsx

 PASS  src/domain/__tests__/household.test.ts

 PASS  src/services/__tests__/dataOrchestrator.test.tsx

 PASS  src/services/__tests__/storage.migration.test.ts

 PASS  src/selectors/__tests__/financialFlow.test.ts

 PASS  src/__tests__/App.projector.test.tsx

 PASS  src/state/schemas/__tests__/schemas.test.ts

 PASS  src/services/__tests__/migration.fixture.test.ts

 PASS  src/domain/__tests__/evaluateDomainRules.test.ts

 PASS  src/ui/styles/__tests__/useAppStyles.test.ts

 PASS  src/ui/components/__tests__/InputCounter.test.tsx

 PASS  src/__tests__/CoreSanity.test.tsx

 PASS  src/utils/__tests__/ping.test.ts

------------------------------|---------|----------|---------|---------|-------------------------

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

------------------------------|---------|----------|---------|---------|-------------------------

All files                     |   79.54 |    73.92 |   77.87 |   80.31 |

 src                          |     100 |      100 |     100 |     100 |

  App.tsx                     |     100 |      100 |     100 |     100 |

 src/app/context              |   77.35 |    76.19 |      80 |   78.84 |

  FormContext.tsx             |      90 |       75 |     100 |     100 | 32

  ThemeContext.tsx            |   69.56 |    66.66 |      80 |   69.56 | 24-27,34-38,48

  WizardContext.tsx           |   66.66 |    66.66 |      50 |   66.66 | 49-53

  formReducer.ts              |     100 |      100 |     100 |     100 |

 src/app/hooks                |     100 |    94.11 |     100 |     100 |

  useAppOrchestration.ts      |     100 |    94.11 |     100 |     100 | 28

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

 src/domain/rules             |     100 |      100 |     100 |     100 |

  evaluateDomainRules.ts      |     100 |      100 |     100 |     100 |

 src/logic                    |   96.96 |    94.11 |     100 |     100 |

  export.ts                   |     100 |     87.5 |     100 |     100 | 29

  finance.ts                  |     100 |      100 |     100 |     100 |

  householdLogic.ts           |   92.85 |    91.66 |     100 |     100 | 21

 src/navigation               |       0 |        0 |       0 |       0 |

  Navigator.tsx               |       0 |        0 |       0 |       0 | 11-20

 src/selectors                |     100 |      100 |     100 |     100 |

  financialSelectors.ts       |     100 |      100 |     100 |     100 |

  householdSelectors.ts       |     100 |      100 |     100 |     100 |

 src/services                 |   88.93 |    80.66 |   91.07 |    89.6 |

  csvService.ts               |    93.1 |     87.5 |    87.5 |   95.83 | 73

  dataOrchestrator.ts         |    91.3 |       55 |     100 |    91.3 | 80-81

  dataProcessor.ts            |    82.6 |    71.87 |      80 |    82.6 | 28,31,37,49

  householdAlign.ts           |   96.42 |    64.28 |     100 |      95 | 56

  logger.ts                   |   47.05 |    27.27 |      50 |      50 | 13-21,26-32

  migrationService.ts         |     100 |    92.68 |     100 |     100 | 40-41,50

  privacyHelpers.ts           |   97.95 |    95.45 |     100 |     100 | 18,21,63

  storage.ts                  |     100 |       92 |     100 |     100 | 14,19

  storageShim.ts              |    62.5 |       50 |   66.66 |    62.5 | 15,27,36-43

  transactionService.ts       |     100 |    97.22 |     100 |     100 | 27

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

 src/test-utils/factories     |      90 |    76.92 |   83.33 |   88.88 |

  csvFactory.ts               |      60 |      100 |      50 |      60 | 9-19

  memberFactory.ts            |     100 |    73.68 |     100 |     100 | 9-10,32-40

  stateFactory.ts             |     100 |    85.71 |     100 |     100 | 45

 src/test-utils/perf          |       0 |        0 |       0 |       0 |

  measure.ts                  |       0 |        0 |       0 |       0 | 7-15

 src/test-utils/render        |   45.45 |    27.77 |   44.44 |   47.36 |

  providers.tsx               |      40 |        0 |   66.66 |   42.85 | 34-42

  renderers.tsx               |      50 |       50 |   33.33 |      50 | 48-57,62-63

 src/test-utils/utils         |       0 |        0 |       0 |       0 |

  name.ts                     |       0 |        0 |       0 |       0 | 7-8

 src/ui/components            |   33.33 |        0 |   33.33 |   35.29 |

  FieldRenderer.tsx           |       0 |        0 |       0 |       0 | 11-31

  FinancialSummary.tsx        |     100 |      100 |     100 |     100 |

 src/ui/components/fields     |   28.04 |    27.05 |      25 |   28.76 |

  ChipButton.tsx              |   33.33 |        0 |       0 |   33.33 | 20-22

  ConditionalField.tsx        |    8.33 |        0 |       0 |    8.33 | 18-37

  DateField.tsx               |    12.9 |        0 |       0 |   14.81 | 18-21,25-29,34-37,49-82

  FormField.tsx               |   57.14 |       80 |      25 |   57.14 | 17,30-38

  InputCounter.tsx            |    87.5 |      100 |      75 |     100 |

  MoneyField.tsx              |      50 |    33.33 |      50 |      50 | 31-32

  MoneyInput.tsx              |    7.14 |        0 |       0 |    8.33 | 21-44

  ToggleSwitch.tsx            |     100 |    66.66 |     100 |     100 | 25-31

  index.ts                    |       0 |        0 |       0 |       0 |

 src/ui/navigation            |   83.33 |       75 |     100 |   83.33 |

  MainNavigator.tsx           |   83.33 |       75 |     100 |   83.33 | 15

 src/ui/screens/CSV           |   23.33 |    22.22 |      25 |   23.33 |

  CsvUploadScreen.tsx         |   23.33 |    22.22 |      25 |   23.33 | 34-103

 src/ui/screens/Daily         |     100 |      100 |     100 |     100 |

  UndoScreen.tsx              |     100 |      100 |     100 |     100 |

 src/ui/screens/DailyInput    |     100 |      100 |      50 |     100 |

  DailyInputScreen.tsx        |     100 |      100 |      50 |     100 |

 src/ui/screens/Dashboard     |     100 |      100 |     100 |     100 |

  DashboardScreen.tsx         |     100 |      100 |     100 |     100 |

 src/ui/screens/Options       |     100 |      100 |     100 |     100 |

  OptionsScreen.tsx           |     100 |      100 |     100 |     100 |

 src/ui/screens/Reset         |      75 |      100 |   33.33 |      75 |

  ResetScreen.tsx             |      75 |      100 |   33.33 |      75 | 18,29

 src/ui/screens/Settings      |   85.71 |    33.33 |      50 |   85.71 |

  SettingsScreen.tsx          |   85.71 |    33.33 |      50 |   85.71 | 38

 src/ui/screens/Wizard        |      96 |    86.36 |     100 |   95.91 |

  CriticalErrorScreen.tsx     |     100 |      100 |     100 |     100 |

  LandingScreen.tsx           |    92.3 |       75 |     100 |    92.3 | 28

  SplashScreen.tsx            |     100 |      100 |     100 |     100 |

  WelcomeWizard.tsx           |     100 |      100 |     100 |     100 |

  WizardController.tsx        |     100 |      100 |     100 |     100 |

  WizardPage.tsx              |   93.33 |    84.61 |     100 |   92.85 | 41

 src/ui/screens/Wizard/pages  |     100 |      100 |     100 |     100 |

  1setupHousehold.config.ts   |     100 |      100 |     100 |     100 |

  2detailsHousehold.config.ts |     100 |      100 |     100 |     100 |

  3incomeDetails.config.ts    |     100 |      100 |     100 |     100 |

  4fixedExpenses.config.ts    |     100 |      100 |     100 |     100 |

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

 src/utils                    |   96.92 |    92.18 |     100 |    99.5 |

  conditions.ts               |     100 |      100 |     100 |     100 |

  csvHelper.ts                |      95 |       90 |     100 |     100 | 12

  date.ts                     |   94.33 |    90.54 |     100 |    98.9 | 101

  frequency.ts                |     100 |      100 |     100 |     100 |

  numbers.ts                  |     100 |    93.93 |     100 |     100 | 8,61

  objects.ts                  |     100 |     90.9 |     100 |     100 | 8

  ping.ts                     |     100 |      100 |     100 |     100 |

  strings.ts                  |     100 |    33.33 |     100 |     100 | 8-9

  validation.ts               |     100 |    94.87 |     100 |     100 | 36,52

------------------------------|---------|----------|---------|---------|-------------------------

=============================== Coverage summary ===============================

Statements   : 79.54% ( 770/968 )

Branches     : 73.92% ( 587/794 )

Functions    : 77.87% ( 183/235 )

Lines        : 80.31% ( 714/889 )

================================================================================

Summary of all failing tests

 FAIL  src/ui/screens/Daily/__tests__/UndoScreen.test.tsx (12.544 s)

  ● UndoScreen Integratie Tests › moet transacties laden en de omschrijvingen tonen (met snapshot)

    thrown: "Exceeded timeout of 5000 ms for a test.

    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jes

tjs.io/docs/api#testname-fn-timeout."

      40 |   afterEach(cleanup);

      41 |

    > 42 |   it('moet transacties laden en de omschrijvingen tonen (met snapshot)', async () => {

         |   ^

      43 |     const mockData = [

      44 |       { id: '1', amount: 12.5, description: 'Boodschappen' },

      45 |       { id: '2', amount: 45.0, description: 'Tanken' },

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:42:3

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:35:1)

Test Suites: 1 failed, 36 passed, 37 total

Tests:       1 failed, 225 passed, 226 total

Snapshots:   5 passed, 5 total

Time:        51.011 s

Ran all test suites.

It looks like your test suite is in good shape overall with 79.54% coverage, but you have one specific bottleneck: a timeout failure in your integration tests for the UndoScreen.

Here is a breakdown of why this is happening and how to fix it.

1. The Immediate Failure: Timeout

The test is exceeding the default Jest timeout of 5000ms. This usually happens in integration tests because:

The Quick Fix

You can increase the timeout for this specific test by adding a third argument to the it function:

TypeScript
The Better Fix (Recommended)

Check if you are using waitFor from React Testing Library correctly. If you are awaiting something that never appears, the test will hang until it hits the timeout. Ensure your mocks resolve immediately:

TypeScript
2. Coverage Analysis

Your coverage is healthy, but there are some "dark zones" in your project that currently have 0% coverage. If you want to reach a higher threshold (e.g., 85-90%), focus on these areas next:

Exporteren naar Spreadsheets
3. Notable "Uncovered Lines"

The report shows specific lines you should target to bridge the gap:

Suggested Next Step

Would you like me to look at the code for to help you figure out why it's hanging, or should we look at writing a test for one of the 0% coverage files like ?

---

**User:**

```
UndoScreen.test.tsx
```

```
UndoScreen.tsx
```

```
TransactionService
```

```
// ✅ Correcte manier om te renderen in de test
let component;
await act(async () => {
  component = render(<UndoScreen />);
});
```

```
// ✅ Correcte manier om te renderen in de test
let component;
await act(async () => {
  component = render(<UndoScreen />);
});
```

```
// ❌ Oude manier (faalt vaak bij gesplitste tekst)
screen.getByText('Boodschappen');

// ✅ Nieuwe manier (vindt de tekst altijd)
await screen.findByText(/Boodschappen/i);
```

```
// ❌ Oude manier (faalt vaak bij gesplitste tekst)
screen.getByText('Boodschappen');

// ✅ Nieuwe manier (vindt de tekst altijd)
await screen.findByText(/Boodschappen/i);
```

```
waitForTextContaining
```

```
UndoScreen.test.tsx
```

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

![JSON-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/code)

de fix
TXT
gemini-cha...60104-1126
JSON

ik heb hier "de fix" en ons gesprek van gisteren in json

Denkproces tonen

Je hebt de bestanden succesvol ingeladen. In "de fix.txt" en het gesprek van gisteren staat de oplossing voor de hardnekkige problemen met de en de bijbehorende act() waarschuwingen.

Hier is de kern van de oplossing die we hebben vastgesteld:

1. De act() fix voor asynchrone renders

De act() waarschuwing ontstond omdat de useEffect in data ophaalt via de . In de test moet de render daarom in een act blok staan om de state-update correct af te handelen:

TypeScript
2. Tekst vinden in React Native (Regex)

React Native splitst tekst vaak op in verschillende nodes (bijv. door variabelen of valuta-tekens). Daarom gebruiken we een Regex met de i flag (case-insensitive) om de tekst robuust te vinden:

TypeScript
3. De Helper

In ons gesprek hebben we ook een krachtige helper-functie geïntroduceerd die diep in de component-tree graaft om alle tekstfragmenten aan elkaar te plakken. Dit loste de TypeScript foutcode 2345 op.

Resultaat

Door deze aanpassingen is de test suite hersteld naar een 100% Pass Rate en is de code coverage gestegen naar een solide 74%, waarmee je de "Grade B" voor de architectuur hebt veiliggesteld.

Wil je dat ik de volledige, samengevoegde code voor genereer op basis van deze specifieke fix?

Bronnen

---

**User:**

```
UndoScreen.test.tsx
```

```
src/ui/screens/Daily/__tests__/UndoScreen.test.tsx
```

```
import React from 'react';
import {
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react-native';
import { render } from '@test-utils/renderers'; // Gebruik je nieuwe render met providers
import { UndoScreen } from '../UndoScreen';
import { TransactionService } from '@services/transactionService';

| * Helper om robuust tekst te vinden | zelfs als React Native deze opsplitst |
| --- | --- |
| searchText: string |  |
| } | options); |

| jest.mock('@services/transactionService' | () => ({ |
| --- | --- |
| getAllTransactions: jest.fn() |  |
| clearAll: jest.fn() |  |
| } |  |

const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

| jest.clearAllMocks() |  |
| --- | --- |
| }) |  |

  afterEach(cleanup);

| ] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |

| render(<UndoScreen />) |  |
| --- | --- |
| }) |  |

| await waitForTextContaining('Boodschappen') |  |
| --- | --- |
| await waitForTextContaining('Tanken') |  |

| expect(screen.toJSON()).toMatchSnapshot() |  |
| --- | --- |
| }) |  |

  it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

| render(<UndoScreen />) |  |
| --- | --- |
| }) |  |

| const counter = await screen.findByText(/Laatste transacties:\s*0/i) |  |
| --- | --- |
| expect(counter).toBeTruthy() |  |
| expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy() |  |
| }) |  |

| const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |
| mockedTx.clearAll.mockResolvedValueOnce(undefined) |  |

| render(<UndoScreen />) |  |
| --- | --- |
| }) |  |

    // Wacht tot initieel geladen
    await screen.findByText(/Boodschappen/i);

| fireEvent.press(screen.getByRole('button', { name: /Verwijder Alles/i })) |  |
| --- | --- |
| }) |  |

| expect(mockedTx.clearAll).toHaveBeenCalled() |  |
| --- | --- |
| expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy() |  |
| }) |  |

    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});
```

```
import React from 'react';
import {
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act
} from '@testing-library/react-native';
import { render } from '@test-utils/renderers'; // Gebruik je nieuwe render met providers
import { UndoScreen } from '../UndoScreen';
import { TransactionService } from '@services/transactionService';

| * Helper om robuust tekst te vinden | zelfs als React Native deze opsplitst |
| --- | --- |
| searchText: string |  |
| } | options); |

| jest.mock('@services/transactionService' | () => ({ |
| --- | --- |
| getAllTransactions: jest.fn() |  |
| clearAll: jest.fn() |  |
| } |  |

const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

| jest.clearAllMocks() |  |
| --- | --- |
| }) |  |

  afterEach(cleanup);

| ] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |

| render(<UndoScreen />) |  |
| --- | --- |
| }) |  |

| await waitForTextContaining('Boodschappen') |  |
| --- | --- |
| await waitForTextContaining('Tanken') |  |

| expect(screen.toJSON()).toMatchSnapshot() |  |
| --- | --- |
| }) |  |

  it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

| render(<UndoScreen />) |  |
| --- | --- |
| }) |  |

| const counter = await screen.findByText(/Laatste transacties:\s*0/i) |  |
| --- | --- |
| expect(counter).toBeTruthy() |  |
| expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy() |  |
| }) |  |

| const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |
| mockedTx.clearAll.mockResolvedValueOnce(undefined) |  |

| render(<UndoScreen />) |  |
| --- | --- |
| }) |  |

    // Wacht tot initieel geladen
    await screen.findByText(/Boodschappen/i);

| fireEvent.press(screen.getByRole('button', { name: /Verwijder Alles/i })) |  |
| --- | --- |
| }) |  |

| expect(mockedTx.clearAll).toHaveBeenCalled() |  |
| --- | --- |
| expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy() |  |
| }) |  |

    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});
```

```
@test-utils/renderers
```

```
ThemeProvider
```

```
FormContext
```

```
screen.getByText(/Laatste transacties:\s*0/i)
```

```
waitForTextContaining
```

```
€ {item.amount}
```

```
["€ ", "12.5"]
```

```
import { render } from '@test-utils/renderers';
```

```
npm test src/ui/screens/Daily/__tests__/UndoScreen.test.tsx
```

| - Gecentreerde render: Door de render uit je te importeren | worden de en automatisch meegeleverd. Dit voorkomt dat je test crasht als je later stijlen of context-data aan de UndoScreen toevoegt. |
| --- | --- |
| - act() Wrappers: In je testlog (npm output) zag je timeouts. Vaak komt dit doordat asynchrone updates niet goed "gevangen" worden. Door de render en fireEvent in act() te plaatsen | dwing je Jest om alle updates af te handelen voordat de test verder gaat. |
| - Regex Matchers: De regel is veel sterker dan een normale string-match | omdat het niet uitmaakt of er extra spaties of witregels tussen de tekst en het getal staan. |
| - JSON Helper: De functie is je "geheime wapen". Omdat React Native de tekst vaak opbreekt in in de tree | vindt de standaard getByText dit soms niet. De stringify-methode vindt het altijd. |

- Zorg dat de import-path  exact klopt met waar je bestand staat.
- Draai de test opnieuw met . De timeout van 5000ms zou nu geen probleem meer moeten zijn.

import React from 'react';

import {

  render,

  screen,

  cleanup,

  fireEvent,

  waitFor

} from '@testing-library/react-native';

import { UndoScreen } from '../UndoScreen';

import { TransactionService } from '@services/transactionService';

// De helper die je eerder hebt aangemaakt

async function waitForTextContaining(

  searchText: string,

  options?: { timeout?: number }

): Promise<void> {

  await waitFor(() => {

    // We gebruiken de interne tree van screen om tekst te extraheren

    const allTexts = screen.toJSON();

    const stringified = JSON.stringify(allTexts);

    expect(stringified).toContain(searchText);

  }, options);

}

// 1. Mock de service

jest.mock('@services/transactionService', () => ({

  TransactionService: {

    getAllTransactions: jest.fn(),

    clearAll: jest.fn(),

  },

}));

const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

describe('UndoScreen Integratie Tests', () => {

  beforeEach(() => {

    jest.clearAllMocks();

  });

  afterEach(cleanup);

  it('moet transacties laden en de omschrijvingen tonen (met snapshot)', async () => {

    const mockData = [

      { id: '1', amount: 12.5, description: 'Boodschappen' },

      { id: '2', amount: 45.0, description: 'Tanken' },

    ];

    mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

    const { toJSON } = render(<UndoScreen />);

    // Wacht tot de tekst verschijnt met de robuuste helper [cite: 56, 60]

    await waitForTextContaining('Boodschappen');

    await waitForTextContaining('Tanken');

    // Snapshot pas maken als de UI 'settled' is [cite: 64, 84]

    expect(toJSON()).toMatchSnapshot();

  });

  it('moet omgaan met undefined data van de service', async () => {

    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

    render(<UndoScreen />);

    // Gebruik findBy om te wachten op de useEffect afhandeling [cite: 68, 77]

    const counter = await screen.findByText(/Laatste transacties:\s*0/i);

    expect(counter).toBeTruthy();

    expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy();

  });

  it('moet alle transacties verwijderen als op de knop wordt gedrukt', async () => {

    const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }];

    mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

    mockedTx.clearAll.mockResolvedValueOnce(undefined);

    render(<UndoScreen />);

    // Wacht tot initieel geladen [cite: 66, 77]

    await screen.findByText(/Boodschappen/i);

    // Actie: Verwijderen [cite: 63]

    fireEvent.press(screen.getByRole('button', { name: /Verwijder Alles/i }));

    // Wacht tot de service is aangeroepen EN de UI is bijgewerkt naar 0 [cite: 63, 66]

    await waitFor(() => {

      expect(mockedTx.clearAll).toHaveBeenCalled();

      expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy();

    });

    expect(screen.queryByText(/Boodschappen/i)).toBeNull();

  });

});

===========

import * as React from 'react';

import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { TransactionService } from '@services/transactionService';

export const UndoScreen: React.FC = () => {

  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {

    const fetchTransactions = async () => {

      const data = await TransactionService.getAllTransactions();

      setItems(data || []);

    };

    fetchTransactions();

  }, []);

  const handleClearAll = async () => {

    await TransactionService.clearAll?.();

    setItems([]);

  };

  return (

    <View style={{ padding: 20 }}>

      <Text style={{ fontSize: 18 }}>

        Laatste transacties: {items.length}

      </Text>

      {items.length === 0 ? (

        <Text style={{ marginTop: 8 }}>Geen recente transacties</Text>

      ) : (

        <ScrollView style={{ marginTop: 8 }}>

          {items.map((item) => (

            <View key={item.id} style={{ paddingVertical: 4 }}>

              {/* ✅ VOEG DIT TOE: De omschrijving zodat de test deze kan vinden */}

              <Text>{item.description}: € {item.amount}</Text>

            </View>

          ))}

        </ScrollView>

      )}

      <TouchableOpacity

        onPress={handleClearAll}

        accessibilityRole="button"

        style={{ marginTop: 20, backgroundColor: 'red', padding: 10, borderRadius: 5 }}

      >

        <Text style={{ color: 'white', textAlign: 'center' }}>Verwijder Alles</Text>

      </TouchableOpacity>

    </View>

  );

};

export default UndoScreen;

==============

import React from 'react';

import { render as rtlRender, RenderOptions as RTLRenderOptions, renderHook } from '@testing-library/react-native';

import { ThemeProvider } from '@app/context/ThemeContext';

import { FormContext } from '@app/context/FormContext';

import { FormState } from '@shared-types/form';

import { makePhoenixState } from '../factories/stateFactory';

// Voeg waitFor toe aan de lijst met imports

import {

  screen,

  waitFor, // <--- DEZE MOET ERBIJ

  // ... andere imports zoals fireEvent

} from '@testing-library/react-native';

export type RenderOptions = Omit<RTLRenderOptions, 'wrapper'> & {

  state?: FormState;

  dispatch?: jest.Mock;

};

// De hoofd-render functie

export function render(

  ui: React.ReactElement,

  { state, dispatch, ...rtlOptions }: RenderOptions = {}

) {

  const Wrapper = ({ children }: { children: React.ReactNode }) => {

    const contextValue = {

      state: state || makePhoenixState(),

      dispatch: dispatch || jest.fn(),

    };

    return (

      <ThemeProvider>

        <FormContext.Provider value={contextValue}>

          {children}

        </FormContext.Provider>

      </ThemeProvider>

    );

  };

  return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });

}

// Aliassen zodat alle verschillende tests blijven werken

export const renderWithState = render;

export function renderHookWithProviders<TProps, TResult>(

  callback: (props: TProps) => TResult,

  options: RenderOptions = {}

) {

  const { state, dispatch } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (

    <ThemeProvider>

      <FormContext.Provider value={{ state: state || makePhoenixState(), dispatch: dispatch || jest.fn() }}>

        {children}

      </FormContext.Provider>

    </ThemeProvider>

  );

  return renderHook(callback, { wrapper: Wrapper });

}

// Voeg dit toe aan je test-utils voor later

export const expectTextAsync = async (text: string | RegExp) => {

  await waitFor(() => {

    expect(screen.getByText(text)).toBeTruthy();

  }, { timeout: 2000 });

};

Gebruik dit als basis voor de nieuwe test

Dit is een uitstekende basis. Je hebt nu drie cruciale onderdelen samengevoegd: de robuuste test-logica met de nieuwe helper, de gecorrigeerde component die daadwerkelijk de data rendert, en de uitgebreide test-utils die zorgen voor een consistente render-omgeving (inclusief providers).

Hieronder vind je de geconsolideerde versie van die gebruikmaakt van je geüpdatete render utils en de specifieke fixes bevat om de timeout en act() waarschuwingen te voorkomen.

🚀 De Geconsolideerde Test:
TypeScript
Waarom dit werkt:

Checklist voor jou:

---

**User:**

```
Can't access .root on unmounted test renderer
```

```
@testing-library/react-native
```

```
await act(async () => { render(...) })
```

```
// ... imports blijven gelijk

describe('UndoScreen Integratie Tests', () => {
  // ... beforeEach/afterEach blijven gelijk

| ] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |

    // ✅ FIX 1: Verwijder de 'await act' om de render heen
    render(<UndoScreen />);

| await waitForTextContaining('Boodschappen') |  |
| --- | --- |
| await waitForTextContaining('Tanken') |  |

| expect(screen.toJSON()).toMatchSnapshot() |  |
| --- | --- |
| }) |  |

  it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

    // ✅ FIX 2: Gewoon direct renderen
    render(<UndoScreen />);

| const counter = await screen.findByText(/Laatste transacties:\s*0/i) |  |
| --- | --- |
| expect(counter).toBeTruthy() |  |
| expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy() |  |
| }) |  |

| const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |
| mockedTx.clearAll.mockResolvedValueOnce(undefined) |  |

    // ✅ FIX 3: Gewoon direct renderen
    render(<UndoScreen />);

    await screen.findByText(/Boodschappen/i);

| // Actie: Verwijderen (fireEvent heeft intern al act | maar mag eromheen blijven als het async is) |
| --- | --- |
| fireEvent.press(screen.getByRole('button' | { name: /Verwijder Alles/i })); |

| expect(mockedTx.clearAll).toHaveBeenCalled() |  |
| --- | --- |
| expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy() |  |
| }) |  |

    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});
```

```
// ... imports blijven gelijk

describe('UndoScreen Integratie Tests', () => {
  // ... beforeEach/afterEach blijven gelijk

| ] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |

    // ✅ FIX 1: Verwijder de 'await act' om de render heen
    render(<UndoScreen />);

| await waitForTextContaining('Boodschappen') |  |
| --- | --- |
| await waitForTextContaining('Tanken') |  |

| expect(screen.toJSON()).toMatchSnapshot() |  |
| --- | --- |
| }) |  |

  it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);

    // ✅ FIX 2: Gewoon direct renderen
    render(<UndoScreen />);

| const counter = await screen.findByText(/Laatste transacties:\s*0/i) |  |
| --- | --- |
| expect(counter).toBeTruthy() |  |
| expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy() |  |
| }) |  |

| const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }] |  |
| --- | --- |
| mockedTx.getAllTransactions.mockResolvedValueOnce(mockData) |  |
| mockedTx.clearAll.mockResolvedValueOnce(undefined) |  |

    // ✅ FIX 3: Gewoon direct renderen
    render(<UndoScreen />);

    await screen.findByText(/Boodschappen/i);

| // Actie: Verwijderen (fireEvent heeft intern al act | maar mag eromheen blijven als het async is) |
| --- | --- |
| fireEvent.press(screen.getByRole('button' | { name: /Verwijder Alles/i })); |

| expect(mockedTx.clearAll).toHaveBeenCalled() |  |
| --- | --- |
| expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy() |  |
| }) |  |

    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});
```

```
UndoScreen.test.tsx
```

```
UndoScreen.tsx
```

```
npm test src/ui/screens/Daily/__tests__/UndoScreen.test.tsx
```

npm test -- --coverage

> test

> jest --coverage

 FAIL  src/ui/screens/Daily/__tests__/UndoScreen.test.tsx

  ● UndoScreen Integratie Tests › moet transacties laden en de omschrijvingen tonen (met snapshot)

    Can't access .root on unmounted test renderer

      36 |     );

      37 |   };

    > 38 |   return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });

         |                   ^

      39 | }

      40 |

      41 | // Aliassen zodat alle verschillende tests blijven werken

      at Object.root (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17446:19)

      at buildRenderResult (node_modules/@testing-library/react-native/src/render.tsx:101:29)

      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:70:10)

      at render (node_modules/@testing-library/react-native/src/render.tsx:44:10)

      at render (src/test-utils/render/renderers.tsx:38:19)

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:54:13

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at callback (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

      at node_modules/@testing-library/react-native/src/act.ts:31:24

      at actImplementation (node_modules/react/cjs/react.development.js:814:22)

      at node_modules/@testing-library/react-native/src/act.ts:30:25

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:53:14)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● UndoScreen Integratie Tests › moet omgaan met undefined data van de service

    Can't access .root on unmounted test renderer

      36 |     );

      37 |   };

    > 38 |   return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });

         |                   ^

      39 | }

      40 |

      41 | // Aliassen zodat alle verschillende tests blijven werken

      at Object.root (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17446:19)

      at buildRenderResult (node_modules/@testing-library/react-native/src/render.tsx:101:29)

      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:70:10)

      at render (node_modules/@testing-library/react-native/src/render.tsx:44:10)

      at render (src/test-utils/render/renderers.tsx:38:19)

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:69:13

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at callback (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

      at node_modules/@testing-library/react-native/src/act.ts:31:24

      at actImplementation (node_modules/react/cjs/react.development.js:814:22)

      at node_modules/@testing-library/react-native/src/act.ts:30:25

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:68:14)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● UndoScreen Integratie Tests › moet alle transacties verwijderen als op de knop wordt gedrukt

    Can't access .root on unmounted test renderer

      36 |     );

      37 |   };

    > 38 |   return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });

         |                   ^

      39 | }

      40 |

      41 | // Aliassen zodat alle verschillende tests blijven werken

      at Object.root (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17446:19)

      at buildRenderResult (node_modules/@testing-library/react-native/src/render.tsx:101:29)

      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:70:10)

      at render (node_modules/@testing-library/react-native/src/render.tsx:44:10)

      at render (src/test-utils/render/renderers.tsx:38:19)

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:84:13

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at callback (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

      at node_modules/@testing-library/react-native/src/act.ts:31:24

      at actImplementation (node_modules/react/cjs/react.development.js:814:22)

      at node_modules/@testing-library/react-native/src/act.ts:30:25

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:83:14)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

 PASS  src/services/__tests__/idempotency.test.ts

 PASS  src/__tests__/App.projector.test.tsx

 PASS  src/services/__tests__/privacyHelpers.test.ts

 PASS  src/__tests__/ScreenSanity.test.tsx

 PASS  src/logic/__tests__/export.test.ts

 PASS  src/services/__tests__/migration.members.test.ts

 PASS  src/utils/__tests__/date.test.ts

 PASS  src/__tests__/CoreSanity.test.tsx

 PASS  src/__tests__/WAI009_FocusManagement.test.tsx

 PASS  src/ui/screens/Wizard/pages/__tests__/wizardConfigs.test.ts

 PASS  src/ui/components/__tests__/InputCounter.test.tsx

 PASS  src/services/__tests__/csvService.integration.test.ts

 PASS  src/utils/__tests__/numbers.test.ts

 PASS  src/selectors/__tests__/householdSelectors.test.ts

 PASS  src/app/hooks/__tests__/useAppOrchestration.test.tsx

 PASS  src/logic/__tests__/finance.test.ts

 PASS  src/__tests__/LandingScreen_Isolation.test.tsx

 PASS  src/utils/__tests__/ping.test.ts

 PASS  src/services/__tests__/csvService.test.tsx

 PASS  src/services/__tests__/migrationService.test.ts

 PASS  src/ui/screens/Wizard/__tests__/WizardController.test.tsx

 PASS  src/utils/__tests__/frequency.test.ts

 PASS  src/services/__tests__/storageShim.test.ts

 PASS  src/utils/__tests__/validation.test.ts

 PASS  src/app/context/__test__/formReducer.test.ts

 PASS  src/state/schemas/__tests__/schemas.test.ts

 PASS  src/utils/__tests__/conditions.test.ts

 PASS  src/selectors/__tests__/financialFlow.test.ts

 PASS  src/services/__tests__/dataOrchestrator.test.tsx

 PASS  src/services/__tests__/storage.test.ts

 PASS  src/services/__tests__/householdAlign.test.ts

 PASS  src/ui/styles/__tests__/useAppStyles.test.ts

 PASS  src/domain/__tests__/household.test.ts

 PASS  src/services/__tests__/storage.migration.test.ts

 PASS  src/domain/__tests__/evaluateDomainRules.test.ts

 PASS  src/services/__tests__/migration.fixture.test.ts

------------------------------|---------|----------|---------|---------|-------------------------

File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s

------------------------------|---------|----------|---------|---------|-------------------------

All files                     |   79.23 |    73.67 |   77.02 |   79.97 |

 src                          |     100 |      100 |     100 |     100 |

  App.tsx                     |     100 |      100 |     100 |     100 |

 src/app/context              |   77.35 |    76.19 |      80 |   78.84 |

  FormContext.tsx             |      90 |       75 |     100 |     100 | 32

  ThemeContext.tsx            |   69.56 |    66.66 |      80 |   69.56 | 24-27,34-38,48

  WizardContext.tsx           |   66.66 |    66.66 |      50 |   66.66 | 49-53

  formReducer.ts              |     100 |      100 |     100 |     100 |

 src/app/hooks                |     100 |    94.11 |     100 |     100 |

  useAppOrchestration.ts      |     100 |    94.11 |     100 |     100 | 28

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

 src/domain/rules             |     100 |      100 |     100 |     100 |

  evaluateDomainRules.ts      |     100 |      100 |     100 |     100 |

 src/logic                    |   96.96 |    94.11 |     100 |     100 |

  export.ts                   |     100 |     87.5 |     100 |     100 | 29

  finance.ts                  |     100 |      100 |     100 |     100 |

  householdLogic.ts           |   92.85 |    91.66 |     100 |     100 | 21

 src/navigation               |       0 |        0 |       0 |       0 |

  Navigator.tsx               |       0 |        0 |       0 |       0 | 11-20

 src/selectors                |     100 |      100 |     100 |     100 |

  financialSelectors.ts       |     100 |      100 |     100 |     100 |

  householdSelectors.ts       |     100 |      100 |     100 |     100 |

 src/services                 |   88.93 |    80.66 |   91.07 |    89.6 |

  csvService.ts               |    93.1 |     87.5 |    87.5 |   95.83 | 73

  dataOrchestrator.ts         |    91.3 |       55 |     100 |    91.3 | 80-81

  dataProcessor.ts            |    82.6 |    71.87 |      80 |    82.6 | 28,31,37,49

  householdAlign.ts           |   96.42 |    64.28 |     100 |      95 | 56

  logger.ts                   |   47.05 |    27.27 |      50 |      50 | 13-21,26-32

  migrationService.ts         |     100 |    92.68 |     100 |     100 | 40-41,50

  privacyHelpers.ts           |   97.95 |    95.45 |     100 |     100 | 18,21,63

  storage.ts                  |     100 |       92 |     100 |     100 | 14,19

  storageShim.ts              |    62.5 |       50 |   66.66 |    62.5 | 15,27,36-43

  transactionService.ts       |     100 |    97.22 |     100 |     100 | 27

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

 src/test-utils/factories     |      90 |    76.92 |   83.33 |   88.88 |

  csvFactory.ts               |      60 |      100 |      50 |      60 | 9-19

  memberFactory.ts            |     100 |    73.68 |     100 |     100 | 9-10,32-40

  stateFactory.ts             |     100 |    85.71 |     100 |     100 | 45

 src/test-utils/perf          |       0 |        0 |       0 |       0 |

  measure.ts                  |       0 |        0 |       0 |       0 | 7-15

 src/test-utils/render        |   45.45 |    27.77 |   44.44 |   47.36 |

  providers.tsx               |      40 |        0 |   66.66 |   42.85 | 34-42

  renderers.tsx               |      50 |       50 |   33.33 |      50 | 48-57,62-63

 src/test-utils/utils         |       0 |        0 |       0 |       0 |

  name.ts                     |       0 |        0 |       0 |       0 | 7-8

 src/ui/components            |   33.33 |        0 |   33.33 |   35.29 |

  FieldRenderer.tsx           |       0 |        0 |       0 |       0 | 11-31

  FinancialSummary.tsx        |     100 |      100 |     100 |     100 |

 src/ui/components/fields     |   28.04 |    27.05 |      25 |   28.76 |

  ChipButton.tsx              |   33.33 |        0 |       0 |   33.33 | 20-22

  ConditionalField.tsx        |    8.33 |        0 |       0 |    8.33 | 18-37

  DateField.tsx               |    12.9 |        0 |       0 |   14.81 | 18-21,25-29,34-37,49-82

  FormField.tsx               |   57.14 |       80 |      25 |   57.14 | 17,30-38

  InputCounter.tsx            |    87.5 |      100 |      75 |     100 |

  MoneyField.tsx              |      50 |    33.33 |      50 |      50 | 31-32

  MoneyInput.tsx              |    7.14 |        0 |       0 |    8.33 | 21-44

  ToggleSwitch.tsx            |     100 |    66.66 |     100 |     100 | 25-31

  index.ts                    |       0 |        0 |       0 |       0 |

 src/ui/navigation            |   83.33 |       75 |     100 |   83.33 |

  MainNavigator.tsx           |   83.33 |       75 |     100 |   83.33 | 15

 src/ui/screens/CSV           |   23.33 |    22.22 |      25 |   23.33 |

  CsvUploadScreen.tsx         |   23.33 |    22.22 |      25 |   23.33 | 34-103

 src/ui/screens/Daily         |      75 |       50 |      60 |      75 |

  UndoScreen.tsx              |      75 |       50 |      60 |      75 | 17-18,32

 src/ui/screens/DailyInput    |     100 |      100 |      50 |     100 |

  DailyInputScreen.tsx        |     100 |      100 |      50 |     100 |

 src/ui/screens/Dashboard     |     100 |      100 |     100 |     100 |

  DashboardScreen.tsx         |     100 |      100 |     100 |     100 |

 src/ui/screens/Options       |     100 |      100 |     100 |     100 |

  OptionsScreen.tsx           |     100 |      100 |     100 |     100 |

 src/ui/screens/Reset         |      75 |      100 |   33.33 |      75 |

  ResetScreen.tsx             |      75 |      100 |   33.33 |      75 | 18,29

 src/ui/screens/Settings      |   85.71 |    33.33 |      50 |   85.71 |

  SettingsScreen.tsx          |   85.71 |    33.33 |      50 |   85.71 | 38

 src/ui/screens/Wizard        |      96 |    86.36 |     100 |   95.91 |

  CriticalErrorScreen.tsx     |     100 |      100 |     100 |     100 |

  LandingScreen.tsx           |    92.3 |       75 |     100 |    92.3 | 28

  SplashScreen.tsx            |     100 |      100 |     100 |     100 |

  WelcomeWizard.tsx           |     100 |      100 |     100 |     100 |

  WizardController.tsx        |     100 |      100 |     100 |     100 |

  WizardPage.tsx              |   93.33 |    84.61 |     100 |   92.85 | 41

 src/ui/screens/Wizard/pages  |     100 |      100 |     100 |     100 |

  1setupHousehold.config.ts   |     100 |      100 |     100 |     100 |

  2detailsHousehold.config.ts |     100 |      100 |     100 |     100 |

  3incomeDetails.config.ts    |     100 |      100 |     100 |     100 |

  4fixedExpenses.config.ts    |     100 |      100 |     100 |     100 |

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

 src/utils                    |   96.92 |    92.18 |     100 |    99.5 |

  conditions.ts               |     100 |      100 |     100 |     100 |

  csvHelper.ts                |      95 |       90 |     100 |     100 | 12

  date.ts                     |   94.33 |    90.54 |     100 |    98.9 | 101

  frequency.ts                |     100 |      100 |     100 |     100 |

  numbers.ts                  |     100 |    93.93 |     100 |     100 | 8,61

  objects.ts                  |     100 |     90.9 |     100 |     100 | 8

  ping.ts                     |     100 |      100 |     100 |     100 |

  strings.ts                  |     100 |    33.33 |     100 |     100 | 8-9

  validation.ts               |     100 |    94.87 |     100 |     100 | 36,52

------------------------------|---------|----------|---------|---------|-------------------------

=============================== Coverage summary ===============================

Statements   : 79.23% ( 767/968 )

Branches     : 73.67% ( 585/794 )

Functions    : 77.02% ( 181/235 )

Lines        : 79.97% ( 711/889 )

================================================================================

Summary of all failing tests

 FAIL  src/ui/screens/Daily/__tests__/UndoScreen.test.tsx

  ● UndoScreen Integratie Tests › moet transacties laden en de omschrijvingen tonen (met snapshot)

    Can't access .root on unmounted test renderer

      36 |     );

      37 |   };

    > 38 |   return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });

         |                   ^

      39 | }

      40 |

      41 | // Aliassen zodat alle verschillende tests blijven werken

      at Object.root (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17446:19)

      at buildRenderResult (node_modules/@testing-library/react-native/src/render.tsx:101:29)

      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:70:10)

      at render (node_modules/@testing-library/react-native/src/render.tsx:44:10)

      at render (src/test-utils/render/renderers.tsx:38:19)

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:54:13

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at callback (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

      at node_modules/@testing-library/react-native/src/act.ts:31:24

      at actImplementation (node_modules/react/cjs/react.development.js:814:22)

      at node_modules/@testing-library/react-native/src/act.ts:30:25

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:53:14)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● UndoScreen Integratie Tests › moet omgaan met undefined data van de service

    Can't access .root on unmounted test renderer

      36 |     );

      37 |   };

    > 38 |   return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });

         |                   ^

      39 | }

      40 |

      41 | // Aliassen zodat alle verschillende tests blijven werken

      at Object.root (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17446:19)

      at buildRenderResult (node_modules/@testing-library/react-native/src/render.tsx:101:29)

      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:70:10)

      at render (node_modules/@testing-library/react-native/src/render.tsx:44:10)

      at render (src/test-utils/render/renderers.tsx:38:19)

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:69:13

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at callback (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

      at node_modules/@testing-library/react-native/src/act.ts:31:24

      at actImplementation (node_modules/react/cjs/react.development.js:814:22)

      at node_modules/@testing-library/react-native/src/act.ts:30:25

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:68:14)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

  ● UndoScreen Integratie Tests › moet alle transacties verwijderen als op de knop wordt gedrukt

    Can't access .root on unmounted test renderer

      36 |     );

      37 |   };

    > 38 |   return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });

         |                   ^

      39 | }

      40 |

      41 | // Aliassen zodat alle verschillende tests blijven werken

      at Object.root (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:17446:19)

      at buildRenderResult (node_modules/@testing-library/react-native/src/render.tsx:101:29)

      at renderInternal (node_modules/@testing-library/react-native/src/render.tsx:70:10)

      at render (node_modules/@testing-library/react-native/src/render.tsx:44:10)

      at render (src/test-utils/render/renderers.tsx:38:19)

      at src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:84:13

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at callback (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

      at node_modules/@testing-library/react-native/src/act.ts:31:24

      at actImplementation (node_modules/react/cjs/react.development.js:814:22)

      at node_modules/@testing-library/react-native/src/act.ts:30:25

      at Object.<anonymous> (src/ui/screens/Daily/__tests__/UndoScreen.test.tsx:83:14)

      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)

      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7

      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)

Test Suites: 1 failed, 36 passed, 37 total

Tests:       3 failed, 223 passed, 226 total

Snapshots:   5 passed, 5 total

Time:        31.861 s, estimated 46 s

Ran all test suites.

De foutmelding is een klassieker in . Het gebeurt wanneer je een render() uitvoert binnen een act() blok dat ook async is.

De oorzaak: Je render functie (uit je utils) voert een synchrone operatie uit, maar door de wordt de renderer intern alweer opgeruimd of in een ongeldige staat gebracht voordat de test library de "root" kan vastleggen.

De Fix

In React Native Testing Library hoef je de initiële render niet in een act te wrappen, zelfs niet als er een useEffect in zit. De library handelt dit intern af. De act is pas nodig bij interacties (zoals fireEvent) of handmatige updates.

Pas je testbestand als volgt aan:

TypeScript
Waarom dit de Coverage ook helpt:

Je ziet in je output dat de coverage nu op 79.97% Lines staat. Dat is extreem dicht bij de 80% grens!

Zodra deze slaagt, worden de lijnen 17-18 en 32 in (die nu als "Uncovered" in je tabel staan) groen gemarkeerd. Dit zal je waarschijnlijk net over die 80% grens tillen naar een Grade A status voor je test coverage.

Probeer het nu opnieuw: