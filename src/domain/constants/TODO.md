# TODO — Domain Constants Refactors

> **Status**: Voorstellen, nog niet uitgevoerd.
> **Scope**: `src/domain/constants/`
> **Prioriteit**: zie per item.

---

## §1 🔴 `labelResolver.ts` doorzoekt `WizStrings.csvAnalysis` niet

### Probleem

`labelFromToken()` doorzoekt zeven `WizStrings`-secties maar slaat `csvAnalysis` over. Elke `titleToken` of `labelToken` die verwijst naar een sleutel in `WizStrings.csvAnalysis` valt terug op de ruwe token-string als weergavetekst.

Dit is een bestaand ticket — ook gedocumenteerd als **TODO-2** in `SCREEN_ARCHITECTURE.md`.

### Huidige opzoekolgorde

```
wizard → dashboard → common → landing → options → undo → settings → fallback
```

`csvAnalysis` ontbreekt.

### Voorstel

Voeg `csvAnalysis` toe aan de opzoekolgorde, vóór de fallback:

```typescript
if (token in (WizStrings.csvAnalysis ?? {}))
  return (WizStrings.csvAnalysis as Record<string, string>)[token] ?? token;
// Fallback
return token;
```

### Vervolgstap

Controleer of `WizStrings.csvAnalysis` überhaupt tokens bevat die via `labelFromToken` worden opgezocht. Als dat niet het geval is (omdat het CSV-scherm een container is en geen pipeline-scherm), dan is het probleem anders: de `titleToken`-waarden in `ScreenRegistry` voor CSV-schermen zijn niet correct geconfigureerd. Zie ook `SCREEN_ARCHITECTURE.md` TODO-5.

### Impact

Klein. Eén extra `if`-regel in `labelResolver.ts`. Geen typewijzigingen, geen tests hoeven te worden aangepast behalve een nieuwe positieve testcase.

---

## §2 🟡 `SCREEN_LABELS` in `labels.ts` is een unused legacy-export

### Probleem

`labels.ts` exporteert zowel `UI_LABELS` als `SCREEN_LABELS`. `SCREEN_LABELS` is een object met drie sleutels (`WIZARD`, `LANDING`, `DASHBOARD`) waarvan de waarden identiek zijn aan de corresponderende `UI_LABELS[UX_TOKENS.*]`-entries. De export is aangemerkt met een `// Legacy support weghalen of behouden?`-comment, maar er is nooit een beslissing genomen.

### Voorstel

1. Zoek alle imports van `SCREEN_LABELS` in de codebase.
2. Als er geen actieve imports zijn: verwijder `SCREEN_LABELS` uit `labels.ts`.
3. Als er imports zijn: vervang ze door `UI_LABELS[UX_TOKENS.WIZARD]` etc. en verwijder daarna `SCREEN_LABELS`.

`SCREEN_LABELS` is al gemarkeerd als `@deprecated` in de bijgewerkte JSDoc.

### Impact

Klein. Puur een verwijdering — geen gedragswijziging.

---

## §3 🟡 `UISection` type exporteert uppercase keys, niet snake_case waarden

### Probleem

```typescript
export type UISection = keyof typeof UI_SECTIONS;
// Resultaat: 'HOUSEHOLD_SETUP' | 'HOUSEHOLD_DETAILS' | ...
```

De waarden in `UI_SECTIONS` zijn snake_case (`'household_setup'`), maar `UISection` geeft de keys terug (uppercase). Als een consumer het type gebruikt om een waarde te annoteren die vergeleken wordt met `UI_SECTIONS.*`, matcht het type niet met de runtime-waarden.

Voorbeeld van het probleem:

```typescript
function setSection(s: UISection) { ... }
setSection(UI_SECTIONS.HOUSEHOLD_SETUP); // TS-fout: 'household_setup' is not assignable to 'HOUSEHOLD_SETUP'
```

### Voorstel

Voeg een `UISectionValue`-alias toe naast het huidige `UISection`:

```typescript
/** Union van alle geldige `UI_SECTIONS`-sleutels (uppercase, bijv. `'HOUSEHOLD_SETUP'`). */
export type UISection = keyof typeof UI_SECTIONS;

/** Union van alle geldige `UI_SECTIONS`-waarden (snake_case, bijv. `'household_setup'`). */
export type UISectionValue = (typeof UI_SECTIONS)[keyof typeof UI_SECTIONS];
```

Gebruik `UISectionValue` overal waar een snake_case waarde wordt verwacht.

### Impact

Additief — `UISection` blijft ongewijzigd voor backwards-compatibiliteit. Consumers die snake_case waarden annoteren, switchen naar `UISectionValue`.

---

## §4 🟡 `UI_LABELS` dekt slechts twee `UX_TOKENS.FIELDS`-entries

### Probleem

`UX_TOKENS.FIELDS` definieert tien tokens:

```
AANTAL_MENSEN, AANTAL_VOLWASSENEN, KINDEREN, CAR_COUNT, NAME,
AGE, BRUTO_INCOME, INCOME_MEMBER, AUTO_INSURANCE, CAR_REPEATER
```

`UI_LABELS` bevat alleen tekst voor `CAR_COUNT` en `NAME`. De overige acht tokens hebben geen Nederlandse tekst in `UI_LABELS`. Omdat `UI_LABELS` verantwoordelijk is voor labels (schermtitels, veldlabels, navigatietekst), is dit een gat in de dekking.

### Voorstel

1. Zoek alle plaatsen in de codebase die `UX_TOKENS.FIELDS.*` gebruiken anders dan `CAR_COUNT` en `NAME`.
2. Als er geen gebruik is: verwijder de ongebruikte tokens uit `UX_TOKENS.FIELDS` en uit `UI_LABELS`.
3. Als er gebruik is: voeg de ontbrekende Nederlandse veldlabels toe aan `UI_LABELS`.

### Impact

Laag. Opruimwerk; geen runtime-fouten door lege entries.

---

## §5 🟢 Documenteer de bestaande scheiding `UI_LABELS` vs `WizStrings`

### Situatie

De scheiding is inhoudelijk correct en intentioneel:

| Systeem | Verantwoordelijkheid |
|---|---|
| `UI_LABELS[UX_TOKENS.*]` | Labels: schermtitels, veldlabels, navigatietekst |
| `WizStrings` + `labelFromToken` | Meldingen: validatieteksten, bevestigingen, foutmeldingen |

Deze regel is nu gedocumenteerd in de README en in de JSDoc van `labelResolver.ts`. Er is echter nog geen expliciete check of convention-test die afdwingt dat nieuwe meldingen niet in `UI_LABELS` belanden en vice versa.

### Voorstel

Voeg een korte conventie-notitie toe aan `WizStrings.ts` en `labels.ts` zodat de grens ook op de bronbestanden zelf leesbaar is voor toekomstige ontwikkelaars (en AI-assistenten).

### Impact

Trivaal. Alleen documentatie.

---

## §6 🟢 `Colors.card` is een deprecated alias zonder verwijdertermijn

### Probleem

`ColorScheme.card` is gedocumenteerd als `← alias voor surface (backwards compat)` maar heeft geen `@deprecated`-tag gehad en geen verwijdertermijn. Dit leidt tot onbepaalde voortbestaan.

### Voorstel

1. Voeg `@deprecated` toe aan `card` in `ColorScheme` (al gedaan in de bijgewerkte JSDoc).
2. Zoek alle `colors.card`-referenties in de codebase.
3. Vervang door `colors.surface`.
4. Verwijder `card` uit `ColorScheme` en beide thema-objecten.

### Impact

Klein. Zoek-en-vervang; geen semantische wijziging omdat `card === surface`.

---

## Uitvoervolgorde (aanbevolen)

1. **§1** — `labelFromToken` + `csvAnalysis` (klein, directe bugfix)
2. **§2** — `SCREEN_LABELS` verwijderen (klein, opruimwerk)
3. **§3** — `UISectionValue` toevoegen (klein, additief)
4. **§4** — `UX_TOKENS.FIELDS` audit (klein, afhankelijk van gebruik)
5. **§6** — `Colors.card` verwijderen (klein, na audit)
6. **§5** — Twee labelsystemen harmoniseren (middelgroot, langetermijn)
