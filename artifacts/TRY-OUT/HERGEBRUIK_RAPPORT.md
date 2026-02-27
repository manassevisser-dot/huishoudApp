# Read-Only Onderzoeksrapport: Hergebruik bestaande code bij MasterOrchestrator splitsing

_Datum: 23-02-2026 | Methode: Read-only analyse van src/_

---

## Onderzoeksvraag

Kunnen de 5 "nieuwe" orchestrators uit het Optimaal Splitsingsplan worden ondergebracht in
al bestaande orchestrators/managers, zodat we geen nieuwe bestanden hoeven te maken?

---

## Mapping: Nieuw plan → Bestaande code

### 1. `BusinessStateOrchestrator` (nieuw in plan)

**Wat het plan wil:**
```typescript
class BusinessStateOrchestrator {
  recompute(): void {
    const summary = this.business.prepareFinancialViewModel(this.fso.getState());
    this.fso.dispatch({ type: 'UPDATE_VIEWMODEL', payload: { financialSummary: summary } });
  }
}
```

**Wat al bestaat:**

| Bestand | Wat het al doet |
|---------|----------------|
| `FinancialOrchestrator.ts` | Berekent `computePhoenixSummary` + formatteert naar `FinancialSummaryVM`. Pure transformatie, stateless. |
| `BusinessManager.ts` | Wikkelt `FinancialOrchestrator.prepareViewModel()` in `IBusinessOrchestrator`. Delegeert alleen. |

**Analyse:** De rekenlogica bestaat al volledig. Het enige dat ontbreekt is de
`fso.dispatch(UPDATE_VIEWMODEL)` stap — één regel. Die zit nu in `MasterOrchestrator.recomputeBusinessState()`.

**Conclusie:** `BusinessStateOrchestrator` is **BusinessManager + één dispatch-aanroep**.
Optie A: Voeg een `recompute(fso)` methode toe aan `BusinessManager` (bestaand bestand uitbreiden).
Optie B: Nieuwe klasse maken — maar dan is het een dunne wrapper om iets dat al bestaat.

---

### 2. `FieldOrchestrator` (nieuw in plan)

**Wat het plan wil:**
```typescript
class FieldOrchestrator {
  updateField(fieldId, value): void   // boundary-validatie + fso.updateField + recompute
  validateSection(sectionId): SectionValidationResult
  canNavigateNext(sectionId): boolean
}
```

**Wat al bestaat:**

| Bestand | Wat het al doet |
|---------|----------------|
| `ValidationOrchestrator.ts` | `validateSection()`, `validateField()`, `validateAtBoundary()` — volledig geïmplementeerd |
| `NavigationOrchestrator.ts` | `canNavigateNext()` — al geïmplementeerd, gebruikt `validation.validateSection` intern |
| `adapters/validation/validateAtBoundary` | De boundary-adapter die `updateField` aanroept in Master |

**Kritiek overlap:** `NavigationOrchestrator` heeft al `canNavigateNext()`. Het plan wil dit opnieuw implementeren in `FieldOrchestrator`. Dat is **directe duplicatie**.

**Conclusie:**
- `validateSection` en `validateAtBoundary` zitten al in `ValidationOrchestrator` — niets nieuws
- `canNavigateNext` zit al in `NavigationOrchestrator` — zou gedupliceerd worden
- `updateField` (de boundary-validatie + dispatch + recompute) is het enige echte nieuwe stuk

Optie: Verplaats `updateField` naar `ValidationOrchestrator` als `updateAndValidate()`, of maak een
dunne nieuwe klasse die `ValidationOrchestrator` en de dispatch-logica combineert — maar zorg dat
`NavigationOrchestrator.canNavigateNext()` de autoriteit blijft.

---

### 3. `ScreenOrchestrator` (nieuw in plan)

**Wat het plan wil:**
```typescript
class ScreenOrchestrator {
  buildRenderScreen(screenId): RenderScreenVM  // StyledVM → RenderVM mapping
  isVisible(ruleName, memberId): boolean
}
```

**Wat al bestaat:**

| Bestand | Wat het al doet |
|---------|----------------|
| `UIOrchestrator.ts` | `buildScreen(screenId): StyledScreenVM` — bouwt het gestylede VM via UIManager |
| `UIManager.ts` | Combineert `ScreenViewModelFactory` + `ScreenStyleFactory` |
| `VisibilityOrchestrator.ts` | `evaluate(ruleName, memberId): boolean` — volledig geïmplementeerd |

**Wat NOG NIET bestaat:**
De `toRenderScreen()`, `toRenderSection()`, `toRenderEntry()` mapping — de transformatie van
`StyledScreenVM` naar `RenderScreenVM` (met resolved labels, `onChange` handlers, visibility flags)
staat **alleen in MasterOrchestrator**. Dit is de echte nieuwe logica.

**Conclusie:** `ScreenOrchestrator` = `UIOrchestrator.buildScreen()` + de mapping-logica uit Master
+ `VisibilityOrchestrator.evaluate()`.

Optimale optie: **Breid `UIOrchestrator` uit** met een `buildRenderScreen()` methode die de
mapping-logica bevat. `isVisible` delegeert naar `VisibilityOrchestrator`. Geen nieuw bestand nodig,
`UIOrchestrator` is precies de juiste plek — het is al de interface tussen StyleFactory en de buitenwereld.

---

### 4. `ImportWorkflowOrchestrator` (nieuw in plan)

**Wat het plan wil:**
```typescript
class ImportWorkflowOrchestrator {
  async execute(csvText): Promise<void>  // parse → research → dispatch → log
}
```

**Wat al bestaat:**

