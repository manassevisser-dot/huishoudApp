# CODE — Tijdslijn
Belangrijkste ontwikkelstappen gereconstrueerd uit `MIJN_CODE.code.txt`.

## 1. Start: Aliassen & moduleNameMapper opzetten
**Bronpositie**: regel-index ~8

```text
```

```
          alias: {
```

```
```

## 2. Phoenix Audit: consoles vervangen door Logger
**Bronpositie**: regel-index ~95

```text
```

```
ℹ️ 🛡️ Start Audit (phoenix-check)...
```

```
```

## 3. Verhuizing: components naar src/ui/components/fields
**Bronpositie**: regel-index ~155

```text
```

```
src/ui/components/fields/MoneyField.tsx (De nieuwe Phoenix-architectuur?)
```

```
```

## 4. Repeater & MemberCard: swipe UI & calculateAge
**Bronpositie**: regel-index ~159

```text
```

```
Open src/ui/organisms/IncomeRepeater.tsx en kijk naar regel 5. Verander deze naar het absolute pad (alias) of het juiste relatieve pad.
Probeer dit (als je aliassen gebruikt):
import MoneyField from '@components/fields/MoneyField'; 
// OF als je de UI-stack volgt:
```

## 5. Wizard herbouw: Page props & controlled/uncontrolled
**Bronpositie**: regel-index ~232

```text
```

```
Dit is een klassieke React Native testfout. De WizardPage gebruikt de hook useSafeAreaInsets(), maar in de testomgeving bestaat de "Safe Area Context" niet.
```

```bash
```

## 6. Testfixes: SafeArea & Providers
**Bronpositie**: regel-index ~236

```text
```

```bash
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, next: 0, right: 0, bottom: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
```
```

## 7. Dedup script: MD5 checks en cleanup
**Bronpositie**: regel-index ~825

```text
```

```ts
    other_path=$(find src -type f -name "$filename" ! -path "src/ui/*" ! -path "*/node_modules/*" ! -path "src/Tempwizard/*" | head -n 1)
```

```bash
```

## 8. Brug fix: module.exports = logger voor Node require
**Bronpositie**: regel-index ~879

```text
```

```
Je vraagt naar de brug. In onze architectuur is "De Brug" (The Bridge) waarschijnlijk de log_bridge.sh of de logica in de Logger-service die de brug slaat tussen:
De Bash-wereld (je Phoenix-scripts, audit, dedup).
De TypeScript-wereld (je React Native app, de Orchestrator).
Het doel van de brug is dat de foutmeldingen in je app (zoals die in de Orchestrator) dezelfde taal spreken en dezelfde formatting gebruiken als de scripts in je terminal.
```

## 9. SSOT Mapping: WIZARD_KEYS/DATA_KEYS
**Bronpositie**: regel-index ~2848

```text
```

```ts
import { WIZARD_KEYS, WizardPageId } from '@domain/constants/DataKeys';
```

```
```

## 10. Reducer refactor: toCents/fromCents & UPDATE_ARRAY_ITEM
**Bronpositie**: regel-index ~3336

```text

```
// ... de logica met .slice() en .map()
};// 2. REDUCER (In context/formReducer.ts)export const formReducer = (state, action) => {
switch (action.type) {
```

```

## 11. Financieel overzicht: computePhoenixSummary & selectors
**Bronpositie**: regel-index ~5058

```text
import { View, ScrollView, RefreshControl } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { useFormContext } from '@app/context/FormContext';
import { selectFinancialSummaryVM } from '@selectors/financialSelectors';
import { FinancialSummary } from '@ui/components/FinancialSummary';
```

```
