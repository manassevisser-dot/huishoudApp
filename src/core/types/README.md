# Core Types

## 🎯 Verantwoordelijkheid

`src/core/types/` is de **type-SSOT van de applicatie**. Het definieert of re-exporteert alle data-shapes die de grens tussen lagen oversteken: van ruwe wizard-input tot geanonimiseerde research-payloads.

Geen runtime-logica. Geen Zod. Alleen TypeScript-types en twee constanten.

---

## 🏗️ Architectuur

- **Layer**: Core (geen afhankelijkheden op andere lagen, behalve `core.ts` → adapter)
- **Pattern**: Type-aliassen, re-exports, utility types
- **Afhankelijkheidsrichting**: Alle andere lagen importeren uit `core/types`. `core/types` importeert alleen uit `@adapters/validation/formStateSchema` (uitsluitend `core.ts`).

```
src/core/types/
  ├── base.ts       ← geen imports
  ├── research.ts   ← geen imports
  └── core.ts       ← importeert uit @adapters/validation/formStateSchema
```

---

## 📋 Bestanden — overzicht

### `base.ts` — JSON-serialisatie utilities

Fundamentele types voor veilig werken met ongestructureerde data aan laad- en opslaggrenzen.

| Export | Soort | Beschrijving |
|---|---|---|
| `JsonPrimitive` | type alias | Bladwaarden in JSON: `string \| number \| boolean \| null` |
| `JsonValue` | type alias | Elke geldige JSON-waarde, recursief |
| `JsonObject` | interface | JSON-object: `{ [key: string]: JsonValue }` |
| `JsonArray` | interface | JSON-array: `Array<JsonValue>` |
| `AnyObject` | type alias | `Record<string, unknown>` — voor tijdelijke transformaties bij onbekende structuur |

**Gebruik**: `JsonValue` bij opslaginterfaces (AsyncStorage, API), `AnyObject` als brug naar een concreet schema-parse.

---

### `research.ts` — Onderzoek & privacy-contracten

Types voor de twee data-stromen in de research-pipeline: lokale data (met PII) en geanonimiseerde externe data.

#### Lokale data (blijft op apparaat)

| Export | Soort | Beschrijving |
|---|---|---|
| `FinanceItem` | interface | Eén inkomsten- of uitgavenregel; bedrag in centen (`amountCents`) |
| `FinanceBucket` | interface | Collectie `FinanceItem[]` met optioneel totaal |
| `FinanceState` | interface | `income` + `expenses` als twee `FinanceBucket`s |
| `FinancialIncomeSummary` | interface | Resultaat van CSV ↔ wizard-reconciliatie; bevat `source` en `isDiscrepancy` |
| `UndoResult` | interface | Auditrecord van een ongedane transactie |
| `Money` | interface | `{ amount: number; currency: 'EUR' }` — interop met `ResearchValidator` |
| `MemberType` | type alias | `'adult' \| 'child' \| 'teenager' \| 'senior' \| 'puber'` |
| `ResearchMember` | interface | Huishoudlid **met PII** (`firstName`, `lastName`) — nooit extern verzenden |
| `CsvItem` | interface | Geparsde CSV-transactie met `amountCents` (canoniek) en `amount` (interop) |
| `RawUIData` | interface | Ongevalideerde wizard-input, ingang van `PrivacyAirlock` |

#### Externe data (anoniem, veilig voor opslag)

| Export | Soort | Beschrijving |
|---|---|---|
| `AnonymizedResearchPayload` | interface | Privacy-safe payload; geen PII; `researchId` is gehashed |
| `ResearchContract` | interface | Volledig N8N-databasecontract met `isSpecialStatus` |
| `CONTRACT_VERSION` | const | Semver voor het `ResearchContract`-schema (`'1.0.0'`) |

---

### `core.ts` — Publieke type-API

Re-exporteert Zod-afgeleide types uit de adapter-laag en definieert convenience-aliassen voor diep geneste `FormState`-secties.

#### Re-exports (bron: `formStateSchema.ts`)

| Export | Beschrijving |
|---|---|
| `FormState` | Volledige applicatie-state |
| `Member` | Eén huishoudlid (wizard-data, zonder PII-garantie) |
| `Auto` | Eén voertuig |
| `DataSection` | `'setup' \| 'household' \| 'finance' \| 'latestTransaction'` |
| `CsvImportState` | Import-state inclusief transacties, periode en status |
| `CsvAnalysisResult` | Analyse-resultaat: discrepantie-vlaggen en periode-samenvatting |
| `TransactionRecord` | Eén undo-stack item met `amountCents` en ISO-datum |
| `TransactionHistory` | Past/present/future stack voor undo/redo |

