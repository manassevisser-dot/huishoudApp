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
==============
plan 2:
Perfect — dan pakken we het plan dat ik eerder schetste, maar nu **specifiek afgestemd op jouw huidige situatie**, waarin:

- de **ACL (Anti‑Corruption Layer)** nu in de **ImportOrchestrator** zit  
- de **MasterOrchestrator** nog steeds te veel verantwoordelijkheden heeft  
- de architectuur al richting “clusters” beweegt (domain, app, ui)

Hier is een **concreet, uitvoerbaar opsplitsplan** dat precies past bij jouw codebase en de richting waarin je al aan het refactoren bent.

---

# 🧭 Doel van de opsplitsing
De MasterOrchestrator moet een **façade** worden:

- dun  
- declaratief  
- geen logica  
- alleen orkestratie tussen clusters

Alles wat nu in de Master zit, maar eigenlijk een *workflow*, *mapping*, *state‑mutatie* of *businesslogica* is, moet eruit.

---

# 🧩 Het uiteindelijke ontwerp (4 sub‑orchestrators + façade)

```
MasterOrchestrator
│
├── ScreenOrchestrator
├── FieldOrchestrator
├── ImportWorkflowOrchestrator   ← ACL zit hier al in ImportOrchestrator
├── DailyTransactionOrchestrator
└── BusinessStateOrchestrator
```

De Master wordt dan:

```ts
class MasterOrchestrator {
  screen: ScreenOrchestrator
  fields: FieldOrchestrator
  importWorkflow: ImportWorkflowOrchestrator
  daily: DailyTransactionOrchestrator
  business: BusinessStateOrchestrator
}
```

---

# 🧱 Stap‑voor‑stap opsplitsplan

## 1. **ScreenOrchestrator**  
Verplaats ALLE UI‑mapping:

- `buildRenderScreen`
- `toRenderScreen`
- `toRenderSection`
- `toRenderEntry`
- `evaluateVisibility`

Waarom?

- Dit is pure view‑mapping.
- Geen businesslogica.
- Geen state‑mutatie.
- Perfect te testen.

**Nieuwe klasse:**

```ts
class ScreenOrchestrator {
  constructor(private ui, private fso, private visibility) {}

  buildRenderScreen(screenId: string) { ... }
}
```

Master:

```ts
return this.screen.buildRenderScreen(screenId);
```

---

## 2. **FieldOrchestrator**  
Verplaats:

- `updateField`
- `validateSection`
- `canNavigateNext`
- `onNavigateNext`
- `onNavigateBack`

Waarom?

- Dit is boundary‑validatie + state‑mutatie.
- Dit hoort niet in dezelfde klasse als CSV‑import of daily transactions.

**Nieuwe klasse:**

```ts
class FieldOrchestrator {
  updateField(fieldId, value) { ... }
  validateSection(sectionId) { ... }
}
```

Master:

```ts
this.fields.updateField(fieldId, value);
```

---

## 3. **ImportWorkflowOrchestrator**  
Dit is de belangrijkste workflow.  
Je ACL zit nu in de **ImportOrchestrator**, dus deze orchestrator moet:

- state ophalen
- ImportOrchestrator aanroepen
- ResearchOrchestrator aanroepen
- dispatchen naar FSO
- business state recomputen
- logging doen

Verplaats:

- `handleCsvImport`
- `dispatchImportData`
- `logImportCompletion`

**Nieuwe klasse:**

```ts
class ImportWorkflowOrchestrator {
  constructor(private fso, private data, private research, private business) {}

  async handleCsvImport(csvText: string) { ... }
}
```

Master:

```ts
await this.importWorkflow.handleCsvImport(csvText);
```

---

## 4. **DailyTransactionOrchestrator**
Verplaats:

- `saveDailyTransaction`
- `buildExpenseItemForTransaction`
- `persistTransactionAndReset`

Waarom?

- Dit is een compleet aparte use case.
- Heeft niets te maken met UI‑rendering of CSV‑import.

**Nieuwe klasse:**

```ts
class DailyTransactionOrchestrator {
  saveDailyTransaction() { ... }
}
```

Master:

```ts
this.daily.saveDailyTransaction();
```

---

## 5. **BusinessStateOrchestrator**
Verplaats:

- `recomputeBusinessState`

Waarom?

- Wordt door meerdere workflows gebruikt
- Hoort niet in de Master

**Nieuwe klasse:**

```ts
class BusinessStateOrchestrator {
  recompute(state) { ... }
}
```

Master:

```ts
this.business.recompute(this.fso.getState());
```

---

# 🧨 Hoe de Master er daarna uitziet

