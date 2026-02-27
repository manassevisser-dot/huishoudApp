# Orchestrator Interfaces

## 🎯 Verantwoordelijkheid

De interfaces-map definieert de **port-contracten** voor alle orchestrators. Ze zijn de formele scheiding tussen wat een orchestrator belooft te doen en hoe het gedaan wordt. Consumers (zoals `MasterOrchestrator`) importeren altijd de interface, nooit de concrete implementatie — dit maakt uitwisseling en testen mogelijk zonder aanpassingen aan consumers.

Alle interfaces zijn **pure TypeScript-shapes**: geen logica, geen state, geen side effects.

---

## 🏗️ Architectuur

- **Layer**: Application (Interface / Port)
- **Pattern**: Hexagonal Architecture — Port-Adapter
- **Afhankelijkheidsrichting**: Interfaces importeren alleen domain-types (`FormState`, `Theme`, `PrimitiveType`). Orchestrators implementeren interfaces; consumers importeren interfaces.

```
MasterOrchestrator
  ├── IBusinessOrchestrator   ← BusinessManager implementeert
  ├── IDataOrchestrator       ← DataManager / ImportOrchestrator
  ├── INavigationOrchestrator ← NavigationOrchestrator
  ├── IThemeOrchestrator      ← ThemeOrchestrator
  ├── IUIOrchestrator         ← UIOrchestrator
  ├── IValidationOrchestrator ← ValidationOrchestrator
  └── IValueOrchestrator      ← ValueOrchestrator
```

---

## 📋 Contract / API

### `IBusinessOrchestrator`

Berekent afgeleide ViewModels uit ruwe `FormState`. Pure transformatie — muteert de state niet.

| Methode | Signature | Beschrijving |
|---|---|---|
| `prepareFinancialViewModel` | `(state: FormState) => FinancialSummaryVM` | Aggregeert inkomsten/uitgaven naar geformatteerde display-strings |

**Types:**
- `FinancialSummaryVM`: `{ totalIncomeDisplay, totalExpensesDisplay, netDisplay }` — alle waarden zijn pre-geformatteerde strings voor directe UI-weergave.

---

### `IDataOrchestrator`

Poortwachter voor CSV-import. Garandeert een voorspelbaar `ImportResult`-object terug, inclusief foutpaden.

| Methode | Signature | Beschrijving |
|---|---|---|
| `processCsvImport` | `(params: { csvText, state }) => ImportResult` | Verwerkt CSV-tekst naar transacties + research-data |

**Types:**
- `ImportResult`: discriminated union — `ImportSuccess | ImportEmpty | ImportError`. Altijd `status`-veld aanwezig.
- `ResearchProcessor`: sub-contract voor de engine die leden + CSV + setup-data aggregeert naar `local` (app) en `research` (analytics) output.
- `ImportStatusValue`: `'success' | 'empty' | 'error'`

---

### `INavigationOrchestrator`

Ontkoppelt UI-componenten van routeringslogica. UI spreekt intenties uit (`goToSettings`), orchestrator handelt de state-update af.

| Methode | Beschrijving |
|---|---|
| `getCurrentScreenId()` | Huidige actieve scherm-ID |
| `canNavigateNext()` | Guard: mag de gebruiker naar de volgende stap? |
| `navigateNext()` / `navigateBack()` | Stap-navigatie in wizard-flow |
| `startWizard()` | Initialiseert lineaire wizard-flow |
| `goToDashboard()` / `goToOptions()` / `goToSettings()` | Directe scherm-navigatie |
| `goToCsvUpload()` / `goToReset()` / `goToCsvAnalysis()` / `goToUndo()` | Feature-scherm navigatie |
| `goBack()` | Terug naar vorig scherm via `previousScreenId` |

**Term-definities:**
- `canNavigateNext`: Guard-conditie die valideert of de huidige stap volledig ingevuld is. Autoriteit ligt bij de orchestrator — niet opnieuw implementeren in UI.
- `startWizard`: Initialiseert de lineaire flow voor het aanmaken van een nieuw huishoudprofiel (LANDING → WIZARD_SETUP_HOUSEHOLD).

---

### `IThemeOrchestrator`

