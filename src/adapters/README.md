# Adapter Layer

## 🎯 Verantwoordelijkheid
De adapter-laag vormt de grenzen van het systeem en vertaalt externe formaten, gebruikersinteracties en opslagmechanismen naar het interne domeinmodel. Het is de enige plek die kennis heeft van I/O, device-capabilities en externe formaten, en fungeert als beschermingslaag (Anti-Corruption Layer) voor de domeinlogica.

## 🏗️ Architectuur
- **Layer**: Adapter (meest extern)
- **Patterns**: Anti-Corruption Layer, Gateway, State Mutation Adapter, Bridge
- **Dependencies**:
  - Importeert: Domein-modellen (`@core/types`), services (`@domain`), utilities
  - Wordt geïmporteerd door: Geen (dit is de buitenste laag)
  - Externe libraries: Zod (alleen hier, ADR-01), Expo DocumentPicker/FileSystem, AsyncStorage

## 📋 Contract / API

### CSV Adapter (`csvAdapter.ts`)
- **Functie**: Vertaalt ruwe CSV-string naar intern domeinmodel (`CsvItem[]`)
- **Kolomdetectie**: Gebruikt regex-patronen voor bank-specifieke formaten
- **Garantie**: Levert non-nullable strings aan processor
- **Term**: `detectedKeys` = mapping van CSV-kolomnamen naar domein-begrippen

### State Writer Adapter (`StateWriterAdapter.ts`)
- **Functie**: Centraliseert state-mutaties als "Traffic Controller"
- **Method overloads**: Type-veilige `updateField` voor setup, household, finance
- **Dynamic Collections**: Upsert-gedrag voor array-gebaseerde structuren (income/expenses)
- **Regel**: Nieuwe velden vereisen update van deze adapter

### File Picker Adapter (`FilePickerAdapter.ts`)
- **Functie**: Faciliteert OS-interactie voor bestandsselectie
- **Resultaat**: `CsvFileResult` met `{ text, fileName, detectedBank }`
- **Error handling**: Gooit Error bij annulering of bestandsfout
- **Bank-detectie**: Pure functie, gescheiden van I/O voor testbaarheid
- **Best-effort**: `detectedBank = undefined` is geldig resultaat

### Persistence Adapter (`PersistenceAdapter.ts`)
- **Functie**: Beheert AsyncStorage voor state-persistentie
- **Persistable state**: Expliciete subset `PersistableFormState` (geen viewModels, navigatie, validatiestatus)
- **`save(state)`**: Serialiseert en logt fouten (gooit niet)
- **`load()`**: Valideert en retourneert `null` bij corruptie (ruimt op)
- **`clear()`**: Verwijdert state
- **Migratie**: Versienummer in `STORAGE_KEY`; schema-breuk = nieuwe key

### Transaction Adapter (`transaction/stateful.ts`)
- **Functie**: Beheert undo/redo tijdlijn met audit logging
- **Pointer model**: Lineaire geschiedenis; push op oudere state wist toekomst
- **Audit logging**: Elke mutatie via AuditLogger (ADR-12)
- **`allocateRemainder`**: Eerlijke verdeling zonder afrondingsverschillen

### Legacy State Adapter (`validation/LegacyStateAdapter.ts`)
- **Functie**: Anti-Corruption Layer voor oude/externe data
- **Tolerantie**: `safeParse` garandeert geldige output (eventueel leeg)
- **`filteredArray`**: Verwijdert corrupte items i.p.v. hele parse te laten falen
- **Gebruik**: Alleen voor import/migratie-scenario's

### Research Contract Adapter (`validation/ResearchContractAdapter.ts`)
- **Functie**: Valideert en transformeert data voor onderzoeksdoeleinden
- **Money handling**: Dwingt centen (integers) af via `MoneySchema`
- **Domein-koppeling**: Integreert `householdRules` voor status-bepaling
- **Types**: `ResearchPayload` (geanonimiseerd), `SpecialStatus` (extra onderzoek)

