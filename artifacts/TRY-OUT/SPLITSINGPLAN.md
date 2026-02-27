# Splitsingplan: MasterOrchestrator → Workflows

## Analyse van de huidige MasterOrchestrator

### Verantwoordelijkheids-inventaris

| Blok | Regels | Verantwoordelijkheid | Afhankelijkheden |
|------|--------|---------------------|-----------------|
| `buildRenderScreen` + `toRenderScreen/Section/Entry` | ~55 | StyledVM → RenderVM transformatie | `app.ui`, `domain.visibility`, `fso.getValue`, `EntryRegistry`, `labelFromToken` |
| `evaluateVisibility` | ~5 | Visibility delegatie | `domain.visibility` |
| `isVisible`, `onNavigateBack/Next`, `canNavigateNext` | ~15 | UI façade / navigatie | `app.navigation`, `domain.validation` |
| `updateField` | ~15 | State boundary / validatie | `validateAtBoundary`, `fso.updateField`, `recomputeBusinessState` |
| `handleCsvImport` + `dispatchImportData` + `logImportCompletion` | ~55 | CSV import workflow | `domain.data`, `domain.research`, `fso.dispatch` |
| `saveDailyTransaction` + `buildExpenseItem` + `persistTransactionAndReset` | ~60 | Daily transaction workflow | `fso.getState/dispatch`, `computePhoenixSummary` |
| `validateSection` + `recomputeBusinessState` | ~15 | Shared helpers | `domain.validation`, `domain.business`, `fso.dispatch` |

**Totaal nu: ~220 regels productie-logica in één class**

---

## Splitsingvoorstel

### Bestandsstructuur na splitsing

```
src/app/orchestrators/
├── MasterOrchestrator.ts          ← FAÇADE (regie, ~60 regels)
├── workflows/
│   ├── RenderScreenService.ts     ← nieuw (~80 regels)
│   ├── CsvImportWorkflow.ts       ← nieuw (~70 regels)
│   └── DailyTransactionWorkflow.ts ← nieuw (~75 regels)
```

---

### 1. `RenderScreenService`

**Verantwoordelijkheid:** StyledVM → RenderVM transformatie. Weet hoe een screen-definitie omgezet wordt naar render-klare data voor de UI.

**Publieke API:**
```typescript
class RenderScreenService {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly ui: IUIOrchestrator,
    private readonly visibility: IVisibilityEvaluator,
    private readonly onFieldChange: (fieldId: string, value: unknown) => void,
  ) {}

  buildRenderScreen(screenId: string): RenderScreenVM
}
```

**Meeverhuizende code:**
- `toRenderScreen()`, `toRenderSection()`, `toRenderEntry()`
- `evaluateVisibility()`
- Type-definities `RenderScreenVM`, `RenderSectionVM`, `RenderEntryVM` → verhuizen ook naar dit bestand (of naar een apart `render.types.ts`)

**Aandachtspunt:** `onFieldChange` wordt als callback meegegeven vanuit de MasterOrchestrator zodat de entry's `onChange` nog steeds `updateField` aanroept (die de boundary-validatie doet). Geen directe `fso`-koppeling in de entry-callbacks.

---

### 2. `CsvImportWorkflow`

**Verantwoordelijkheid:** Orkestratie van het volledige CSV import-pad: parsen → verwerken → state updaten → loggen.

**Publieke API:**
```typescript
class CsvImportWorkflow {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly data: DataManager,
    private readonly research: ResearchOrchestrator,
    private readonly onRecompute: () => void,
  ) {}

  async execute(csvText: string): Promise<void>
}
```

**Meeverhuizende code:**
- `handleCsvImport()` → wordt `execute()`
- `dispatchImportData()`
- `logImportCompletion()`

**Aandachtspunt:** `onRecompute` is een callback naar `recomputeBusinessState()` in de MasterOrchestrator. Zo blijft de business state recompute gecentraliseerd in de façade, en heeft de workflow geen kennis van `IBusinessOrchestrator`.

---

### 3. `DailyTransactionWorkflow`

**Verantwoordelijkheid:** Validatie, persistentie en reset van een dagelijkse transactie.

**Publieke API:**
```typescript
class DailyTransactionWorkflow {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly onRecompute: () => void,
  ) {}

  execute(): boolean
}
```

**Meeverhuizende code:**
- `saveDailyTransaction()` → wordt `execute()`
- `buildExpenseItemForTransaction()`
- `persistTransactionAndReset()`

**Aandachtspunt:** `computePhoenixSummary` wordt direct geïmporteerd in de workflow — dat is zuiver domein-logica, geen probleem. De `onRecompute` callback zorgt dat de business state na opslaan herberekend wordt zonder dat de workflow de `IBusinessOrchestrator` hoeft te kennen.

---

### 4. `MasterOrchestrator` na splitsing (façade)

**Blijft verantwoordelijk voor:**
- Instantiëren / doorzetten van de drie workflows
- Publieke API die ongewijzigd blijft (`MasterOrchestratorAPI` interface)
- `recomputeBusinessState()` — gedeelde operatie, blijft hier
- `validateSection()` — gedeelde helper, blijft hier
- `updateField()` — state boundary, blijft hier (is API-contract)
- Navigatie-façade: `isVisible`, `onNavigateBack`, `onNavigateNext`, `canNavigateNext`

**Geschatte omvang na splitsing: ~60-70 regels**

---

## Publieke API stabiliteit

De `MasterOrchestratorAPI` interface en alle publieke methode-signaturen blijven **ongewijzigd**. De MasterOrchestrator delegeert alleen intern naar de workflows.

Geen breaking changes voor consumers (`UniversalScreen`, context providers, tests).

---

## Risico's

| Risico | Mitigatie |
|--------|-----------|
| Circulaire afhankelijkheden via `onRecompute` callback | Callback is een plain `() => void` — geen module-import, geen cirkel |
| Type-definities (`RenderScreenVM` etc.) zijn nu elders geïmporteerd | Types verhuizen mee naar `RenderScreenService.ts`, MasterOrchestrator re-exporteert ze |
| Tests voor MasterOrchestrator mocken nu de workflow-classes | MasterOrchestrator.test.ts wordt kleiner, workflow-tests worden apart geschreven |

---

## Volgorde van implementatie

1. `RenderScreenService` — meest isoleerbaar, geen async, geen state-writes
2. `DailyTransactionWorkflow` — alleen `fso` dependency, makkelijkst te testen
3. `CsvImportWorkflow` — heeft meeste dependencies, maar logica is al helder
4. `MasterOrchestrator` opschonen — verwijder gemigreerde methoden, voeg workflow-instanties toe
