# UI Entries

## 🎯 Verantwoordelijkheid

De `entries`-map bevat de volledige entry-renderingketen: van een ruwe `RenderEntryVM` (geproduceerd door de orchestratorlaag) tot een zichtbaar, gestyled React Native component. De keten bestaat uit drie lagen die elk een strikte verantwoordelijkheid hebben.

---

## 🏗️ Architectuur

- **Layer**: UI (Presentation)
- **Pattern**: Mapper → ViewModel → Component
- **Afhankelijkheidsrichting**: entries → `@ui/kernel` (types), `@ui/styles/useAppStyles`, `@app/orchestrators` (types only)

```
RenderEntryVM  (van UIOrchestrator, incl. styleIntent)
      │
      ▼
DynamicEntry.tsx          ← enige plek waar useAppStyles() wordt aangeroepen
      │  styles: AppStyles
      ▼
entry.mappers.ts          ← pure functies, geen React-context
  PRIMITIVE_STYLE_CONFIG   ← centrale fallback-config per primitiveType
  ACTION_STYLE_MAP         ← StyleIntent → AppStyles-sleutel mapping
  toCurrencyViewModel(entry, styles)
  toCounterViewModel(entry, styles)
  toActionViewModel(entry, styles)  ← leest styleIntent voor variant
  … (10 mappers totaal)
      │  resolveContainerStyle(entry, styles, config)
      ▼
entry.helpers.ts          ← stateless primitives
  resolveContainerStyle / toStyleRule / toStringValue / toBaseViewModel
      │
      ▼
entries.components.tsx    ← domme componenten, binden viewModel aan primitives
  MoneyEntry / CounterEntry / ActionEntry (geen variantkennis) / … (10 totaal)
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
| `resolveContainerStyle` | `(entry, styles, config) => PrimitiveStyleRule` | Centraal: leest bron en fallback uit `PrimitiveStyleConfig` |
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

**`PRIMITIVE_STYLE_CONFIG` is de SSOT voor fallback-sleutels.**
Elke mapper leest zijn stijlconfiguratie uit deze centrale tabel via `resolveContainerStyle`. Fallback-sleutels worden nooit direct in mapper-functies hardcoded. TypeScript dwingt af via `string & keyof AppStyles` dat de sleutel **werkelijk bestaat** — een ontbrekende sleutel geeft een compile-time fout.

**`ACTION_STYLE_MAP` koppelt `StyleIntent` aan `AppStyles`-sleutels.**
De mapper is de enige plek waar intentie (`'destructive'`) wordt vertaald naar een stijlsleutel (`'actionButtonDestructive'`). De `ButtonPrimitive`-component weet niet welke variant hij ontvangt.

**Een nieuwe primitive toevoegen:**
1. `PRIMITIVE_TYPES` uitbreiden in `PrimitiveRegistry`
2. ViewModel-interface toevoegen aan `PrimitiveRegistry.ts`
3. **Entry toevoegen in `PRIMITIVE_STYLE_CONFIG`** in `entry.mappers.ts`
4. Mapper toevoegen in `entry.mappers.ts`
5. Entry-component toevoegen in `entries.components.tsx`
6. Case toevoegen in `DynamicEntry.tsx` switch-statement
7. **Integratietest toevoegen** in `entry.style-resolution.integration.test.ts`

**Een nieuwe ACTION-variant toevoegen:**
1. `StyleIntent` uitbreiden in `EntryRegistry.ts`
2. Stijl toevoegen aan `makePrimaryButtons` in `Buttons.ts`
3. Sleutel toevoegen aan `ACTION_STYLE_MAP` in `entry.mappers.ts`
4. Integratietest uitbreiden voor de nieuwe variant

---

## 🧩 Voorbeelden

```typescript
// DynamicEntry gebruikt styles intern — buiten is alleen de entry nodig
<DynamicEntry entry={renderEntryVM} />

// Mapper direct aanroepen (in tests of andere contexts)
const { styles } = useAppStyles();
const vm = toCounterViewModel(renderEntryVM, styles);
// vm.containerStyle is nu een echt RN-stijlobject via resolveContainerStyle

// toStyleRule gedrag
toStyleRule({ margin: 8 }, styles, 'entryContainer')
// → { margin: 8 }  (object-input heeft prioriteit, fallback genegeerd)

toStyleRule('primitive:counter', styles, 'entryContainer')
// → styles.entryContainer  (string-input → fallback opgezocht)

toStyleRule('onbekend')
// → {}  (geen styles-param → leeg)

// ACTION-variant: destructive knop (goToReset, clearAllAction)
const destructiveVm = toActionViewModel(
  { ...entry, styleIntent: 'destructive' },
  styles
);
// destructiveVm.containerStyle === styles.actionButtonDestructive
// (error-kleur, waarschuwing voor onomkeerbare actie)
```

---

## 🔗 Gerelateerd

- [`UIOrchestrator`](../../app/orchestrators/UIOrchestrator.ts) — produceert `RenderEntryVM`, threadt `styleIntent` door
- [`render.types.ts`](../../app/orchestrators/types/render.types.ts) — type-definitie `RenderEntryVM` incl. `styleIntent`
- [`useAppStyles`](../styles/useAppStyles.ts) — levert het `AppStyles`-object
- [`PrimitiveRegistry`](../../domain/registry/PrimitiveRegistry.ts) — ViewModel-typen en primitiveType-SSOT
- [`StyleFactory`](../../app/orchestrators/factory/StyleFactory.ts) — identity-resolver die style-sleutels produceert
- [`EntryRegistry`](../../domain/registry/EntryRegistry.ts) — `StyleIntent` type + `styleIntent` per entry
- [`Buttons.ts`](../../domain/styles/primitives/Buttons.ts) — `actionButton*` stijldefinities
- [`entry.style-resolution.integration.test.ts`](./entry.style-resolution.integration.test.ts) — integratietests voor fallback-sleutels
