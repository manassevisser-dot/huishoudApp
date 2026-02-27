# Cascade-rapport: Vergelijking splitsingplannen MasterOrchestrator

_Datum: 23-02-2026 | Scope: src/_

---

## Vertrekpunt: wat raakt een splitsing?

Onderzochte consumenten van MasterOrchestrator en zijn types:

| Bestand | Koppeling |
|---------|-----------|
| `src/app/types/MasterOrchestratorAPI.ts` | Interface-contract — importeert `RenderScreenVM` direct uit MasterOrchestrator.ts |
| `src/app/context/useStableOrchestrator.ts` | **Assemblagepunt** — instantieert en bedraad alle orchestrators, retourneert MasterOrchestrator |
| `src/app/context/FormContext.tsx` | Consumeert `useStableOrchestrator`, exposeert orchestrator aan UI |
| `src/app/orchestrators/MasterOrchestrator.test.ts` | 420+ regels tests — mockt DomainCluster + AppCluster direct |
| Alle UI-screens via `useFormContext()` | Gebruiken `orchestrator.buildRenderScreen`, `updateField`, etc. |

Kritieke observaties:
1. `RenderScreenVM` is **geïmporteerd vanuit MasterOrchestrator.ts** in de API-interface. Verhuizing van dit type breekt de import-keten tenzij re-export plaatsvindt.
2. `useStableOrchestrator` is de **enige assemblageplek** — wijzigingen in de constructor-signatuur van MasterOrchestrator vereisen aanpassing hier.
3. De test-suite mockt de **DomainCluster en AppCluster** als losse objecten — niet de interne workflows. Dit heeft directe implicaties per plan.

---

## Plan 1 — `SPLITSINGPLAN.md` (3 workflows, callbacks)

### Structuur
```
MasterOrchestrator.ts     ← façade (~70 regels)
workflows/
  RenderScreenService.ts
  CsvImportWorkflow.ts
  DailyTransactionWorkflow.ts
```

### Cascade — positief

**useStableOrchestrator.ts: geen aanpassing nodig.**
De constructor-signatuur van MasterOrchestrator blijft `(fso, DomainCluster, AppCluster)`. De workflows worden intern geïnstantieerd. Dit is de grootste winst van Plan 1.

**MasterOrchestrator.test.ts: minimale aanpassing.**
De bestaande tests mocken DomainCluster en AppCluster — precies het niveau dat Plan 1 bewaart. Tests voor `buildRenderScreen`, `updateField`, `handleCsvImport`, `saveDailyTransaction` blijven werken mits de publieke methoden delegeren. Enkel de interne mock-setup voor `computePhoenixSummary` en `EntryRegistry` moet mogelijk naar de workflow-test verhuizen.

**MasterOrchestratorAPI.ts: geen aanpassing.**
Publieke methoden ongewijzigd.

**RenderScreenVM types: één aanpassing.**
Types verhuizen naar `RenderScreenService.ts`, MasterOrchestrator re-exporteert ze. Eén regeltje toevoegen. Alle consumers onveranderd.

### Cascade — negatief

**`updateField`, `validateSection` en navigatie blijven in MasterOrchestrator.**
Dit is een bewuste keuze maar architectureel impuur: de façade bevat dan nog steeds ~40 regels eigen logica (boundary-validatie, navigatie-delegatie, `recomputeBusinessState`). De "dunheid" is beperkter dan Plans 2/3 beloven.

**Callbacks creëren impliciete koppeling.**
`RenderScreenService` ontvangt `onFieldChange` als `(fieldId, value) => void`. Dit werkt, maar de callback is niet zichtbaar in de type-signatuur van de service. Bij refactoring of uitbreiding is de intent minder expliciet dan een directe dependency.

**`recomputeBusinessState` blijft dubbel aanwezig** in MasterOrchestrator (na zowel `updateField` als workflow-afronding). Geen aparte encapsulatie — risico op vergeten bij toekomstige uitbreiding.

### Samenvatting Plan 1

| Aspect | Score |
|--------|-------|
| Wijzigingen in useStableOrchestrator | ✅ Geen |
| Wijzigingen in bestaande tests | ✅ Minimaal |
| Façade-dunheid na splitsing | ⚠️ ~70 regels (nog steeds logica) |
| Type-veiligheid callbacks | ⚠️ Zwakker |
| Implementatierisico | ✅ Laag |
| Architecturele zuiverheid | ⚠️ Matig |

---

## Plan 2 — `Splitsingplan2.txt` (5 orchestrators, publiek properties)

