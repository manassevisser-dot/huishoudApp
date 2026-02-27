# Orchestrators

## 🎯 Verantwoordelijkheid

De orchestrator-map coördineert alle applicatie-logica. Orchestrators zijn de enige laag die FormState muteert, business-regels evalueert, navigatie beheert en UI-ViewModels assembleert. Ze vormen de brug tussen de domeinlaag (registries, rules) en de UI-laag (schermen, entries).

---

## 🏗️ Architectuur

- **Layer**: Application (Facade + Coordination)
- **Pattern**: Facade (`MasterOrchestrator`), Command, Strategy
- **Afhankelijkheidsrichting**: Orchestrators importeren domein; UI importeert alleen `MasterOrchestratorAPI`

```
MasterOrchestrator  (publieke façade — MasterOrchestratorAPI)
  ├── FormStateOrchestrator   ← exclusieve state-toegang
  ├── BusinessManager         ← inkomstenberekeningen
  ├── ValidationOrchestrator  ← veld-validatie pipeline
  ├── UIOrchestrator          ← buildRenderScreen() + isVisible()
  ├── NavigationOrchestrator  ← stap-navigatie + canNavigateNext()
  ├── ThemeOrchestrator       ← thema-persistentie
  ├── DataManager             ← CSV-import workflow
  ├── ResearchOrchestrator    ← privacy-airlock onderzoek
  ├── DailyTransactionWorkflow
  ├── SettingsWorkflow
  └── ResetWorkflow
```

`MasterOrchestrator` bevat **geen eigen logica** — elke methode delegeert naar één van bovenstaande.

---

## 📋 Contract / API

### MasterOrchestrator

| Methode | Delegeert naar | Beschrijving |
|---|---|---|
| `buildRenderScreen(screenId)` | `UIOrchestrator` | Assembleert volledig RenderScreenVM |
| `updateField(fieldId, value)` | `ValidationOrchestrator` / `SettingsWorkflow` | Valideert en schrijft veldwaarde |
| `saveDailyTransaction()` | `DailyTransactionWorkflow` | Persisteert dagelijkse transactie |
| `handleCsvImport(params)` | `DataManager` | Verwerkt CSV-upload |
| `executeReset(type)` | `ResetWorkflow` | `'full'` of `'setup'` reset |
| `canNavigateNext(sectionId)` | `NavigationOrchestrator` | Stap-validatie voor Verder-knop |
| `isVisible(ruleName, memberId?)` | `UIOrchestrator` | Visibility-evaluatie per rule |

> **`theme`-veld**: `updateField('theme', value)` wordt **niet** naar de validatiepipeline gestuurd — `SettingsWorkflow` handelt dit af zonder FormState-mutatie.

### FormStateOrchestrator

De enige toegangspoort tot `FormState`. Alle lees- en schrijfoperaties lopen via deze klasse.

| Methode | Beschrijving |
|---|---|
| `getValue(fieldId)` | Leest veldwaarde — zoekt in income/expense items, setup en household |
| `updateField(fieldId, value)` | Schrijft gevalideerde waarde via `StateWriterAdapter` |
| `getValidationError(fieldId, value)` | Valideert op grens via `validateAtBoundary` |
| `getState()` | Direct snapshot van huidige FormState (publiek, read-only gebruik) |
| `dispatch(action)` | Dispatcht een reducer-actie (publiek voor workflows) |

### Term-definities

- **Façade**: `MasterOrchestrator` is een dunne doorgeefluik. Bevat geen businesslogica — als een methode meer doet dan delegeren, is het verkeerd.
- **`StateWriterAdapter`**: De abstractielaag die de werkelijke state-mutaties uitvoert achter `FormStateOrchestrator.updateField()`.
- **`MappingContext`**: Configuratieobject dat `UIOrchestrator.buildRenderScreen()` ontvangt — bevat FSO, onChange/onNavigate callbacks en `valueResolvers`.
- **`DomainCluster` / `AppCluster`**: Constructor-grouping van afhankelijkheden — houdt de constructor leesbaar zonder lange parameterlijst.

---

## 💡 Best Practices

- Voeg **geen logica** toe aan `MasterOrchestrator` — maak een nieuwe sub-orchestrator of workflow
- Lees FormState altijd via `FormStateOrchestrator.getValue()`, nooit direct via `getState().data[...]`
- Nieuwe schermen toevoegen? → `navigateTo()` in `MasterOrchestrator` uitbreiden + `ScreenRegistry`
- Settings-velden (die niet in FormState leven) → afhandelen via `SettingsWorkflow`, niet via validatiepipeline

---

## 🧩 Voorbeelden

```typescript
// UI → MasterOrchestrator (via MasterProvider hook)
const master = useMaster();
master.updateField('nettoSalaris', 2500);
master.saveDailyTransaction();

// FormStateOrchestrator direct (vanuit sub-orchestrators)
const value = fso.getValue('mem_0_name');       // → 'Alice'
fso.updateField('aantalMensen', 3);
const err = fso.getValidationError('postcode', 'FOUT'); // → 'Voer een geldige postcode in'
```