```ts
export class MasterOrchestrator {
  constructor(
    private readonly screen: ScreenOrchestrator,
    private readonly fields: FieldOrchestrator,
    private readonly importWorkflow: ImportWorkflowOrchestrator,
    private readonly daily: DailyTransactionOrchestrator,
    private readonly business: BusinessStateOrchestrator,
  ) {}

  buildRenderScreen(id) {
    return this.screen.buildRenderScreen(id);
  }

  updateField(id, value) {
    this.fields.updateField(id, value);
  }

  async handleCsvImport(csv) {
    await this.importWorkflow.handleCsvImport(csv);
  }

  saveDailyTransaction() {
    return this.daily.saveDailyTransaction();
  }
}
```

**Dun.  
Overzichtelijk.  
Geen logica.  
Alle workflows netjes gescheiden.**

---

# 🧠 Waarom dit perfect aansluit op jouw huidige code

- De ACL zit al in de ImportOrchestrator → dus de ImportWorkflowOrchestrator hoeft alleen te orkestreren.
- Je clusters (domain, app, ui) zijn al gescheiden → dit plan sluit daar direct op aan.
- Je Master is nu een God Object → dit plan maakt hem een façade.
- Je FormStateOrchestrator blijft de enige bron van waarheid → consistent.

---

# 🚀 Wil je dat ik de code‑skeletbestanden genereer voor alle 5 orchestrators?  
Dan kun je ze direct in je repo plakken en beginnen met verplaatsen.

===============
PLan 3:
# Derde splitsingsplan: MasterOrchestrator naar gespecialiseerde orchestrators

## Inleiding
De huidige `MasterOrchestrator` is een God Object met ~220 regels productie-logica, verantwoordelijk voor:
- UI-rendering (buildRenderScreen)
- Veldupdates en validatie
- CSV-import workflow
- Dagelijkse transactie workflow
- Business state recompute
- Navigatie-delegatie

Dit plan splitst de MasterOrchestrator op in **vijf gespecialiseerde orchestrators**, waarbij de Master een dunne façade wordt. Het plan combineert de sterke punten van de twee eerdere voorstellen en sluit aan bij de bestaande cluster-architectuur (domain, app).

## Doel
- MasterOrchestrator wordt een façade zonder eigen logica (~40-50 regels).
- Elke gespecialiseerde orchestrator heeft één duidelijke verantwoordelijkheid.
- Geen breaking changes voor consumers (de publieke API blijft identiek).
- Maximale testbaarheid en onderhoudbaarheid.

## Voorgestelde bestandsstructuur
```
src/app/orchestrators/
├── MasterOrchestrator.ts                 ← façade
├── workflows/
│   ├── ScreenOrchestrator.ts             ← UI-rendering + visibility
│   ├── FieldOrchestrator.ts               ← veldupdates, sectievalidatie, canNavigateNext
│   ├── BusinessStateOrchestrator.ts       ← herberekenen business state (financial summary)
│   ├── ImportWorkflowOrchestrator.ts      ← CSV-import workflow (gebruikt ACL via DataManager)
│   └── DailyTransactionWorkflowOrchestrator.ts ← dagelijkse transactie workflow
└── types/
    └── render.types.ts                    ← (optioneel) types gedeeld met UI
```

## Gedetailleerde beschrijving van elke orchestrator

### 1. ScreenOrchestrator
**Verantwoordelijkheid:**  
Omzetten van `StyledScreenVM` naar `RenderScreenVM` (render-ready data voor UI). Bevat alle mapping-logica en evaluatie van zichtbaarheid.

**Publieke API:**
```typescript
class ScreenOrchestrator {
  constructor(
    private readonly ui: IUIOrchestrator,
    private readonly fso: FormStateOrchestrator,
    private readonly visibility: IVisibilityEvaluator,
    private readonly onFieldChange: (fieldId: string, value: unknown) => void, // callback naar FieldOrchestrator
  ) {}

  buildRenderScreen(screenId: string): RenderScreenVM;
  isVisible(ruleName: string, memberId?: string): boolean; // delegatie naar visibility
}
```

**Verhuisde code uit MasterOrchestrator:**
- `buildRenderScreen`, `toRenderScreen`, `toRenderSection`, `toRenderEntry`
- `evaluateVisibility`
- Type-definities `RenderScreenVM`, `RenderSectionVM`, `RenderEntryVM` (worden geëxporteerd)

**Aandachtspunt:**  
De `onChange` in `toRenderEntry` gebruikt de meegegeven `onFieldChange`-callback, die in de MasterOrchestrator naar `FieldOrchestrator.updateField` verwijst. Zo blijft de koppeling los.

