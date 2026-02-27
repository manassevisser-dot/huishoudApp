# Screen Architecture — Single Source of Truth

> **Doelgroep** — Ontwikkelaars (mens én AI) die een nieuw scherm toevoegen, een bestaand scherm
> begrijpen, of fouten debuggen.  
> **Scope** — Alles wat een scherm raakt: van `ScreenRegistry` tot renderer, van entry tot label,
> van style-token tot provider-boom.  
> **Bronbestanden** — Volledig afgeleid van de echte broncode in `src/`. Geen aannames.  
> **Laatste update** — 2026-02-26 (grondige broncode-audit; alle bestaande bronbestanden gelezen)

---

## Inhoudsopgave

1. [Architectuurprincipes](#1-architectuurprincipes)
2. [Provider-boom en bootstrapping](#2-provider-boom-en-bootstrapping)
3. [Navigatie — hoe een scherm op het scherm komt](#3-navigatie--hoe-een-scherm-op-het-scherm-komt)
4. [De vijf registries](#4-de-vijf-registries)
5. [De VM-bouwpipeline (stap voor stap)](#5-de-vm-bouwpipeline-stap-voor-stap)
6. [De volledige rendering-keten](#6-de-volledige-rendering-keten)
7. [Screen types en renderers](#7-screen-types-en-renderers)
8. [screens.tsx — de renderer registry](#8-screenstsx--de-renderer-registry)
9. [Teksten en labels](#9-teksten-en-labels)
10. [Visibility-systeem](#10-visibility-systeem)
11. [ACTION primitives — navigatie en commands via de pipeline](#11-action-primitives--navigatie-en-commands-via-de-pipeline)
12. [Style-systeem](#12-style-systeem)
13. [Container-patroon voor schermen buiten de pipeline](#13-container-patroon-voor-schermen-buiten-de-pipeline)
14. [Stap-voor-stap: een nieuw scherm toevoegen](#14-stap-voor-stap-een-nieuw-scherm-toevoegen)
15. [Beslisboom](#15-beslisboom)
16. [Bestaande schermen — volledig overzicht](#16-bestaande-schermen--volledig-overzicht)
17. [Tombstone-bestanden — wachten op git rm](#17-tombstone-bestanden--wachten-op-git-rm)
18. [TODOs en bekende bugs](#18-todos-en-bekende-bugs)

---

## 1. Architectuurprincipes

### Geen hardcoded navigatie-stack

De app heeft **één enkel schermcomponent** — `UniversalScreen` — dat elk scherm rendert op basis
van een `screenId`-string. Welk scherm zichtbaar is, is uitsluitend een eigenschap van
`FormState.activeStep`. Er is geen React Navigation, geen stack, geen imperatieve route-push.

### Gouden regels

| Wat wil je? | Waar doe je dat? |
|-------------|-----------------|
| Nieuwe velden toevoegen aan een scherm | `EntryRegistry` + `SectionRegistry` |
| Volgorde van velden wijzigen | `SectionRegistry.fieldIds` |
| Nieuw scherm toevoegen | `ScreenRegistry` (altijd) + eventueel `screens.tsx` |
| Navigatieknop toevoegen | `EntryRegistry` (ACTION-entry) + `SectionRegistry.fieldIds` |
| Tekst van een label wijzigen | `WizStrings.ts` |
| Kleur of spacing wijzigen | `StyleRegistry` (via `make*`-functies) of `Colors.ts` / `Tokens.ts` |
| Scherm met destructieve actie (Alert) | Container-patroon, `validationMessages.ts` |

**Nooit**: hardcoded strings in componenten, hardcoded kleuren (`#FFFFFF`), hardcoded spacing.  
**Nooit**: navigatielogica in een component of container — altijd via `master.navigation.*`.

---

## 2. Provider-boom en bootstrapping

```
App.tsx
└── FormStateProvider          ← state + dispatch; AsyncStorage hydration + auto-save
    └── MasterProvider         ← MasterOrchestrator instantie; bereikbaar via useMaster()
        └── AppContent
            └── ThemeProvider  ← ontvangt master als prop (voor ThemeManager)
                └── WizardProvider  ← ⚠️ zie TODO-6: volledig dode context, nul consumers
                    └── MainNavigator
```

### FormStateProvider

- Laadt bij mount eenmalig uit AsyncStorage (`HYDRATE` dispatch).
- Na `HYDRATE` is `activeStep = 'LANDING'` en `currentScreenId = 'landing'` (lowercase!
  — zie TODO-9).
- Auto-save triggert bij elke wijziging in `state.data` of `state.meta.lastModified`.
- Auto-save triggert **niet** tijdens hydration (`isHydratedRef` guard).
- Migreren naar MMKV? Alleen `PersistenceAdapter.ts` aanpassen.

### MasterProvider / useStableOrchestrator

`useStableOrchestrator()` assembleert de volledige orchestrator-graaf in één `useMemo`.
De aanmaakvolgorde is verplicht (dependencies van boven naar beneden):

```
FormStateOrchestrator (fso)   ← late-binding via stateRef
VisibilityOrchestrator        ← leest via fso
ValidationOrchestrator        ← leest via fso; heeft BusinessManager nodig
UIOrchestrator                ← heeft VisibilityOrchestrator nodig
NavigationOrchestrator        ← heeft fso + NavigationManager + ValidationOrchestrator
ThemeManager                  ← stateless; geen deps
MasterOrchestrator            ← assembleert alles
```

Componenten bereiken de orchestrator uitsluitend via:

```typescript
const master = useMaster();  // geeft MasterOrchestratorAPI
```

De UI mag **uitsluitend** praten met methoden die in `MasterOrchestratorAPI` gedefinieerd zijn.

---

## 3. Navigatie — hoe een scherm op het scherm komt

### De complete stroom

```
1. Gebruiker tikt op knop / app initialiseert
2. master.navigation.goToDashboard()
3. NavigationOrchestrator.navigateTo('DASHBOARD')
4.   → ScreenRegistry.getDefinition('DASHBOARD')  [bestaat? anders: warn + return]
5.   → fso.dispatch({ type: 'SET_STEP', payload: 'DASHBOARD' })
6.   → FormState.activeStep = 'DASHBOARD'
7. MainNavigator leest useFormState().state.activeStep
8. <UniversalScreen screenId="DASHBOARD" />
9. master.buildRenderScreen('DASHBOARD')
10. resolveScreenRenderer(screenVM) → juiste Renderer
11. <Renderer screenVM={...} topPadding={...} onSaveDailyTransaction={...} />
```

### ScreenRegistry (`src/domain/registry/ScreenRegistry.ts`)

De centrale kaart. Elk scherm dat bestaat heeft hier een definitie.

```typescript
interface ScreenDefinition {
  id: string;               // SSOT — dit is de activeStep-waarde (altijd UPPERCASE)
  type: ScreenType;         // 'AUTH' | 'WIZARD' | 'APP_STATIC' | 'SYSTEM'
  titleToken: string;       // bijv. 'screens.dashboard.title' (⚠️ zie TODO-5: niet opgelost door labelFromToken)
  sectionIds: string[];     // verwijzen naar SectionRegistry
  nextScreenId?: string;    // voor wizard-flow (Verder-knop)
  previousScreenId?: string; // voor goBack() (Terug-knop)
}
```

**goBack() fallback**: Als een scherm geen `previousScreenId` heeft én `goBack()` wordt aangeroepen,
navigeert `NavigationOrchestrator.goBack()` automatisch terug naar `'DASHBOARD'`.

### Macronavigatiemethoden

Alle methoden op `MasterOrchestratorAPI.navigation` (conform `INavigationOrchestrator`):

| Methode | Navigeert naar |
|---------|---------------|
| `startWizard()` | `WIZARD_SETUP_HOUSEHOLD` (via `NavigationManager.getFirstScreenId()`) |
| `goToDashboard()` | `DASHBOARD` |
| `goToOptions()` | `OPTIONS` |
| `goToSettings()` | `SETTINGS` |
| `goToCsvUpload()` | `CSV_UPLOAD` |
| `goToCsvAnalysis()` | `CSV_ANALYSIS` |
| `goToReset()` | `RESET` |
| `goToUndo()` | `UNDO` |
| `navigateBack()` | leest `previousScreenId` uit `ScreenRegistry`; fallback: `DASHBOARD` |
| `navigateNext()` | leest `nextScreenId` + valideert sectie |

**Nieuw scherm toevoegen**: voeg de `goTo`-methode toe aan `NavigationOrchestrator`,
`INavigationOrchestrator` én de `navigateTo`-switch in `MasterOrchestrator`.

### navigateTo-switch in MasterOrchestrator

`MasterOrchestrator.navigateTo(target)` vertaalt `navigationTarget`-strings van
`EntryRegistry`-entries naar de juiste navigatiemethode:

```typescript
// src/app/orchestrators/MasterOrchestrator.ts — private navigateTo()
switch (target) {
  case 'WIZARD':     navigation.startWizard();   break;
  case 'DASHBOARD':  navigation.goToDashboard(); break;
  case 'SETTINGS':   navigation.goToSettings();  break;
  case 'CSV_UPLOAD': navigation.goToCsvUpload(); break;
  case 'RESET':      navigation.goToReset();     break;
  case 'OPTIONS':    navigation.goToOptions();   break;
  case 'UNDO':       navigation.goToUndo();      break;
  // ⚠️ 'CSV_ANALYSIS' ontbreekt — zie TODO-1
  default: break; // fail-silent
}
```

### WIZARD-navigatie: SET_CURRENT_SCREEN_ID

Bij navigatie naar een scherm met `type === 'WIZARD'` dispatcht `NavigationOrchestrator.navigateTo()`
**twee** acties:
1. `SET_STEP` (muteert `activeStep` → bepaalt wat UniversalScreen rendert)
2. `SET_CURRENT_SCREEN_ID` (muteert `currentScreenId` → gebruikt door `canNavigateNext()`)

Bij niet-wizard-schermen wordt alleen `SET_STEP` gedispatcht.

---

## 4. De vijf registries

Alle vijf registries implementeren `IBaseRegistry<K, V>` met `getDefinition`, `isValidKey` en
`getAllKeys`. Ze zijn **puur statisch** — geen runtime-state, geen side-effects.

### ScreenRegistry

Kaart van `screenId → ScreenDefinition`. Bevat type, titeltokens, sectionIds, next/previous.

### SectionRegistry (`src/domain/registry/SectionRegistry.ts`)

Kaart van `sectionId → SectionDefinition`. Groepeert entries in een logische sectie.

```typescript
interface SectionDefinition {
  id: string;
  labelToken: string;
  fieldIds: string[];          // keys in EntryRegistry
  layout: 'list' | 'grid' | 'card' | 'stepper';
  uiModel?: 'numericWrapper' | 'collapsible' | 'swipeable' | 'readonly';
}
```

**Lege `fieldIds: []`** = de sectie bestaat wel (ScreenRegistry verwijst ernaar) maar de
bijbehorende renderer bypast de pipeline volledig (zie §8).

**uiModel-gedrag in DynamicSection**:

| uiModel | Daadwerkelijk gedrag in sections.tsx |
|---------|--------------------------------------|
| `undefined` | Gewone `View` met optionele titeltekst |
| `'collapsible'` | `CollapsibleWrapper` — inklapbaar met ▶/▼ toggle |
| `'numericWrapper'` | ⚠️ **Geen speciaal UI-gedrag** — valt door naar gewone `View`. De naam is een styling-intentie, de UI-implementatie is identiek aan `undefined`. |
| `'swipeable'` | ⚠️ **Niet geïmplementeerd** — valt door naar gewone `View`. |
| `'readonly'` | ⚠️ **Niet geïmplementeerd** — valt door naar gewone `View`. |

### EntryRegistry (`src/domain/registry/EntryRegistry.ts`)

Kaart van `entryId → EntryDefinition`. Elk veld of elke knop in de UI heeft hier een definitie.

```typescript
interface EntryDefinition {
  primitiveType: PrimitiveType;      // zie §4 PrimitiveRegistry
  labelToken: string;                // sleutel in WizStrings
  placeholderToken?: string;
  visibilityRuleName?: VisibilityRuleName;
  constraintsKey?: string;           // FormState-veldnaam (heeft prioriteit boven entryId)
  optionsKey?: OptionsKey;           // verwijst naar OptionsRegistry
  options?: readonly string[];       // inline opties (alternatief voor optionsKey)
  navigationTarget?: string;         // alleen voor ACTION: target in navigateTo-switch
  commandTarget?: string;            // alleen voor ACTION: reducer-actie ('UNDO' etc.)
  isDerived?: boolean;
  defaultValue?: unknown;
}
```

**fieldId-resolutie** (in `resolveFieldId()`):
1. `constraintsKey` aanwezig en niet leeg → gebruik `constraintsKey` als FormState-veldnaam
2. anders → gebruik `entryId` zelf

### PrimitiveRegistry (`src/domain/registry/PrimitiveRegistry.ts`)

Valideert of een `primitiveType`-string bestaat en geeft metadata terug. `ScreenViewModelFactory`
gooit een `Error` als een `primitiveType` niet in dit register staat.

Beschikbare types (`PRIMITIVE_TYPES`):

| Constante | String | `requiresOptions` | `isReadOnly` | Omschrijving |
|-----------|--------|--------------------|--------------|-------------|
| `COUNTER` | `'counter'` | nee | nee | Teller met +/- knoppen |
| `CURRENCY` | `'currency'` | nee | nee | Geldbedrag (decimal-pad) |
| `TEXT` | `'text'` | nee | nee | Vrij tekstveld |
| `NUMBER` | `'number'` | nee | nee | Numeriek veld |
| `CHIP_GROUP` | `'chip-group'` | **ja** | nee | Enkelvoudige keuze chips |
| `CHIP_GROUP_MULTIPLE` | `'chip-group-multiple'` | **ja** | nee | Meervoudige keuze chips |
| `TOGGLE` | `'toggle'` | **ja** | nee | Aan/uit schakelaar |
| `RADIO` | `'radio'` | **ja** | nee | Radio-knoppen |
| `LABEL` | `'label'` | nee | **ja** | Alleen-lezen weergave |
| `DATE` | `'date'` | nee | nee | Datumkiezer |
| `ACTION` | `'action'` | nee | **ja** | Navigatie- of commandoknop |

> `ACTION` heeft `requiresOptions: false` en `isReadOnly: true`. Een ACTION-entry heeft
> geen `value`-veld en geen `onChange` — alleen `label` + `onPress`.

### OptionsRegistry

Levert string-arrays voor `chip-group`, `chip-group-multiple`, `radio` en `toggle` primitives.
Verwijs ernaar via `optionsKey` in `EntryDefinition`. Importeer uit:
`@domain/registry/OptionsRegistry` (`GENERAL_OPTIONS`, `HOUSEHOLD_OPTIONS`, `FINANCE_OPTIONS`).

---

## 5. De VM-bouwpipeline (stap voor stap)

`master.buildRenderScreen(screenId)` doorloopt zes lagen. Elke laag voegt informatie toe.

```
Stap 1 — ScreenRegistry
  ScreenDefinition { type, titleToken, sectionIds, navigation }
         ↓
Stap 2 — SectionRegistry (één per sectionId)
  SectionDefinition { labelToken, fieldIds, layout, uiModel? }
         ↓
Stap 3 — EntryRegistry (één per fieldId)
  EntryDefinition { primitiveType, labelToken, constraintsKey?,
                    navigationTarget?, commandTarget?, visibilityRuleName? }
         ↓
Stap 4 — PrimitiveRegistry
  Valideert primitiveType; gooit Error als onbekend
         ↓
Stap 5 — StyleFactory (ScreenStyleFactory.bind)
  Koppelt stijlsleutels op basis van type/layout/primitiveType
  Resultaat: StyledScreenVM
         ↓
Stap 6 — UIOrchestrator.mapToRenderEntry() (per entry)
  - labelFromToken(entry.labelToken)       → leesbare string
  - resolveEntryValue()                    → waarde uit fso of valueResolver
  - evaluateVisibility(visibilityRuleName) → boolean
  - resolveChangeHandler()                 → onChange-callback
  Resultaat: RenderEntryVM (klaar voor directe consumptie door de UI)
```

### Stap 6 in detail — resolveChangeHandler

```
ACTION-entry met commandTarget?     → () => onCommand(commandTarget)
ACTION-entry met navigationTarget?  → () => onNavigate(navigationTarget)
overige entry                       → (value) => onFieldChange(fieldId, value)
```

`commandTarget` heeft altijd **prioriteit** boven `navigationTarget`.

### valueResolver (escape-hatch voor velden buiten FormState)

Velden die buiten `FormState` leven (bijv. het huidige thema) worden geïnjecteerd als
synchrone getter-functies in `MappingContext.valueResolvers`:

```typescript
// In MasterOrchestrator.buildRenderScreen():
valueResolvers: {
  theme: () => this.theme.getTheme() === 'dark',  // boolean i.p.v. FormState-waarde
},
```

`resolveEntryValue()` raadpleegt eerst `valueResolvers`; als de fieldId daar niet in zit,
valt het terug op `fso.getValue(fieldId)`.

---

## 6. De volledige rendering-keten

Nadat de pipeline de `RenderScreenVM` heeft gebouwd, loopt het renderen via deze keten:

```
UniversalScreen
  └── resolveScreenRenderer(screenVM) → Renderer-component
        └── SectionList (in Default / Wizard / OptionsScreenRenderer)
              └── DynamicSection (sections.tsx)
                    └── DynamicEntry (entries/DynamicEntry.tsx)  ← per RenderEntryVM
                          └── renderByPrimitive(entry)
                                ├── toCurrencyViewModel(entry) → MoneyEntry
                                ├── toTextViewModel(entry)     → TextEntry
                                ├── toCounterViewModel(entry)  → CounterEntry
                                ├── toToggleViewModel(entry)   → ToggleEntry
                                ├── toChipGroupViewModel(entry)→ ChipGroupEntry
                                ├── toRadioViewModel(entry)    → RadioEntry
                                ├── toLabelViewModel(entry)    → LabelEntry
                                ├── toDateViewModel(entry)     → DateEntry
                                └── toActionViewModel(entry)   → ActionEntry
```

### DynamicEntry

`DynamicEntry` is de poortwachter:

```typescript
if (entry.isVisible !== true) return null;  // verborgen entries worden niet gerenderd
return renderByPrimitive(entry);
```

### entry.mappers.ts

Elke `to*ViewModel()`-functie vertaalt een `RenderEntryVM` naar het platform-specifieke
`PrimitiveViewModel` dat het bijbehorende entry-component verwacht. **Nooit
rechtstreeks aanroepen** — `DynamicEntry` doet dit automatisch.

### DynamicSection (`sections.tsx`)

Rendert de "romp" van een sectie: titel (optioneel) en container. **Daadwerkelijk ondersteunde
`uiModel`-waarden in de huidige implementatie:**

| uiModel | Gedrag |
|---------|--------|
| `undefined` (of elke niet-`'collapsible'`-waarde) | Gewone `View` + optionele titeltekst |
| `'collapsible'` | `CollapsibleWrapper` met ▶/▼ toggle, bevat `useState` |

Alle andere `uiModel`-waarden (`'numericWrapper'`, `'swipeable'`, `'readonly'`) vallen door
naar de gewone `View`. Ze zijn aanwezig in de type-definitie maar niet geïmplementeerd in
`sections.tsx`. Dit is architectureel bedoeld als toekomstige uitbreidingspunten.

> ⚠️ **TODO-8**: De `@ai_instruction` in de JSDoc van `sections.tsx` is verouderd en beschrijft
> een non-existent `RenderEntries`-component. Zie §18.

---

## 7. Screen types en renderers

| Type | Beschrijving | Standaard renderer |
|------|-------------|-------------------|
| `AUTH` | Vóór authenticatie (LANDING) | `DefaultScreenRenderer` (valt door fallback) |
| `WIZARD` | Stap in de setup-wizard | `WizardScreenRenderer` via `SCREEN_TYPE_RENDERERS` |
| `APP_STATIC` | Regulier app-scherm | `DefaultScreenRenderer` (tenzij override in `SCREEN_RENDERERS`) |
| `SYSTEM` | SPLASH, RESET, CRITICAL_ERROR | Dedicated renderer **verplicht** in `SCREEN_RENDERERS` |

`WIZARD` is de **enige** type-gebaseerde override. Alle andere afwijkingen gaan per `screenId`.

**Let op LANDING**: Het heeft `nextScreenId: 'WIZARD_SETUP_HOUSEHOLD'` in `ScreenRegistry`.
Dit is functioneel irrelevant — `AUTH`-schermen tonen geen `NavigationFooter`, dus de Verder-knop
wordt nooit gerenderd. De waarde is aanwezig maar ongebruikt.

---

## 8. screens.tsx — de renderer registry

**Bestand**: `src/ui/screens/screens.tsx`

### Resolver-volgorde

```
resolveScreenRenderer(screenVM):
  1. SCREEN_RENDERERS[screenVM.screenId]   → gevonden? gebruik die
  2. SCREEN_TYPE_RENDERERS[screenVM.type]  → gevonden? gebruik die
  3. anders → DefaultScreenRenderer
```

### ScreenRendererProps

Elke renderer ontvangt altijd deze drie props (gebruik wat je nodig hebt):

```typescript
interface ScreenRendererProps {
  screenVM: RenderScreenVM;           // het volledig gebouwde scherm-model
  topPadding: number;                 // insets.top + Tokens.Space.md
  onSaveDailyTransaction: () => void; // alleen DAILY_INPUT gebruikt dit
}
```

### Bestaande renderers

| Renderer | Structuur | Registratie |
|----------|-----------|-------------|
| `DefaultScreenRenderer` | `SectionList` (ScrollView + DynamicSection) | Fallback — geen entry nodig |
| `WizardScreenRenderer` | `SectionList` + `NavigationFooter` | Via `SCREEN_TYPE_RENDERERS['WIZARD']` |
| `OptionsScreenRenderer` | `SectionList` + `NavigationBackFooter` | `SCREEN_RENDERERS['OPTIONS']` |
| `DailyInputScreenRenderer` | `SectionList` + `DailyInputActionFooter` | `SCREEN_RENDERERS['DAILY_INPUT']` |
| `SplashScreenRenderer` | `SplashContent` (ActivityIndicator + tekst) | `SCREEN_RENDERERS['SPLASH']` |
| `CsvUploadScreenRenderer` | delegeert aan `CsvUploadContainer` | `SCREEN_RENDERERS['CSV_UPLOAD']` |
| `CsvAnalysisScreenRenderer` | delegeert aan `CsvAnalysisFeedbackContainer` | `SCREEN_RENDERERS['CSV_ANALYSIS']` |
| `ResetScreenRenderer` | delegeert aan `ResetConfirmationContainer` | `SCREEN_RENDERERS['RESET']` |
| `CriticalErrorScreenRenderer` | delegeert aan `CriticalErrorContainer` | `SCREEN_RENDERERS['CRITICAL_ERROR']` |
| `UndoScreenRenderer` | `TransactionHistoryContainer` + actie-sectie | `SCREEN_RENDERERS['UNDO']` |

### NavigationFooter vs NavigationBackFooter

| Component | Wanneer | Knoppen |
|-----------|---------|---------|
| `NavigationFooter` | WIZARD-schermen | Terug (altijd) + Verder (disabled bij validatiefout) |
| `NavigationBackFooter` | APP_STATIC met `previousScreenId` | Alleen Terug |

Beide lezen de navigatielogica uit `master.navigation` — **nooit** hardcoded target in de
footer-component zelf.

> ⚠️ **TODO-4**: `FooterContainer` in `NavigationFooter.tsx` heeft hardcoded `'#FFFFFF'` en
> `'#E5E7EB'`. Zie §18.

---

## 9. Teksten en labels

### labelFromToken()

**Bestand**: `src/domain/constants/labelResolver.ts`

Zoekt een token op in `WizStrings` in vaste volgorde:

```typescript
WizStrings.wizard   → WizStrings.dashboard → WizStrings.common  →
WizStrings.landing  → WizStrings.options   → WizStrings.undo    →
WizStrings.settings → fallback: retourneert de token-string zelf
```

> ⚠️ `WizStrings.csvAnalysis` wordt **niet doorzocht** — zie TODO-2.  
> ⚠️ `ScreenRegistry.titleToken`-waarden (bijv. `'screens.dashboard.title'`) worden **niet
> gevonden** — zie TODO-5.

### WizStrings-secties en hun inhoud

| Sectie | Bevat |
|--------|-------|
| `wizard` | `back`, `next`, `finish` |
| `dashboard` | `title`, `welcome` |
| `common` | `loading`, `error` |
| `landing` | `screenTitle`, `screenSubtitle`, `startWizard`, `goToDashboard` |
| `options` | `goToSettings`, `goToCsvUpload`, `goToReset` |
| `undo` | `screenTitle`, `listTitle`, `emptyTitle`, `emptyMessage`, `undoAction`, `redoAction`, `clearAllAction` |
| `settings` | `darkModeLabel` |
| `csvAnalysis` | `title`, `emptyTitle`, `emptyMessage`, `periodTitle`, labels voor vergelijking (**niet doorzoekbaar via labelFromToken**) |

### Een nieuw label toevoegen

1. Voeg de string toe aan de juiste sectie in `src/config/WizStrings.ts`
2. Gebruik de sleutelnaam als `labelToken` in `EntryRegistry`
3. Als het een **nieuwe sectie** is, voeg de lookup-regel toe aan `labelFromToken()`:

```typescript
// In labelResolver.ts — voeg toe vóór de fallback:
if (token in (WizStrings.mijnSectie ?? {}))
  return (WizStrings.mijnSectie as Record<string,string>)[token] ?? token;
```

### Teksten voor Alert-dialogen

Niet in `WizStrings` maar in `validationMessages.ts`
(`src/state/schemas/sections/validationMessages.ts`). Containers lezen hier direct uit — SSOT
voor destructieve-actie-teksten. Secties: `reset.wipe`, `reset.wizardOnly`, `criticalError`.

---

## 10. Visibility-systeem

### Principe

Een entry heeft een optionele `visibilityRuleName` in `EntryRegistry`. `UIOrchestrator`
evalueert deze na de pipeline:

```
visibilityRuleName leeg/undefined → standaard true (fail-open)
visibilityRuleName aanwezig       → fieldVisibilityRules[ruleName](context)
ACTION-entry                      → altijd true (bypast visibility volledig)
```

### fieldVisibilityRules (`src/domain/rules/fieldVisibility.ts`)

Pure functies met signatuur `(ctx: VisibilityContext, memberId?: string) => boolean`.
`VisibilityRuleName` is het automatisch afgeleide type van alle sleutels in dit object.

Voorbeeldregels:
- `isWoningHuur` — `ctx.getValue('woningType') === 'Huur'`
- `hasCars` — `ctx.getValue('autoCount') !== 'Geen'`
- `hasWorkSelected` — raadpleegt een member-object via `memberId`

### Een nieuwe visibility-regel toevoegen

1. Voeg de functie toe aan `fieldVisibilityRules` in `fieldVisibility.ts`
2. `VisibilityRuleName` wordt automatisch uitgebreid (union type via `keyof`)
3. Gebruik de naam als `visibilityRuleName` in `EntryDefinition`

---

## 11. ACTION primitives — navigatie en commands via de pipeline

### navigationTarget (schermnavigatie)

```typescript
// EntryRegistry.ts
goToSettings: {
  primitiveType: PRIMITIVE_TYPES.ACTION,
  labelToken: 'goToSettings',       // → WizStrings.options.goToSettings → 'Instellingen'
  navigationTarget: 'SETTINGS',     // → navigateTo('SETTINGS') → navigation.goToSettings()
},
```

**Volledige flow**:
`ActionEntry.onPress()` → `entry.onChange(null)` → `onNavigate('SETTINGS')` →
`MasterOrchestrator.navigateTo('SETTINGS')` → `navigation.goToSettings()` →
`fso.dispatch({ type: 'SET_STEP', payload: 'SETTINGS' })`.

### commandTarget (reducer-dispatch)

```typescript
// EntryRegistry.ts
undoAction: {
  primitiveType: PRIMITIVE_TYPES.ACTION,
  labelToken: 'undoAction',
  commandTarget: 'UNDO',  // → dispatchCommand('UNDO') → dispatch({ type: 'UNDO_TRANSACTION' })
},
```

Beschikbare commands in `MasterOrchestrator.dispatchCommand()`:

| commandTarget | Reducer-actie |
|---------------|--------------|
| `'UNDO'` | `UNDO_TRANSACTION` |
| `'REDO'` | `REDO_TRANSACTION` |
| `'CLEAR_ALL'` | `CLEAR_TRANSACTIONS` |

**commandTarget heeft altijd prioriteit boven navigationTarget.**

### Een nieuwe ACTION-knop toevoegen

1. Voeg entry toe in `EntryRegistry` met `navigationTarget` (of `commandTarget`)
2. Voeg `entryId` toe aan `SectionRegistry.fieldIds` van de juiste sectie
3. Bij nieuw `navigationTarget`:
   - Voeg `case 'MIJN_TARGET':` toe aan de switch in `MasterOrchestrator.navigateTo()`
   - Voeg methode toe aan `NavigationOrchestrator` én `INavigationOrchestrator`

---

## 12. Style-systeem

### useAppStyles()

```typescript
const { styles, colors, Tokens } = useAppStyles();
```

| Property | Type | Gebruik |
|----------|------|---------|
| `styles` | gecacht `StyleSheet`-object | `<View style={styles.container}>` |
| `colors` | `Colors[theme]` | `{ backgroundColor: colors.error }` |
| `Tokens` | `Tokens`-constanten | `{ marginTop: Tokens.Space.lg }` |

**Nooit** hardcoded hex-kleuren of magic numbers voor spacing. De enige uitzondering is
`FooterContainer` in `NavigationFooter.tsx` — zie TODO-4.

### Style-hiërarchie (SSOT)

```
Tokens.ts + Colors.ts               ← primitieve waarden (geen logica)
     ↓
StyleRegistry (make*-functies)       ← per categorie (makeButtons, makeCards, ...)
     ↓
useAppStyles.getAppStyles()          ← assembleert + cachet per thema via StyleSheet.create()
     ↓
Component: const { styles } = useAppStyles()
```

### Stijl van een bestaand component wijzigen

Pas de bijbehorende `make*`-functie aan in `src/domain/styles/primitives/` of
`src/domain/styles/sections/`. **Nooit** in het component zelf.

### Thema (dark/light)

- Schakelen via `darkModeToggle` entry (TOGGLE-primitive met `constraintsKey: 'theme'`)
- `updateField('theme', value)` wordt onderschept in `MasterOrchestrator` →
  `SettingsWorkflow.execute()` → `ThemeManager.setTheme()`
- `valueResolver` in `MappingContext` zorgt dat `fso.getValue('theme')` **niet** wordt
  aangeroepen — de ThemeManager is de SSOT voor het huidige thema

---

## 13. Container-patroon voor schermen buiten de pipeline

Gebruik dit patroon wanneer een scherm:
- Een destructieve actie heeft die `Alert.alert` vereist
- Eigen laadstatus heeft (`useState`)
- Een externe container delegeert (CSV, transactiegeschiedenis)

### Bestandslocatie

```
src/ui/screens/MijnScherm/MijnSchermContainer.tsx
```

### Anatomie

```tsx
// src/ui/screens/MijnScherm/MijnSchermContainer.tsx

import * as React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { Tokens } from '@domain/constants/Tokens';
import { validationMessages } from '@state/schemas/sections/validationMessages';

// ─── Getypte Alert-wrapper ───────────────────────────────────────────────────
// Isoleert Alert.alert achter een getypte wrapper (ESLint no-unsafe-call).
// DIT IS DE ENIGE PLEK WAAR Alert.alert IN DIT BESTAND STAAT.

interface AlertButtonConfig {
  text: string;
  style?: 'cancel' | 'destructive' | 'default';
  onPress?: () => void;
}

function showConfirmAlert(
  title: string,
  message: string,
  buttons: AlertButtonConfig[],
): void {
  Alert.alert(title, message, buttons);
}

// ─── Container ──────────────────────────────────────────────────────────────
export const MijnSchermContainer: React.FC = () => {
  const master = useMaster();
  const insets = useSafeAreaInsets();
  const { styles, colors } = useAppStyles();

  // Callback op container-niveau (NIET als prop van sub-component).
  // Reden: TypeScript-keten volledig traceerbaar zonder tussenliggende any.
  const onBevestigd = React.useCallback((): void => {
    master.executeReset('full');  // of welke actie dan ook
  }, [master]);

  const handleKnopDruk = React.useCallback((): void => {
    const { title, message, confirm, cancel } = validationMessages.mijnScherm.alert;
    showConfirmAlert(title, message, [
      { text: cancel, style: 'cancel' },
      { text: confirm, style: 'destructive', onPress: onBevestigd },
    ]);
  }, [onBevestigd]);

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom }]}
      testID="mijn-scherm-container"
    >
      <View style={[styles.dashboardCard, { marginBottom: Tokens.Space.xxl }]}>
        <Text style={styles.summaryDetail}>
          {validationMessages.mijnScherm.screenMessage}
        </Text>
      </View>

      <TouchableOpacity
        testID="btn-mijn-actie"
        style={[styles.button, { backgroundColor: colors.error }]}
        onPress={handleKnopDruk}
        accessibilityRole="button"
        accessibilityLabel={validationMessages.mijnScherm.alert.confirm}
      >
        <Text style={styles.buttonText}>Actie</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Checklist container-patroon

| Eigenschap | Reden |
|-----------|-------|
| `useMaster()` direct in container | TypeScript-keten volledig; geen prop-drilling |
| `useAppStyles()` voor kleuren + spacing | Geen hardcoded hex of magic numbers |
| `useSafeAreaInsets()` voor `paddingBottom` | Home-indicator op iOS |
| `Alert.alert` via `showConfirmAlert()`-wrapper | ESLint `no-unsafe-call` |
| Teksten via `validationMessages` | SSOT; geen hardcoded strings in de UI |
| `testID` op container en knoppen | Testbaarheid |
| `accessibilityRole` op knoppen | Toegankelijkheid (WCAG) |
| Callbacks op container-niveau | TypeScript-keten volledig traceerbaar |
| `Alert.alert` **NIET** in orchestrators of workflows | UI-import; architectuurgrens |

### Container registreren als renderer

```tsx
// 1. In screens.tsx — import toevoegen
import { MijnSchermContainer } from '@ui/screens/MijnScherm/MijnSchermContainer';

// 2. Renderer-wrapper aanmaken
const MijnSchermRenderer: React.FC<ScreenRendererProps> = ({ topPadding }) => (
  <View style={{ flex: 1, paddingTop: topPadding }}>
    <MijnSchermContainer />
  </View>
);

// 3. Registreren
const SCREEN_RENDERERS: Record<string, ScreenRenderer> = {
  // ...bestaande entries...
  MIJN_SCHERM: MijnSchermRenderer,
};
```

---

## 14. Stap-voor-stap: een nieuw scherm toevoegen

### Pad A — Pipeline-scherm (velden via de registries)

Gebruik voor: wizard-stappen, formulieren, instellingen, lijsten van navigatieknoppen.

**Stap 1 — SectionRegistry**

```typescript
MIJN_SECTIE: {
  id: 'MIJN_SECTIE',
  labelToken: 'SECTION_MIJN_SECTIE',
  layout: 'list',
  fieldIds: ['mijnVeld1', 'mijnVeld2'],
},
```

**Stap 2 — EntryRegistry**

```typescript
mijnVeld1: {
  primitiveType: PRIMITIVE_TYPES.TEXT,
  labelToken: 'mijnVeld1Label',       // sleutel in WizStrings
  constraintsKey: 'mijnVeld1',        // FormState-veldnaam (prioriteit boven entryId)
  visibilityRuleName: 'mijnRegel',    // optioneel
},
```

**Stap 3 — WizStrings + labelResolver** (alleen als nieuwe WizStrings-sectie)

```typescript
// WizStrings.ts
mijnScherm: {
  mijnVeld1Label: 'Mijn eerste veld',
},

// labelResolver.ts — nieuwe if-regel toevoegen vóór de fallback:
if (token in (WizStrings.mijnScherm ?? {}))
  return (WizStrings.mijnScherm as Record<string,string>)[token] ?? token;
```

**Stap 4 — ScreenRegistry**

```typescript
'MIJN_SCHERM': {
  id: 'MIJN_SCHERM',
  type: 'APP_STATIC',
  titleToken: 'screens.mijn_scherm.title',
  sectionIds: ['MIJN_SECTIE'],
  previousScreenId: 'DASHBOARD',  // voor NavigationBackFooter
},
```

**Stap 5 — NavigationOrchestrator + INavigationOrchestrator + MasterOrchestrator**

```typescript
// NavigationOrchestrator.ts
public goToMijnScherm(): void { this.navigateTo('MIJN_SCHERM'); }

// INavigationOrchestrator.ts
goToMijnScherm(): void;

// MasterOrchestrator.navigateTo():
case 'MIJN_SCHERM': this.app.navigation.goToMijnScherm(); break;
```

**Stap 6 — screens.tsx** (alleen als afwijkend van `DefaultScreenRenderer`)

Niet nodig voor puur pipeline-schermen zonder footer.

---

### Pad B — Container-scherm (eigen state / Alert.alert)

Gebruik voor: destructieve acties met bevestigingsdialoog, schermen met laadstatus.

**Stap 1 — validationMessages.ts**

```typescript
mijnScherm: {
  screenMessage: 'Omschrijving van de actie.',
  alert: {
    title: 'Bevestig actie',
    message: 'Weet je het zeker?',
    confirm: 'Ja, doe het',
    cancel: 'Annuleer',
  },
},
```

**Stap 2 — Maak de Container** (zie §13 voor het volledig template)

**Stap 3 — ScreenRegistry** (container bypast de pipeline: `sectionIds: []`)

```typescript
'MIJN_SCHERM': {
  id: 'MIJN_SCHERM',
  type: 'SYSTEM',
  titleToken: 'screens.mijn_scherm.title',
  sectionIds: [],
},
```

**Stap 4 — screens.tsx** (renderer + registratie, zie §13)

**Stap 5 — NavigationOrchestrator** (zelfde als Pad A, stap 5)

---

## 15. Beslisboom

### Welk pad?

```
Nieuw scherm nodig?
│
├── Heeft het velden die FormState muteren?
│   └─ Ja → Pad A (pipeline). Geen eigen React-state in het component.
│
├── Heeft het een destructieve actie (wissen, versturen) die bevestiging vereist?
│   └─ Ja → Pad B (container met Alert.alert)
│
├── Heeft het eigen laadstatus (spinner, progress)?
│   └─ Ja → Pad B (container met useState)
│
├── Is het een laadscherm of foutscherm zonder UI-inhoud via de pipeline?
│   └─ Ja → Pad B (dedicated renderer zoals SplashScreenRenderer)
│
└── Zijn alle velden read-only of navigatieknoppen?
    └─ Ja → Pad A (ACTION + LABEL primitives via pipeline)
```

### Welke renderer?

```
Wizard-stap (next/previous)?                 → WizardScreenRenderer (automatisch via type 'WIZARD')
Alleen een Terug-knop (previousScreenId)?    → OptionsScreenRenderer-patroon (SectionList + NavigationBackFooter)
Eigen save-actie?                            → DailyInputScreenRenderer-patroon (SectionList + eigen footer)
Container (geen pipeline-velden)?            → Container-renderer (delegeert volledig, zie §13)
Puur pipeline, geen footer?                 → DefaultScreenRenderer (geen registratie nodig)
```

---

## 16. Bestaande schermen — volledig overzicht

| screenId | type | sectionIds | Renderer |
|----------|------|-----------|----------|
| `SPLASH` | SYSTEM | `[]` | `SplashScreenRenderer` |
| `LANDING` | AUTH | `['LANDING_ACTIONS_CARD']` | `DefaultScreenRenderer` (via fallback) |
| `WIZARD_SETUP_HOUSEHOLD` | WIZARD | `['householdSetup']` | `WizardScreenRenderer` (via type) |
| `WIZARD_DETAILS_HOUSEHOLD` | WIZARD | `['householdDetails']` | `WizardScreenRenderer` |
| `WIZARD_INCOME_DETAILS` | WIZARD | `['incomeDetails', 'workToeslagen']` | `WizardScreenRenderer` |
| `WIZARD_FIXED_EXPENSES` | WIZARD | `['fixedExpenses', 'overigeVerzekeringen', 'abonnementen']` | `WizardScreenRenderer` |
| `DASHBOARD` | APP_STATIC | `['DASHBOARD_OVERVIEW_CARD', 'QUICK_ACTIONS_SECTION']` | `DefaultScreenRenderer` |
| `DAILY_INPUT` | APP_STATIC | `['EXPENSE_INPUT_CARD']` | `DailyInputScreenRenderer` |
| `UNDO` | APP_STATIC | `['TRANSACTION_HISTORY_LIST', 'TRANSACTION_ACTIONS_CARD']` | `UndoScreenRenderer` |
| `OPTIONS` | APP_STATIC | `['GLOBAL_OPTIONS_LIST']` | `OptionsScreenRenderer` |
| `SETTINGS` | APP_STATIC | `['USER_PROFILE_CARD', 'APP_PREFERENCES_SECTION']` | `DefaultScreenRenderer` |
| `CSV_UPLOAD` | APP_STATIC | `['CSV_DROPZONE_CARD', 'CSV_MAPPING_SECTION']` | `CsvUploadScreenRenderer` |
| `CSV_ANALYSIS` | APP_STATIC | `['CSV_ANALYSIS_RESULT_CARD']` | `CsvAnalysisScreenRenderer` |
| `RESET` | SYSTEM | `['RESET_CONFIRMATION_CARD']` | `ResetScreenRenderer` |
| `CRITICAL_ERROR` | SYSTEM | `['ERROR_DIAGNOSTICS_CARD']` | `CriticalErrorScreenRenderer` |

### Secties met lege fieldIds (pipeline wordt bypast)

| Sectie | Reden leeg | Wie rendert |
|--------|-----------|-------------|
| `DASHBOARD_OVERVIEW_CARD` | Dashboard rendert nog handmatig | *(nog geen dedicated renderer)* |
| `QUICK_ACTIONS_SECTION` | Idem | *(nog geen dedicated renderer)* |
| `CSV_DROPZONE_CARD` | Container bypast pipeline | `CsvUploadContainer` |
| `CSV_MAPPING_SECTION` | Container bypast pipeline | `CsvUploadContainer` |
| `CSV_ANALYSIS_RESULT_CARD` | Container bypast pipeline | `CsvAnalysisFeedbackContainer` |
| `RESET_CONFIRMATION_CARD` | Container bypast pipeline | `ResetConfirmationContainer` |
| `ERROR_DIAGNOSTICS_CARD` | Container bypast pipeline | `CriticalErrorContainer` |
| `TRANSACTION_HISTORY_LIST` | Container bypast pipeline | `TransactionHistoryContainer` (sections/) |

---

## 17. Tombstone-bestanden — wachten op git rm

De volgende bestanden zijn vervangen door de UniversalScreen-pipeline en bevatten alleen
een `@deprecated`-comment + `export {}`. Veilig te verwijderen:

```bash
git rm src/ui/screens/Wizard/LandingScreen.tsx
git rm src/ui/screens/Wizard/SplashScreen.tsx
git rm src/ui/screens/Wizard/CriticalErrorScreen.tsx
git rm src/ui/screens/Wizard/WelcomeWizard.tsx
git rm src/ui/screens/Wizard/pages/1setupHousehold.config.ts
git rm src/ui/screens/Wizard/pages/2detailsHousehold.config.ts
git rm src/ui/screens/Wizard/pages/3incomeDetails.config.ts
git rm src/ui/screens/Wizard/pages/4fixedExpenses.config.ts
git rm src/ui/screens/Options/OptionsScreen.tsx
git rm src/ui/screens/Reset/ResetScreen.tsx
git rm src/ui/screens/Settings/SettingsScreen.tsx
rmdir src/ui/screens/DailyInput    # lege map
rmdir src/ui/screens/Dashboard     # lege map
```

Aanvullend — na verificatie (zie TODO-7):

```bash
# Controleer of dit bestand nergens geïmporteerd wordt:
git rm src/ui/screens/Daily/TransactionHistoryContainer.tsx
rmdir src/ui/screens/Daily
```

---

## 18. TODOs en bekende bugs

Gevonden tijdens grondige broncode-analyse op 2026-02-26.
**Dit bestand heeft lees-only rechten op de bronbestanden** — geen van de genoemde bugs is door
de README-schrijver gewijzigd.

Prioriteiten: 🔴 Hoog (functionele bug of dode code zonder twijfel) · 🟡 Middel · 🟢 Laag

---

### TODO-1 🔴 BUG — MasterOrchestrator.navigateTo() mist `'CSV_ANALYSIS'`

**Bestand**: `src/app/orchestrators/MasterOrchestrator.ts`, private methode `navigateTo()`  
**Ernst**: Hoog — een ACTION-entry met `navigationTarget: 'CSV_ANALYSIS'` zou silently falen.

```typescript
// Huidige switch (gecondenseerd) — 'CSV_ANALYSIS' ontbreekt:
case 'WIZARD':     navigation.startWizard();   break;
case 'DASHBOARD':  navigation.goToDashboard(); break;
case 'SETTINGS':   navigation.goToSettings();  break;
case 'CSV_UPLOAD': navigation.goToCsvUpload(); break;
case 'RESET':      navigation.goToReset();     break;
case 'OPTIONS':    navigation.goToOptions();   break;
case 'UNDO':       navigation.goToUndo();      break;
// ← 'CSV_ANALYSIS' ontbreekt

// Fix — voeg toe:
case 'CSV_ANALYSIS': this.app.navigation.goToCsvAnalysis(); break;
```

`NavigationOrchestrator.goToCsvAnalysis()` bestaat al. `INavigationOrchestrator` bevat
de methode al. `CsvUploadContainer` roept `master.navigation.goToCsvAnalysis()` momenteel
**direct** aan (omzeilt de switch), waardoor de bug nu geen runtime-effect heeft. Zodra
een ACTION-entry met `navigationTarget: 'CSV_ANALYSIS'` wordt toegevoegd, faalt het stilzwijgend.

---

### TODO-2 🟡 LABEL — labelFromToken dekt WizStrings.csvAnalysis niet

**Bestand**: `src/domain/constants/labelResolver.ts`  
**Ernst**: Middel — CSV-analyseteksten vallen terug op de ruwe token-string.

`WizStrings.csvAnalysis` heeft 14 sleutels (title, emptyTitle, emptyMessage, periodTitle, etc.)
maar `labelFromToken()` doorzoekt deze sectie niet.

**Fix** — voeg toe aan `labelResolver.ts` vóór de fallback:
```typescript
if (token in (WizStrings.csvAnalysis ?? {}))
  return (WizStrings.csvAnalysis as Record<string,string>)[token] ?? token;
```

---

### TODO-3 🔴 BUG — formReducer.ts INITIAL_DATA_RESET.setup is out of sync met initialFormState

**Bestand**: `src/app/state/formReducer.ts`, constante `INITIAL_DATA_RESET`  
**Ernst**: Hoog — na `RESET_APP` bevat `data.setup` een veld `dob` dat er niet in hoort
en mist `postcode`.

```typescript
// formReducer.ts — INITIAL_DATA_RESET (fout):
[DATA_KEYS.SETUP]: {
  aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Geen',
  heeftHuisdieren: false, woningType: 'Huur',
  dob: '',        // ← FOUT: hoort in een member-object, niet in setup
                  // ← ONTBREEKT: postcode: ''
},

// initialFormState.ts — correct:
[DATA_KEYS.SETUP]: {
  aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Geen',
  heeftHuisdieren: false, woningType: 'Huur',
  postcode: '',   // ← correct
},
```

**Fix** in `formReducer.ts`:
```typescript
[DATA_KEYS.SETUP]: {
  aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Geen',
  heeftHuisdieren: false, woningType: 'Huur',
  postcode: '',   // ← vervang `dob: ''` door `postcode: ''`
},
```

---

### TODO-4 🟡 STIJL — NavigationFooter: FooterContainer heeft hardcoded kleuren

**Bestand**: `src/ui/navigation/NavigationFooter.tsx`, component `FooterContainer`  
**Ernst**: Middel — footer is altijd wit in dark mode (thema-onbewust).

```typescript
// Huidige situatie — hardcoded:
const bg = '#FFFFFF';
const border = '#E5E7EB';

// Fix — thema-bewust maken via useAppStyles():
// FooterContainer moet een hook-capable component worden.
// Gebruik dan: colors.background en colors.border (of equivalente tokens).
```

---

### TODO-5 🟡 LABEL — ScreenRegistry.titleToken-waarden worden niet opgelost door labelFromToken

**Bestand**: `src/domain/registry/ScreenRegistry.ts` + `src/config/WizStrings.ts`  
**Ernst**: Middel — schermpaginatitels verschijnen als ruwe token-strings.

`ScreenRegistry` gebruikt tokens zoals `'screens.splash.title'`, `'wizard.setup.title'`,
`'screens.dashboard.title'`. Geen van deze tokens is een sleutel in de secties die
`labelFromToken()` doorzoekt (want `WizStrings.wizard` heeft alleen `back`, `next`, `finish`
— geen `setup.title`).

**Opties**:
- **A** — Voeg een `screens`-sectie toe aan `WizStrings` en een bijbehorende lookup-regel
  aan `labelFromToken()`
- **B** — Pas `titleToken`-waarden in `ScreenRegistry` aan naar bestaande sleutels
  (bijv. `'title'` in `WizStrings.dashboard`)

---

### TODO-6 🔴 DODE CODE — WizardContext volledig zonder consumers

**Bestand**: `src/app/context/WizardContext.tsx` + `src/App.tsx`  
**Ernst**: Hoog — `WizardProvider` staat actief in de provider-boom maar produceert context
die door **nul** componenten geconsumeerd wordt.

**Bevestigd tijdens audit**:
- `useWizard()` wordt **nergens** aangeroepen buiten `WizardContext.tsx` zelf.
- `WizardProvider` staat in `App.tsx` maar de context-waarde (`activeStepId`, `goToNextStep`,
  `master`, etc.) wordt nooit geleezen via `useWizard()`.
- `WizardContext.tsx` bevat zelf al de waarschuwing: *"⚠️ DEPRECATION WARNING: Dit bestand is
  mogelijk redundant geworden door de gecentraliseerde UIOrchestrator."*

**Fix**:
1. Verwijder `<WizardProvider>` uit `App.tsx`
2. Verwijder de import van `WizardProvider` uit `App.tsx`
3. Tombstone `WizardContext.tsx` → `export {}`
4. Voeg toe aan `git rm`-lijst in §17

---

### TODO-7 🟡 DODE CODE — Duplicate TransactionHistoryContainer

**Ernst**: Middel — mogelijk verwarrend bij onderhoud; één exemplaar is dead code.

Er zijn **twee** bestanden met dezelfde naam:

| Pad | Geïmporteerd door | Status |
|-----|------------------|--------|
| `src/ui/sections/TransactionHistoryContainer.tsx` | `screens.tsx` (UndoScreenRenderer) | ✅ Actief |
| `src/ui/screens/Daily/TransactionHistoryContainer.tsx` | **Nergens** | ❌ Dead code |

Extra bevinding: `Daily/TransactionHistoryContainer.tsx` heeft in de JSDoc:
```
@see UndoScreenRenderer (screens.tsx) — gebruikt deze container
```
Deze `@see` is **onjuist** — `screens.tsx` importeert uit `@ui/sections/...`, niet uit
`@ui/screens/Daily/...`. De `@changes`-opmerking ("Nieuw: vervangt useTransactionHistory +
UndoScreen legacy") suggereert dat het een vroegere prototype was die later is overschreven door
het `sections/`-exemplaar.

**Fix**:
```bash
git rm src/ui/screens/Daily/TransactionHistoryContainer.tsx
rmdir src/ui/screens/Daily
```

---

### TODO-8 🟢 DOCUMENTATIE — DynamicSection JSDoc is misleidend

**Bestand**: `src/ui/sections/sections.tsx`, `@ai_instruction` in de bestandsheader-JSDoc  
**Ernst**: Laag — de opmerking klopt niet meer met de implementatie.

De huidige JSDoc zegt:
> *"Het `RenderEntries`-component dat hier wordt aangeroepen, is niet gedefinieerd, wat duidt op
> een implementatiefout. De bedoeling is om hier over de `fields`-prop te itereren en voor elk
> item de `Renderer` aan te roepen."*

Dit klopt niet: de implementatie in `sections.tsx` itereert correct over `children`
via `DynamicEntry`. Er is geen sprake van een implementatiefout. De tekst stamt uit een
vroegere iteratie en beschrijft een toestand die allang opgelost is.

**Fix**: Vervang de misleidende `@ai_instruction` door een correcte beschrijving van
hoe `DynamicSection` nu werkt (via `children: RenderEntryVM[]` + `DynamicEntry`).

---

### TODO-9 🟡 INCONSISTENTIE — currentScreenId is lowercase 'landing' na HYDRATE en initialisatie

**Bestand**: `src/app/state/formReducer.ts` (HYDRATE case) + `src/app/state/initialFormState.ts`  
**Ernst**: Middel — alle andere scherm-IDs zijn UPPERCASE; `currentScreenId` wordt alleen
gebruikt voor wizard-validatie maar inconsistentie verhoogt de kans op toekomstige bugs.

```typescript
// formReducer.ts — HYDRATE:
currentScreenId: 'landing',   // ← lowercase

// initialFormState.ts:
currentScreenId: 'landing',   // ← lowercase

// Alle andere scherm-IDs in ScreenRegistry: 'SPLASH', 'LANDING', 'DASHBOARD', etc.
// NavigationOrchestrator.navigateTo() dispatcht SET_CURRENT_SCREEN_ID met uppercase ID
// bij WIZARD-schermen — maar dit initialiseert lowercase.
```

**Impact**: `canNavigateNext()` roept `this.validation.validateSection(currentId, ...)` aan
met `currentId = 'landing'`. Dit is alleen een probleem als `validateSection` een sectie
opzoekt die met UPPERCASE-ID's werkt. Op het LANDING-scherm is er geen NavigationFooter,
dus de validatie wordt niet aangeroepen — waardoor de inconsistentie in de praktijk benigne is.

**Fix** — aligneer initialisatiewaarden met de rest:
```typescript
// formReducer.ts HYDRATE case:
currentScreenId: 'LANDING',   // ← uppercase

// initialFormState.ts:
currentScreenId: 'LANDING',   // ← uppercase
```
