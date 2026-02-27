# UI Entries

## 🎯 Verantwoordelijkheid

De `entries`-map bevat de volledige entry-renderingketen: van een ruwe `RenderEntryVM` (geproduceerd door de orchestratorlaag) tot een zichtbaar, gestyled React Native component. De keten bestaat uit drie lagen die elk een strikte verantwoordelijkheid hebben.

---

## 🏗️ Architectuur

- **Layer**: UI (Presentation)
- **Pattern**: Mapper → ViewModel → Component
- **Afhankelijkheidsrichting**: entries → `@ui/kernel` (types), `@ui/styles/useAppStyles`, `@app/orchestrators` (types only)

```
RenderEntryVM  (van UIOrchestrator)
      │
      ▼
DynamicEntry.tsx          ← enige plek waar useAppStyles() wordt aangeroepen
      │  styles: AppStyles
      ▼
entry.mappers.ts          ← pure functies, geen React-context
  toCurrencyViewModel(entry, styles)
  toCounterViewModel(entry, styles)
  … (10 mappers totaal)
      │  toStyleRule(entry.childStyle, styles, 'inputContainer')
      ▼
entry.helpers.ts          ← stateless primitives
  toStyleRule / toStringValue / toNumberValue / toBaseViewModel
      │
      ▼
entries.components.tsx    ← domme componenten, binden viewModel aan primitives
  MoneyEntry / CounterEntry / … (10 totaal)
```

---

## 📋 Contract / API

### `DynamicEntry`

| Prop | Type | Beschrijving |
|---|---|---|
| `entry` | `RenderEntryVM` | Volledig render-klaar entry-model van `UIOrchestrator` |

Rendert `null` als `entry.isVisible !== true`. Anders stuurt het de entry via `renderByPrimitive` naar de juiste component.

### `entry.mappers.ts`

Alle 10 mapper-functies hebben dezelfde signatuur:

```typescript
toXxxViewModel(entry: RenderEntryVM, styles: AppStyles): XxxViewModel
```

| Mapper | ViewModel |
|---|---|
| `toCurrencyViewModel` | `CurrencyViewModel` |
| `toDateViewModel` | `DateViewModel` |
| `toTextViewModel` | `TextViewModel` |
| `toNumberViewModel` | `NumberViewModel` |
| `toCounterViewModel` | `CounterViewModel` |
| `toToggleViewModel` | `ToggleViewModel` |
| `toChipGroupViewModel` | `ChipGroupViewModel` |
| `toRadioViewModel` | `RadioViewModel` |
| `toLabelViewModel` | `LabelViewModel` |
| `toActionViewModel` | `ActionViewModel` |

### `entry.helpers.ts`

| Helper | Signatuur | Beschrijving |
|---|---|---|
| `toStyleRule` | `(style, styles?, fallbackKey?) => PrimitiveStyleRule` | Resolvet style-input naar RN-stijlobject |
| `getEmptyStyle` | `() => PrimitiveStyleRule` | Gedeeld leeg object (singleton) |
| `toStringValue` | `(value) => string` | Veilig casten naar string |
| `toNumberValue` | `(value) => number` | Veilig casten naar number |
| `toBooleanValue` | `(value) => boolean` | Strict `=== true` check |
| `toBaseViewModel` | `(entry, type) => BasePrimitiveViewModel` | Basisvelden voor elk ViewModel |

---

## 💡 Best Practices

**Stijlresolutie hoort uitsluitend in de UI-laag.**
`UIOrchestrator` geeft stijlsleutels door als strings (bijv. `"primitive:counter"`) via de identity-resolver. Deze worden pas in `toStyleRule` omgezet naar echte RN-objecten. Verplaats dit patroon nooit naar de orchestrator- of domeinlaag.

**`useAppStyles()` wordt alleen in `DynamicEntry` aangeroepen.**
Mappers en helpers zijn pure functies — ze ontvangen `styles` als parameter. Dit maakt ze testbaar zonder React-context.

**`toStyleRule` heeft prioriteitsregels:**
1. Object-input → direct teruggeven
2. String-input + `styles` + `fallbackKey` → `styles[fallbackKey]`
3. Overige input → `{}`

**Een nieuwe primitive toevoegen:**
1. `PRIMITIVE_TYPES` uitbreiden in `PrimitiveRegistry`
2. ViewModel-interface toevoegen aan `PrimitiveRegistry.ts`
3. Mapper toevoegen in `entry.mappers.ts`
4. Entry-component toevoegen in `entries.components.tsx`
5. Case toevoegen in `DynamicEntry.tsx` switch-statement

---

## 🧩 Voorbeelden

```typescript
// DynamicEntry gebruikt styles intern — buiten is alleen de entry nodig
<DynamicEntry entry={renderEntryVM} />

// Mapper direct aanroepen (in tests of andere contexts)
const { styles } = useAppStyles();
const vm = toCounterViewModel(renderEntryVM, styles);
// vm.containerStyle is nu een echt RN-stijlobject

// toStyleRule gedrag
toStyleRule({ margin: 8 }, styles, 'inputContainer')
// → { margin: 8 }  (object-input heeft prioriteit)

toStyleRule('primitive:counter', styles, 'inputContainer')
// → styles.inputContainer  (string-input → fallback)

toStyleRule('onbekend')
// → {}  (geen styles-param → leeg)
```

---

## 🔗 Gerelateerd

- [`UIOrchestrator`](../../app/orchestrators/UIOrchestrator.ts) — produceert `RenderEntryVM`
- [`render.types.ts`](../../app/orchestrators/types/render.types.ts) — type-definitie `RenderEntryVM`
- [`useAppStyles`](../styles/useAppStyles.ts) — levert het `AppStyles`-object
- [`PrimitiveRegistry`](../../domain/registry/PrimitiveRegistry.ts) — ViewModel-typen en primitiveType-SSOT
- [`StyleFactory`](../../app/orchestrators/factory/StyleFactory.ts) — identity-resolver die style-sleutels produceert