| Bestand | Wat het al doet |
|---------|----------------|
| `ImportOrchestrator.ts` | Volledig CSV-parsing pipeline: parsen, normaliseren, categoriseren, digest, PII-strip |
| `DataManager.ts` | Wikkelt `ImportOrchestrator.processCsvImport()` in een dun facade-object |
| `ResearchOrchestrator.ts` | `processAllData()` — verrijkt de geparsede data voor research en local gebruik |

**Wat NOG NIET bestaat:**
De workflow-coördinatie (parse → research → dispatch → log) staat in `MasterOrchestrator.handleCsvImport()`.
`DataManager` is al bedoeld als façade maar heeft de research- en dispatch-stappen niet.

**Conclusie:** De zware lifting (`ImportOrchestrator`, `ResearchOrchestrator`) bestaat al.
De workflow-coördinatie is het nieuwe stuk.

Optimale optie: **Breid `DataManager` uit** met een `executeImportWorkflow()` methode die de
volledige orchestratie doet (inclusief research en dispatch-aanroep via callback of directe dependency).
`DataManager` is al de façade voor import — dit past exact bij zijn verantwoordelijkheid. Geen nieuw bestand.

---

### 5. `DailyTransactionWorkflowOrchestrator` (nieuw in plan)

**Wat het plan wil:**
```typescript
class DailyTransactionWorkflowOrchestrator {
  execute(): boolean  // valideer latestTransaction, bouw ExpenseItem, persist, reset
}
```

**Wat al bestaat:**

Niets. De `saveDailyTransaction`, `buildExpenseItemForTransaction` en `persistTransactionAndReset`
logica staat **alleen in MasterOrchestrator**. Er is geen bestaand bestand dat ook maar in de buurt komt.

`computePhoenixSummary` (domeinregel) wordt intern gebruikt — maar dat is een pure functie,
geen orchestrator.

**Conclusie:** Dit is de **enige** orchestrator die echt nieuw moet zijn. Geen bestaand bestand
kan deze rol overnemen zonder zijn eigen verantwoordelijkheid te overschrijden.

---

## Samenvatting: Nieuw vs Hergebruik

| Geplande orchestrator | Hergebruik mogelijk? | Beste optie |
|-----------------------|---------------------|-------------|
| `BusinessStateOrchestrator` | ✅ 80% al in `BusinessManager` | Voeg `recompute(fso)` toe aan `BusinessManager` |
| `FieldOrchestrator` | ⚠️ Deels — `validateSection` in `ValidationOrchestrator`, `canNavigateNext` in `NavigationOrchestrator` | Verplaats alleen `updateField` logica, delegeer de rest naar bestaande orchestrators |
| `ScreenOrchestrator` | ✅ 60% al in `UIOrchestrator` + `VisibilityOrchestrator` | Breid `UIOrchestrator` uit met `buildRenderScreen()` mapping |
| `ImportWorkflowOrchestrator` | ✅ 70% al in `DataManager` + `ImportOrchestrator` | Breid `DataManager` uit met workflow-methode |
| `DailyTransactionWorkflowOrchestrator` | ❌ Niets herbruikbaar | Nieuw bestand vereist |

---

## Hergebruik-optimaal plan (aangepast voorstel)

In plaats van 5 nieuwe bestanden in `workflows/`:

```
Aanpassing in bestaande bestanden:
  BusinessManager.ts          ← + recompute(fso) methode
  UIOrchestrator.ts           ← + buildRenderScreen() + isVisible() delegatie
  DataManager.ts              ← + executeImportWorkflow() methode
  ValidationOrchestrator.ts   ← ongewijzigd (wordt als dependency gebruikt)
  NavigationOrchestrator.ts   ← ongewijzigd (canNavigateNext() blijft hier)

Nieuw bestand (onvermijdelijk):
  workflows/DailyTransactionWorkflow.ts   ← geen alternatief

Nieuw bestand (types):
  types/render.types.ts       ← RenderScreenVM etc. uit MasterOrchestrator
```

**TODO melding:** ACL-verificatie
De TODO in MasterOrchestrator is technisch achterhaald. ImportOrchestrator is al een effectieve ACL:

PII wordt gestript via dataProcessor.stripPII()
Datum genormaliseerd, categorie gecategoriseerd
original.rawDigest is een hash, niet de ruwe CSV-tekst

Er is wel een architecturele schuld op type-niveau: CsvItem extends Record<string, unknown> maakt het type onnodig open. Maar die TODO staat al in research.ts gedocumenteerd — het werk is geïdentificeerd, het is geen urgent blocker.
De TODO in MasterOrchestrator kan weg.

**Gevolg:** MasterOrchestrator.ts zakt naar ~45 regels via delegatie naar bestaande én
licht uitgebreide orchestrators. Slechts 1 nieuw orchestrator-bestand i.p.v. 5.

---

## Risico's van dit hergebruik-pad

| Risico | Omschrijving |
|--------|-------------|
| `BusinessManager` krijgt FSO-dependency | Nu heeft BusinessManager geen FSO. `recompute(fso)` injecteren als parameter van de methode (niet constructor) houdt de klasse stateless. |
| `UIOrchestrator` wordt groter | `buildRenderScreen` + mapping is ~60 regels. Risico op max-lines-per-function. Extraheer de mapping naar private helpers of een apart `RenderMapper` object binnen hetzelfde bestand. |
| `DataManager` krijgt research-dependency | Nu heeft DataManager geen `ResearchOrchestrator`. Injecteren via constructor of methode-parameter. Dit past bij de bestaande `IDataOrchestrator` uitbreiden. |
| `canNavigateNext` duplicatie-risico | Zorg expliciet dat `FieldOrchestrator` (als die toch gemaakt wordt) delegeert naar `NavigationOrchestrator`, niet opnieuw implementeert. |
