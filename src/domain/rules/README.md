# Domain Rules

## 🎯 Verantwoordelijkheid

De rules-map bevat alle businesslogica van de applicatie: veld-validatieconstraints, zichtbaarheidsregels, financiële berekeningen, leeftijdsafbakeningen en afgeleide waarden. Dit is de kern van het domein — de enige plek waar applicatie-specifieke beslissingen worden gecodeerd.

Alle bestanden zijn **pure functies of const-registries** — geen side effects, geen state.

---

## 🏗️ Architectuur

- **Layer**: Domain
- **Pattern**: Rules Engine, Registry (SSOT), Pure Functions
- **Afhankelijkheidsrichting**: Rules importeren alleen andere domain-bestanden (OptionsRegistry, types). Orchestrators en adapters importeren rules; nooit andersom.

```
fieldConstraints.ts   ← SSOT voor veld-metadata (min/max/enum/warn)
    └── gebruikt door: validateAtBoundary, ConstraintSchemaBuilder

fieldVisibility.ts    ← SSOT voor zichtbaarheidsregels
    └── gebruikt door: VisibilityOrchestrator

financeRules.ts       ← inkomsten/uitgaven berekeningen
householdRules.ts     ← huishoudsamenstelling regels
ageRules.ts / ageBoundaryRules.ts / aowRules.ts  ← leeftijdslogica
calculateRules.ts     ← generieke rekenregels
derivedValues.ts      ← afgeleide waarden (bijv. aantalKinderen)
conditions.ts         ← herbruikbare boolean-condities
dataFilters.ts        ← filterlogica voor datareeksen
typeGuards.ts         ← runtime type-validaties
```

---

## 📋 Contract / API

### `fieldConstraints.ts` — veld-validatie SSOT

| Export | Type | Beschrijving |
|---|---|---|
| `FIELD_CONSTRAINTS_REGISTRY` | `const Record` | Alle veld-constraints geïndexeerd op `fieldId` |
| `getConstraint(fieldId)` | function | Haalt constraint op; stript `mem_N_` / `auto-N_` prefixes |
| `exceedsWarning(fieldId, value)` | function | `true` als waarde boven `warn`-drempel zit |
| `getWarningMessage(fieldId, value)` | function | Gebruikerstekst bij overschrijding soft-limit |
| `FieldConstraint` | discriminated union | `NumberConstraint \| EnumConstraint \| StringConstraint \| BooleanConstraint` |
| `MEMBER_FIELD_KEYS` | `const string[]` | Velden die per huishoudlid herhaald worden |
| `AUTO_FIELD_KEYS` | `const string[]` | Velden die per auto herhaald worden |

### `fieldVisibility.ts` — zichtbaarheidsregels SSOT

Elke `VisibilityRuleName` is een functie `(state: FormState, memberId?) => boolean`. De `VisibilityOrchestrator` evalueert deze regels per entry bij het bouwen van het `RenderScreenVM`.

### Term-definities

- **`FieldConstraint`**: Discriminated union — `type`-property bepaalt welke velden beschikbaar zijn (`min`/`max` bij `number`, `values` bij `enum`). TypeScript kan hiermee exact afleiden welk Zod-schema nodig is.
- **`warn`-drempel**: Soft-limit die een niet-blokkerende waarschuwing toont (bijv. salaris > €20.000 → vermoedelijk jaarbedrag). Verschilt van `max` dat een harde fout geeft.
- **`MEMBER_FIELD_KEYS` / `AUTO_FIELD_KEYS`**: Template-sleutels voor repeating entries. `getConstraint('mem_0_nettoSalaris')` stript de prefix en zoekt op `'nettoSalaris'`.
- **Pure function**: Elke rule-functie is deterministisch — zelfde input geeft altijd zelfde output, geen side effects.

---

## 💡 Best Practices

- Voeg nieuwe veld-constraints toe aan `FIELD_CONSTRAINTS_REGISTRY` — nooit hardcoded in UI of orchestrator
- Zichtbaarheidslogica hoort in `fieldVisibility.ts` als named rule, niet inline in components
- `warn`-waarden zijn bedoeld voor UX-feedback, niet voor validatie — gebruik `max` voor harde grenzen
- Template-velden (member/auto) altijd opnemen in `MEMBER_FIELD_KEYS` / `AUTO_FIELD_KEYS` zodat prefix-stripping werkt

---

## 🧩 Voorbeelden

```typescript
// Constraint ophalen (prefix-onafhankelijk)
const c = getConstraint('mem_0_nettoSalaris');
// → { type: 'number', min: 0, max: 50000, warn: 20000 }

// Soft-limit check
if (exceedsWarning('nettoSalaris', 25000)) {
  showWarning(getWarningMessage('nettoSalaris', 25000));
  // → 'Dit lijkt een jaarbedrag - vul het maandbedrag in'
}

// Zod-schema genereren (in ConstraintSchemaBuilder)
const constraint = getConstraint(fieldId);
if (constraint?.type === 'number') {
  schema = z.number().min(constraint.min ?? 0).max(constraint.max ?? Infinity);
}
```

---

## 🔗 Gerelateerd

- [`validateAtBoundary`](../../adapters/validation/validateAtBoundary.ts) — gebruikt `getConstraint` voor Zod-validatie
- [`VisibilityOrchestrator`](../../app/orchestrators/VisibilityOrchestrator.ts) — evalueert `fieldVisibility` rules
- [`OptionsRegistry`](../registry/OptionsRegistry.ts) — enum-opties waarnaar `EnumConstraint.values` verwijst
- [`EntryRegistry`](../registry/EntryRegistry.ts) — koppelt `constraintsKey` aan veld-definities