### Structuur
```
MasterOrchestrator.ts     ← façade (~30 regels)
  screen: ScreenOrchestrator
  fields: FieldOrchestrator
  importWorkflow: ImportWorkflowOrchestrator
  daily: DailyTransactionOrchestrator
  business: BusinessStateOrchestrator
```

### Cascade — positief

**MasterOrchestrator wordt écht dun (~30 regels).**
Puur delegatie, geen eigen logica. Dit is het meest radicale resultaat en sluit het best aan bij het "God Object elimineren" doel.

**`BusinessStateOrchestrator` centraliseert recompute.**
Alle drie de workflows (`fields`, `importWorkflow`, `daily`) injecteren dezelfde instantie. Geen kans op vergeten aanroep. Positief domino-effect op onderhoudbaarheid.

**`FieldOrchestrator` groepeert verwante logica.**
`updateField`, `validateSection`, `canNavigateNext` horen inderdaad bij elkaar. Aparte testbaarheid is een voordeel.

### Cascade — negatief

**useStableOrchestrator.ts: significante aanpassing.**
Plan 2 stelt de 5 sub-orchestrators voor als **publieke properties** van MasterOrchestrator (`master.screen`, `master.fields`, etc.). Dit betekent dat `useStableOrchestrator` of de consumers deze properties direct aanspreken — of de MasterOrchestrator intern de sub-orchestrators instantieert. Het plan is hier ambivalent: de getoonde constructor ontvangt de 5 sub-orchestrators als parameters, wat betekent dat `useStableOrchestrator.ts` ze ook moet instantiëren. Dit zijn **13+ nieuwe instantiaties** met correcte dependency-volgorde. Hoog risico op assemblagefout.

**MasterOrchestratorAPI.ts moet worden uitgebreid of aangepast.**
`MasterOrchestratorAPI` definieert nu alle methoden flat op het interface. Als de Master delegeert via properties, moeten de types kloppen. `canNavigateNext` zit nu op de Master — na Plan 2 zit het op `FieldOrchestrator`. De interface zelf hoeft niet te breken, maar de interne routing verandert.

**MasterOrchestrator.test.ts: complete herschrijving nodig.**
De huidige test mockt `domain.validation.validateSection` — dat gaat via de DomainCluster. Plan 2 introduceert een `FieldOrchestrator` die `validation` intern gebruikt. De test moet nu ofwel (a) de `FieldOrchestrator` zelf mocken als dependency, of (b) de interne `IValidationOrchestrator` dieper mocken. Beide vereisen een volledige testherstructurering van ~420 regels.

**`isVisible` routing onduidelijk.**
Plan 2 plaatst `isVisible` op `ScreenOrchestrator`, maar `FieldOrchestrator` heeft `visibility` ook als dependency. Dit creëert een dubbele route naar hetzelfde sub-systeem. Risico op inconsistentie.

**Geen concrete bestandspaden of mappenstructuur opgegeven.**
Plan 2 noemt geen `workflows/` map — de orchestrators zweven zonder locatie. Dit is een implementatierisico.

### Samenvatting Plan 2

| Aspect | Score |
|--------|-------|
| Wijzigingen in useStableOrchestrator | ❌ Groot (13+ nieuwe instantiaties) |
| Wijzigingen in bestaande tests | ❌ Complete herschrijving |
| Façade-dunheid na splitsing | ✅ ~30 regels |
| Type-veiligheid | ✅ Sterk (geen callbacks) |
| Implementatierisico | ❌ Hoog |
| Architecturele zuiverheid | ✅ Hoog |

---

## Plan 3 — `Splitisinsplan3.txt` (5 orchestrators, intern geïnstantieerd)

### Structuur
```
MasterOrchestrator.ts     ← façade (~50 regels)
workflows/
  ScreenOrchestrator.ts
  FieldOrchestrator.ts
  BusinessStateOrchestrator.ts
  ImportWorkflowOrchestrator.ts
  DailyTransactionWorkflowOrchestrator.ts
```

Plan 3 is inhoudelijk vrijwel identiek aan Plan 2, maar lost het grootste knelpunt op: **de sub-orchestrators worden intern geïnstantieerd door MasterOrchestrator**, niet extern ingeject. De constructor van de Master blijft `(fso, DomainCluster, AppCluster)`.

### Cascade — positief (aanvullend op Plan 2)

**useStableOrchestrator.ts: geen aanpassing nodig.**
Zelfde als Plan 1 — de externe assemblageplek ziet niets van de interne structuurwijziging. Dit is de cruciale verbetering ten opzichte van Plan 2.

**Bestandsstructuur expliciet (`workflows/` map).**
Plan 3 geeft een concrete mappenstructuur met bestandsnamen. Lagere kans op interpretatieverschillen tijdens implementatie.

