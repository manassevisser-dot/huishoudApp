# Domain Constants

## 🎯 Verantwoordelijkheid

`src/domain/constants/` is de **configuratie-SSOT van de domeinlaag**: alle benoemde waarden die meer dan één module gebruiken. Geen runtime-logica, geen Zod, geen React — alleen `as const`-objecten, types en één pure functie (`labelFromToken`).

Regels:
- Hardcoded strings of getallen buiten deze map zijn een code-smell.
- Elke constante die door twee of meer bestanden wordt gebruikt, hoort hier.
- Thema-afhankelijke waarden (kleuren) horen in `Colors.ts`, niet verspreid over componenten.

---

## 🏗️ Architectuur

- **Layer**: Domain
- **Pattern**: SSOT-constanten, design-tokens, token→label-mapping
- **Afhankelijkheidsrichting**: Constants importeren niets uit hogere lagen. UI, orchestrators en adapters importeren uit constants.

```
Colors.ts       ← geen imports uit deze map
Tokens.ts       ← geen imports
LayoutTokens.ts ← importeert Tokens.ts
uxTokens.ts     ← geen imports
labels.ts       ← importeert uxTokens.ts
labelResolver.ts← importeert WizStrings (@config)
businessRules.ts← geen imports
datakeys.ts     ← geen imports
uiSections.ts   ← geen imports
```

---

## 📋 Bestanden — overzicht

### `Colors.ts` — kleurenschema's

| Export | Soort | Beschrijving |
|---|---|---|
| `Theme` | type alias | `'light' \| 'dark'` |
| `ColorScheme` | interface | Alle kleurrollen: `background`, `primary`, `error`, etc. |
| `Colors` | `Record<Theme, ColorScheme>` | SSOT voor alle UI-kleuren per thema |

**Gebruik**: altijd via `useAppStyles()` of `Colors[theme]`. Nooit hardcoded hex-waarden in componenten.

**Let op**: `card` is een deprecated alias voor `surface`.

---

### `Tokens.ts` — atomaire design-tokens

Thema-onafhankelijke primitieve waarden. Basis van het design-systeem.

| Export | Soort | Beschrijving |
|---|---|---|
| `Space` | `as const` | Spacing-schaal: `xs(4)` t/m `xxl(24)` |
| `Type` | `as const` | Typografie-schaal: `xs(12)` t/m `kpi(48)` |
| `Radius` | `as const` | Border-radius-schaal: `xs(4)` t/m `circle(999)` |
| `Sizes` | `as const` | Vaste afmetingen: `inputHeight`, `hitTarget(44)`, etc. |
| `Shadows` | `as const` | Schaduw-definities voor iOS en Android (`sm/md/lg`) |
| `Opacity` | `as const` | `transparent(0)`, `disabled(0.5)`, `solid(1)` |
| `Tokens` | `as const` | Samengevoegd object van alle groepen |
| `TokensType` | type | `typeof Tokens` |

**Let op**: `Shadows.level1/2/3` zijn deprecated aliassen voor `sm/md/lg`.

---

### `LayoutTokens.ts` — structurele layout-patronen

Herbruikbare flexbox- en positioneringsobjecten voor `StyleRegistry`-modules.

| Export | Soort | Beschrijving |
|---|---|---|
| `Space` | re-export | Alias voor `Tokens.Space` (convenience) |
| `Layout` | `as const` | Flexbox/positionerings-patronen: `rowBetweenCenter`, `pinBottom`, etc. |
| `LayoutToken` | type | `keyof typeof Layout` |

**Gebruik**:
```typescript
container: { ...Layout.rowBetweenCenter, padding: Space.lg }
```

Alleen structuur hier — geen kleuren, geen vaste thema-waarden.

---

### `uxTokens.ts` — semantische UI-tokens

| Export | Soort | Beschrijving |
|---|---|---|
| `UX_TOKENS` | `as const` | Stabiele token-strings gegroepeerd in `SCREENS` en `FIELDS` |

**Workflow**: token toevoegen hier → tekst toevoegen in `labels.ts`.

---

### `labels.ts` — token→tekst-woordenboek