#### Convenience-aliassen

| Export | Gelijk aan | Gebruik |
|---|---|---|
| `SetupData` | `FormState['data']['setup']` | Huishoud-configuratie |
| `Household` | `FormState['data']['household']` | Members-array + toeslagen |
| `Finance` | `FormState['data']['finance']` | Income + expenses |
| `CsvImportData` | `FormState['data']['csvImport']` | CSV-import state |
| `CsvAnalysisVM` | `CsvAnalysisResult` | ViewModel alias voor analyse-scherm |
| `IncomeItem` | element van `Finance['income']['items']` | Één inkomstregel in lijsten |
| `ExpenseItem` | element van `Finance['expenses']['items']` | Één uitgavenregel in lijsten |

#### Utility types

| Export | Beschrijving |
|---|---|
| `DeepPartial<T>` | Maakt alle properties van `T` recursief optioneel; gebruik voor reducer-payloads |

---

## 💡 Best Practices

**Kies het juiste type voor de situatie:**

```
Onbekende JSON-input binnenkomst   →  JsonValue / AnyObject
Wizard-data vóór PrivacyAirlock    →  RawUIData
Lid met PII (lokaal)               →  ResearchMember
Lid zonder PII (extern)            →  AnonymizedResearchPayload
FormState-sectie                   →  SetupData / Household / Finance
Lijstitem uit Finance              →  IncomeItem / ExpenseItem
Partiële state-update              →  DeepPartial<SetupData> (of andere sectie)
```

**Importeer altijd uit `@core/types`, nooit rechtstreeks uit `formStateSchema`:**

```typescript
// ✅ Correct
import type { FormState, IncomeItem } from '@core/types/core';

// ❌ Verboden buiten de adapter-laag
import type { FormState } from '@adapters/validation/formStateSchema';
```

**PII-grens nooit kruisen:**

```typescript
// ✅ Extern verzenden
const payload: AnonymizedResearchPayload = airlock.collectAndDistributeData(raw, i).researchPayload;

// ❌ Nooit extern
const member: ResearchMember = ...; // bevat firstName, lastName
await api.send(member);             // SECURITY ALERT
```

---

## 🧩 Voorbeelden

```typescript
// JSON-input verwerken
async function loadLegacyData(): Promise<AnyObject | null> {
  const raw: JsonValue = JSON.parse(await AsyncStorage.getItem('state') ?? 'null');
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null;
  return raw as AnyObject; // narrow naar AnyObject, daarna schema.parse()
}

// FormState-secties gebruiken (convenience-aliassen)
import type { SetupData, IncomeItem, DeepPartial } from '@core/types/core';

function patchSetup(patch: DeepPartial<SetupData>): FormAction {
  return { type: 'PATCH_SETUP', payload: patch };
}

function renderIncome(items: IncomeItem[]) {
  return items.map(item => `${item.fieldId}: ${item.amount}`);
}

// Privacy-grens bewaken
import type { RawUIData, AnonymizedResearchPayload } from '@core/types/research';

// ✅ Correct: alleen anonieme data extern
const payload: AnonymizedResearchPayload = airlock.collectAndDistributeData(raw, i).researchPayload;
await api.send(payload);

// ❌ Verboden: ResearchMember bevat PII
// await api.send(member);
```

---

## ⚠️ Bekende schuld

| Bestand | Issue |
|---|---|
| `research.ts` — `ResearchMember` | Index-signatuur `[key: string]: unknown` is tijdelijk; verwijderen zodra strikte mapping op `MasterOrchestrator`-grens bestaat |
| `research.ts` — `CsvItem` | `extends Record<string, unknown>` is tijdelijke linter-fix; zie inline TODO |
| `research.ts` — `ResearchContract.isSpecialStatus` | Veld is nog inactief; N8N-integratie nog niet geïmplementeerd |

---

## 🔗 Gerelateerd

- [`formStateSchema.ts`](../../adapters/validation/formStateSchema.ts) — Zod-schemas die `FormState` en verwante types genereren
- [`PrivacyAirlock.ts`](../../domain/research/PrivacyAirlock.ts) — Transformeert `RawUIData` → `ResearchMember` + `AnonymizedResearchPayload`
- [`ResearchContractAdapter.ts`](../../adapters/validation/ResearchContractAdapter.ts) — Runtime-validatie van `AnonymizedResearchPayload` en `Money`
- [`ResearchOrchestrator.ts`](../../app/orchestrators/ResearchOrchestrator.ts) — Coördineert de volledige research-pipeline
