# Antwoorden op Open Eindjes

_Datum: 23-02-2026 | Bronnen: AuditLoggerAdapter.ts, FormStateOrchestrator.ts, ResearchOrchestrator.ts, ImportOrchestrator.ts, research.ts_

---

## 1. Logging-eigenaarschap: Wie logt wat?

### Bevinding uit de code

`AuditLoggerAdapter` heeft drie niveaus: `logger.info`, `logger.warn`, `logger.error`.
De adapter stuurt automatisch door:
- `error` + `warning` → naar de UI-listeners (subscribers) én console
- `info` → alleen naar console
- `fatal` → naar "ticketing" (console.error) + UI

Huidige logging per orchestrator (uit de broncode):

| Locatie | Event | Niveau | Categorie |
|---------|-------|--------|-----------|
| `VisibilityOrchestrator` | `visibility_rule_missing_fail_closed` | error | Technische fout |
| `VisibilityOrchestrator` | `visibility_rule_execution_failed` | error | Technische fout |
| `NavigationOrchestrator` | `navigation_screen_not_found` | warn | Technische fout |
| `ImportOrchestrator` | `csv Mapping failed` | error | Technische fout |
| `ImportOrchestrator` | `Critical Failure in csv-parsing` | error | Technische fout |
| `MasterOrchestrator` | `field_update_validation_failed` | warn | Gebruikersflow |
| `MasterOrchestrator` | `csv_parse_failed` | error | Gebruikersflow |
| `MasterOrchestrator` | `csv_parse_empty` | warn | Gebruikersflow |
| `MasterOrchestrator` | `csv_import_success` | info | Business-event |
| `MasterOrchestrator` | `csv_import_discrepancy_found` | warn | Business-event |
| `MasterOrchestrator` | `transaction_form_not_initialized` | warn | Gebruikersflow |
| `MasterOrchestrator` | `transaction_invalid_amount` | warn | Gebruikersflow |
| `MasterOrchestrator` | `transaction_category_required` | warn | Gebruikersflow |
| `MasterOrchestrator` | `transaction_saved` | info | Business-event |

### Conclusie

Er is al een impliciet patroon, maar het is niet gedocumenteerd:
- **Orchestrators dicht bij het domein** (Visibility, Navigation, Import) loggen *technische fouten* via `error`/`warn`
- **MasterOrchestrator** logt zowel gebruikersflow-fouten als business-events

### Conventie (klaar om over te nemen)

```
LOGGING_CONVENTION:

logger.error  → Onverwachte technische fout; systeem kon niet uitvoeren wat het moest.
               Gebruiker ZOU dit niet mogen zien; het is een programmeerfout of infra-fout.
               Voorbeelden: visibility rule bestaat niet, CSV mapper crashed.

logger.warn   → Verwachte fout door gebruikersinvoer of ontbrekende data.
               Systeem werkt nog, maar kon de actie niet voltooien.
               Voorbeelden: validatiefout, ontbrekende categorie, lege CSV.

logger.info   → Succesvolle afronding van een business-workflow.
               Alleen voor events die waarde hebben voor audit/traceerbaarheid.
               Voorbeelden: transactie opgeslagen, import succesvol.

EIGENAARSCHAP NA SPLITSING:
- FieldOrchestrator/ValidationOrchestrator  → logger.warn (gebruikersinvoer fouten)
- ImportWorkflowOrchestrator               → logger.error (parse crash), logger.warn (leeg/discrepantie), logger.info (success count)
- DailyTransactionWorkflow                 → logger.warn (validatiefouten), logger.info (opgeslagen)
- ScreenOrchestrator/UIOrchestrator        → logger.error (entry niet gevonden in registry)
- MasterOrchestrator (façade)              → NIETS — logt niet meer zelf; delegeert volledig
```

---

## 2. FSO als "God Dependency"

### Bevinding uit de code

`FormStateOrchestrator` heeft 5 publieke methoden:

| Methode | Aard |
|---------|------|
| `getState()` | Lezen |
| `getValue(fieldId)` | Lezen |
| `dispatch(action)` | Schrijven |
| `updateField(fieldId, value)` | Schrijven (via StateWriterAdapter) |
| `getValidationError(fieldId, value)` | Validatie |

Welke orchestrators gebruiken welke methoden:

| Orchestrator | getState | getValue | dispatch | updateField | getValidationError |
|-------------|----------|----------|----------|-------------|-------------------|
| `VisibilityOrchestrator` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `NavigationOrchestrator` | ✅ | ❌ | ✅ | ❌ | ❌ |
| `ResearchOrchestrator` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `FinancialOrchestrator` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `ValidationOrchestrator` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `MasterOrchestrator` | ✅ | ✅ | ✅ | ✅ | ❌ |

### Kritieke ontdekking

