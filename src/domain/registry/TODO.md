# TODO — Registry Layer Refactors

> **Status**: Voorstellen, nog niet uitgevoerd.
> **Scope**: `src/domain/registry/`
> **Prioriteit**: laag-tot-middel — geen productiebug, wel architecturele schuld.

---

## §1 🔴 ViewModels horen niet in de domeinlaag

### Probleem

`PrimitiveRegistry.ts` exporteert elf `*ViewModel`-interfaces
(`CounterViewModel`, `CurrencyViewModel`, … `ActionViewModel`) en de
`PrimitiveViewModel`-unie. Deze types worden geïmporteerd door:

- `src/ui/entries/entry.mappers.ts`
- `src/ui/entries/entries.components.tsx`

Dat zijn **UI-laag bestanden**. Domein-laag bestanden mogen niet weten hoe UI
rendert; hier is het omgekeerde: de UI-laag importeert ViewModel-shapes uit het
domein. Dit doorbreekt de afhankelijkheidsrichting van de Hexagonale Architectuur.

### Huidige situatie

```
src/domain/registry/PrimitiveRegistry.ts
  └── exporteert CounterViewModel, CurrencyViewModel, ...   ← domein

src/ui/entries/entry.mappers.ts
  └── importeert *ViewModel types uit @domain/registry/PrimitiveRegistry  ← UI importeert domein ✓
src/ui/entries/entries.components.tsx
  └── importeert *ViewModel types uit @domain/registry/PrimitiveRegistry  ← UI importeert domein ✓
```

Strikt gezien is de importrichting (UI → domein) correct; het probleem is dat
de *definitie* van UI-types in het domein zit. ViewModel-interfaces zijn
UI-contracten, geen domeinregels.

### Voorstel

Verplaats alle `*ViewModel`-interfaces en de `PrimitiveViewModel`-unie naar een
nieuw bestand in de UI-laag:

```
src/ui/entries/primitiveViewModels.ts   ← nieuw bestand
```

`PrimitiveRegistry.ts` behoudt alleen:
- `PRIMITIVE_TYPES` (de SSOT-constante)
- `PrimitiveType` (het afgeleide union-type)
- `PrimitiveStyleRule`
- `BasePrimitiveViewModel` (kan ook mee naar `primitiveViewModels.ts`)
- `PrimitiveMetadata`
- `PrimitiveRegistry` (de service)
- `isValidPrimitiveType`
- `validatePrimitiveRequirements`

### Impact

| Bestand | Wijziging |
|---|---|
| `PrimitiveRegistry.ts` | Verwijder de 11 `*ViewModel`-interfaces + `PrimitiveViewModel`-unie |
| `src/ui/entries/primitiveViewModels.ts` | Nieuw bestand: alle ViewModel-interfaces + unie |
| `entry.mappers.ts` | Import-pad aanpassen naar `./primitiveViewModels` |
| `entries.components.tsx` | Import-pad aanpassen naar `./primitiveViewModels` |
| `PrimitiveRegistry.test.ts` | Geen wijziging — test alleen metadata en helpers |

### Risico

Laag. Het zijn puur type-verplaatsingen; geen runtime-gedrag verandert.
De `*ViewModel`-interfaces hebben geen circular dependency met `PrimitiveRegistry`
(ze erven van `BasePrimitiveViewModel`, dat mee kan verhuizen).

---

## §2 🟡 `isReadOnly: true` op `action` is misleidend

### Probleem

`ACTION` heeft `isReadOnly: true` in `PRIMITIVE_METADATA`. Dat suggereert dat de
primitive passief is (zoals `label`), maar `ActionViewModel` heeft een actieve
`onPress: () => void` handler — het is een knop.

De betekenis van `isReadOnly` in de huidige codebase is: *"schrijft geen waarde
naar FormState"*. Dat klopt voor `action`, maar de naam impliceert "niet
interactief", wat onjuist is.

### Voorstel A — Rename het vlag

```typescript
// Huidig:
isReadOnly: boolean;

// Nieuw:
mutatesFormState: boolean;
```

Dan wordt de metadata voor `action`:

```typescript
[PRIMITIVE_TYPES.ACTION]: { ..., mutatesFormState: false, ... }
[PRIMITIVE_TYPES.LABEL]:  { ..., mutatesFormState: false, ... }
```

En voor alle invoer-primitives `mutatesFormState: true`.

### Voorstel B — Splits het vlag in twee

```typescript
interface PrimitiveMetadata {
  isInteractive:     boolean;  // heeft de gebruiker een click/input handler?
  mutatesFormState:  boolean;  // schrijft naar FormState via onChange?
}
```

| Primitive | `isInteractive` | `mutatesFormState` |
|---|---|---|
| `counter` | ja | ja |
| `action` | **ja** | nee |
| `label` | nee | nee |

Voorstel B geeft meer semantische precisie maar is ook een grotere wijziging.

### Impact

`isReadOnly` wordt alleen gelezen in `validatePrimitiveRequirements` (nee — die
gebruikt alleen `requiresOptions`) en in `PrimitiveRegistry.test.ts`. De vlag
wordt nergens in de rendering-pipeline gecheckt. Impact is daarom minimaal;
het is puur een documentatie/semantiek-fix.

