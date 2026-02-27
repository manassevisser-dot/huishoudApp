# 📋 Beknopt JSDoc Template (volgens jouw principes)

Hier is het herschreven template dat focust op **"wat"** en **"hoe"**, met architectuur verwezen naar README.md.

---

## 🎯 Basis Template voor Interfaces / Types

```typescript
/**
 * [1-zin: wat is dit?]
 * 
 * @module [pad]
 * @see {@link ./README.md | [Module] - Details}
 * 
 * @typeParam TKey - [kort: wat is TKey?]
 * @typeParam TDefinition - [kort: wat is TDefinition?]
 */
export interface IBaseRegistry<TKey extends string, TDefinition> {
  /**
   * [wat doet deze methode?]
   * 
   * @param key - [kort: wat is key?]
   * @returns [kort: wat retourneert het?]
   * 
   * @example
   * const def = registry.getDefinition('email');
   * if (def) { console.log(def.label); }
   */
  getDefinition(key: TKey): TDefinition | null;

  /**
   * [wat doet deze type guard?]
   * 
   * @param key - [kort: input]
   * @returns `true` als de key geldig is
   * 
   * @example
   * if (registry.isValidKey(input)) { ... }
   */
  isValidKey(key: string): key is TKey;

  /**
   * [wat retourneert deze methode?]
   * 
   * @returns Array met alle geldige keys
   */
  getAllKeys(): TKey[];
}
```

---

## 🎯 Basis Template voor Functies

```typescript
/**
 * [1-zin: wat berekent/transformeert deze functie?]
 * 
 * @module [pad]
 * @see {@link ./README.md | [Module] - Details}
 * 
 * @param data - [kort: wat is de input?]
 * @returns [kort: wat is de output?]
 * 
 * @example
 * const totals = computePhoenixSummary(financeData);
 * console.log(totals.netCents);
 */
export const computePhoenixSummary = (data: unknown): FinancialTotals => {
  // ...
};
```

---

## 🎯 Basis Template voor Classes / Services

```typescript
/**
 * [1-zin: verantwoordelijkheid van deze class]
 * 
 * @module [pad]
 * @see {@link ./README.md | [Module] - Details}
 */
export class CsvAnalysisService {
  /**
   * [wat doet deze static methode?]
   * 
   * @param transactions - [kort: input]
   * @param setupData - [kort: optionele input]
   * @returns [kort: output type]
   * 
   * @example
   * const result = CsvAnalysisService.analyse(transactions, setup);
   */
  public static analyse(
    transactions: ParsedCsvTransaction[],
    setupData: SetupData | null,
  ): CsvAnalysisResult {
    // ...
  }
}
```

---

## 🎯 Basis Template voor Schema's / Adapters

```typescript
/**
 * [1-zin: wat valideert/transformeert dit schema?]
 * 
 * @module [pad]
 * @see {@link ./README.md | Validation Layer - Details}
 * 
 * @remarks
 * - Zod wordt alleen hier gebruikt (ADR-01)
 * - Constraints komen uit `FIELD_CONSTRAINTS_REGISTRY`
 */
export const FormStateSchema = z.object({
  // ...
});

/**
 * Parsed ruwe input naar getypte FormState.
 * 
 * @param input - Unknown input van buiten de adapter-grens
 * @returns Geldige FormState
 * @throws ZodError bij invalid input
 * 
 * @example
 * const state = parseFormState(rawJson);
 */
export function parseFormState(input: unknown): FormState {
  return FormStateSchema.parse(input);
}
```

---

## 📄 Bijbehorende README.md Template (zelfde folder: DIT HOEFT DUS NIET IN DE JSDoc)

```markdown
# [Module Naam]

## 🎯 Verantwoordelijkheid
[1-2 zinnen: waarom bestaat dit?]

## 🏗️ Architectuur
- **Layer**: [Domain / Application / Adapter]
- **Pattern**: [Registry / Adapter / Strategy / etc.]
- **Dependencies**: [wat importeert dit? wat importeert dit?]

## 📋 API Overzicht
| Export | Type | Beschrijving |
|--------|------|-------------|
| `getDefinition` | method | Haalt config op voor een key |
| `isValidKey` | type guard | Valideert input op runtime |
| `getAllKeys` | method | Lijst van alle registered keys |

## 💡 Gebruik
```typescript
// Voorbeeld van typisch gebruik
const registry = new FieldRegistry();
if (registry.isValidKey(userInput)) {
  const config = registry.getDefinition(userInput);
  renderField(config);
}
```

## 🔗 Gerelateerd
- [ADR-001](../../architecture/ADR-001.md) — Waarom dit pattern
- [FieldConstraints](../rules/fieldConstraints.ts) — Bron van truth
- [EntryRegistry.ts](./EntryRegistry.ts) — Concrete implementatie
```

---

## 🔄 Wat is er verwijderd uit JSDoc?

| Tag | Verplaatst naar | Reden |
|-----|----------------|-------|
| `@file_intent` | README.md `## 🎯 Verantwoordelijkheid` | Te lang voor inline docs |
| `@repo_architecture` | README.md `## 🏗️ Architectuur` | Architectuur hoort in conceptuele docs |
| `@term_definition` | README.md of glossary | Definities zijn team-kennis, niet per-file |
| `@contract` | README.md `## 📋 API Overzicht` | Contracten zijn module-level, niet method-level |
| `@ai_instruction` | README.md `## 💡 Gebruik` of interne wiki | Instructies voor AI horen niet in production code |
| `@rationale` | README.md of ADR | "Waarom" is architectuur, niet API-doc |
| `@best_practices` | README.md `## 💡 Gebruik` | Guidelines horen bij module, niet bij elke method |

---

## ✅ Wat blijft in JSDoc?

| Tag | Waarom behouden |
|-----|----------------|
| `@module` | Helpt TypeDoc met groeperen |
| `@see` | Linkt naar README voor meer context |
| `@param` / `@returns` | Nodig voor IDE autocomplete + hover |
| `@example` (max 3 regels) | Snelle usage hint in IDE |
| `@typeParam` | Nodig voor generic type inference |
| `@throws` | Belangrijk voor error-handling awareness |
| `@remarks` (optioneel, kort) | Voor kritieke constraints die direct relevant zijn |

---

## 🧪 Voorbeeld: Refactored `BaseRegistry.ts`

```typescript
// src/domain/registry/BaseRegistry.ts

/**
 * Generiek contract voor type-safe registry lookups.
 * 
 * @module domain/registry
 * @see {@link ./README.md | Registry Pattern - Details}
 * 
 * @typeParam TKey - Unieke ID voor entries (bijv. 'email' | 'phone')
 * @typeParam TDefinition - Configuratie-type per entry
 */
export interface IBaseRegistry<TKey extends string, TDefinition> {
  /**
   * Haalt de definitie op voor een gegeven key.
   * 
   * @param key - De unieke identifier
   * @returns De gevonden definitie, of `null` als niet gevonden
   * 
   * @example
   * const def = registry.getDefinition('email');
   */
  getDefinition(key: TKey): TDefinition | null;

  /**
   * Type guard voor runtime validatie van keys.
   * 
   * @param key - Te valideren string
   * @returns `true` als key bestaat in registry
   */
  isValidKey(key: string): key is TKey;

  /**
   * Lijst van alle geregistreerde keys.
   * 
   * @returns Array met alle geldige keys
   */
  getAllKeys(): TKey[];
}