Brug tussen persistente opslag (AsyncStorage) en actieve UI-weergave. Biedt zowel async I/O als synchrone getter voor performante renders.

| Methode | Signature | Beschrijving |
|---|---|---|
| `loadTheme()` | `() => Promise<Theme>` | Initialiseert thema vanuit AsyncStorage |
| `setTheme(theme)` | `(theme: Theme) => Promise<void>` | Persisteert thema + triggert UI-update |
| `getTheme()` | `() => Theme` | Synchrone getter voor huidige thema-waarde |
| `onThemeChange(callback)` | `(cb: (theme: Theme) => void) => void` | Observer-registratie voor React-state koppeling |

**Term-definities:**
- `onThemeChange`: Observer-patroon callback — registreer in `ThemeProvider.useEffect()` zodat `setTheme()` automatisch een re-render triggert.
- `Theme`: `'light' | 'dark'` — gedefinieerd in `@domain/constants/Colors`.

---

### `IUIOrchestrator`

Assembleert volledig gestylde screen view models op basis van een scherm-ID.

| Methode | Signature | Beschrijving |
|---|---|---|
| `buildScreen(screenId)` | `(screenId: string) => StyledScreenVM` | Bouwt compleet en gestyled screen view model |

> **Let op**: `MasterOrchestrator` gebruikt `UIOrchestrator` direct (niet via deze interface) vanwege `buildRenderScreen()` dat niet op `IUIOrchestrator` staat. Zie `MasterOrchestrator.ts` voor details.

---

### `IValidationOrchestrator`

Centrale interface voor validatie op veld-, sectie- en grens-niveau. Dwingt een consistente foutstructuur af voor de hele applicatie.

| Methode | Signature | Beschrijving |
|---|---|---|
| `validateSection` | `(sectionId, formData) => SectionValidationResult` | Geaggregeerde sectie-validatie (gebruikt door NavigationOrchestrator voor `canNavigateNext`) |
| `validateField` | `(fieldId, value) => string \| null` | Real-time veld-validatie voor UI-feedback |
| `validateAtBoundary` | `(fieldId, value) => string \| null` | Strikte type-check aan systeemgrens |

**Types:**
- `ValidationSeverity`: `'error' | 'warning' | 'info'` — ernst-gradatie per fout.
- `ValidationError`: `{ message, severity, code? }` — uniforme foutstructuur.
- `SectionValidationResult`: `{ isValid, errorFields: string[], errors: Record<string, ValidationError> }`.

---

### `IValueOrchestrator`

Levert een getypt `ValueViewModel` per veld-ID — inclusief primitiveType en eventuele opties.

| Methode | Signature | Beschrijving |
|---|---|---|
| `getValueModel(fieldId)` | `(fieldId: string) => ValueViewModel \| null` | Haalt waarde + type + opties op voor een veld |

**Types:**
- `ValueViewModel`: `{ fieldId, value, primitiveType: PrimitiveType, options?: readonly string[] }`.

---

## 💡 Best Practices

- Voeg nieuwe schermen toe aan de applicatie? → Extend `INavigationOrchestrator` met de bijbehorende `goTo`-methode
- Nieuwe importbronnen (naast CSV)? → Extend `ImportResult` met een nieuw sub-type; bewaar de discriminated union
- Implementaties van `IBusinessOrchestrator` mogen alleen lezen uit `FormState` — nooit muteren
- `IThemeOrchestrator.getTheme()` is de synchrone getter voor renders; gebruik `loadTheme()` alleen bij initialisatie
- `validateSection` is de autoriteit voor `canNavigateNext` — implementeer deze logica niet opnieuw in de UI

---

## 🔗 Gerelateerd

- [`MasterOrchestrator`](../MasterOrchestrator.ts) — enige consumer van alle interfaces
- [`ValidationOrchestrator`](../ValidationOrchestrator.ts) — implementeert `IValidationOrchestrator`
- [`NavigationOrchestrator`](../NavigationOrchestrator.ts) — implementeert `INavigationOrchestrator`
- [`validateAtBoundary`](../../../adapters/validation/validateAtBoundary.ts) — gebruikt door `IValidationOrchestrator`
- [`MasterOrchestratorAPI`](../../types/MasterOrchestratorAPI.ts) — publieke API voor UI-consumers
