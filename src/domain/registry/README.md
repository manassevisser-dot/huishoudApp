# Registry Layer

## 🎯 Verantwoordelijkheid

De registry-map is de **configuratie-SSOT van de domeinlaag**. Elke registry beschrijft *wat er bestaat* in de applicatie — welke veldtypen, schermen, secties, primitives en opties er zijn — zonder te weten hoe ze gerenderd worden of welke data ze bevatten.

Registries zijn **stateless, pure lookups**. Ze lezen, nooit schrijven.

---

## 🏗️ Architectuur

- **Layer**: Domain
- **Pattern**: Registry (lookup-tabel met typed metadata)
- **Afhankelijkheidsrichting**: Registries importeren alleen `BaseRegistry` en elkaars types. UI en orchestrators importeren de registries, nooit andersom.

```
EntryRegistry
    └── verwijst naar PrimitiveRegistry (primitiveType)
    └── verwijst naar OptionsRegistry   (optionsKey)

SectionRegistry
    └── verwijst naar EntryRegistry     (fieldIds)

ScreenRegistry
    └── verwijst naar SectionRegistry   (sectionIds)

PrimitiveRegistry  ← enkel geïmporteerd door entry.mappers.ts, entries.components.tsx
StyleRegistry      ← geïmporteerd door useAppStyles()
OptionsRegistry    ← geïmporteerd door ScreenViewModelFactory
```

---

## 📋 Registries — overzicht

| Bestand | Key-type | Definitie-type | Verantwoordelijkheid |
|---|---|---|---|
| `BaseRegistry.ts` | `TKey` | `TDefinition` | Generiek contract (`IBaseRegistry`) |
| `ScreenRegistry.ts` | `ScreenId` | `ScreenDefinition` | Welke schermen bestaan er en welk type hebben ze |
| `SectionRegistry.ts` | `SectionId` | `SectionDefinition` | Welke secties bestaan er en wat is hun `uiModel` |
| `EntryRegistry.ts` | `fieldId` | `EntryDefinition` | Welke velden bestaan er, hun primitive, label en opties |
| `PrimitiveRegistry.ts` | `PrimitiveType` | `PrimitiveMetadata` | Welke UI-primitives bestaan er en wat zijn hun capabilities |
| `OptionsRegistry.ts` | `OptionsKey` | `string[]` | Welke keuzelijsten bestaan er |
| `StyleRegistry.ts` | `StyleKey` | `StyleDefinition` | Token-naar-stijl mapping per thema |

---

## 🧩 PrimitiveRegistry — details

### Primitive types

| Primitive | `requiresOptions` | `supportsPlaceholder` | `isReadOnly` | `supportsMultiSelect` |
|---|---|---|---|---|
| `counter` | nee | nee | nee | nee |
| `currency` | nee | **ja** | nee | nee |
| `text` | nee | **ja** | nee | nee |
| `number` | nee | **ja** | nee | nee |
| `chip-group` | **ja** | nee | nee | nee |
| `chip-group-multiple` | **ja** | nee | nee | **ja** |
| `radio` | **ja** | nee | nee | nee |
| `toggle` | **ja** | nee | nee | nee |
| `label` | nee | nee | **ja** | nee |
| `date` | nee | nee | nee | nee |
| `action` | nee | nee | **ja** | nee |

> **`isReadOnly: true` voor `action`**: Dit vlag betekent dat de primitive geen waarde schrijft naar `FormState`. Een `action` is interactief (heeft `onPress`) maar muteert geen veld. Zie `TODO.md` §2 voor de voorgestelde verduidelijking.

### ViewModel-anatomie

Elke `*ViewModel` interface erft van `BasePrimitiveViewModel`:

```typescript
interface BasePrimitiveViewModel {
  fieldId:       string;        // koppeling naar EntryRegistry
  primitiveType: PrimitiveType; // discriminant voor switch in renderByPrimitive()
  error?:        string | null; // validatiefout uit FormStateOrchestrator
  errorStyle?:   PrimitiveStyleRule;
}
```

Mappers in `entry.mappers.ts` vertalen een `RenderEntryVM` naar een concrete `*ViewModel`. UI-componenten in `entries.components.tsx` consumeren die ViewModel — ze weten niets van de onderliggende `FormState`.

### `chip-group` vs `chip-group-multiple`

Beide types delen de `ChipGroupViewModel`-shape. Het verschil zit uitsluitend in de `onChange`-logica van de mapper:

- `chip-group`: `onChange(option)` vervangt de huidige waarde
- `chip-group-multiple`: `onChange(option)` togglet de waarde in een array

### `toggle` en `requiresOptions: true`

`toggle` heeft `requiresOptions: true` in de metadata, maar `ToggleViewModel` bevat geen `options`-array. De "opties" zijn de twee labels (`labelTrue` / `labelFalse`) die hardcoded `'Ja'` en `'Nee'` zijn in `toToggleViewModel`. Dit is een inconsistentie — zie `TODO.md` §3.

---

## 🔗 Gerelateerd

- [`TODO.md`](./TODO.md) — Refactorvoorstellen voor deze map
- [`entry.mappers.ts`](../../ui/entries/entry.mappers.ts) — Converteert `RenderEntryVM` → `*ViewModel`
- [`entries.components.tsx`](../../ui/entries/entries.components.tsx) — React Native componenten per ViewModel
- [`SCREEN_ARCHITECTURE.md`](../screens/SCREEN_ARCHITECTURE.md) — Volledige rendering-pipeline