`ResearchOrchestrator` heeft `fso` als constructor-parameter maar gebruikt hem **nergens** in de getoonde implementatie. `FinancialOrchestrator` heeft dezelfde situatie — fso is geïnjecteerd "voor toekomstige integraties" maar blijft ongebruikt. `ValidationOrchestrator` heeft `_fso` (underscore = intentioneel ongebruikt).

Dit zijn drie orchestrators die FSO kunnen loslaten **zonder enige functionaliteitswijziging**.

### Interface Segregation — concreet voorstel

```typescript
// src/core/types/stateInterfaces.ts

/** Alleen lezen uit de state — voor Visibility, Research, Financial */
export interface IStateReader {
  getState(): FormState;
  getValue(fieldId: string): unknown;
}

/** Alleen schrijven naar de state — voor workflows die dispatchen */
export interface IStateWriter {
  dispatch(action: FormAction): void;
  updateField(fieldId: string, value: unknown): void;
}
```

Toepassing per orchestrator na splitsing:

| Orchestrator | Interface |
|-------------|-----------|
| `VisibilityOrchestrator` | `IStateReader` (alleen getValue) |
| `ResearchOrchestrator` | Geen FSO meer nodig → verwijder constructor-param |
| `FinancialOrchestrator` | Geen FSO meer nodig → verwijder constructor-param |
| `ValidationOrchestrator` | Geen FSO meer nodig → verwijder `_fso` |
| `NavigationOrchestrator` | `IStateReader + IStateWriter` |
| Nieuwe workflows (Field, Import, Daily) | `IStateReader + IStateWriter` |

**Dit is een toekomstige verbetering, geen blocker voor de huidige splitsing.** Toepasbaar per orchestrator onafhankelijk.

---

## 3. ACL-verificatie: Is DataManager.processCsvImport een echte ACL?

### Bevinding uit de code

De `TODO` in MasterOrchestrator waarschuwt voor "lekkende data van de CSV-adapter."
De vraag is of `ImportOrchestrator` alleen domein-velden doorzet.

**Kijk naar de data-flow:**

```
CSV-tekst
  ↓
csvAdapter.mapToInternalModel()   → AdapterCsvItem { amount, date, description, ... }
  ↓
ImportOrchestrator.mapCsvToImportedTransaction()
  ↓
buildImportedTransaction()        → CsvItem (domein-type)
```

**Wat `buildImportedTransaction` produceert:**
```typescript
{
  id:          `csv_${rawDigest}`,          // gegenereerd, geen raw CSV-data
  fieldId:     `csv_tx_${digest}_${index}`, // gegenereerd
  amount:      row.amount,                  // getal, alleen het bedrag
  amountCents: toCents(row.amount),         // berekend
  date:        normalizedDate,              // genormaliseerd, niet raw
  description: sanitizedDescription,       // PII-gestript via dataProcessor.stripPII()
  category:    resolveCategory(...),        // gecategoriseerd, niet raw
  isIgnored:   false,
  original: {                               // ← dit is de vraag
    rawDigest, schemaVersion, importedAt, columnMapVersion, flags
  }
}
```

**Het `original` veld bevat:**
- `rawDigest`: een hash van de canonical string (`datum|bedrag|beschrijving`) — **geen raw CSV-data**
- `schemaVersion`, `columnMapVersion`, `importedAt`, `flags`: audit-metadata — **geen raw CSV-data**

### Conclusie: De ACL is functioneel aanwezig

`ImportOrchestrator` is al een effectieve ACL:
- PII wordt gestript via `dataProcessor.stripPII()`
- Datum wordt genormaliseerd
- Categorie wordt gecategoriseerd (niet doorgegeven)
- `original.rawDigest` is een hash, niet de originele tekst

De TODO in MasterOrchestrator is **technisch achterhaald** — de ACL zit nu correct in `ImportOrchestrator`, niet meer in de Master.

### Maar: er is een architecturele schuld in het type zelf

`CsvItem` is gedeclareerd als:
```typescript
export interface CsvItem extends Record<string, unknown> { ... }
```

De `extends Record<string, unknown>` is een tijdelijke fix (gedocumenteerd als "ARCHITECTURAL DEBT" in het bestand zelf). Dit maakt het type open voor willekeurige extra velden — dat ondermijnt de ACL-garantie op type-niveau, ook al werkt de runtime-mapping correct.

**Actie (toekomstig, geen blocker):**
1. Verwijder `extends Record<string, unknown>` uit `CsvItem`
2. De TODO in het type-bestand (`research.ts`) beschrijft dit exact — het werk staat al klaar
3. Zodra dit is gedaan, wordt de ACL ook compile-time gegarandeerd

**De TODO in MasterOrchestrator kan worden verwijderd** — de ACL bestaat al, alleen de type-definitie is nog open.
