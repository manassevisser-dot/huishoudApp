# Services

## 🎯 Verantwoordelijkheid

De services-map bevat applicatieservices die specifieke operationele taken uitvoeren: data-migratie van legacy-formaten, transactiebeheer, opslag-abstractie en huishouduitlijning. Services orchestreren samenwerking tussen adapters en domeinlogica zonder zelf businessregels te bevatten.

---

## 🏗️ Architectuur

- **Layer**: Application Service
- **Pattern**: Service Object, Migration Pipeline
- **Afhankelijkheidsrichting**: Services importeren adapters en domein; orchestrators importeren services voor workflows

```
transactionService.ts   ← migratie LegacyState → Phoenix + transactiebeheer
migrationService.ts     ← bredere data-migratiepipeline
householdAlign.ts       ← uitlijning huishoudleden tussen schemaversies
storageShim.ts          ← opslag-abstractie (AsyncStorage wrapper)
```

---

## 📋 Contract / API

### `transactionService.ts`

| Export | Type | Beschrijving |
|---|---|---|
| `TransactionService.migrate(oldState)` | `async function` | Migreert `LegacyState` naar Phoenix `FormState`-structuur |
| `TransactionService.getAllTransactions()` | `async function` | Extraheert alle `FinanceItem[]` uit opgeslagen state |
| `TransactionService.clearAll()` | `async function` | Wist alle opgeslagen data via `StorageShim` |
| `TransactionService.undo()` | `async function` | **⚠️ Placeholder** — nog niet geïmplementeerd |
| `migrateTransactionsToPhoenix(oldState)` | `async function` | Directe export van `migrate` |

**Migratieoutput-structuur:**
```typescript
{
  schemaVersion: '1.0',
  data: { setup, household: { members }, transactions },
  meta: { lastModified, version, itemsProcessed }
}
```

### `storageShim.ts`

Abstractielaag over `AsyncStorage`. Isoleert alle opslag-I/O — componenten en services gebruiken nooit `AsyncStorage` direct.

| Methode | Beschrijving |
|---|---|
| `StorageShim.loadState()` | Laadt opgeslagen state of retourneert `null` |
| `StorageShim.saveState(state)` | Persisteert state |
| `StorageShim.clearAll()` | Wist alle opgeslagen data |

### Term-definities

- **`LegacyState`**: Ongestructureerde pre-Phoenix state (gevalideerd via `LegacyValidator` Zod-schema). Velden kunnen op meerdere geneste paden voorkomen — `mapLegacyMembers` en `extractFinanceItems` normaliseren dit.
- **`FinanceItem`**: Genormaliseerd object `{ fieldId: string; amount: number }` — het enige formaat dat income/expense items kennen na migratie.
- **Migration Pipeline**: `LegacyValidator.parseState()` → `getSetupSource()` + `mapLegacyMembers()` + `extractFinanceItems()` → Phoenix-structuur.

---

## 💡 Best Practices

- Fouten in `mapLegacyMembers` en `extractFinanceItems` kunnen dataverlies veroorzaken bij migratie — test grondig met echte legacy-snapshots
- Gebruik `StorageShim` als enige opslag-toegangspunt — geen directe `AsyncStorage`-aanroepen in andere lagen
- `TransactionService.undo()` is een placeholder — implementeer pas als `UndoStack` in `FormStateOrchestrator` beschikbaar is
- Migraties zijn idempotent: meerdere keren uitvoeren geeft hetzelfde resultaat

---

## 🧩 Voorbeelden

```typescript
// Legacy-migratie bij app-opstart
const rawState = await StorageShim.loadState();
if (rawState) {
  const migrated = await TransactionService.migrate(rawState);
  dispatch({ type: 'HYDRATE_STATE', payload: migrated });
}

// Transacties ophalen voor analyse
const transactions = await TransactionService.getAllTransactions();
const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

// Storage wissen bij reset
await TransactionService.clearAll();
```

---

## 🔗 Gerelateerd

- [`LegacyStateAdapter`](../adapters/validation/LegacyStateAdapter.ts) — Zod-validator voor legacy input
- [`StorageShim`](./storageShim.ts) — opslag-abstractie
- [`ResetWorkflow`](../app/workflows/ResetWorkflow.ts) — gebruikt `clearAll` bij volledige reset
- [`DataManager`](../app/orchestrators/managers/DataManager.ts) — coördineert CSV-import workflows