### 2. FieldOrchestrator
**Verantwoordelijkheid:**  
Afhandelen van veldupdates (met boundary-validatie), valideren van hele secties, en bepalen of naar volgende sectie genavigeerd mag worden.

**Publieke API:**
```typescript
class FieldOrchestrator {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly validation: IValidationOrchestrator,
    private readonly visibility: IVisibilityEvaluator, // voor eventueel gebruik (nu niet nodig)
    private readonly business: BusinessStateOrchestrator, // voor recompute na update
  ) {}

  updateField(fieldId: string, value: unknown): void;
  validateSection(sectionId: string): SectionValidationResult;
  canNavigateNext(sectionId: string): boolean; // gebaseerd op validateSection
}
```

**Verhuisde code uit MasterOrchestrator:**
- `updateField` (zonder `recomputeBusinessState` – die wordt via `business` aangeroepen)
- `validateSection`
- `canNavigateNext` (wordt hier geïmplementeerd)

**Waarom apart?**  
Deze methoden vormen een logische eenheid rond veld- en sectie-interactie. Ze worden ook gebruikt door andere workflows (bijv. na import moet niet opnieuw gevalideerd worden).

### 3. BusinessStateOrchestrator
**Verantwoordelijkheid:**  
Herberekenen van de business viewmodel (financial summary) en dispatchen van `UPDATE_VIEWMODEL`. Wordt door meerdere workflows gebruikt.

**Publieke API:**
```typescript
class BusinessStateOrchestrator {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly business: IBusinessOrchestrator,
  ) {}

  recompute(): void;
}
```

**Verhuisde code uit MasterOrchestrator:**
- `recomputeBusinessState`

**Waarom apart?**  
Vermijdt code-duplicatie in `FieldOrchestrator`, `ImportWorkflowOrchestrator` en `DailyTransactionWorkflowOrchestrator`. Maakt deze orchestrators eenvoudiger en meer SRP.

### 4. ImportWorkflowOrchestrator
**Verantwoordelijkheid:**  
Orkestreren van de volledige CSV-import:
1. State ophalen
2. DataManager (ACL) aanroepen voor parsing
3. ResearchOrchestrator aanroepen voor verrijking
4. State updaten via FSO
5. Business state herberekenen
6. Loggen

**Publieke API:**
```typescript
class ImportWorkflowOrchestrator {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly data: DataManager,               // bevat ACL (processCsvImport)
    private readonly research: ResearchOrchestrator,
    private readonly business: BusinessStateOrchestrator,
  ) {}

  async execute(csvText: string): Promise<void>;
}
```

**Verhuisde code uit MasterOrchestrator:**
- `handleCsvImport` (wordt `execute`)
- `dispatchImportData`
- `logImportCompletion`

**Opmerking:**  
De ACL (Anti-Corruption Layer) zit al in `DataManager.processCsvImport`. Deze orchestrator gebruikt die en voegt alleen de workflow-stappen toe.

### 5. DailyTransactionWorkflowOrchestrator
**Verantwoordelijkheid:**  
Valideren, opslaan en resetten van een dagelijkse transactie.

**Publieke API:**
```typescript
class DailyTransactionWorkflowOrchestrator {
  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly business: BusinessStateOrchestrator,
  ) {}

  execute(): boolean; // true als succesvol opgeslagen
}
```

**Verhuisde code uit MasterOrchestrator:**
- `saveDailyTransaction` (wordt `execute`)
- `buildExpenseItemForTransaction`
- `persistTransactionAndReset`

**Afhankelijkheid:**  
Gebruikt `computePhoenixSummary` (pure domeinfunctie) – wordt direct geïmporteerd.

## De nieuwe MasterOrchestrator (façade)

Na splitsing wordt `MasterOrchestrator` een dunne façade die alle publieke methoden van de oude klasse aanbiedt door ze te delegeren naar de juiste orchestrators.