| Export | Soort | Beschrijving |
|---|---|---|
| `UI_LABELS` | object | Mapping `UX_TOKENS`-waarde → Nederlandse tekst |
| `SCREEN_LABELS` | object | Legacy-aliassen voor `WIZARD`, `LANDING`, `DASHBOARD` — deprecated |

**Let op**: `UI_LABELS` dekt niet alle `UX_TOKENS.FIELDS`-tokens. Zie TODO.md §2.

---

### `labelResolver.ts` — meldingstoken→tekst-functie (runtime)

| Export | Soort | Beschrijving |
|---|---|---|
| `labelFromToken(token)` | functie | Zoekt `token` op in `WizStrings`-secties; fallback = token zelf |

**Verantwoordelijkheid**: uitsluitend meldingen — validatieteksten, bevestigingen, foutmeldingen. Voor labels: gebruik `UI_LABELS[UX_TOKENS.*]`.

**Opzoekolgorde**: `wizard` → `dashboard` → `common` → `landing` → `options` → `undo` → `settings` → fallback.

**Let op**: `csvAnalysis`-sectie wordt niet doorzocht. Zie TODO.md §1.

---

### `businessRules.ts` — gedeelde business-rule drempelwaarden

| Export | Soort | Beschrijving |
|---|---|---|
| `INCOME_DISCREPANCY_THRESHOLD_CENTS` | `number` | €50,00 in centen — grens voor inkomensdiscrepantie |
| `MIN_TRANSACTIONS_FOR_ANALYSIS` | `number` | Minimaal 3 transacties voor zinvolle analyse |
| `CATEGORY_WONEN` | `'Wonen'` | Canonieke categorie-naam voor woonlasten |

**Regel**: alleen constanten die door ≥2 modules worden gedeeld.

---

### `datakeys.ts` — opslag-sleutels

| Export | Soort | Beschrijving |
|---|---|---|
| `DATA_KEYS` | `as const` | Top-level sleutels: `setup`, `household`, `finance`, `meta`, etc. |
| `SUB_KEYS` | `as const` | Geneste sleutels: `members`, `income`, `expenses`, `items` |
| `DataKey` | type | Union van `DATA_KEYS`-waarden |
| `SubKey` | type | Union van `SUB_KEYS`-waarden |

⚠️ Wijzig waarden alleen samen met een `PersistenceAdapter`-migratie.

---

### `uiSections.ts` — functionele UI-secties

| Export | Soort | Beschrijving |
|---|---|---|
| `UI_SECTIONS` | `as const` | Snake_case identifiers voor logische UI-secties |
| `UISection` | type | `keyof typeof UI_SECTIONS` (uppercase keys) |

**Onderscheid met `ScreenRegistry`**: secties zijn logische groeperingen; schermen zijn individuele renderconfiguraties.

---

## 💡 Best Practices

**Twee tekst-systemen — strikte scheiding:**

```
Labels (schermtitels, veldlabels, navigatietekst)          →  UI_LABELS[UX_TOKENS.*]
Meldingen (validatie, bevestigingen, foutmeldingen)        →  labelFromToken()  via WizStrings
```

**Design-token hiërarchie:**

```
Tokens.ts         ← atomaire waarden (Space, Type, Radius)
    ↓
LayoutTokens.ts   ← structurele patronen (Layout.rowBetween)
    ↓
StyleRegistry     ← component-specifieke stijlen
    ↓
useAppStyles()    ← thema-bewuste stijlen in componenten
```

**Nooit hardcoden:**
```typescript
// ❌
paddingHorizontal: 16
borderRadius: 8
storageKey: 'setup'

// ✅
paddingHorizontal: Space.lg       // Tokens.ts
borderRadius: Radius.md           // Tokens.ts
storageKey: DATA_KEYS.SETUP       // datakeys.ts
```

---

## 🔗 Gerelateerd

- [`TODO.md`](./TODO.md) — Bekende inconsistenties en refactorvoorstellen
- [`WizStrings.ts`](../../config/WizStrings.ts) — Tekstbron voor `labelFromToken`
- [`StyleRegistry`](../registry/StyleRegistry.ts) — Consument van `Tokens` en `Layout`
- [`SCREEN_ARCHITECTURE.md`](../../ui/screens/SCREEN_ARCHITECTURE.md) — Hoe `labelFromToken` in de rendering-pipeline zit