### Aanbevolen aanpak

Start met Voorstel A (rename). Implementeer Voorstel B alleen als er concrete
behoefte ontstaat om `isInteractive` los te checken (bijv. voor
accessibility-markering).

---

## §3 🟡 `toggle` heeft `requiresOptions: true` maar geen options in ViewModel

### Probleem

`PRIMITIVE_METADATA` voor `toggle` stelt `requiresOptions: true`. Dat impliceert
dat een `toggle`-entry een niet-lege `options`-array in de `EntryRegistry` nodig
heeft. Maar `ToggleViewModel` bevat geen `options`-veld; de twee labels zijn
hardcoded in de mapper:

```typescript
// entry.mappers.ts — toToggleViewModel:
labelTrue:  'Ja',
labelFalse: 'Nee',
```

`validatePrimitiveRequirements('toggle', false)` geeft dus `false` terug voor
elke toggle-entry die geen `options` heeft in de `EntryRegistry`, ook al werkt
de rendering prima.

### Twee mogelijke oorzaken

1. `requiresOptions: true` is een overblijfsel van een eerdere ontwerp-iteratie
   waarbij `toggle` zijn labels uit `OptionsRegistry` haalde.
2. De intentie was dat `toggle`-entries wél een `options`-array zouden krijgen
   (bijv. `['Ja', 'Nee']`) en de mapper die zou uitlezen.

### Voorstel

**Optie A** — Als de hardcoded aanpak bewust is: zet `requiresOptions: false`
voor `toggle` in `PRIMITIVE_METADATA` en verwijder de nu-dode `options`-check
uit de toggle-entries in `EntryRegistry` (als die er zijn).

**Optie B** — Als er toekomstig per-entry configureerbare toggle-labels gewenst
zijn: voeg `options?: string[]` toe aan `ToggleViewModel` en laat de mapper de
waarden uit `entry.options` uitlezen met `'Ja'` / `'Nee'` als fallback.

### Aanbevolen aanpak

Controleer eerst of er `toggle`-entries in `EntryRegistry` bestaan met een
`optionsKey`. Als dat nergens het geval is, kies Optie A. Als er al entries zijn
die een `optionsKey` meegeven, kies Optie B.

---

## §4 🟢 `ChipGroupViewModel` dekt twee types met verschillende selectie-semantiek

### Probleem

`chip-group` en `chip-group-multiple` delen exact dezelfde `ChipGroupViewModel`
interface. Het enige verschil is de `primitiveType`-discriminant en de
`onChange`-logica in de mapper. Dit maakt de unie minder expressief:

```typescript
// Huidige situatie:
interface ChipGroupViewModel extends BasePrimitiveViewModel {
  primitiveType: 'chip-group' | 'chip-group-multiple';
  // geen onderscheid in shape
}
```

Een component die een `ChipGroupViewModel` ontvangt, kan uit de type-definitie
niet afleiden welk selectiegedrag verwacht wordt. De discriminant zit in
`primitiveType` maar de interface dwingt dit niet af.

### Voorstel

Splits in twee aparte interfaces met een smalle gedeelde basis:

```typescript
interface BaseChipGroupViewModel extends BasePrimitiveViewModel {
  label:              string;
  containerStyle:     PrimitiveStyleRule;
  labelStyle:         PrimitiveStyleRule;
  chipContainerStyle: PrimitiveStyleRule;
  chips:              ChipViewModel[];
}

interface SingleChipGroupViewModel extends BaseChipGroupViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.CHIP_GROUP;
}

interface MultipleChipGroupViewModel extends BaseChipGroupViewModel {
  primitiveType: typeof PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE;
}

type ChipGroupViewModel = SingleChipGroupViewModel | MultipleChipGroupViewModel;
```

### Impact

- `entry.mappers.ts`: `toChipGroupViewModel` splitsen in `toSingleChipGroupViewModel`
  en `toMultipleChipGroupViewModel` (of via een `type`-parameter).
- `entries.components.tsx`: `ChipGroupEntry` werkt al op basis van `chips`-array;
  geen gedragswijziging nodig, alleen import-type aanpassen.
- `PrimitiveViewModel`-unie: de twee nieuwe types vervangt de huidige
  `ChipGroupViewModel`.

### Prioriteit

Laag — het huidige gedrag is correct. Dit is een expressiviteitsverbetering die
helpt als er in de toekomst component-niveau splitsen nodig zijn (bijv. een
apart `MultiSelectChipGroup`-component met checkmarks).

---

## Uitvoervolgorde (aanbevolen)

1. **§3** — Onderzoek toggle-entries in EntryRegistry, los inconsistentie op (klein)
2. **§2** — Rename `isReadOnly` → `mutatesFormState` (klein, hoge semantische winst)
3. **§1** — Verplaats ViewModels naar `primitiveViewModels.ts` (middelgroot, architecturele winst)
4. **§4** — Splits `ChipGroupViewModel` (klein, alleen als §1 al uitgevoerd is)