```typescript
export class MasterOrchestrator implements MasterOrchestratorAPI {
  public readonly theme: IThemeOrchestrator;
  public readonly navigation: INavigationOrchestrator;
  public readonly ui: IUIOrchestrator;

  private readonly screen: ScreenOrchestrator;
  private readonly fields: FieldOrchestrator;
  private readonly business: BusinessStateOrchestrator;
  private readonly importWorkflow: ImportWorkflowOrchestrator;
  private readonly dailyWorkflow: DailyTransactionWorkflowOrchestrator;

  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly domain: DomainCluster,
    private readonly app: AppCluster,
  ) {
    // Exposeer app-onderdelen voor directe toegang (bestaande publieke properties)
    this.theme = this.app.theme;
    this.navigation = this.app.navigation;
    this.ui = this.app.ui;

    // Instantieer orchestrators met onderlinge afhankelijkheden
    this.business = new BusinessStateOrchestrator(this.fso, this.domain.business);
    this.fields = new FieldOrchestrator(this.fso, this.domain.validation, this.domain.visibility, this.business);
    this.screen = new ScreenOrchestrator(
      this.app.ui,
      this.fso,
      this.domain.visibility,
      (fieldId, value) => this.fields.updateField(fieldId, value), // callback
    );
    this.importWorkflow = new ImportWorkflowOrchestrator(
      this.fso,
      this.domain.data,
      this.domain.research,
      this.business,
    );
    this.dailyWorkflow = new DailyTransactionWorkflowOrchestrator(this.fso, this.business);
  }

  // === UI-rendering ===
  buildRenderScreen(screenId: string): RenderScreenVM {
    return this.screen.buildRenderScreen(screenId);
  }

  // === Visibility (publiek) ===
  isVisible(ruleName: string, memberId?: string): boolean {
    return this.screen.isVisible(ruleName, memberId);
  }

  // === Veldupdates ===
  updateField(fieldId: string, value: unknown): void {
    this.fields.updateField(fieldId, value);
  }

  // === Navigatie (delegatie naar app.navigation) ===
  onNavigateBack(): void {
    this.app.navigation.navigateBack();
  }

  onNavigateNext(): void {
    this.app.navigation.navigateNext();
  }

  canNavigateNext(sectionId: string): boolean {
    return this.fields.canNavigateNext(sectionId);
  }

  // === Workflows ===
  async handleCsvImport(csvText: string): Promise<void> {
    await this.importWorkflow.execute(csvText);
  }

  saveDailyTransaction(): boolean {
    return this.dailyWorkflow.execute();
  }
}
```

**Geschatte omvang:** ~50 regels (exclusief boilerplate).

## Publieke API stabiliteit
- Alle publieke methoden van `MasterOrchestratorAPI` blijven bestaan met exact dezelfde signaturen.
- De types `RenderScreenVM`, `RenderSectionVM`, `RenderEntryVM` worden nu geëxporteerd vanuit `ScreenOrchestrator` (of een gedeeld types-bestand). De MasterOrchestrator re-exporteert ze om breaking changes te voorkomen.
- Consumers (zoals `UniversalScreen`) merken niets van de interne herstructurering.

## Risico's en mitigaties

| Risico | Mitigatie |
|--------|-----------|
| **Circulaire afhankelijkheden** via callbacks | De callback in `ScreenOrchestrator` is een functie, geen orchestrator-injectie. Geen module-cirkel. |
| **Type-definities niet meer op dezelfde plek** | Types worden verplaatst naar `ScreenOrchestrator.ts` en opnieuw geëxporteerd door `MasterOrchestrator`. |
| **Tests moeten worden aangepast** | Oude tests voor `MasterOrchestrator` worden kleiner; nieuwe unit-tests per orchestrator worden geschreven. Dit is een gewenste verbetering. |
| **Vergeten van `recomputeBusinessState` in een workflow** | Door `BusinessStateOrchestrator` centraal te gebruiken, is de kans kleiner. Alle workflows die state wijzigen, moeten `business.recompute()` aanroepen. |
| **Prestaties door extra aanroepen** | Verwaarloosbaar; alle orchestrators zijn lichtgewicht en delegeren alleen. |

## Volgorde van implementatie
1. **BusinessStateOrchestrator** – klein, wordt door anderen gebruikt.
2. **ScreenOrchestrator** – meest onafhankelijk, kan als eerste worden gebouwd en getest.
3. **FieldOrchestrator** – afhankelijk van BusinessStateOrchestrator.
4. **DailyTransactionWorkflowOrchestrator** – afhankelijk van BusinessStateOrchestrator.
5. **ImportWorkflowOrchestrator** – afhankelijk van DataManager, ResearchOrchestrator en BusinessStateOrchestrator.
6. **MasterOrchestrator** opschonen – vervang interne logica door delegatie naar nieuwe orchestrators.

Tijdens de implementatie kunnen we stap voor stap te werk gaan: per orchestrator de code uit de Master verplaatsen, tests schrijven, en pas aan het einde de Master herschrijven. Zo blijft de applicatie altijd werkend.

## Conclusie
Dit derde plan leidt tot een schone, modulaire MasterOrchestrator met vijf gespecialiseerde collega's. Het respecteert de bestaande architectuur, behoudt volledige backward compatibility, en maakt de codebase aanzienlijk onderhoudbaarder.
