# PR-7 Blueprint: `mapCsvToImportedTransaction` (ImportOrchestrator)

## Doel
Implementeer een expliciete Anti-Corruption Layer (ACL) op de CSV-boundary, zodat er geen losse `Record<string, unknown>` uit adapter-land doorlekt naar intern finance-model.

## Huidige pijnpunten (gevalideerd in code)
- `CsvItem` in `src/core/types/research.ts` extendeert nu `Record<string, unknown>`.
- `ImportOrchestrator` accepteert/werkt met brede setup-types (`Record<string, unknown> | null`).
- `MasterOrchestrator` TODO benoemt expliciet dat directe doorgifte van `transactions` vervangen moet worden door mapping.
- `dispatchImportData` duwt data door naar `finance.*.items` zonder harde whitelist-map.

## Architectuurkeuze (voor PR-7)
Plaats de ACL op **ImportOrchestrator niveau**:
1. CSV-adapter output inlezen.
2. Per rij expliciet mappen via `mapCsvToImportedTransaction(...)`.
3. Alleen gemapte/geschoonde transacties teruggeven aan de rest van de flow.

`MasterOrchestrator` en `ResearchOrchestrator` consumeren daarna alleen interne, expliciete types.

---

## Voorstel voor nieuwe interne types (expliciet)

```ts
// In research.ts (of dedicated import types bestand)
export interface ImportedTransaction {
  id: string;                  // stable import id
  fieldId: string;             // state key, b.v. csv_...
  amount: number;              // signed amount in euro-units (huidige app-conventie)
  date: string;                // ISO date (YYYY-MM-DD of full ISO)
  description: string;         // PII-stripped
  category: string;            // from dataProcessor.categorize
  source: 'csv';
  importMeta: ImportedTransactionMeta;
}

export interface ImportedTransactionMeta {
  rawDigest: string;           // deterministic hash for traceability/dedup
  schemaVersion: 'csv-v1';
  importedAt: string;          // ISO timestamp
  columnMapVersion: 'v1';
  flags?: ReadonlyArray<'missing_date' | 'missing_description' | 'fallback_category'>;
}
```

### Waarom dit werkt
- Geen `Record<string, unknown>` in kernpad.
- Metadata blijft beschikbaar voor audit/debug.
- Contract is stabiel voor `MasterOrchestrator.dispatchImportData`.

---

## Blueprint voor `mapCsvToImportedTransaction`

### Signatuur
```ts
private mapCsvToImportedTransaction(
  row: CsvItem,
  index: number,
  importedAtIso: string,
): ImportedTransaction | null
```

### Input-validatie en normalisatie
1. **Amount**
- Accepteer alleen finite numbers.
- `0` mag gefilterd blijven zoals nu (`tx.amount !== 0`).
- Onbruikbaar -> `null` (drop row).

2. **Date**
- Als leeg/invalid: fallback naar `importedAtIso` + flag `missing_date`.
- Normaliseer naar consistente ISO-datum (bijv. `YYYY-MM-DD`).

3. **Description**
- Trim string.
- Leeg -> `'Geen omschrijving'` + flag `missing_description`.
- Altijd door `dataProcessor.stripPII(...)`.

4. **Category**
- `dataProcessor.categorize(description)`.
- Als leeg/undefined -> `'Overig'` + flag `fallback_category`.

5. **IDs**
- `id` en `fieldId` deterministic afleiden op basis van digest + index.
- Voorbeeld: `id = 'csv_' + digest.slice(0, 16)`
- `fieldId = 'csv_tx_' + digest.slice(0, 12)`

### Output
- Return strikt `ImportedTransaction` object.
- Nooit rauwe row objecten in output.

---

## Veilige opslag van `original` data

## Principe
`original` niet meer als object in state/research-model bewaren.

### Concreet voorstel
- Maak een canonical string van beperkte whitelisted velden:
  - `date|amount|description` (geschoond)
- Bereken een digest (`rawDigest`) op deze string.
- Sla **alleen digest + flags + importMeta** op in `importMeta`.

### Waarom veilig
- Geen directe PII-lek via `original` payload.
- Wel herleidbaarheid voor debugging, dedupe en audit.

### Als volledig raw echt nodig is
- Niet in `FormState`.
- Alleen in aparte quarantainestorage met korte TTL en expliciet feature-flagged.
- Buiten PR-7 scope; default = **niet opslaan**.

---

## Integratieplan per bestand

## 1) `src/app/orchestrators/ImportOrchestrator.ts`
- Voeg private mapper toe: `mapCsvToImportedTransaction(...)`.
- Laat `parseAndEnrichCsv(...)` een lijst `ImportedTransaction[]` opleveren.
- `LocalImportResult.transactions` type wijzigen naar `ImportedTransaction[]`.
- `calculateSummary(...)` en `detectMissingHousingCosts(...)` op dit type laten draaien.

## 2) `src/app/orchestrators/MasterOrchestrator.ts`
- Verwijder ACL TODO in `handleCsvImport` na implementatie.
- `dispatchImportData(...)` consumeert expliciet `ImportedTransaction[]`.
- Geen directe afhankelijkheid meer op open-ended csv payload.

## 3) `src/core/types/research.ts` (of `research.ts`)
- Introduceer `ImportedTransaction` contract.
- Verwijder `CsvItem extends Record<string, unknown>` uit actieve importflow.
- `original` uit kern-model halen of sterk typeren + verplaatsen naar meta/digest.

---

## Gedragsregels (acceptatiecriteria mapping)
- CSV payload wordt alleen via `mapCsvToImportedTransaction` vertaald.
- Geen `Record<string, unknown>` meer in importpad-signatures.
- `MasterOrchestrator` ACL TODO verdwijnt.
- `finance.income.items` / `finance.expenses.items` ontvangen alleen expliciet getypeerde transacties.

---

## Minimale testimpact (gericht)

## ImportOrchestrator tests
- mapt valide row naar `ImportedTransaction`.
- dropt row met invalid amount.
- zet defaults + flags bij ontbrekende date/description.
- bewaart `rawDigest` in `importMeta`, niet `original` object.

## MasterOrchestrator tests
- `handleCsvImport` werkt met `ImportedTransaction[]`.
- state dispatch bevat alleen expliciete velden.

## ResearchOrchestrator tests (indien type aanscherping)
- contract werkt zonder `Record<string, unknown>` cast op transacties.

---

## Niet-doen in PR-7 (scope bewaken)
- Geen complete herbouw van finance schema.
- Geen migratie van legacy screens.
- Geen raw payload persistence in FormState.

---

## Uitrolvolgorde
1. Type toevoegen (`ImportedTransaction`).
2. Mapper implementeren in ImportOrchestrator.
3. MasterOrchestrator consumer aanpassen + TODO verwijderen.
4. Testen op importpad updaten.
5. Eventueel daarna schema-verstrakking in aparte PR.