---

## 📦 Publieke API — `MasterOrchestratorAPI`

`src/app/types/MasterOrchestratorAPI.ts` is het **enige importpunt** voor de UI-laag. Consumers importeren nooit `MasterOrchestrator` direct.

### Interface-leden

| Lid | Type | Beschrijving |
|---|---|---|
| `canNavigateNext(sectionId)` | method | Guard: mag de gebruiker naar de volgende stap? |
| `onNavigateNext()` | method | Triggert volgende stap in wizard-flow |
| `onNavigateBack()` | method | Triggert vorige stap |
| `isVisible(ruleName, memberId?)` | method | Evaluatie van een zichtbaarheidsregel |
| `updateField(fieldId, value)` | method | Veldwaarde valideren en schrijven |
| `handleCsvImport(params)` | `async` method | CSV parse → analyse → research workflow |
| `saveDailyTransaction()` | method | Dagelijkse transactie persisteren; retourneert `boolean` |
| `buildRenderScreen(screenId)` | method | Volledig `RenderScreenVM` assembleren |
| `executeReset(type)` | method | `'full'` → LANDING, `'setup'` → WIZARD |
| `ui` | `IUIOrchestrator` | Sub-interface voor UI-operaties |
| `theme` | `IThemeOrchestrator` | Sub-interface voor themabeheer |
| `navigation` | `INavigationOrchestrator` | Sub-interface voor navigatie |

### `CsvUploadParams`

Geëxporteerd type zodat `CsvUploadContainer` het kan importeren zonder directe afhankelijkheid op `MasterOrchestrator`.

| Veld | Type | Beschrijving |
|---|---|---|
| `csvText` | `string` | Volledige CSV-tekst in UTF-8 |
| `fileName` | `string` | Originele bestandsnaam voor state-opslag |
| `bank?` | `DutchBank` | Hint voor kolomdetectie (auto-gedetecteerd) |

---

## 📂 Types-submap — `orchestrators/types/`

Bevat type-definities die specifiek zijn voor de orchestrator-laag en niet thuishoren in `core/types`.

### `render.types.ts` — Render-ready ViewModels

Type-definities voor het volledig geassembleerde render-model dat de UI direct consumeert. Geen logica — puur shapes.

| Export | Beschrijving |
|---|---|
| `RenderScreenVM` | Volledig scherm-model: `screenId`, `title`, `type`, `sections`, `navigation` |
| `RenderSectionVM` | Één sectie: `sectionId`, `title`, `layout`, `uiModel`, `children` |
| `RenderEntryVM` | Één veld: `fieldId`, `primitiveType`, `value`, `isVisible`, `onChange` + stijlprops |

> `MasterOrchestrator` re-exporteert deze types voor backward compatibility met consumers die vóór de extractie importeerden.

### `csvUpload.types.ts` — CSV ACL-typeketen

Volledig getypte keten van ruw bankbestand tot analyse-resultaat. Vijf lagen:

| Laag | Type | Beschrijving |
|---|---|---|
| 1 — Rauw | `RawCsvRow` / `RawCsvItem` | Vóór adapter; alles strings, bank-afhankelijke kolomnamen |
| 2 — Adapter-output | `AdapterCsvItem` | Ná `csvAdapter.mapToInternalModel()`; genormaliseerd, PII aanwezig |
| 3 — ACL-output | `ParsedCsvTransaction` | Ná `ImportOrchestrator`; PII gestript, alle velden bekend en getypt |
| 4 — State-slice | `CsvImportStateSlice` | Wat in `FormState.data.csvImport` wordt opgeslagen |
| 5 — Analyse | `CsvAnalysisResult` | Berekend resultaat in `viewModels`; nooit in `data` |

**Overige exports:** `DutchBank`, `CsvParseResult` (discriminated union), `ImportResult`, `ImportPhase`, `CsvParseOptions`, type guards (`isParsedCsvTransaction`, `isAdapterCsvItem`, etc.)

> **ACL-grens**: `ParsedCsvTransaction` vervangt `research.CsvItem` — geen `extends Record<string, unknown>`, alle velden zijn getypt.

---

## 🔗 Gerelateerd

- [`MasterOrchestratorAPI`](../types/MasterOrchestratorAPI.ts) — publieke interface (consumers importeren dit)
- [`interfaces/README.md`](./interfaces/README.md) — port-contracten per orchestrator
- [`formReducer`](../state/formReducer.ts) — reducer die `dispatch` verwerkt
- [`StateWriterAdapter`](../../adapters/StateWriter/StateWriterAdapter.ts) — concrete state-mutaties
- [`validateAtBoundary`](../../adapters/validation/validateAtBoundary.ts) — grens-validatie
- [`ScreenRegistry`](../../domain/registry/ScreenRegistry.ts) — scherm-definities
