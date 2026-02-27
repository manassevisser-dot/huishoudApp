# UI Styles

## 🎯 Verantwoordelijkheid

De `styles`-map is de assemblagebrug tussen de domeinlaag (stijldefinities in `@domain/styles`) en React Native's `StyleSheet`-API. De primaire export is de `useAppStyles`-hook, die elk UI-component een volledig gecached, thema-bewust stylesheet geeft.

---

## 🏗️ Architectuur

- **Layer**: UI (Style Root)
- **Pattern**: Factory + Cache (per thema)
- **Afhankelijkheidsrichting**: `useAppStyles` → `@domain/styles/primitives` (make-functies), `@ui/kernel` (Colors, Tokens), `@ui/providers/ThemeProvider`

```
@domain/styles/primitives/
  Fields.ts       → makeForms(c)
  Layout.ts       → makeLayout(c)
  Buttons.ts      → makeButtons(c)
  … (13 modules)
          │
          ▼
  useAppStyles.ts / getAppStyles(theme)
    1. spread alle make…-resultaten → assembled
    2. applyShadows(assembled, colors) → withShadows
    3. StyleSheet.create(withShadows) → gecached per thema
          │
          ▼
  Component: const { styles, colors, Tokens } = useAppStyles()
```

---

## 📋 Contract / API

### `useAppStyles()`

```typescript
function useAppStyles(): { styles: AppStyles; colors: ColorScheme; Tokens: typeof Tokens }
```

Retourneert het gecachede stylesheet, de actieve kleurset en de design-tokens. Wordt **alleen in React-componenten** aangeroepen.

### `getAppStyles(theme)`

```typescript
function getAppStyles(theme: Theme): AppStyles
```

De onderliggende factory — bruikbaar buiten React-context (bijv. in tests). Cacht per thema; bij hetzelfde thema wordt de cache teruggegeven zonder herberekening.

### `AppStyles`

```typescript
type AppStyles = ReturnType<typeof getAppStyles>
```

Afgeleid type van alle geassembleerde stijlen. Exporteer dit type als je het als parameter wilt doorgeven (bijv. in `entry.mappers.ts`).

---

## 📦 Geassembleerde stijlmodules

| Module | make-functie | Sleutelvoorbeelden |
|---|---|---|
| Layout | `makeLayout` | `container`, `screenContainer`, `inputContainer` |
| Forms | `makeForms` | `entryLabel`, `entryContainer`, `input`, `moneyRow` |
| Header | `makeHeader` | `header`, `headerTitle` |
| Buttons | `makeButtons` | `button`, `buttonPrimary`, `buttonDisabled` |
| Cards | `makeCards` | `card`, `cardHeader` |
| Chips | `makeChips` | `chip`, `chipSelected` |
| Dashboard | `makeDashboard` | `dashboardCard`, `dashboardValue` |
| Summary | `makeSummary` | `summaryRow`, `summaryLabel` |
| Typography | `makeTypography` | `title`, `subtitle`, `bodyText` |
| Alerts | `makeAlerts` | `alertSuccess`, `alertError` |
| Toggles | `makeToggles` | `toggleContainer`, `toggleLabel` |
| Checkboxes | `makeCheckboxes` | `checkboxRow`, `checkboxLabel` |
| Helpers | `makeHelpers` | `spacer`, `divider` |
| Containers | `makeContainers` | `collapsibleContainer`, `collapsibleContent` |

> **Nieuw module toevoegen:** maak een `make…`-functie in `@domain/styles/primitives/`, importeer en spread in `getAppStyles`.

---

## 💡 Best Practices

**Stijldefinities horen in `@domain/styles`, niet hier.**
`useAppStyles` orkestreert alleen de assemblage. Wijzigingen aan de kleur van een knop horen in `Buttons.ts`, niet in dit bestand.

**Cache is per thema — niet globaal flushen.**
Bij een thema-wissel berekent `getAppStyles` automatisch een nieuwe entry. Handmatig flushen is niet nodig en niet ondersteund.

**`AppStyles` als parametertype gebruiken:**

```typescript
import type { AppStyles } from '@ui/styles/useAppStyles';

function myMapper(entry: RenderEntryVM, styles: AppStyles) {
  return styles.inputContainer; // volledig getypt
}
```

**`PlatformStyles.applyShadows` is de enige RN-platform stap.**
Alle `make…`-functies zijn puur (geen `Platform.OS`-checks). Schaduwen worden in `getAppStyles` stap 2 toegevoegd.

---

## 🧩 Voorbeelden

```typescript
// Standaard gebruik in een component
const { styles, colors, Tokens } = useAppStyles();
<View style={styles.inputContainer}>
  <Text style={styles.entryLabel}>{label}</Text>
</View>

// Buiten React-context (test of factory)
import { getAppStyles } from '@ui/styles/useAppStyles';
const styles = getAppStyles('light');
expect(styles.inputContainer).toBeDefined();

// Doorgeven als parameter
import type { AppStyles } from '@ui/styles/useAppStyles';
const vm = toCounterViewModel(entry, styles);
```

---

## 🔗 Gerelateerd

- [`StyleRegistry`](../../domain/registry/StyleRegistry.ts) — re-exporteert alle make-functies
- [`Fields.ts`](../../domain/styles/primitives/Fields.ts) — formulier-stijlen (`entryLabel`, `inputContainer`)
- [`PlatformStyles.ts`](./PlatformStyles.ts) — shadow-implementatie per platform
- [`ThemeProvider`](../providers/ThemeProvider.ts) — levert het actieve thema aan `useAppStyles`
- [`entries/README.md`](../entries/README.md) — consument van `AppStyles` via mappers