**Implementatievolgorde expliciet gedefinieerd.**
BusinessStateOrchestrator eerst (kleinste, geen deps) → ScreenOrchestrator → FieldOrchestrator → DailyTransaction → ImportWorkflow → Master opschonen. Dit minimaliseert de tijd dat de codebase in een "half-gesplitste" staat verkeert.

**`RenderScreenVM` types worden re-geëxporteerd.**
Plan 3 vermeldt expliciet dat MasterOrchestrator de types re-exporteert om consumers niet te breken. `MasterOrchestratorAPI.ts` hoeft niet aangepast.

### Cascade — negatief

**MasterOrchestrator.test.ts: deels herschrijven.**
Net als Plan 2. Tests die `domain.business.prepareFinancialViewModel` direct verwachten te zien na `updateField`, moeten weten dat dit nu via `BusinessStateOrchestrator` loopt die intern door `FieldOrchestrator` wordt aangeroepen. De mock-setup wordt complexer voor integratietests.

**Concrete oplossing:** de huidige MasterOrchestrator tests worden gesplitst:
- `MasterOrchestrator.test.ts` wordt een dunne façade-test (~50 regels, test alleen delegatie)
- Per workflow een eigen testbestand (de logica zit nu geïsoleerd en is beter testbaar)

**`FieldOrchestrator` heeft `BusinessStateOrchestrator` als dependency.**
Dit is een inwaartse dependency van één workflow op een andere. Architectureel acceptabel (BSO is een service, geen workflow), maar het vereist dat BSO als eerste wordt aangemaakt in de constructor.

**`IValueOrchestrator.getValueModel` vs huidig gebruik.**
De interface definieert `getValueModel` maar `MasterOrchestrator.test.ts` mockt `getValueViewModel`. Dit is een bestaande discrepantie (TSC-error) die Plan 3 erft maar niet veroorzaakt.

### Samenvatting Plan 3

| Aspect | Score |
|--------|-------|
| Wijzigingen in useStableOrchestrator | ✅ Geen |
| Wijzigingen in bestaande tests | ⚠️ Deels (splitsing tests, niet herschrijving) |
| Façade-dunheid na splitsing | ✅ ~50 regels |
| Type-veiligheid | ✅ Sterk (geen callbacks) |
| Implementatierisico | ✅ Laag-matig |
| Architecturele zuiverheid | ✅ Hoog |

---

## Vergelijkingstabel

| Criterium | Plan 1 | Plan 2 | Plan 3 |
|-----------|--------|--------|--------|
| useStableOrchestrator aanpassing | ✅ Geen | ❌ Groot | ✅ Geen |
| MasterOrchestrator.test.ts | ✅ Minimaal | ❌ Volledig herschrijven | ⚠️ Splitsen |
| MasterOrchestratorAPI aanpassing | ✅ Geen | ✅ Geen | ✅ Geen |
| Constructor-signatuur stabiel | ✅ Ja | ❌ Nee | ✅ Ja |
| Façade-dunheid | ⚠️ ~70 regels | ✅ ~30 regels | ✅ ~50 regels |
| recomputeBusinessState encapsulatie | ❌ Geen | ✅ BSO | ✅ BSO |
| Type-veiligheid callbacks | ⚠️ Zwak | ✅ Geen callbacks | ✅ Geen callbacks |
| Implementatierisico | ✅ Laag | ❌ Hoog | ✅ Laag-matig |
| Architecturele zuiverheid | ⚠️ Matig | ✅ Hoog | ✅ Hoog |
| Expliciete bestandslocaties | ⚠️ Deels | ❌ Nee | ✅ Ja |

---

## Aanbeveling

**Plan 3** wint op alle kritieke criteria. Het combineert de architecturele ambitie van Plan 2 met de pragmatische voordelen van Plan 1:

- `useStableOrchestrator` blijft ongewijzigd (geen assemblageketen aanpassen)
- Constructor-signatuur stabiel (geen breaking change voor FormContext)
- Bestaande tests hoeven niet volledig herschreven te worden, alleen gesplitst
- `BusinessStateOrchestrator` elimineert het `recomputeBusinessState` duplicatie-risico
- Expliciete implementatievolgorde minimaliseert de tijd dat de codebase "half gesplitst" is

**Plan 1** is acceptabel als tijdgebrek of risicomijding prevaleert. De callbacks zijn een technische schuld die later alsnog vraagt om herziening.

**Plan 2** is af te raden in de huidige vorm: de externe instantiatie van alle 5 sub-orchestrators in `useStableOrchestrator` vergroot de assemblage-complexiteit zonder meerwaarde ten opzichte van Plan 3.
