**Geëxporteerd:** 4-1-2026, 16:02:45
**Aantal berichten:** 10

---
**User:**

geef de officiele prompt voor fase 2c

---

**User:**

Dit bestand is verwijderd

Developer has delivered execution plan

---

**User:**

Created: src/organisms/ExpenseRepeater.tsx

Household-level expenses list with add/remove/edit; chips for type; optional label for ‘overig’; numeric amount input; dispatches shallow merge to state.C10.lasten.

Modified: src/components/FormField.tsx

Extended FieldConfig['type'] with 'expense-repeater' and added a render branch to display <ExpenseRepeater />.

Modified: App.tsx

Replaced C10 page fields with new 'expense-repeater' field and updated calculateFinancialSummary to sum c10.lasten amounts (array model).

Style & Lint:

No single-element style arrays; hook deps stable; export {} used to satisfy isolatedModules.

Result:

Users can enter multiple household expenses on C10, navigate freely without data loss, and see accurate totals on the dashboard (income from C7 map minus expenses from C10 array).

---

**User:**

Ok CTO, what do you suggest how we make the final changes according to the leads' and claude's validation file? (including the conditional rendering)

---

**User:**

Conditional Wizard Pathing: Ensure WIZARD_PAGES dynamically skips pages if data is missing, although currently, we have established the sequence C1 → C4 → C7 → C10 → Dashboard - I disagree! The path is not conditional. No page should be skipped. We should set the required/optional fields.

AND we should put all sections per page in the right order + all fields in the right order + follow the conditional rendering rules exactly as stated.

---

**User:**

![TXT-icoon](https://drive-thirdparty.googleusercontent.com/32/type/text/plain)

TXT

Fout! Hier staat de precieze logica van de conditonal rendering EN welke velden er per sectie + welke secties per pagina, gemaakt moeten worden.

---

**User:**

We zijn er nog niet. Volgens de developer zijn alle conitional rendering en validatie perfect uitgevoerd. Ik zie als tester nog veel errors en fouten in de flow. Het klopt nog niet. Hier een overzicht van de pagina's en de features. Zoals je ziet zit er een dubbeling al op C1 en C4

Here’s the full feature list per page (C1 → C4 → C7 → C10) based on your current implementation and the Phase 2B/2C requirements:

✅ C1 – Wonen & Gezinssituatie (Basis)

Fields:

woonsituatie (radio chips): Huurhuis / Koophuis / Inwonend

burgerlijkeStaat (radio chips): Alleenstaand / Gehuwd/Samenwonend

aantalMensen (counter): min 1, max 10

aantalVolwassen (counter): conditional if aantalMensen > 1, min 0, max 7

Logic:

Validation: adults ≤ people; adults ≥ 1; people ≥ 1

Computed children = aantalMensen - aantalVolwassen (read-only label shown only if > 0)

Guard: Alert if adults > 4 before moving forward

UI:

Counter style: [-] [value] [+] (unchanged)

Inline error messages for min/max violations

✅ C4 – Huishouden Details

Dynamic sections:

Adults (≥1): For each adult:Naam (text, max 25 chars, no emoji)

Leeftijd (numeric, 2 digits, ≥18)

Gender (chips: man / vrouw / anders / geen antwoord)

Children (if any): For each child:Naam (same rules)

Leeftijd (<18)

Gender (same chips)

Geboortejaar (numeric, 4 digits)

Household-level fields:

Burgerlijke staat (once per household):If adults == 1 → auto “Alleenstaand”

Else → chips: Gehuwd / Fiscaal Partners / Samenwonend / Bevriend / Anders

Wonen section:Woning type (Koop / Huur / Kamer / Anders)

Postcode (4 digits, required if adults ≤ 1)

Huisdieren (Ja/Nee)

Auto (Nee / Één / Twee)

Validation:

Adults age ≥18; children age <18

Name max length 25; no emoji

Postcode numeric only (4 digits)

✅ C7 – Inkomsten

Per adult (ID-keyed map):

Multi-select categories: geen inkomen / inkomen uit werk / een uitkering / anders

Vakantiegeld (per jaar) → normalized to monthly

If “werk”:Netto salaris + frequentie (week / 4wk / month / quarter / year)

Toeslagen: zorgtoeslag, reiskosten, overige

If “uitkering”:Uitkering matrix (checkboxes: DUO, Bijstand, WW, ZW, WAO, WGA, WIA, IVA, WAJONG, IOW, Pensioen/AOW if age >67, anders)

For each checked: amount + frequentie; “anders” adds omschrijving

If “anders”:Dynamic rows: label + amount + frequentie

Household-only benefits (once per household):

Huurtoeslag (if woning = Huur)

KindgebondenBudget (if children > 0)

Kinderopvangtoeslag (if any child <13)

Kinderbijslag (€/kwartaal → normalized to monthly)

Validation:

Numeric fields sanitized; frequency applied in dashboard calculation

✅ C10 – Vaste Lasten

Sections:

Wonen (conditional by woning):Huur → Kale huur + Servicekosten

Koop → Hypotheek (bruto) + OZB

Kamer → Kostgeld

Anders → Woonlasten

Nutsvoorzieningen:Kamer → bijdrage EGW

Else → Energie/Gas + Water

Verzekeringen:Ziektekosten (Premie) + hint “Eigen risico wordt automatisch berekend”

Aansprakelijkheid, Reis, Opstal

Abonnementen:Internet/TV, Sport, Lezen

Streaming (chips for videoland/hbo/netflix/etc. → amount per selected)

Contributie vereniging

Per persoon:Telefoon (€) (optional for children <15)

OV (€) (optional for all)

Auto(kosten):Repeat section based on Auto count (Één/Twee)

Required-first order: Wegenbelasting, Benzine/opladen, APK

Optional: Onderhoud, Lease, Afschrijving

Data model: state.C10.lasten = array of objects; aggregator sums all numeric fields

Validation: numeric only; optional vs required enforced by UI hints

✅ Dashboard Summary

Income = sum of:Per-adult amounts (salary normalized by frequency + toeslagen + uitkeringen + anders + vakantiegeld/month)

Household benefits (Kinderbijslag normalized to monthly)

Expenses = sum of all numeric fields in C10.lasten

Cashflow = income − expenses

Color-coded KPI (green if ≥0, red if <0)

---

**User:**

Nee! Waar komt het woord "geboortejaar" vandaan. Dat moet "leeftijd" zijn. Ben je aan het afwijken van jouw CTO rol en creativiteit aan het toepassen?

---

**User:**

- Verberg 'Postcode' conditioneel zodra aantalVolwassenen > 1. NEE! Postcode NIET verbergen. Show 1 keer bij 1e volwassene.

---

**User:**

Schrijf de prompt om deze opdracht uit te laten voeren