### Form State Schema (`validation/formStateSchema.ts`)
- **Functie**: Vertaalt domein-constraints naar runtime Zod-schema's
- **Single Source of Truth**: Wijzigingen beginnen in `FIELD_CONSTRAINTS_REGISTRY`
- **Enige Zod-locatie**: Volgens ADR-01
- **Builders**: `build[Type]` zet regels om naar code
- **Lookup**: `FieldSchemas` voor individuele veldvalidatie

### Boundary Validator (`validation/validateAtBoundary.ts`)
- **Functie**: Primaire beveiligingsschil tussen UI en domein
- **Verplichting**: Geen waarde bereikt domein zonder validatie (ADR-01 & ADR-02)
- **`ValidationResult`**: Gediscrimineerde union met `success: true` (data) of `success: false` (foutmelding)
- **Normalization**: Vertaalt ruwe UI-input naar juiste types (bv. string → number)

## 💡 Best Practices

### Algemene regels
1. **Adapters kennen geen business logica** - Delegeer naar domein-services
2. **Exporteer alleen publieke API's** - Houd implementatie details privé
3. **Documenteer tolerant gedrag** - Geef aan wanneer en waarom data wordt aangepast
4. **Test I/O isolatie** - Pure functies gescheiden houden van side-effects

### Per adapter type

**CSV/File adapters:**
- Detecteer bank-formaten met losse, testbare functies
- Gebruik `detectedBank` als hint, niet als harde garantie
- Valideer CSV-structuur voor verdere processing

**State adapters:**
- Gebruik overloads voor type-veilige updates
- Update mappings bij nieuwe velden
- Bewaar alleen persistable state (geen UI/vluchtige data)

**Validatie adapters:**
- Zod is **alleen** in validatie-laag toegestaan (ADR-01)
- Gebruik `filteredArray` voor tolerante imports, nooit voor runtime data
- `ValidationResult` dwingt expliciete error handling af

**Transaction adapters:**
- Audit log elke mutatie (ADR-12)
- Pointer model = lineaire geschiedenis, geen branching
- Gebruik `allocateRemainder` voor eerlijke verdeling

## 🧩 Voorbeelden

### CSV importeren
```typescript
// Adapter vertaalt ruwe CSV naar domeinmodel
const csvString = await FilePickerAdapter.pickAndReadFile();
const items = CsvAdapter.parseToItems(csvString);
// items is CsvItem[] klaar voor verwerking
```

### State updaten
```typescript
// Type-safe updates via overloads
writer.updateField('aantalMensen', 4);               // setup
writer.updateField('huurtoeslag', 150);              // household
writer.updateField('streaming_netflix', 12.99);      // dynamic collection
```

### State laden met migratie
```typescript
// Persistence adapter handelt versies af
const loaded = await PersistenceAdapter.load();
if (loaded) {
  // Geldige state (huidige of gemigreerde versie)
} else {
  // Corrupt/oud: clean start
}
```

### Undo/redo met audit logging
```typescript
const tx = new StatefulTransactionAdapter(initialState);
tx.push(newState, 'USER_UPDATE');
// ... later
const vorige = tx.undo(); // Audit log: { event: 'undo', pointer: 1 }
```

### Tolerante legacy import
```typescript
// Zelfs met corrupte items krijg je geldige state
const legacy = LegacyValidator.parseState(malformedData);
// legacy bevat alleen valide items, nooit crash
```

### Boundary validatie
```typescript
const result = validateField('age', '25');
if (result.success) {
  // result.data is number (genormaliseerd)
  updateDomain(result.data);
} else {
  showError(result.error);
}
```

## 🔗 Gerelateerd

- [ADR + Clean Code](src/ADR_CLEANCODE/README.md) 
- [FIELD_CONSTRAINTS_REGISTRY](../../domain/rules/fieldConstraints.ts) — Source of truth voor validatie
- [householdRules.ts](../../domain/rules/householdRules.ts) — Statusbepaling voor onderzoek
- [@core/types](../../core/types/core.d.ts) — Gedeelde type-definities