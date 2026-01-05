# MVP-prioritering beslissingsmatrix voor features - Claude

**Geëxporteerd:** 5-1-2026, 10:48:23
**Aantal berichten:** 138

---
**Claude:**

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | 10 | GO (MVP) | Privacy-first is een kernpijler van de UVP. Zonder basale toegangsbeveiliging is de privacy-belofte niet geloofwaardig. Financiële data op een onbeveiligde app ondermijnt het hele vertrouwensverhaal. Dit is een 'table stakes' feature voor elke finance app die privacy claimt. Lage complexiteit (standaard OS-functionaliteit), hoge impact op vertrouwen. |
| Feature B: Historische CSV-import (bulk) | 3 | 2 | 5 | MVP+ | Ondersteunt de UVP (flexibiliteit + privacy zonder bankkoppeling), maar is niet essentieel voor een werkende MVP. Gebruikers kunnen ook vanaf 'nu' beginnen met tracken. De feature voegt vooral gemak toe voor power users die hun volledige historie willen migreren. CSV-import is al onderdeel van MVP-scope, maar de bulkimport van historische data brengt extra complexiteit (duplicaatherkenning over langere periodes, data-cleaning van oude exports, performance bij grote datasets). Kan worden uitgesteld tot na validatie van basis-import functionaliteit. |

| Beslissing | Actie |
| --- | --- |
| Feature A (PIN/Biometrie) | ✅ Opnemen in MVP – niet-onderhandelbaar voor privacy-UVP |
| Feature B (Historische Import) | ⏸️ Uitstellen naar MVP+ – valideer eerst basis-functionaliteit |

| # | Feature | Prioriteit | T-Shirt Size | Motivering |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegangsbeveiliging | P0 | S | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig. Essentieel voor gebruikersvertrouwen bij financiële data. Lage complexiteit (standaard OS-functionaliteit). |
| 2 | Handmatige invoer uitgaven/inkomsten | P0 | M | Basis van de app - essentieel voor gebruikers die controle en privacy willen. Simpele UX voor dagelijks gebruik. |
| 3 | Categorisering & budgettering | P0 | M | Vaste lasten, variabel budget, sparen, vrije bestedingsruimte. Kern van cashflow-controle functionaliteit. |
| 4 | Basis rapportage/overzicht | P0 | M | Maandelijkse cashflow, saldo, uitgaven vs inkomsten. Basisgrafieken voor inzicht. Zonder dit is de app alleen een logboek. |
| 5 | Privacy-first data model | P0 | M | Data lokaal of versleuteld opgeslagen, duidelijke export/backup/data-ownership opties. Architecturele beslissing die hele app beïnvloedt. |
| 6 | Flexibele account types | P0 | S | Cash, bank, spaargeld, contant, meerdere rekeningen. Ondersteunt diverse gebruikerssituaties. Relatief simpel data model. |

| Fase | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| MVP 1.0 | Basis CSV-import (generiek) | P1 | M | ✅ GO - Simpele parser voor standaard CSV-structuur, handmatige kolom-mapping door gebruiker. Risico: Gebruikers moeten zelf kolommen selecteren = hogere leercurve. |
| MVP 1.1 | Voorinstellingen top 3 banken | P2 | L | ⏸️ MVP+ - ING, Rabobank, ABN AMRO voorinstellingen, inclusief robuuste foutafhandeling en duplicaatdetectie. Vereist eerst: Benchmark van andere apps + verzamelen testdata. |

| Feature | Motivering Uitstel |
| --- | --- |
| Historische bulk CSV-import | Nice-to-have voor migratie, niet essentieel. Gebruikers kunnen vanaf nu beginnen tracken. Extra complexiteit: performance bij grote datasets, edge cases in oude formats. Valideer eerst basis-import. |

| Fase | Features | Effort | Prioriteit |
| --- | --- | --- | --- |
| Phase 1 | n8n workflow met ING + Rabobank + ABN AMRO presets | L | P0 |
| Phase 2 | Bunq + Knab + SNS presets toevoegen | M | P1 |
| Phase 3 | Generic CSV parser (handmatige kolom-mapping) | M | P2 |
| Phase 4 | Auto-categorisatie op basis van historische data | XL | MVP+ |

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Complexity/Effort | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | S | 10 | ✅ GO (MVP 1.0) | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig bij financiële data. Lage complexiteit (standaard OS-API's), hoge impact. Onveranderd t.o.v. eerdere analyse. |
| Feature B: Historische CSV-import met 3-maanden limiet | 4 | 4 | M → L | 8 | ✅ GO (MVP 1.0) ⚠️ GEWIJZIGD | Substantiële heroverweeging: CSV-onderzoek toont dat bank-presets (ING/Rabobank/ABN) technisch haalbaar zijn en kritiek voor UVP-differentiatie. 3-maanden limiet maakt complexiteit beheersbaar. Zonder goede CSV-import mist de kern-USP: "geen bankkoppeling, maar wél gemak". Effort verhoogd naar M-L vanwege bank-specifieke parsers, maar strategische waarde rechtvaardigt investering. |

| Bank | CSV-Rijkheid | Import Limiet | Parsing Complexity |
| --- | --- | --- | --- |
| ING | Middel (11 kolommen) | 2000 tx, 18 maanden | Medium - puntkomma-delimiter, aanhalingstekens |
| Rabobank | Zeer hoog (18 kolommen) | 8 jaar | Medium - komma-delimiter, rijke metadata |
| ABN AMRO | Zeer laag (5 kolommen) | 18 maanden | Laag - tab-delimited, minimaal |
| Bunq | Hoog (modern) | Onbeperkt | Laag - gestandaardiseerd |
| Knab | Middel | 2000 tx, 24 maanden | Medium |
| SNS | Middel | 5 jaar | Medium |

| Scenario | Impact op Vertrouwen | Waarschijnlijkheid zonder Bank-Presets | Mitigatie met Bank-Presets |
| --- | --- | --- | --- |
| Import faalt volledig | ⛔ Kritisch - gebruiker haakt af | Hoog (generieke parser = trial & error) | Laag (geteste presets) |
| Verkeerde categorisatie | ⚠️ Middel - frustratie, handmatig fixen | Hoog (geen contextbegrip) | Middel (Rabobank metadata helpt) |
| Missende transacties | ⛔ Kritisch - wantrouwen in app | Middel (parsing errors) | Laag (robuuste validatie) |
| Dubbele transacties | ⚠️ Middel - verwarring | Hoog (zonder fingerprinting) | Laag (duplicaatdetectie in n8n) |

| Component | Complexity | Rationale |
| --- | --- | --- |
| Generieke CSV-parser (basis) | S | PapaParse library, simpele kolom-mapping |
| Bank-detectie logic | S | Header-matching met 70% threshold |
| ING-specifieke parser | M | Puntkomma-delimiter, aanhalingstekens-handling, 11 kolommen |
| Rabobank-specifieke parser | M | Komma-delimiter, 18 kolommen, rijke metadata-extractie |
| ABN AMRO-specifieke parser | S | Tab-delimited, 5 kolommen, minimaal |
| Unified schema mapping | S | Datum-normalisatie, bedrag-parsing |
| Duplicaatdetectie | M | Fingerprinting (datum + bedrag + tegenrekening) |
| 3-maanden date-range filter | S | Simpele datum-vergelijking |
| n8n workflow orchestration | M | 6 nodes, error handling |
| Testing met real bank data | M | Verzamelen testdata, edge cases |
| TOTAAL (Top 3 banken) | L | Geschat: 2-3 weken development |

| Aspect | Versie 1.0 (Oorspronkelijk) | Versie 2.0 (Na CSV-Onderzoek) |
| --- | --- | --- |
| CSV-Import | Generieke parser (handmatige mapping) | Bank-presets voor ING + Rabobank + ABN AMRO |
| Historische Import | Uitgesteld naar MVP+ | ✅ Opgenomen met 3-maanden limiet |
| Effort Estimate | M (1 week) | L (2-3 weken) |
| UVP-Differentiatie | Basis import-mogelijkheid | Sterke differentiatie: "Werkt out-of-the-box" |
| Gebruikersvertrouwen | Onzeker (trial & error) | Hoog (geteste presets) |

| # | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegang | P0 | S | GO |
| 2 | Handmatige invoer | P0 | M | GO |
| 3 | Categorisering & budgettering | P0 | M | GO |
| 4 | Basis rapportage/overzicht | P0 | M | GO |
| 5 | Privacy-first data model | P0 | M | GO |
| 6 | Flexibele account types | P0 | S | GO |
| 7 | CSV-import met bank-presets (ING/Rabo/ABN) + 3-maanden limiet | P1 | L | ✅ GO |

| Feature | Aanbeveling | Rationale |
| --- | --- | --- |
| Feature A (PIN/Biometrie) | ✅ GO | Onveranderd - essentieel voor privacy-UVP |
| Feature B (CSV-import) | ⚠️ GO → van MVP+ naar MVP 1.0 | CSV-onderzoek toont dat dit niet optioneel is voor UVP-differentiatie. 3-maanden limiet maakt het haalbaar. Zonder dit mist de kern-USP. |

| # | Vereiste Output | Status | Locatie in Documentatie | Volledigheid |
| --- | --- | --- | --- | --- |
| 1 | Concept UVP (één duidelijke zin) | ⚠️ Gedeeltelijk | Meerdere versies verspreid door rapport | 60% - Niet geconsolideerd tot één definitieve zin |
| 2 | Definitieve Minimale Scope (3 Kernfuncties) | ❌ Nee | 7 features in plaats van 3 | 40% - Scope creep, geen focus op Setup/Invoer/Dashboard |
| 3 | Formeel GO/STOP Keuzemoment voor Lead | ❌ Nee | Vraag gesteld maar niet afgedwongen | 30% - Geen duidelijk beslissingskader |

| Versie | Locatie | Formulering |
| --- | --- | --- |
| Versie A | Rapport pagina 4 | "Privacy-first budget app die toch automatisch transacties kan verwerken -- zonder bankkoppeling." |
| Versie B | Rapport pagina 7 | "Een eenvoudige, privacy-gerichte, flexibele financiën-tracker: geen bank-koppeling nodig, maar wél overzicht en import-opties. Grip op cashflow, ook bij contant geld of variabel inkomen." |
| Versie C | Beslissingsmatrix | "Privacy-first & Controle met CSV-import als differentiator" (impliciet) |

| Kernfunctie | Definitie | Onderliggende Features (technisch) | User Story |
| --- | --- | --- | --- |
| 1. SETUP | Eerste configuratie van de app om te kunnen beginnen | • PIN/Biometrie toegang• Privacy-first data model (lokale opslag)• Flexibele account types (cash/bank/sparen)• Categorisering structuur aanmaken | "Als nieuwe gebruiker wil ik veilig en snel mijn accounts en categorieën instellen, zodat ik binnen 5 minuten kan beginnen met tracken." |
| 2. INVOER | Transacties toevoegen (handmatig of via import) | • Handmatige invoer (uitgaven/inkomsten)• CSV-import met bank-presets (ING/Rabo/ABN)• 3-maanden historische import limiet• Automatische categorisatie (basis) | "Als gebruiker wil ik makkelijk mijn uitgaven toevoegen — ofwel handmatig, ofwel door mijn bankafschrift te uploaden — zodat ik tijd bespaar en een compleet overzicht krijg." |
| 3. DASHBOARD | Inzicht in cashflow en budgetstatus | • Basis rapportage (maandelijks overzicht)• Uitgaven vs inkomsten grafiek• Budget per categorie (vrije bestedingsruimte)• Saldo-overzicht (per account) | "Als gebruiker wil ik in één oogopslag zien hoeveel ik deze maand heb uitgegeven en hoeveel ik nog vrij heb om uit te geven, zodat ik controle houd." |

| # | Kernfunctie | Doel | Ondersteunt UVP Element |
| --- | --- | --- | --- |
| 1 | SETUP | Veilige, snelle eerste configuratie (accounts, categorieën, privacy) | "Privacy-first" + "Controle" |
| 2 | INVOER | Flexibel transacties toevoegen (handmatig of CSV-import) | "Automatisch verwerkt" + "Zonder bankkoppeling" |
| 3 | DASHBOARD | Inzicht in cashflow, budget en vrije bestedingsruimte | "Controle over cashflow" |

| Doelstelling | Oorspronkelijke Status | Herziene Status (Na Correctie) |
| --- | --- | --- |
| Concept UVP (één zin) | ⚠️ Gedeeltelijk (60%) | ✅ Voldaan (100%) |
| 3 Kernfuncties (Setup/Invoer/Dashboard) | ❌ Niet voldaan (40%) | ✅ Voldaan (100%) |
| Formeel GO/STOP Keuzemoment | ❌ Niet voldaan (30%) | ⏳ Framework klaar (80% - wacht op Lead) |

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```js
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

- CTO statusrapport fase 3 audit goedgekeurd
- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning

- Privacy-first is expliciet onderdeel van de kern-UVP
- Gebruikers hebben privacyzorgen en willen data-controle bij finance apps
- Zonder toegangsbeveiliging is er geen geloofwaardige privacy-bescherming
- Technisch eenvoudig: standaard iOS/Android biometrie-API's
- Essentieel voor vertrouwen: gebruikers zullen niet hun financiële data invoeren in een onbeveiligde app
- Lage development effort, maar hoge perceptiewaarde

- Basis CSV-import staat al in MVP-scope – die volstaat voor lopende transacties
- Historische bulk-import is een nice-to-have voor migratie, niet essentieel voor werking
- Extra complexiteit:

| UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |
| --- | --- |
| - UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |

- Duplicaatherkenning wordt complexer bij grote volumes
- Performance-optimalisatie nodig voor datasets van meerdere jaren
- Edge cases in oude CSV-formaten (banken veranderen hun export-structuur)
- UX-uitdagingen: progressie-indicatoren, error handling bij grote bestanden

- Na validatie dat gebruikers CSV-import daadwerkelijk gebruiken
- Wanneer er vraag is van early adopters om historie te migreren
- Na optimalisatie van parsing en duplicaat-detectie

- Benchmark onderzoek: hoe bieden andere apps CSV-import aan
- Verzamelen/creëren van geanonimiseerde testdata van top 3 banken
- Feature-schets voor robuuste CSV-import valideren met testdata

| Key | Value |
| --- | --- |
| MVP 1.0 (Generieke CSV) | Valideert technische haalbaarheid + gebruikersbehoefte aan import-functie. Lagere barrier to launch. |
| MVP 1.1 (Bank | presets): Verhoogt gebruiksvriendelijkheid drastisch, maar vereist significant meer investering (L). Uitstel voorkomt dat we tijd/resources investeren in bank-specifieke parsers voordat we weten of generieke import überhaupt wordt gebruikt. |

| Key | Value |
| --- | --- |
| ✅ Privacy | first: PIN/biometrie + lokale data opslag |
| ✅ Eenvoud | Minimalistisch, zonder overbodige features |
| ✅ Controle | Handmatige invoer + flexibele accounts |
| ✅ Flexibiliteit | Generieke CSV-import als optie (bank-presets volgen later) |

| Key | Value |
| --- | --- |
| 6 Core Features | 2x S + 4x M = ~4-6 weken development (schatting voor 1-2 developers) |
| CSV | Import (generiek): +1 week |
| Testing & Polish | +1-2 weken |
| Total MVP 1.0 | ~6-9 weken |

| Key | Value |
| --- | --- |
| ✅ GO | Alle 6 kern-features (inclusief PIN/biometrie) |
| ✅ GO | Generieke CSV-import (gebruiker selecteert kolommen handmatig) |
| ⏸️ MVP 1.1 | Bank-specifieke voorinstellingen (na benchmark + testdata) |
| ❌ STOP | Historische bulk-import (naar MVP+) |

| Key | Value |
| --- | --- |
| Snellere time | to-market (geen L-size bank-parser werk) |
| Risico | mitigatie: valideer eerst of CSV-import überhaupt wordt gebruikt |
| Focus blijft op kern | UVP (privacy + controle) |
| Ruimte om te leren van early adopters voordat we investeren in complexe bank | presets |

- Ben je akkoord met deze MVP 1.0 scope?
- Wil je toch bank-presets in MVP 1.0, ondanks het hogere risico en langere ontwikkeltijd?
- Heb je aanvullende features die je essentieel vindt voor MVP 1.0?

- Download-limieten per bank:

| - Scheidingstekens variëren: ING wijzigde in 2020 van komma (,) naar puntkomma ( | ) als scheidingsteken Banktrans |
| --- | --- |
| - MT940 wordt afgebouwd: SNS/ASN/RegioBank (Volksbank) ondersteunt sinds juli 2022 geen MT940 meer | Rabobank stopt MT940-ondersteuning vanaf 2025 Moneymonk |

| Key | Value |
| --- | --- |
| ING | max 18 maanden terug |
| ABN AMRO | max 24 maanden (maar slechts 18 maanden in XLS/CSV) |
| Rabobank | tot 8 jaar terug |
| Knab | tot 24 maanden terug |
| bunq | onbeperkt (elke gewenste periode) |
| SNS | tot 5 jaar terug Spreadsheet Shop |

- Scheidingsteken: puntkomma (;)
- 11 kolommen (2 kolommen toegevoegd in 2020: "Saldo na mutatie" en "Tag")
- Datumformaat: JJJJMMDD (yyyymmdd)
- Max 2000 transacties per export Banktrans

- Velden staan tussen aanhalingstekens; Excel voegt soms dubbele/driedubbele aanhalingstekens toe bij bewerking Banktrans

- Scheidingsteken: komma (,)
- Zeer informatierijk: bevat mutatiesoort, rentedatum, meerdere omschrijvingsvelden
- Datumformaat: DD-MM-YYYY
- Meest gedetailleerde CSV van alle banken GeldnerdGitHub

- Veel metadata voor automatische categorisatie (mutatiesoort, meerdere omschrijvingsvelden)

- Scheidingsteken: Tab (TXT) of komma (CSV)
- Zeer beperkt: bevat minimale informatie
- Geen mutatiesoort, geen extra metadata
- Download limiet: 18 maanden in XLS/CSV-formaat Geldnerd

- Minste informatie van alle grote banken; lastig voor automatische categorisatie

- Ondersteunt zowel CSV als JSON export
- Geen downloadin-limiet: gebruikers kunnen transacties exporteren voor elke gewenste periode Spreadsheet Shop
- Modern digitaal platform, waarschijnlijk gestructureerde API-achtige output

- Max 2000 transacties per download
- Tot 24 maanden terug downloadbaar Spreadsheet Shop

- Bestandsformaat: Microsoft Excel, CSV-bestand
- Geen MT940-ondersteuning meer sinds juli 2022
- Tot 5 jaar terug downloadbaar Spreadsheet ShopMoneymonk

- Technische grenzen:

ING's max download: 2000 transacties per export Spreadsheet Shop
Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- UX Overwegingen:

3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
Voorkomt "analysis paralysis" bij onboarding
Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- Privacy & Data Ownership:

Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
Minder data = minder risico bij opslag/verwerking
- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues

- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)

- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ✅ Bank-onafhankelijk MAAR wel gebruiksvriendelijk

Geen directe API-koppeling (privacy-first)
Wél intelligente presets voor gemak
- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak
- ✅ Schaalbaar & Onderhoudbaar

n8n workflows zijn visueel en gemakkelijk uit te breiden
Nieuwe bank toevoegen = nieuwe parser-node
- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node
- ✅ 3-maanden limiet = Sweet Spot

| UX: genoeg data voor inzicht | niet overweldigend |
| --- | --- |
| - UX: genoeg data voor inzicht | niet overweldigend |

Duplicaatherkenning via fingerprinting
Validatie op elk niveau
Error handling per bank-parser
- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak

- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node

| Key | Value |
| --- | --- |
| Technisch haalbaar binnen bank | limieten |
| UX | genoeg data voor inzicht, niet overweldigend |
| Privacy | beperkte historische data-opslag |

- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

| Key | Value |
| --- | --- |
| ✅ GO | Deze n8n-workflow architectuur opnemen in de MVP 1.0 scope? |
| ✅ GO | 3-maanden limiet instellen voor historische bulk-import? |
| ✅ GO | Starten met Phase 1 (ING + Rabobank + ABN AMRO) en later uitbreiden? |

- Andere limiet dan 3 maanden? (bijv. 1 maand of 6 maanden)
- Andere banken prioriteren?
- Voorkeur voor andere technologie dan n8n?

- "Nice-to-have voor migratie, niet essentieel"
- "Gebruikers kunnen vanaf nu beginnen tracken"
- "Valideer eerst basis-import"

- Top 3 banken (ING, Rabobank, ABN) dekken ~70%+ van Nederlandse markt

Focus op deze 3 = maximale ROI met beperkte scope
- Focus op deze 3 = maximale ROI met beperkte scope
- Rabobank's rijke metadata (mutatiesoort, meerdere omschrijvingsvelden) maakt automatische categorisatie mogelijk

Dit is een killer feature die handmatige apps niet hebben
Verhoogt UVP substantieel: "Eenvoud door slimme import"
- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"
- ABN AMRO's minimalisme toont aan dat zelfs beperkte CSV-import beter is dan geen import

| Key | Value |
| --- | --- |
| Gebruikers verwachten dit als baseline | feature |
| Gebruikers verwachten dit als baseline | feature |
| 3 | maanden limiet lost technische barrières op: |

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

- Focus op deze 3 = maximale ROI met beperkte scope

- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"

- Gebruikers verwachten dit als baseline-feature

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

| Key | Value |
| --- | --- |
| Versie 1.0 | Generieke CSV (M) + uitstellen bank-presets |
| Versie 2.0 | Generieke CSV + Top 3 bank-presets (L) |
| Delta | +1-2 weken effort |

- Strategische waarde >> Effort-kosten

CSV-import is primaire differentiator vs handmatige apps
Zonder dit faalt de kern-USP
- CSV-import is primaire differentiator vs handmatige apps
- Zonder dit faalt de kern-USP
- n8n workflow = toekomstige schaalbaarheid

Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
Visual workflow = makkelijk onderhoudbaar
- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar
- 3-maanden limiet = effort-begrenzer

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Bank | presets = vertrouwen-multiplier |

"Het werkt gewoon" = kritiek voor early adopters
Goede eerste indruk = retention
- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

| Key | Value |
| --- | --- |
| CSV | import is primaire differentiator vs handmatige apps |
| Zonder dit faalt de kern | USP |

- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |

- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

- Concurrentievoordeel:

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Onboarding | kritiek: |

| Falen = churn | slagen = engagement |
| --- | --- |
| - Falen = churn | slagen = engagement |

n8n workflow = fundament voor toekomstige features
Automatische categorisatie (MVP+) bouwt hierop voort
Investering nu = snellere iteraties later
- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |

- Eerste 5 minuten bepalen of gebruiker blijft
- "Importeer je bankdata" = eerste actie
- Falen = churn, slagen = engagement

- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Versie 1.0 | ~6-9 weken |
| Versie 2.0 | ~8-12 weken (+2-3 weken voor robuuste CSV-import) |

- ⏱️ +2-3 weken development time
- ✅ Veel sterkere product-market fit
- ✅ Lagere churn bij onboarding
- ✅ Duidelijke differentiatie vs concurrentie

| Key | Value |
| --- | --- |
| MVP 1.0a | Alleen ING-preset (grootste bank, ~40% markt) = M effort (1 week) |
| MVP 1.0b | Rabobank + ABN toevoegen = +1 week |

| - ✅ Optie A (Aanbevolen): GO voor Feature B in MVP 1.0 met Top 3 bank-presets (L effort | 2-3 weken extra) |
| --- | --- |
| - ⚡ Optie B (Sneller): GO voor Feature B in MVP 1.0 met alleen ING-preset (M effort | 1 week extra) |
| - ⏸️ Optie C (Oorspronkelijk plan): Uitstellen Feature B naar MVP+ (geen extra tijd | maar zwakkere UVP) |

- 3 verschillende formuleringen
- Geen enkele is één duidelijke zin zoals gevraagd
- Versie B is te lang (2 zinnen)
- Geen formele goedkeuring van Lead op specifieke formulering

- PIN/Biometrie
- Handmatige invoer
- Categorisering & budgettering
- Basis rapportage
- Privacy-first data model
- Flexibele account types
- CSV-import met bank-presets

| Key | Value |
| --- | --- |
| Scope creep | 7 features ≠ 3 kernfuncties |
| Niet georganiseerd volgens het gevraagde framework | Setup → Invoer → Dashboard |
| Features zijn technische bouwblokken, geen gebruikers | gerichte functies |

- Stelden vragen: "Ben je akkoord?", "Welke optie kies je?"
- Geen duidelijk GO/STOP framework met criteria
- Geen expliciete "Sign-off" vereiste van Lead

- Formele beslissingsprocedure
- Duidelijke criteria voor GO (bijv. "UVP moet X scoren op Y")
- Risico-overzicht bij STOP-beslissing
- Expliciete handtekening/akkoord-moment

| Key | Value |
| --- | --- |
| ✅ Privacy | first: Expliciet genoemd |
| ✅ Geen bankkoppeling | Kernonderscheid vs concurrentie |
| ✅ Automatisch verwerkt | CSV-import als gemak |
| ✅ Cashflow | controle: Hoofdfunctie |
| ✅ Contant/onregelmatig | Doelgroep-differentiatie |
| ✅ Één zin | 23 woorden, helder en scannabel |

- ✅ Voldoet aan "3 kernfuncties" vereiste
- ✅ Georganiseerd volgens Setup → Invoer → Dashboard
- ✅ Alle 7 technische features blijven behouden, maar nu gestructureerd

- ✅ Vult gat in markt (privacy vs gemak)
- ✅ Duidelijk onderscheidend vs concurrentie
- ✅ Ondersteuning door 3 kernfuncties (zie hieronder)

| - Setup = Features 1 | 5 | 6 |
| --- | --- | --- |
| - Invoer = Features 2 | 3 | 7 |

- ✅ GO → We gaan door naar Stap 3
- ⏸️ REVISE → Specificeer welke aanpassingen nodig zijn
- ❌ STOP → Motiveer waarom we stoppen

| Key | Value |
| --- | --- |
| Voor correctie | 43% compliant |
| Na correctie | 93% compliant (laatste 7% = Lead-beslissing) |

- ✅ Goedkeuring of aanpassing van de Definitieve UVP:

| Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |
| --- | --- |
| - Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |

Akkoord met deze structuur?
Ontbreekt er iets essentieel?
- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?
- ✅ Formele GO/STOP/REVISE beslissing:

| Geef expliciet aan: GO | STOP of REVISE |
| --- | --- |
| - Geef expliciet aan: GO | STOP of REVISE |

| Key | Value |
| --- | --- |
| Akkoord met | "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen." |
| Of | voorgestelde wijziging |

- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?

- Vul het beslissingskader in (zie boven)
- Geef expliciet aan: GO, STOP of REVISE

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes
- Validatie-vragen voor gebruikerstests

- Privacy-bewuste gebruikers die geen bankkoppeling willen
- Mensen met contant geld of onregelmatig inkomen (freelancers, ZZP'ers, wisselende inkomsten)
- Casual budgetters die een simpel overzicht willen zonder complexe features
- Leeftijd: 25-45 jaar
- Locatie: Nederland (primair), EU (secundair)
- Tech-savviness: Gemiddeld tot hoog (comfortabel met CSV-bestanden downloaden)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| --- | --- |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |

- Handmatige Invoer

Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

CTA: "Opslaan" button (prominent)
- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)
- CSV Import

| Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |
| --- | --- | --- | --- |
| - Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |

- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)

- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

- Upload-zone (drag & drop of file picker)
- Bank-selectie (dropdown: ING, Rabobank, ABN AMRO, Andere)
- Preview van eerste 3 transacties (tabel) na upload
- Waarschuwing: "Max 3 maanden terug" (info-icoon met uitleg)
- CTA: "Importeer [X] transacties" button

| Key | Value |
| --- | --- |
| Privacy | signaal: Toon ergens subtiel: "🔒 Data blijft op jouw apparaat" (niet opdringerig) |
| Snelheid | Handmatige invoer moet binnen 3 taps/clicks voltooid zijn |
| Foutpreventie | Validatie op bedrag (geen 0, geen letters), datum (niet in toekomst voor uitgaven) |
| Feedback | Bevestiging na opslaan ("✓ Transactie toegevoegd") |

- Welke modus is default? Handmatig of Import? (Advies: Handmatig, want lagere drempel)
- Hoe switchen tussen modi? Tabs, toggle, of aparte schermen?
- Hoe visueel onderscheiden tussen Uitgave/Inkomst? Kleur, icoon, positie?
- Waar plaats je privacy-signalen zonder dat het opdringerig wordt?

- Hoofd-KPI (Hero Section)

"Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

Visueel: Progress bar of cirkel (groen = goed, oranje = op, rood = over budget)
- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |
| Maand | selector |

Dropdown of swipe-interface: "December 2024" ← →
Quick stats: "✓ 47 transacties deze maand"
- Dropdown of swipe-interface: "December 2024" ← →
- Quick stats: "✓ 47 transacties deze maand"
- Inkomsten vs Uitgaven (Simpele Grafiek)

| 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |
| --- | --- |
| - 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |

Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Quick Actions (FAB of Bottom Bar)

| "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |
| --- | --- |
| - "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |

- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

| Key | Value |
| --- | --- |
| Dropdown of swipe | interface: "December 2024" ← → |
| Quick stats | "✓ 47 transacties deze maand" |

- Bar chart of lijndiagram
- 2 kleuren: Groen (inkomsten), Rood (uitgaven)
- X-as: Weken of dagen (afhankelijk van zoom-niveau)

- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)

| Key | Value |
| --- | --- |
| "+" button | Transactie toevoegen (shortcut naar Invoer-scherm) |
| "📊" button | Rapporten (toekomstig, mag disabled zijn in wireframe) |
| "⚙️" button | Instellingen |

| Key | Value |
| --- | --- |
| Informatiehiërarchie | Belangrijkste info bovenaan (Vrije Bestedingsruimte) |
| Scannability | Moet binnen 3 seconden te begrijpen zijn |
| Actie | gericht: Duidelijke CTA ("Transactie toevoegen") altijd zichtbaar |
| Emotionele respons | Gebruik kleur psychologie (groen = goed, rood = waarschuwing, niet judgmental) |
| Privacy | signaal: Eventueel subtiele indicator dat data lokaal is (geen sync-icoon) |

- Hoe presenteer je "Vrije Bestedingsruimte" visueel krachtig zonder overdrijving?
- Welke grafiektype is meest intuïtief voor non-finance users?
- Hoe balanceer je informatiedichtheid vs white space? (minimalistisch maar compleet)
- Waar plaats je Quick Actions? FAB (Floating Action Button) of Bottom Navigation?

| Key | Value |
| --- | --- |
| Primair | iOS (iPhone) - design voor iPhone 13/14/15 standaard formaat |
| Secundair | Android (kan later aangepast worden) |
| Orientatie | Portrait (staand) |

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Niet nodig | Hi-fi mockups, animaties, interactions (komt later) |

- Figma (preferred voor collaborative review)
- Sketch
- Adobe XD
- Balsamiq
- Of zelfs pen & papier gescand

- Tap/click areas
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale database")
- Edge cases (bijv. "Wat als geen transacties deze maand?")

- "Wat denk je dat er gebeurt als je op deze knop klikt?" (voor Invoer-scherm)
- "Wat vertelt dit scherm jou over jouw financiële situatie?" (voor Dashboard)
- "Hoe zou je een uitgave toevoegen?" (task-based test)
- "Voel je je comfortabel met waar je data blijft?" (privacy-perceptie)

- Waarom heb je gekozen voor deze layout?
- Welke UX-patterns heb je toegepast? (bijv. progressive disclosure, chunking)
- Waar heb je bewust gekozen voor eenvoud over features?

- Wireframe 1: INVOER-scherm

 Handmatige invoer versie
 CSV import versie
 Annotaties voor interacties
- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties
- Wireframe 2: DASHBOARD-scherm

 Hero section (Vrije Bestedingsruimte)
 Inkomsten vs Uitgaven grafiek
 Budget per Categorie lijst
 Quick Actions
 Annotaties voor data-sources
- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources
- Design Rationale document (1-2 pagina's)

 Keuzes uitgelegd
 UX-patterns toegelicht
 Privacy-signalering strategie
- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie
- Gebruikerstest Script (Concept)

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties

- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources

- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF |
| Documenten | Markdown of PDF |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 2-3 uur |
| Wireframe 2 (Dashboard) | 2-3 uur |
| Documentatie | 1-2 uur |
| Totaal | 5-8 uur (1 werkdag) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)

| Key | Value |
| --- | --- |
| Dyme (NL) | bekijk hun handmatige invoer flow |
| Wallet by BudgetBakers | bekijk dashboard indeling |
| Spendle | bekijk privacy-signalering |

- Te veel features op 1 scherm (zoals Mint)
- Onduidelijke categorisering (zoals Toshl)
- Privacy-signalen die angstig maken (zoals Revolut's security pop-ups)

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor technische haalbaarheid | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | Quick call (15 min) - vragen over briefing |
| 50% milestone | Review schetsen (30 min) - richting valideren |
| 100% | Final review (45 min) - deliverables doorlopen |

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Privacy-first aanpak is zichtbaar in design
- Handmatige invoer flow is binnen 3 taps/clicks te voltooien
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 3 seconden scannen
- Design rationale legt keuzes uit
- Gebruikerstest script is klaar voor validatie
- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ 0 critical usability issues (blockers voor MVP)

| - Complexiteit te versimpelen (CSV-import voelt technisch | maar moet toegankelijk aanvoelen) |
| --- | --- |
| - Privacy visueel te maken (niet alleen zeggen | maar laten zien) |

- ✅ Akkoord met scope & deliverables
- 📅 Verwachte opleveringsdatum
- ❓ Eventuele vragen of onduidelijkheden

| Key | Value |
| --- | --- |
| GO | Start opdracht |
| REVISE | Aanpassingen nodig (specificeer hieronder) |

- Mensen in armoede of met schuldenproblematiek
- Jong tot oud (breed leeftijdsspectrum: 18-65+)
- Variërend opleidingsniveau en digitale vaardigheden

- ✅ Toegankelijkheid is KRITIEK (WCAG-compliant, duidelijke taal, grote touch targets)
- ✅ Geen stigmatisering (vermijd "budget overschreden" met negatieve framing)
- ✅ Empathie in UX (begrijp stress van financiële onzekerheid)
- ✅ Laagdrempelig (ook voor mensen met beperkte smartphone-ervaring)

| Key | Value |
| --- | --- |
| Cross | platform: iOS EN Android (React Native) |
| Design moet werken binnen React Native component | beperkingen |
| Gebruik universele UI | patterns (geen platform-specifieke elementen) |

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes (incl. toegankelijkheid)
- Validatie-vragen voor gebruikerstests (inclusief voor diverse doelgroepen)

- Privacy-bewuste gebruikers

Willen geen bankkoppeling
Technisch vaardig (25-45 jaar)
- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)
- Mensen met onregelmatig inkomen

| Freelancers | ZZP'ers | wisselende inkomsten |
| --- | --- | --- |
| - Freelancers | ZZP'ers | wisselende inkomsten |

| Beperkt budget | elke euro telt |
| --- | --- |
| - Beperkt budget | elke euro telt |

55-75+ jaar
Mogelijk beperkte digitale vaardigheden
Waarde autonomie en controle
Kunnen visuele beperkingen hebben
- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben
- Jongeren die leren budgetteren ⚠️ NIEUW

| Studenten | starters op arbeidsmarkt |
| --- | --- |
| - Studenten | starters op arbeidsmarkt |

- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)

- Freelancers, ZZP'ers, wisselende inkomsten
- Veel contant geld
- 25-55 jaar

- Beperkt budget, elke euro telt
- Kunnen stress/angst ervaren bij financiën
- Alle leeftijden (18-65+)
- Mogelijk lager opleidingsniveau

- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben

- 18-25 jaar
- Eerste keer zelfstandig financiën beheren
- Studenten, starters op arbeidsmarkt

| Key | Value |
| --- | --- |
| ❌ VERMIJD | Schuld-inducerende taal ("Je hebt te veel uitgegeven", rode waarschuwingen) |
| ✅ GEBRUIK | Neutrale, helpende taal ("Nog €50 beschikbaar deze week", "Budget bijna bereikt") |
| ✅ FOCUS | Op wat WEL kan, niet wat NIET kan |

- ✅ Grote tekst (minimaal 16px body text)
- ✅ Grote touch targets (minimaal 44x44px)
- ✅ Duidelijke labels (geen iconen zonder tekst)
- ✅ Eenvoudige navigatie (max 3 niveaus diep)
- ✅ Bevestigingen bij belangrijke acties

- ✅ Hoog contrast (WCAG AA minimaal, AAA ideaal)
- ✅ Kleur is NIET de enige informatie-drager (iconen + tekst)
- ✅ Screen reader support (semantische labels)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Inclusief & empathisch - geen stigmatisering | begrijp financiële stress |
| --- | --- |
| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| - ✅ Eenvoud boven volledigheid (geen feature-overload | ook voor beginners) |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |
| - ✅ Snelle onboarding (binnen 5 minuten productief | ook voor ouderen) |

| Key | Value |
| --- | --- |
| Handmatige Invoer (Default | laagste drempel) |
| Velden (in deze volgorde | logische flow): |

Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

Bedrag (numeriek keyboard, EUR symbool, groot invoerveld)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

Categorie (dropdown met iconen + tekst)

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

Wanneer? (datepicker, default: vandaag)

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| Key | Value |
| --- | --- |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

CTA:

| "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- Rekening (dropdown: Bankrekening, Cash, Spaarrekening)
- Notitie (optioneel tekstveld, placeholder: "Bijv. 'Albert Heijn'")
- "Opslaan" button (prominent, groot - min 44px hoog)
- ⚠️ Toegankelijkheid: Duidelijk contrast, loading state bij tap
- CSV Import (Optioneel - voor gevorderde gebruikers)
Flow:

Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

Stap 2: Upload-zone

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

Stap 3: Preview (tabel van eerste 3 transacties)

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

Waarschuwing (duidelijk zichtbaar):

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

CTA:

"Importeer [X] transacties" button (groot, duidelijk)
Annuleren-optie (evengroot, secondary style)
- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

- ⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| - "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- ⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

| - "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| - Annuleren-optie (evengroot | secondary style) |

| Key | Value |
| --- | --- |
| Toon subtiel | "🔒 Blijft op jouw apparaat" (klein, onder CTA) |
| NIET | "Je data is veilig bij ons" (suggereert cloud-opslag) |

| - Tekst grootte: Minimaal 16px body | 18px voor invoervelden |
| --- | --- |
| - Kleur contrast: Minimaal 4.5:1 voor tekst | 3:1 voor UI-elementen |
| - Error messages: Duidelijk | helpend (niet "Ongeldige invoer" maar "Vul een bedrag in") |

| Key | Value |
| --- | --- |
| Handmatige invoer | Max 5 taps/inputs (Type → Bedrag → Categorie → Opslaan, rest heeft defaults) |
| CSV import | Max 3 stappen (Bank → Upload → Bevestig) |

| - Validatie: Bedrag niet 0/negatief | datum niet ver in toekomst |
| --- | --- |
| - Maar: Zacht valideren - geen rode errors | wel helpers ("Bedrag moet meer dan €0 zijn") |

| Key | Value |
| --- | --- |
| Bevestiging na opslaan | "✓ Transactie toegevoegd" (toast, verdwijnt na 2 sec) |
| Bij import | "✓ [X] transacties geïmporteerd" + optie om te bekijken |

| Key | Value |
| --- | --- |
| Bij negatief saldo | NIET "Je gaat over budget!" |
| WEL | "Let op: je hebt €50 minder dan gepland" (neutraal, informatief) |

- Welke modus is default?

| Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| CSV import moet duidelijk zijn | maar niet opdringerig |
| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

| Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |
| --- | --- |
| - Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |

| Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |
| --- | --- |
| - Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |

| Advies: Footer van scherm | klein maar leesbaar |
| --- | --- |
| - Advies: Footer van scherm | klein maar leesbaar |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

- Advies: Tabs boven (universeel pattern, werkt op iOS + Android)
- Vermijd hamburger menu (niet toegankelijk voor ouderen)

| Key | Value |
| --- | --- |
| Advies | Iconen + kleur + labels (➖🔴 Uitgave, ➕🟢 Inkomst) |
| NIET | Alleen kleur (kleurenblindheid) |

| Key | Value |
| --- | --- |
| Advies | Footer van scherm, klein maar leesbaar |
| Optioneel | ℹ️ info-icoon met meer uitleg (opt-in) |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

- Hoofd-KPI (Hero Section) - HERZIEN voor Empathie
Optie A (Voor gebruikers met positief saldo):

"Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

| Key | Value |
| --- | --- |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

Optie B (Voor gebruikers met negatief saldo/schulden):

"Je tekort deze maand" (neutraal, niet beschuldigend)

Voorbeeld: "€ 127,80 tekort"

| Visueel: Progress ring (rood | maar met helper-tekst) |
| --- | --- |
| Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

Cruciale Toegankelijkheid:

Groot cijfer: Minimaal 28-32px font
Hoog contrast: Minimaal 7:1 (AAA rating)
Niet alleen kleur: Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!)
- "Nog beschikbaar deze maand" (groot, prominent)

Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
Voorbeeld: "€ 342,50"
- Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
- Voorbeeld: "€ 342,50"
- Visueel: Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort)
- Toon: "Je hebt nog goed ruimte" (positief, ondersteunend)
- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

| Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |
| - Quick stat: "47 transacties" (klein | onder maand) |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
X-as: Weken van de maand (Week 1, Week 2, etc.)
⚠️ Toegankelijkheid:

Labels BOVEN bars (niet binnen - leesbaar op klein scherm)
Minimaal 12px font voor as-labels
Hoog contrast bars (#00A86B groen, #DC143C rood - colorblind safe)
- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Layout: Icoon | Naam | Bedrag | Progress bar |
| --- | --- | --- | --- |
| - Layout: Icoon | Naam | Bedrag | Progress bar |

- "Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

- Voorbeeld: "€ 127,80 tekort"

| Key | Value |
| --- | --- |
| Groot cijfer | Minimaal 28-32px font |
| Hoog contrast | Minimaal 7:1 (AAA rating) |
| Niet alleen kleur | Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!) |

| - Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Key | Value |
| --- | --- |
| Labels BOVEN bars (niet binnen | leesbaar op klein scherm) |
| Minimaal 12px font voor as | labels |
| Hoog contrast bars (#00A86B groen, #DC143C rood | colorblind safe) |

- Layout: Icoon | Naam | Bedrag | Progress bar
- Voorbeeld:

- Kleurlogica (HERZIEN):

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |

100%: Rood + helper ("€20 meer dan gepland")
- 0-70%: Groen (ruimte over)
- 71-90%: Geel (bijna op)
- 91-100%: Oranje (budget bereikt)
- 100%: Rood + helper ("€20 meer dan gepland")
- ⚠️ Toegankelijkheid:

Icoon + tekst (niet alleen icoon)
Progress bar + percentage (niet alleen bar)
Minimaal 16px font voor categorie-namen
48px hoog per rij (makkelijk tappen)
- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)
- ⚠️ Empathie:

| WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |
| --- | --- |
| - WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |
| 100% | Rood + helper ("€20 meer dan gepland") |

- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)

| Key | Value |
| --- | --- |
| NIET | "Budget overschreden! ⛔" |
| WEL | "€20 meer uitgegeven dan gepland" (neutraal, feitelijk) |

- Quick Actions (Bottom Bar - React Native Safe Area)
Layout: Bottom Navigation (3-4 items, universeel pattern)
Items:

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

⚠️ Toegankelijkheid:

| Icoon + label (altijd beide | niet alleen icoon) |
| --- | --- |
| - Icoon + label (altijd beide | niet alleen icoon) |

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

- Icoon + label (altijd beide, niet alleen icoon)
- Minimaal 56px hoog (React Native safe area)
- Haptic feedback bij tap (Android + iOS)
- Duidelijke active state (kleur + onderstreping)

| Key | Value |
| --- | --- |
| Belangrijkste info bovenaan | "Nog beschikbaar" of "Tekort" |
| Scannability | Max 5 seconden om hoofdvraag te beantwoorden |
| Progressive disclosure | Details (categorieën) komen daarna |

- Kleurpsychologie - empathisch:

| Groen = positief | ruimte | controle |
| --- | --- | --- |
| Geel = attentie | bijna op | let op |
| - Groen = positief | ruimte | controle |
| - Geel = attentie | bijna op | let op |

✅ "Nog over", "beschikbaar", "meer uitgegeven"
❌ "Schuld", "overschrijding", "fout", "probleem"
- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Groen = positief | ruimte | controle |
| --- | --- | --- |
| - Geel = attentie | bijna op | let op |

- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Tekst grootte: Min 16px body | 28-32px voor hoofd-KPI |
| --- | --- |
| - Screen reader: Semantische HTML | alt-texts voor grafieken |

| Key | Value |
| --- | --- |
| Subtle indicator | Klein 🔒 icoon in app header (altijd zichtbaar) |
| Geen sync | icoon (suggereert cloud) |

- Geen verborgen navigatie (hamburger menu)
- Duidelijke labels (niet alleen iconen)
- Grote touch areas (vermijd accidental taps)
- Confirmatie bij belangrijke acties ("Weet je zeker dat je...")

- Geen alarmbells (❌ "URGENT: Budget overschreden!")
- Wel actionable helpers (✅ "Bekijk waar je kunt besparen")
- Focus op controle (niet op falen)

- Hoe presenteer je "Tekort" zonder stigma?

| Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |
| --- | --- | --- |
| - Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |

| Advies: Vertical bar chart (simpelste | meest universeel) |
| --- | --- |
| - Advies: Vertical bar chart (simpelste | meest universeel) |

Advies: Meer white space voor toegankelijkheid (ook ouderen)
Max 3-4 data-punten per sectie
- Advies: Meer white space voor toegankelijkheid (ook ouderen)
- Max 3-4 data-punten per sectie
- Waar plaats je Quick Actions?

| Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |
| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- Advies: Neutraal icoon (⚠️ niet ⛔), helpende tekst, focus op oplossing

| Key | Value |
| --- | --- |
| Advies | Vertical bar chart (simpelste, meest universeel) |
| Alternatief | Line chart (voor trends over weken) |
| VERMIJD | Pie charts (moeilijk te lezen op klein scherm) |

| Key | Value |
| --- | --- |
| Advies | Meer white space voor toegankelijkheid (ook ouderen) |
| Max 3 | 4 data-punten per sectie |

| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- ⚠️ HERZIEN: iOS EN Android (React Native)
- Design voor:

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| Orientatie | Portrait (staand) - primair |
| Dark mode | Moet ondersteund worden (React Native native support) |

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |

- ✅ Bottom Tab Navigation (werkt native op beide platforms)
- ✅ Modal sheets (React Native's Modal component)
- ✅ Standard buttons (TouchableOpacity/Pressable)
- ✅ TextInput (native keyboard support)
- ❌ VERMIJD: Platform-specific gestures (3D Touch, force touch)
- ❌ VERMIJD: Custom native components (te complex voor MVP)

| Key | Value |
| --- | --- |
| iOS | Notch + home indicator (gebruik SafeAreaView) |
| Android | Status bar + navigation bar |
| Bottom navigation | Min 56px hoog + safe area insets |

| Key | Value |
| --- | --- |
| ✅ Kleurcontrast | Min 4.5:1 voor normale tekst, 3:1 voor grote tekst (>18px) |
| ✅ Touch targets | Min 44x44px (iOS) / 48x48dp (Android) |
| ✅ Tekst resize | Tot 200% zonder content loss |
| ✅ Focus indicators | Duidelijk zichtbaar (min 2px border) |

- ✅ Kleurcontrast: Min 7:1 voor normale tekst
- ✅ Touch targets: Min 48x48px overal
- ✅ Geen animaties >3 seconden (optie om uit te zetten)

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Annoteer | Lettergroottes, touch target sizes, kleurcontrasten |
| Niet nodig | Hi-fi mockups, animaties, micro-interactions (komt later) |

- Figma (preferred - collaborative review + React Native plugins)
- Sketch + React Native plugin
- Adobe XD
- Balsamiq
- Of pen & papier gescand

- React Native Design System
- Accessibility Checker (Stark)
- Contrast (voor WCAG checks)

- Tap/click areas (met minimale sizes: 44px/48dp)
- Tekst sizes (minimaal 16px voor body)
- Kleurcontrasten (bijv. "#333 op #FFF = 12.6:1 ✓")
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale SQLite database")
- Edge cases:

Wat als geen transacties deze maand?
Wat als gebruiker negatief saldo heeft?
Wat als ouderen de CSV-import niet begrijpen?
- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?
- Toegankelijkheid notes (bijv. "Alt-text voor grafiek: 'Bar chart met inkomsten €1200 en uitgaven €857'")

- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?

- "Wat zou je doen om bij te houden dat je €15 hebt uitgegeven aan boodschappen?" (task-based)
- "Waar zou je klikken om een uitgave toe te voegen?" (navigatie)
- "Wat gebeurt er als je op 'CSV Import' klikt?" (begrip)

- "Wat vertelt dit scherm jou over jouw financiële situatie?" (comprehensie)
- "Hoeveel heb je nog over deze maand?" (scannability - moet binnen 5 sec antwoord hebben)
- "Waar kijk je als eerste naar?" (visuele hiërarchie)

- Wireframe 1: INVOER-scherm

[
- [

- [

- CSV import versie (optioneel, met hulp)
- Annotaties: touch targets (min 44/48px), lettergroottes (min 16px), contrasten
- Toegankelijkheid notes: WCAG-checks, screen reader labels, color-blind safe
- Wireframe 2: DASHBOARD-scherm

 Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
 Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
 Budget per Categorie lijst (icoon + tekst, progress bar + %)
 Quick Actions (bottom navigation, 3-4 items)
 Annotaties: data-sources, edge cases, toegankelijkheid
 Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Design Rationale document (2-3 pagina's)

| Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| --- | --- |
| - Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| - Gebruikerstest Script (Concept | 3-4 pagina's) |

 5-7 validatievragen per scherm
 Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |

 2-3 task-based scenarios (bijv. "Voeg een uitgave toe")
- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?

- Layout keuzes uitgelegd
- UX-patterns toegelicht
- Toegankelijkheidsstrategie (WCAG AA/AAA compliance)
- Empathie & inclusiviteit (taalgebruik, kleurpsychologie)
- Privacy-signalering strategie
- React Native overwegingen (cross-platform patterns)

- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| - Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF (met annotaties leesbaar) |
| Documenten | Markdown of PDF |
| Toegankelijkheid audit | Gebruik Figma plugin "Stark" of "Contrast" voor WCAG-checks |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 3-4 uur (incl. toegankelijkheids-annotaties) |
| Wireframe 2 (Dashboard) | 3-4 uur (incl. diverse scenario's: positief/negatief saldo) |
| Documentatie (rationale + empathie) | 2-3 uur |
| Gebruikerstest script (inclusief diverse doelgroepen) | 1-2 uur |
| Totaal | 9-13 uur (~1.5-2 werkdagen) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)
- WCAG 2.1 Guidelines - https://www.w3.org/WAI/WCAG21/quickref/ (voor toegankelijkheidsreferentie)

| - Microsoft Outlook Mobile - grote touch targets | duidelijke navigatie |
| --- | --- |
| - Google Keep - simpele UI | geschikt voor alle leeftijden |

| Key | Value |
| --- | --- |
| Qapital (US) | positieve framing van sparen |
| Emma (UK) | geen stigmatiserende taal bij overschrijding |
| ❌ NIET Mint | té complex, overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Spendle (NL) | goede privacy-communicatie |
| Standard Notes | duidelijke lokale/versleutelde data-indicatoren |

| Key | Value |
| --- | --- |
| ❌ Kleine tekst (<16px) | onleesbaar voor ouderen |
| ❌ Kleine touch targets (<44px) | moeilijk tappen |
| ❌ Alleen kleur voor informatie | kleurenblindheid |
| ❌ Negatieve taal bij budget | overschrijding - stigmatiserend |
| ❌ Complexe grafieken (pie charts, multi | line) - overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor toegankelijkheidsvragen | [Accessibility Lead naam, of externe consultant] |
| Voor React Native constraints | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | 2: Quick call (20 min) - vragen over briefing + toegankelijkheidseisen |
| 50% milestone | Review schetsen (45 min) - valideer richting + toegankelijkheid |

| Check: WCAG AA contrasten | touch target sizes | empathische taal |
| --- | --- | --- |
| - Check: WCAG AA contrasten | touch target sizes | empathische taal |

- Check: WCAG AA contrasten, touch target sizes, empathische taal

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Handmatige invoer flow is binnen 5 taps/clicks te voltooien (ook voor ouderen)
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 5 seconden scannen

- WCAG 2.1 AA minimaal voldaan:

| Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |
| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

- Geen stigmatiserende taal (✓ "tekort" ipv ✗ "schuld")
- Positief/neutraal framing bij negatieve situaties
- Helpende actionables bij waarschuwingen (niet alleen alarm)

| Key | Value |
| --- | --- |
| Privacy | first aanpak is subtiel maar zichtbaar in design |
| Geen cloud/sync | iconen (communiceert lokale opslag) |

- Design werkt binnen React Native constraints
- Geen platform-specific patterns (werkt op iOS + Android)
- Safe areas gemarkeerd (notch, home indicator, status bar)

- Design rationale legt keuzes uit (incl. toegankelijkheid + empathie)
- Gebruikerstest script is klaar voor validatie met diverse doelgroepen
- Annotaties zijn compleet (sizes, contrasten, edge cases)

- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests
- Toegankelijkheidsaudit is gedaan (via Figma plugin of handmatig)

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ 0 critical usability issues (blockers voor MVP)

- ✅ ≥90% ouderen (55+) kan handmatige invoer voltooien
- ✅ ≥80% gebruikers met lage digitale vaardigheden begrijpt hoofdscherm
- ✅ ≥95% gebruikers kan tekst lezen (geen klachten over te kleine letters)
- ✅ ≥90% gebruikers kan knoppen makkelijk tappen (geen mistaps)

- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ ≥80% gebruikers met schulden/financiële stress voelt zich NIET veroordeeld door de app
- ✅ ≥70% gebruikers vindt de taal begrijpelijk en ondersteunend (niet jargon/technisch)

- ✅ Geen visuele/interactie-verschillen tussen iOS en Android testgebruikers

- Complexiteit te versimpelen

| CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| Financiële data kan overweldigend zijn | maar moet scanbaar blijven |
| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

| Niet alleen zeggen | maar laten zien |
| --- | --- |
| - Niet alleen zeggen | maar laten zien |

| Ondersteunende taal | niet veroordelend |
| --- | --- |
| Focus op controle en mogelijkheden | niet op falen |
| - Ondersteunende taal | niet veroordelend |
| - Focus op controle en mogelijkheden | niet op falen |

| Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |
| - Grote tekst | grote knoppen | hoog contrast |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

Werkt identiek goed op iOS en Android
Binnen React Native constraints
- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

- Niet alleen zeggen, maar laten zien
- Zonder opdringerig te zijn

| - Ondersteunende taal | niet veroordelend |
| --- | --- |
| - Focus op controle en mogelijkheden | niet op falen |

| - Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

- ✅ Akkoord met scope & deliverables (incl. toegankelijkheidseisen)
- 📅 Verwachte opleveringsdatum (hou rekening met 1.5-2 werkdagen)
- ❓ Eventuele vragen of onduidelijkheden
- 🛠️ Welke tool ga je gebruiken? (Figma aanbevolen voor WCAG-plugins)
- 🧪 Heb je toegang tot Figma accessibility plugins? (Stark, Contrast)

- ✅ GO - Start opdracht
- ⚠️ REVISE - Aanpassingen nodig (specificeer hieronder):
- 
-

- 
-

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drabobank.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dopleidingscentrum.eu&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dspreadsheet-shop.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dstamrechtingenieur.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dabnamro.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbankingtools.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddanielhaitink.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dclearvault.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

### RecentsHide

### rapportage_totaal.docx

## Beslissingsmatrix: MVP Feature Prioritering

## Toelichting per Feature

### Feature A: PIN/Biometrie (Aanbeveling: GO)

### Feature B: Historische Bulk CSV-Import (Aanbeveling: MVP+)

## Conclusie & Aanbeveling aan Lead

### Naamloos document.docx

## 📋 Definitieve MVP Feature List - Project Minimal Cashflow

### ✅ Kern-Features (MUST HAVE - GO voor MVP)

### ⚠️ CSV-Import: Gefaseerde Aanpak (Risicomitigatie)

### ❌ Uitgesteld naar MVP+ (STOP voor nu)

## 🎯 MVP Definitie Samenvatting

### Scope Statement:

### UVP Validatie:

### Total Effort Estimate:

## 🚦 Beslissingsvraag aan Lead (Manasse)

## 🏦 CSV-Structuuranalyse: Top 6 Nederlandse Banken

### 📊 Bevindingen uit Onderzoek

### 🔍 CSV-Structuur per Bank

#### 1. ING Bank

#### 2. Rabobank

#### 3. ABN AMRO

#### 4. Bunq

#### 5. Knab

#### 6. SNS Bank (Volksbank: SNS, ASN, RegioBank)

### n8n Node-by-Node Implementatie

#### Node 1: File Upload (HTTP Webhook of Binary Input)

#### Node 2: Bank Detection (Function Node)

#### Node 3: Parse & Clean (Switch Node → Bank-Specific Parsers)

#### Node 4: Map to Unified Data Model (Function Node)

#### Node 5: Validate & Dedupe (Function Node)

#### Node 6: Output (HTTP Response / Database Insert)

## 🚨 Max Limiet voor Historische Bulk Data

### ✅ Aanbevolen Limiet: 3 Maanden (90 Dagen)

## 📋 Implementatie Roadmap

### MVP 1.0: Gefaseerde Aanpak

## ✅ Voordelen van Deze Aanpak

## 🚦 Vraag aan Jou (Goedkeuring)

# 🔄 Heroverweging: MVP-Scope Prioritering met CSV-Onderzoek

## 📊 Beslissingsmatrix: MVP Feature Prioritering (Versie 2.0)

## 🔍 Gedetailleerde Heroverweging Feature B

### ❌ Oorspronkelijke Analyse (Versie 1.0)

### ✅ Nieuwe Analyse (Versie 2.0 - Na CSV-Onderzoek)

### 1️⃣ UVP-Fit Score: 3 → 4 (+1 punt)

### 2️⃣ Vertrouwen Score: 2 → 4 (+2 punten)

### 3️⃣ Complexity/Effort: S → M-L (Verhoogd, maar acceptabel)

## 🎯 Strategische Implicaties

### Wat verandert er in MVP 1.0 Scope?

### Waarom deze heroverweeging strategisch cruciaal is:

## 📋 Bijgewerkte MVP 1.0 Scope

### ✅ Definitieve Feature List:

## 🚦 Aanbeveling aan Lead

## ❓ Vraag aan Jou (Goedkeuring Vereist)

# 📊 Audit: Voldoen We Aan Stap 2 Doelstellingen?

## ✅ Checklist: Vereiste Outputs voor Stap 2

## 🔍 Gedetailleerde Analyse per Output

### Output 1: Concept UVP (één duidelijke zin)

### Output 2: Definitieve Minimale Scope (3 Kernfuncties)

### Output 3: Formeel GO/STOP Keuzemoment

## 🔧 Correctieplan: Hoe We Dit Oplossen

### Actie 1: Consolideer UVP tot Eén Definitieve Zin

### Actie 2: Herstructureer Scope naar 3 Kernfuncties

### Actie 3: Formeel GO/STOP Beslissingskader

## 📋 Finale Deliverable: Gecorrigeerde Output voor Stap 2

### 1. Concept UVP (Definitief)

### 2. Definitieve Minimale Scope (3 Kernfuncties)

### 3. Formeel GO/STOP Keuzemoment

## ✅ Herziene Antwoord op Jouw Vraag

## 🚦 Actie Vereist van Jou (Lead)

# 📐 Opdracht voor David - UX/UI Designer (Consult)

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (Primair)

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden

### Platform

### Design Fidelity

### Tools (Keuze David)

### Annotaties

## 🧪 Validatie-ondersteuning

### 1. Gebruikerstest Script (Concept)

### 2. Design Rationale (Korte toelichting)

## 📦 Deliverables Checklist

## ⏱️ Tijdsinschatting & Prioriteit

## 🔗 Relevante Documentatie

## 💬 Communicatie & Vragen

## ✅ Acceptatiecriteria (Wat is "Done"?)

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?)

## 📝 Slot: Waarom Dit Belangrijk Is

## ✍️ Akkoord & Kickoff

# 📐 Opdracht voor David - UX/UI Designer (Consult) [HERZIENE VERSIE]

## 🔄 Belangrijke Herziene Punten

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (HERZIEN - Breed & Inclusief)

### Cruciale Toegankelijkheids-overwegingen

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes (HERZIEN)

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden (HERZIEN)

### Platform

### React Native Component Constraints

### Toegankelijkheids-specificaties (WCAG 2.1)

### Design Fidelity

### Tools (Keuze David)

### Annotaties (MUST HAVE)

## 🧪 Validatie-ondersteuning (HERZIEN)

### 1. Gebruikerstest Script (Concept) - Inclusief voor Diverse Doelgroepen

#### Voor INVOER-scherm:

#### Voor DASHBOARD-scherm:

### 2. Design Rationale (Korte toelichting) - HERZIEN

## 📦 Deliverables Checklist (HERZIEN)

## ⏱️ Tijdsinschatting & Prioriteit (HERZIEN)

## 🔗 Relevante Documentatie (HERZIEN)

## 💬 Communicatie & Vragen (HERZIEN)

## ✅ Acceptatiecriteria (Wat is "Done"?) - HERZIEN

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?) - HERZIEN

## 📝 Slot: Waarom Dit Belangrijk Is (HERZIEN)

## ✍️ Akkoord & Kickoff (HERZIEN)

## 📎 Bijlage: Quick Reference - Toegankelijkheidseisen

> "Als de import faalt (bijv. verkeerde categorisatie, missende transacties, of crashende import), ondermijnt dit direct onze Unique Value Proposition (UVP) van 'Privacy-first & Controle'. Het faalt in het leveren van het beloofde gemak van automatisch inlezen én veroorzaakt frustratie, wat leidt tot afhaken van gebruikers bij de eerste essentiële actie."

> "Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard)."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Dashboard: Koos voor cirkel-progress ipv bar omdat dit visueel compacter is en emotioneel minder 'judgmental' aanvoelt. Gebruikers zien ratio vs absoluut getal."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

New chatChatsProjectsArtifactsCodeAll chatsMManasseFree planMVP-prioritering beslissingsmatrix voor featuresShare667 linesdocxVraag 2: Elias - MVP-Scope Prioritering
Target AI: claude
Uw Geoptimaliseerde Prompt:
PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP).
 
CONTEXT:
Lees bijgevoegd rapport
1.  [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516].
2.  **Te Prioriteren Features (Optioneel):**
    * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524].
    * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525].
 
TAAK:
Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP).
 
CRITERIA VOOR AFWEGING:
1.  **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst).
2.  **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5).
3.  **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1).
 
OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel):
Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025Ik ga de beslissingsmatrix genereren voor de twee optionele features, gebaseerd op de context uit het rapport en de drie opgegeven criteria.

Waarom GO voor MVP:

Risico bij weglaten: App wordt niet serieus genomen als privacy-tool, reputatieschade, gebruikers haken af voordat ze beginnen.

Waarom MVP+ (uitstellen):

Wanneer wel toevoegen (MVP+):

| Key | Value |
| --- | --- |
| Motivatie | De MVP moet 'Minimal' blijven. Feature A is een fundamentele voorwaarde voor de privacy-belofte. Feature B is waardevol maar niet kritisch – gebruikers kunnen vanaf vandaag beginnen tracken. Houd de scope scherp en valideer eerst de kernfunctionaliteit voordat je optimaliseert voor migratie van oude data. |
| Volgende stap | Als je akkoord gaat met deze prioritering, kan ik een definitieve MVP Feature List opstellen met alle GO-features gerangschikt op implementatievolgorde.63 linesdocxneem dit document mee in jouw overwegingen voor het samenstellen van de definitieve mvp; vraag daarna om mijn goedkeuring2 dec 2025Ik heb beide documenten nu geanalyseerd. Het tweede document voegt een kritische risicoanalyse toe over de CSV-parser die impact heeft op de MVP-scope. Laat me de definitieve MVP samenstellen met deze nieuwe inzichten. |

KRITISCH INZICHT uit Document 2:
CSV-headers/formaten verschillen per bank, wat leidt tot risico van onbetrouwbare data-import. Dit ondermijnt direct de UVP als het faalt.
Gefaseerde implementatie (MVP → MVP+):

Mitigerende Acties (voor MVP 1.1):

Strategische Redenering:

"Een werkende, beveiligde app die handmatige invoer en basis CSV-import ondersteunt, met categorisering, budgettering en cashflow-overzicht. Data blijft privé en lokaal. Gebruikers kunnen direct beginnen met tracken."

Ik adviseer de volgende scope voor MVP 1.0:

Voordelen van deze aanpak:

Vraag aan jou:

Laat me weten of je goedkeuring geeft, of dat je aanpassingen wilt voordat we deze scope formaliseren.Kunnen we onderzoeken hoe de 6 grootste banken in NL hun csv samenstellen en bedenken hoe een n8n workflow het 'lezen' en verwerken van de data kan aanpakken? Én een max stellen aan de upload van historisch bulk data? Bijvoorbeeld max 3 maanden terug?2 dec 2025Uitstekende pragmatische aanpak! Dit combineert het beste van beide werelden: robuuste bank-support vanaf dag 1, maar met duidelijke scope-begrenzing. Laat me dit onderzoeken.2 stepsRabobank ABN AMRO CSV export kolommen velden structuur10 resultsInformatie over bestandsformaten Rabo Business Banking Professional - Rabobankrabobank.nlEn weer een bank erbij in de spreadsheet – Geldnerd.nlgeldnerd.nlMicrosoft Excel - Rabobank bankrekening transacties download omzetten naar Excelopleidingscentrum.euBanktransacties downloaden doe je zo! Alle Nederlandse banken – Spreadsheet Shopspreadsheet-shop.nlDownloadinstructies Bankmutatiesstamrechtingenieur.nlExporteren naar je boekhoudprogramma - Internetbankieren - ABN AMROabnamro.nlMeestgestelde vragen | BankingToolsbankingtools.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlGitHub - ToonvdPas/rabobank-csv-conversie: Conversie-tool om een CSV-download van de Rabobank te converteren, rubriceren en organiseren voor gebruik in een spreadsheet.github.comFinanciën op orde (2): Inkomsten en Uitgaven in beeld – Geldnerd.nlgeldnerd.nlbunq knab SNS CSV export format kolommen structuur10 resultsList of supported bank and online payment providers export formats : Yuki Support Nederlandyuki.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlYNAB Going Dutchdanielhaitink.nlHow do I create a CSV export - bunq Togetherbunq.comCashflow online software csv export - bunq Togetherbunq.comExport a set of payments - bunq Togetherbunq.comExport rekening overzicht - bunq Togetherbunq.comKnab bank export files : Yuki Support Nederlandyuki.nlPDF to MT940, CAMT.053 & CSV Converter | Bankafschriften + Creditcard Omzettenclearvault.nlExport statements with filter/search/selection - bunq Togetherbunq.comPerfect! Ik heb nu voldoende informatie verzameld. Laat me een uitgebreid overzicht maken van de CSV-structuren van de 6 grootste Nederlandse banken en een n8n workflow-strategie opstellen.

Belangrijkste Inzichten:

Hieronder een reconstructie gebaseerd op de onderzoeksbronnen:

Huidige structuur (na augustus 2020):
csv
Kenmerken:

Uitdagingen:

Uitgebreide CSV-structuur:
csv
Kenmerken:

Voordeel:

Beperkte TXT/CSV-structuur:
txt
Kenmerken:

Uitdaging:

CSV & JSON ondersteuning:

Geschatte structuur (veelvoorkomend bij neobanken):
csv

CSV-ondersteuning:

Vermoedelijke structuur (vergelijkbaar met andere moderne banken):
csv

CSV met IBAN:

Vermoedelijke structuur:
csv

javascript

Detectielogica gebaseerd op CSV-headers:
javascript

ING Parser (Function Node):
javascript
Rabobank Parser (Function Node):
javascript
ABN AMRO Parser (Function Node):
javascript

Unified Transaction Schema:
javascript

Duplicaat-detectie strategie:
javascript

Output JSON voor frontend:
javascript

Rationale:

Implementatie in n8n:
javascript

Wil je dat ik:

Of heb je aanpassingen:

| Key | Value |
| --- | --- |
| Laat me weten of je deze aanpak goedkeurt, dan werk ik de definitieve MVP | scope uit! 🚀Heroverweeg Vraag 2 Elias en gebruik al het bovenstaande CSV onderzoek als input. Vraag 2: Elias - MVP-Scope Prioritering Target AI: claude Uw Geoptimaliseerde Prompt: PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP). CONTEXT: Lees bijgevoegd rapport 1. [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516]. 2. **Te Prioriteren Features (Optioneel):** * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524]. * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525]. TAAK: Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP). CRITERIA VOOR AFWEGING: 1. **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst). 2. **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5). 3. **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1). OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel): Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025 |
| Als Lyra, Beslissingsmatrix Generator | geüpdatet met CSV-structuurinzichten |

Conclusie: MVP+ (uitstellen)
Rationale:

Conclusie: GO voor MVP 1.0
Rationale:

Waarom deze stijging?
Het CSV-onderzoek onthult dat bankvariatie substantieel maar beheersbaar is:

Cruciale inzichten:

Conclusie: CSV-import is niet "nice-to-have" maar essentieel voor differentiatie. Zonder goede import-ervaring valt de kern-USP weg: "Privacy zonder bankkoppeling, maar toch gemak".

Waarom deze stijging?
Het rapport waarschuwt expliciet voor "onbetrouwbare data-import" als kritiek risico:

Risico-analyse:

Conclusie: Een half-werkende CSV-import is slechter dan geen import. Gebruikers die hun eerste import proberen en falen, verliezen direct vertrouwen. Bank-presets (ING/Rabobank/ABN) met robuuste validatie zijn vertrouwen-kritiek.

Effort Breakdown:

Vergelijking met oorspronkelijke schatting:

Is deze effort-investering gerechtvaardigd?
✅ JA, om volgende redenen:

Total MVP 1.0 Effort:

Herziene beslissing:

Trade-off:

Alternatief (indien tijd kritiek is):

Keuze:

Welke optie kies je?
Mijn strategische advies: Optie A. De extra investering (2-3 weken) levert een veel sterker product op dat de kern-UVP waarmaakt. Zonder robuuste CSV-import riskeren we dat gebruikers afhaken bij hun eerste kritieke actie.Voldoen we aan deze doelstellingen? 
Stap 2: De Kern: Bepaling van de UVP (Onder leiding van Elias)
 * Input: De goedgekeurde Concurrentie-matrix en Doelgroep Hypothese (uit Stap 1).
 * Activiteit: Formulering van de kernboodschap die de gaten in de markt vult. Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard).
 * Output Vereisten:
   * De Concept UVP (één duidelijke zin).
   * De Definitieve Minimale Scope (3 Kernfuncties) die de UVP ondersteunen.
 * Definitief Keuzemoment voor de Lead: Formele GO/STOP op de Concept UVP en de Minimale Scope.2 dec 2025
Systematische controle van outputvereisten

Status: ⚠️ GEDEELTELIJK VOLDAAN
Wat we hebben (verspreid door documentatie):

Probleem:

Status: ❌ NIET VOLDAAN
Wat gevraagd werd:

Wat we leverden:
7 features in MVP 1.0:

Probleem:

Status: ❌ NIET VOLDAAN
Wat we deden:

Wat ontbreekt:

Ik stel voor:
📌 DEFINITIEVE CONCEPT UVP (Versie 1.0):

Validatie tegen UVP-criteria:

Framework: Setup → Invoer → Dashboard

Mapping van 7 features naar 3 kernfuncties:

Result:

Framework voor Lead-beslissing:

📌 Kernboodschap:

Validatie:

Technische mapping:

Status: ⏳ WACHTEND OP LEAD-BESLISSING
Vereiste actie van Lead (Manasse):
Vul het bovenstaande beslissingskader in en geef expliciet aan:

"Voldoen we aan deze doelstellingen?"

OVERALL:

Om Stap 2 formeel af te ronden, heb ik nodig:

| Zodra ik dit heb | is Stap 2 formeel afgerond en kunnen we door naar Stap 3 (Wireframes & User Flows). 🚀 |
| --- | --- |
| Wat is jouw beslissing?Schrijf de opdracht voor David | onze UX/UI Designer (Consult). Hij levert ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie2 dec 2025 |
| Fase: Fase 1 | Stap 3 - Wireframes & User Flows |

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voordat we investeren in volledige development. Focus op gebruiksvriendelijkheid, privacy-gevoel en snelheid van begrip.
Deliverables:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 3 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden):

Gebruik de tool die je het snelst laat werken:

Voeg bij wireframes korte notities toe:

Naast de wireframes, lever ook:

Stel 3-5 vragen op die we kunnen stellen tijdens validatie:
Voorbeeld vragen:

Leg per scherm kort uit (3-5 bullets):

Voorbeeld:

David levert op:

Formaat:

Geschatte effort:

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 3-5 werkdagen] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):

Anti-patterns (vermijden):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:

Na gebruikerstests (Stap 4) verwachten we:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP. Als gebruikers hier niet doorheen komen, faalt het hele product. We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Laat zien waarom eenvoud zo krachtig is! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze opdracht te geven?

Succes David! We kijken uit naar je werk. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Teamtwee opmerkingen (revisie) 1) We maken de app voor mensen die meer duidelijkheid en grip willen hebben op hun financiën. Dat kunnen ook mensen zijn in armoede of met schulden van jong tot oud. 
2) We maken de app voor zowel IOS als Android. Native React dus2 dec 2025
Project: Minimal Cashflow - Privacy-First Budget App
Fase: Fase 1, Stap 3 - Wireframes & User Flows
Opdrachtgever: Manasse (Lead) via Elias (Product Strategist)
Datum: [Vandaag]
Deadline: [Te bepalen door Lead]
Versie: 2.0 (Herzien na feedback)

⚠️ REVISIE 1 - Doelgroep Verbreding:
De app is bedoeld voor iedereen die duidelijkheid en grip wil op hun financiën, inclusief:

Impact op design:

⚠️ REVISIE 2 - Platform:

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voor diverse gebruikers (incl. mensen met schulden, ouderen, lage digitale vaardigheden) voordat we investeren in development.
Deliverables:

Primaire doelgroepen:

Locatie: Nederland (primair), EU (secundair)

Voor mensen in financiële stress:

Voor ouderen/lage digitale vaardigheden:

Voor mensen met visuele beperkingen:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

Privacy-signaal:

Toegankelijkheid - Kritieke punten:

Snelheid:

Foutpreventie:

Feedback:

Empathie voor financiële stress:

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 5 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden - logische prioriteit):

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

Informatiehiërarchie:

Emotionele Respons (KRITIEK):

Toegankelijkheid - Kritieke punten:

Privacy-signaal:

Voor ouderen/lage digitale vaardigheden:

Voor mensen in financiële stress:

⚠️ BELANGRIJK voor David:
Gebruik universele patterns die werken in React Native:

Safe Areas (React Native):

MUST HAVE (AA-rating):

NICE TO HAVE (AAA-rating):

Gebruik de tool die je het snelst laat werken:

Handige Figma plugins voor React Native:

Voeg bij wireframes toe:

Naast de wireframes, lever ook:

Stel 5-7 vragen op per scherm, inclusief specifieke vragen voor diverse gebruikers:

Algemeen (alle gebruikers):

Voor ouderen/lage digitale vaardigheden:
4. "Is het duidelijk wat je moet doen om te beginnen?" (onboarding)
5. "Zijn de knoppen groot genoeg om op te klikken?" (touch targets)
6. "Begrijp je wat 'CSV-bestand' betekent?" (jargon-check)
Voor mensen in financiële stress:
7. "Hoe voel je je als je een uitgave toevoegt die je budget overschrijdt?" (emotionele respons)

Algemeen:

Voor ouderen:
4. "Is de tekst groot genoeg om te lezen?" (lettergrootte)
5. "Zijn er dingen die je niet begrijpt?" (duidelijkheid)
Voor mensen met schulden:
6. "Als je een tekort hebt, voelt dit scherm dan beschuldigend of helpt het je?" (empathie-check)
7. "Wat zou je doen om je tekort te verminderen?" (actionability)
Privacy-perceptie (alle gebruikers):
8. "Waar denk je dat je gegevens worden opgeslagen?" (privacy-signalen effectiviteit)
9. "Voel je je comfortabel met het invoeren van je financiële data?" (vertrouwen)

Leg per scherm uit (5-7 bullets), inclusief toegankelijkheidskeuzes:
Template:

Voorbeeld (Dashboard):

David levert op:
Continue2 dec 2025x] Handmatige invoer versie (default, toegankelijk)

Formaat:

Geschatte effort (verhoogd vanwege toegankelijkheidseisen):

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 5-7 werkdagen, vanwege verhoogde complexiteit] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):
Voor toegankelijkheid:

Voor empathische financiële UX:

Voor privacy-signalering:

Anti-patterns (VERMIJDEN):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:
Functioneel:

Toegankelijkheid (KRITIEK):

Empathie & Inclusiviteit:

Privacy:

Cross-Platform:

Documentatie:

Goedkeuring:

Na gebruikerstests (Stap 4) verwachten we:
Algemene bruikbaarheid:

Toegankelijkheid (specifiek):

Empathie & Vertrouwen:

Cross-Platform:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes en toegankelijkheid zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP, en de toegankelijkheid en empathie zijn cruciaal. Als mensen in armoede, ouderen, of gebruikers met beperkte digitale vaardigheden hier niet doorheen komen, falen we in onze missie om iedereen grip te geven op hun financiën.
We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Dit is design met impact - het kan mensen helpen die echte financiële stress ervaren. Laat zien hoe krachtig empathisch, toegankelijk design kan zijn! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze herziene opdracht te geven?

Succes David! We kijken uit naar toegankelijk, empathisch design dat écht voor iedereen werkt. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Team

Print dit uit voor tijdens het ontwerpen:
Claude is AI and can make mistakes. Please double-check responses. Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

- CTO statusrapport fase 3 audit goedgekeurd
- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning

### RecentsHide

ChatsProjectsArtifactsCodeAll chats

---

**Claude:**

ChatsProjectsArtifactsCode

---

**Claude:**

- CTO statusrapport fase 3 audit goedgekeurd
- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning

### RecentsHide

All chats

---

**Claude:**

CTO statusrapport fase 3 audit goedgekeurd

---

**Claude:**

Markdown bestanden combineren met PowerShell

---

**Claude:**

Verbeteringssuggestions gevraagd

---

**Claude:**

Scripts analyseren en verbeteringsadvies

---

**Claude:**

Scripts organiseren en opschonen

---

**Claude:**

Audit-script update en verbeterpunten analyseren

---

**Claude:**

Haakje of puntkomma zoeken in code

---

**Claude:**

Wat is dit?

---

**Claude:**

Protocol en documentenanalyse met validatie

---

**Claude:**

Flow 2 architect prompt evaluation

---

**Claude:**

Flow 6 analyse en optimalisatie

---

**Claude:**

CU-assembler prompt optimalisatie voor WAI-audit

---

**Claude:**

CU-assembler ultimate prompt ophalen

---

**Claude:**

Audit-script optimalisatie voor WAI-001 tot WAI-006

---

**Claude:**

Mappenstructuur aanmaken

---

**Claude:**

Prompt optimization en vergelijking PR2

---

**Claude:**

CSV service parsing and validation improvements

---

**Claude:**

Code analyse en verbeteringsadvies

---

**Claude:**

Identificatie bestanden voor theme-code integratie

---

**Claude:**

Untitled

---

**Claude:**

Resuming project development context

---

**Claude:**

Implementation plan development

---

**Claude:**

Dagelijkse invoer voor transactiebeheer

---

**Claude:**

Applying a specific diff

---

**Claude:**

Analyse, vergelijking en aanbevelingen

---

**Claude:**

React Native app wizard flow implementation

---

**Claude:**

Financial household management app architecture

---

**Claude:**

AI CTO initialization and project planning

---

**Claude:**

All chats

---

**Claude:**

MManasseFree plan

---

**Claude:**

M

---

**Claude:**

ManasseFree plan

---

**Claude:**

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | 10 | GO (MVP) | Privacy-first is een kernpijler van de UVP. Zonder basale toegangsbeveiliging is de privacy-belofte niet geloofwaardig. Financiële data op een onbeveiligde app ondermijnt het hele vertrouwensverhaal. Dit is een 'table stakes' feature voor elke finance app die privacy claimt. Lage complexiteit (standaard OS-functionaliteit), hoge impact op vertrouwen. |
| Feature B: Historische CSV-import (bulk) | 3 | 2 | 5 | MVP+ | Ondersteunt de UVP (flexibiliteit + privacy zonder bankkoppeling), maar is niet essentieel voor een werkende MVP. Gebruikers kunnen ook vanaf 'nu' beginnen met tracken. De feature voegt vooral gemak toe voor power users die hun volledige historie willen migreren. CSV-import is al onderdeel van MVP-scope, maar de bulkimport van historische data brengt extra complexiteit (duplicaatherkenning over langere periodes, data-cleaning van oude exports, performance bij grote datasets). Kan worden uitgesteld tot na validatie van basis-import functionaliteit. |

| Beslissing | Actie |
| --- | --- |
| Feature A (PIN/Biometrie) | ✅ Opnemen in MVP – niet-onderhandelbaar voor privacy-UVP |
| Feature B (Historische Import) | ⏸️ Uitstellen naar MVP+ – valideer eerst basis-functionaliteit |

| # | Feature | Prioriteit | T-Shirt Size | Motivering |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegangsbeveiliging | P0 | S | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig. Essentieel voor gebruikersvertrouwen bij financiële data. Lage complexiteit (standaard OS-functionaliteit). |
| 2 | Handmatige invoer uitgaven/inkomsten | P0 | M | Basis van de app - essentieel voor gebruikers die controle en privacy willen. Simpele UX voor dagelijks gebruik. |
| 3 | Categorisering & budgettering | P0 | M | Vaste lasten, variabel budget, sparen, vrije bestedingsruimte. Kern van cashflow-controle functionaliteit. |
| 4 | Basis rapportage/overzicht | P0 | M | Maandelijkse cashflow, saldo, uitgaven vs inkomsten. Basisgrafieken voor inzicht. Zonder dit is de app alleen een logboek. |
| 5 | Privacy-first data model | P0 | M | Data lokaal of versleuteld opgeslagen, duidelijke export/backup/data-ownership opties. Architecturele beslissing die hele app beïnvloedt. |
| 6 | Flexibele account types | P0 | S | Cash, bank, spaargeld, contant, meerdere rekeningen. Ondersteunt diverse gebruikerssituaties. Relatief simpel data model. |

| Fase | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| MVP 1.0 | Basis CSV-import (generiek) | P1 | M | ✅ GO - Simpele parser voor standaard CSV-structuur, handmatige kolom-mapping door gebruiker. Risico: Gebruikers moeten zelf kolommen selecteren = hogere leercurve. |
| MVP 1.1 | Voorinstellingen top 3 banken | P2 | L | ⏸️ MVP+ - ING, Rabobank, ABN AMRO voorinstellingen, inclusief robuuste foutafhandeling en duplicaatdetectie. Vereist eerst: Benchmark van andere apps + verzamelen testdata. |

| Feature | Motivering Uitstel |
| --- | --- |
| Historische bulk CSV-import | Nice-to-have voor migratie, niet essentieel. Gebruikers kunnen vanaf nu beginnen tracken. Extra complexiteit: performance bij grote datasets, edge cases in oude formats. Valideer eerst basis-import. |

| Fase | Features | Effort | Prioriteit |
| --- | --- | --- | --- |
| Phase 1 | n8n workflow met ING + Rabobank + ABN AMRO presets | L | P0 |
| Phase 2 | Bunq + Knab + SNS presets toevoegen | M | P1 |
| Phase 3 | Generic CSV parser (handmatige kolom-mapping) | M | P2 |
| Phase 4 | Auto-categorisatie op basis van historische data | XL | MVP+ |

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Complexity/Effort | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | S | 10 | ✅ GO (MVP 1.0) | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig bij financiële data. Lage complexiteit (standaard OS-API's), hoge impact. Onveranderd t.o.v. eerdere analyse. |
| Feature B: Historische CSV-import met 3-maanden limiet | 4 | 4 | M → L | 8 | ✅ GO (MVP 1.0) ⚠️ GEWIJZIGD | Substantiële heroverweeging: CSV-onderzoek toont dat bank-presets (ING/Rabobank/ABN) technisch haalbaar zijn en kritiek voor UVP-differentiatie. 3-maanden limiet maakt complexiteit beheersbaar. Zonder goede CSV-import mist de kern-USP: "geen bankkoppeling, maar wél gemak". Effort verhoogd naar M-L vanwege bank-specifieke parsers, maar strategische waarde rechtvaardigt investering. |

| Bank | CSV-Rijkheid | Import Limiet | Parsing Complexity |
| --- | --- | --- | --- |
| ING | Middel (11 kolommen) | 2000 tx, 18 maanden | Medium - puntkomma-delimiter, aanhalingstekens |
| Rabobank | Zeer hoog (18 kolommen) | 8 jaar | Medium - komma-delimiter, rijke metadata |
| ABN AMRO | Zeer laag (5 kolommen) | 18 maanden | Laag - tab-delimited, minimaal |
| Bunq | Hoog (modern) | Onbeperkt | Laag - gestandaardiseerd |
| Knab | Middel | 2000 tx, 24 maanden | Medium |
| SNS | Middel | 5 jaar | Medium |

| Scenario | Impact op Vertrouwen | Waarschijnlijkheid zonder Bank-Presets | Mitigatie met Bank-Presets |
| --- | --- | --- | --- |
| Import faalt volledig | ⛔ Kritisch - gebruiker haakt af | Hoog (generieke parser = trial & error) | Laag (geteste presets) |
| Verkeerde categorisatie | ⚠️ Middel - frustratie, handmatig fixen | Hoog (geen contextbegrip) | Middel (Rabobank metadata helpt) |
| Missende transacties | ⛔ Kritisch - wantrouwen in app | Middel (parsing errors) | Laag (robuuste validatie) |
| Dubbele transacties | ⚠️ Middel - verwarring | Hoog (zonder fingerprinting) | Laag (duplicaatdetectie in n8n) |

| Component | Complexity | Rationale |
| --- | --- | --- |
| Generieke CSV-parser (basis) | S | PapaParse library, simpele kolom-mapping |
| Bank-detectie logic | S | Header-matching met 70% threshold |
| ING-specifieke parser | M | Puntkomma-delimiter, aanhalingstekens-handling, 11 kolommen |
| Rabobank-specifieke parser | M | Komma-delimiter, 18 kolommen, rijke metadata-extractie |
| ABN AMRO-specifieke parser | S | Tab-delimited, 5 kolommen, minimaal |
| Unified schema mapping | S | Datum-normalisatie, bedrag-parsing |
| Duplicaatdetectie | M | Fingerprinting (datum + bedrag + tegenrekening) |
| 3-maanden date-range filter | S | Simpele datum-vergelijking |
| n8n workflow orchestration | M | 6 nodes, error handling |
| Testing met real bank data | M | Verzamelen testdata, edge cases |
| TOTAAL (Top 3 banken) | L | Geschat: 2-3 weken development |

| Aspect | Versie 1.0 (Oorspronkelijk) | Versie 2.0 (Na CSV-Onderzoek) |
| --- | --- | --- |
| CSV-Import | Generieke parser (handmatige mapping) | Bank-presets voor ING + Rabobank + ABN AMRO |
| Historische Import | Uitgesteld naar MVP+ | ✅ Opgenomen met 3-maanden limiet |
| Effort Estimate | M (1 week) | L (2-3 weken) |
| UVP-Differentiatie | Basis import-mogelijkheid | Sterke differentiatie: "Werkt out-of-the-box" |
| Gebruikersvertrouwen | Onzeker (trial & error) | Hoog (geteste presets) |

| # | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegang | P0 | S | GO |
| 2 | Handmatige invoer | P0 | M | GO |
| 3 | Categorisering & budgettering | P0 | M | GO |
| 4 | Basis rapportage/overzicht | P0 | M | GO |
| 5 | Privacy-first data model | P0 | M | GO |
| 6 | Flexibele account types | P0 | S | GO |
| 7 | CSV-import met bank-presets (ING/Rabo/ABN) + 3-maanden limiet | P1 | L | ✅ GO |

| Feature | Aanbeveling | Rationale |
| --- | --- | --- |
| Feature A (PIN/Biometrie) | ✅ GO | Onveranderd - essentieel voor privacy-UVP |
| Feature B (CSV-import) | ⚠️ GO → van MVP+ naar MVP 1.0 | CSV-onderzoek toont dat dit niet optioneel is voor UVP-differentiatie. 3-maanden limiet maakt het haalbaar. Zonder dit mist de kern-USP. |

| # | Vereiste Output | Status | Locatie in Documentatie | Volledigheid |
| --- | --- | --- | --- | --- |
| 1 | Concept UVP (één duidelijke zin) | ⚠️ Gedeeltelijk | Meerdere versies verspreid door rapport | 60% - Niet geconsolideerd tot één definitieve zin |
| 2 | Definitieve Minimale Scope (3 Kernfuncties) | ❌ Nee | 7 features in plaats van 3 | 40% - Scope creep, geen focus op Setup/Invoer/Dashboard |
| 3 | Formeel GO/STOP Keuzemoment voor Lead | ❌ Nee | Vraag gesteld maar niet afgedwongen | 30% - Geen duidelijk beslissingskader |

| Versie | Locatie | Formulering |
| --- | --- | --- |
| Versie A | Rapport pagina 4 | "Privacy-first budget app die toch automatisch transacties kan verwerken -- zonder bankkoppeling." |
| Versie B | Rapport pagina 7 | "Een eenvoudige, privacy-gerichte, flexibele financiën-tracker: geen bank-koppeling nodig, maar wél overzicht en import-opties. Grip op cashflow, ook bij contant geld of variabel inkomen." |
| Versie C | Beslissingsmatrix | "Privacy-first & Controle met CSV-import als differentiator" (impliciet) |

| Kernfunctie | Definitie | Onderliggende Features (technisch) | User Story |
| --- | --- | --- | --- |
| 1. SETUP | Eerste configuratie van de app om te kunnen beginnen | • PIN/Biometrie toegang• Privacy-first data model (lokale opslag)• Flexibele account types (cash/bank/sparen)• Categorisering structuur aanmaken | "Als nieuwe gebruiker wil ik veilig en snel mijn accounts en categorieën instellen, zodat ik binnen 5 minuten kan beginnen met tracken." |
| 2. INVOER | Transacties toevoegen (handmatig of via import) | • Handmatige invoer (uitgaven/inkomsten)• CSV-import met bank-presets (ING/Rabo/ABN)• 3-maanden historische import limiet• Automatische categorisatie (basis) | "Als gebruiker wil ik makkelijk mijn uitgaven toevoegen — ofwel handmatig, ofwel door mijn bankafschrift te uploaden — zodat ik tijd bespaar en een compleet overzicht krijg." |
| 3. DASHBOARD | Inzicht in cashflow en budgetstatus | • Basis rapportage (maandelijks overzicht)• Uitgaven vs inkomsten grafiek• Budget per categorie (vrije bestedingsruimte)• Saldo-overzicht (per account) | "Als gebruiker wil ik in één oogopslag zien hoeveel ik deze maand heb uitgegeven en hoeveel ik nog vrij heb om uit te geven, zodat ik controle houd." |

| # | Kernfunctie | Doel | Ondersteunt UVP Element |
| --- | --- | --- | --- |
| 1 | SETUP | Veilige, snelle eerste configuratie (accounts, categorieën, privacy) | "Privacy-first" + "Controle" |
| 2 | INVOER | Flexibel transacties toevoegen (handmatig of CSV-import) | "Automatisch verwerkt" + "Zonder bankkoppeling" |
| 3 | DASHBOARD | Inzicht in cashflow, budget en vrije bestedingsruimte | "Controle over cashflow" |

| Doelstelling | Oorspronkelijke Status | Herziene Status (Na Correctie) |
| --- | --- | --- |
| Concept UVP (één zin) | ⚠️ Gedeeltelijk (60%) | ✅ Voldaan (100%) |
| 3 Kernfuncties (Setup/Invoer/Dashboard) | ❌ Niet voldaan (40%) | ✅ Voldaan (100%) |
| Formeel GO/STOP Keuzemoment | ❌ Niet voldaan (30%) | ⏳ Framework klaar (80% - wacht op Lead) |

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```js
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

- Privacy-first is expliciet onderdeel van de kern-UVP
- Gebruikers hebben privacyzorgen en willen data-controle bij finance apps
- Zonder toegangsbeveiliging is er geen geloofwaardige privacy-bescherming
- Technisch eenvoudig: standaard iOS/Android biometrie-API's
- Essentieel voor vertrouwen: gebruikers zullen niet hun financiële data invoeren in een onbeveiligde app
- Lage development effort, maar hoge perceptiewaarde

- Basis CSV-import staat al in MVP-scope – die volstaat voor lopende transacties
- Historische bulk-import is een nice-to-have voor migratie, niet essentieel voor werking
- Extra complexiteit:

| UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |
| --- | --- |
| - UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |

- Duplicaatherkenning wordt complexer bij grote volumes
- Performance-optimalisatie nodig voor datasets van meerdere jaren
- Edge cases in oude CSV-formaten (banken veranderen hun export-structuur)
- UX-uitdagingen: progressie-indicatoren, error handling bij grote bestanden

- Na validatie dat gebruikers CSV-import daadwerkelijk gebruiken
- Wanneer er vraag is van early adopters om historie te migreren
- Na optimalisatie van parsing en duplicaat-detectie

- Benchmark onderzoek: hoe bieden andere apps CSV-import aan
- Verzamelen/creëren van geanonimiseerde testdata van top 3 banken
- Feature-schets voor robuuste CSV-import valideren met testdata

| Key | Value |
| --- | --- |
| MVP 1.0 (Generieke CSV) | Valideert technische haalbaarheid + gebruikersbehoefte aan import-functie. Lagere barrier to launch. |
| MVP 1.1 (Bank | presets): Verhoogt gebruiksvriendelijkheid drastisch, maar vereist significant meer investering (L). Uitstel voorkomt dat we tijd/resources investeren in bank-specifieke parsers voordat we weten of generieke import überhaupt wordt gebruikt. |

| Key | Value |
| --- | --- |
| ✅ Privacy | first: PIN/biometrie + lokale data opslag |
| ✅ Eenvoud | Minimalistisch, zonder overbodige features |
| ✅ Controle | Handmatige invoer + flexibele accounts |
| ✅ Flexibiliteit | Generieke CSV-import als optie (bank-presets volgen later) |

| Key | Value |
| --- | --- |
| 6 Core Features | 2x S + 4x M = ~4-6 weken development (schatting voor 1-2 developers) |
| CSV | Import (generiek): +1 week |
| Testing & Polish | +1-2 weken |
| Total MVP 1.0 | ~6-9 weken |

| Key | Value |
| --- | --- |
| ✅ GO | Alle 6 kern-features (inclusief PIN/biometrie) |
| ✅ GO | Generieke CSV-import (gebruiker selecteert kolommen handmatig) |
| ⏸️ MVP 1.1 | Bank-specifieke voorinstellingen (na benchmark + testdata) |
| ❌ STOP | Historische bulk-import (naar MVP+) |

| Key | Value |
| --- | --- |
| Snellere time | to-market (geen L-size bank-parser werk) |
| Risico | mitigatie: valideer eerst of CSV-import überhaupt wordt gebruikt |
| Focus blijft op kern | UVP (privacy + controle) |
| Ruimte om te leren van early adopters voordat we investeren in complexe bank | presets |

- Ben je akkoord met deze MVP 1.0 scope?
- Wil je toch bank-presets in MVP 1.0, ondanks het hogere risico en langere ontwikkeltijd?
- Heb je aanvullende features die je essentieel vindt voor MVP 1.0?

- Download-limieten per bank:

| - Scheidingstekens variëren: ING wijzigde in 2020 van komma (,) naar puntkomma ( | ) als scheidingsteken Banktrans |
| --- | --- |
| - MT940 wordt afgebouwd: SNS/ASN/RegioBank (Volksbank) ondersteunt sinds juli 2022 geen MT940 meer | Rabobank stopt MT940-ondersteuning vanaf 2025 Moneymonk |

| Key | Value |
| --- | --- |
| ING | max 18 maanden terug |
| ABN AMRO | max 24 maanden (maar slechts 18 maanden in XLS/CSV) |
| Rabobank | tot 8 jaar terug |
| Knab | tot 24 maanden terug |
| bunq | onbeperkt (elke gewenste periode) |
| SNS | tot 5 jaar terug Spreadsheet Shop |

- Scheidingsteken: puntkomma (;)
- 11 kolommen (2 kolommen toegevoegd in 2020: "Saldo na mutatie" en "Tag")
- Datumformaat: JJJJMMDD (yyyymmdd)
- Max 2000 transacties per export Banktrans

- Velden staan tussen aanhalingstekens; Excel voegt soms dubbele/driedubbele aanhalingstekens toe bij bewerking Banktrans

- Scheidingsteken: komma (,)
- Zeer informatierijk: bevat mutatiesoort, rentedatum, meerdere omschrijvingsvelden
- Datumformaat: DD-MM-YYYY
- Meest gedetailleerde CSV van alle banken GeldnerdGitHub

- Veel metadata voor automatische categorisatie (mutatiesoort, meerdere omschrijvingsvelden)

- Scheidingsteken: Tab (TXT) of komma (CSV)
- Zeer beperkt: bevat minimale informatie
- Geen mutatiesoort, geen extra metadata
- Download limiet: 18 maanden in XLS/CSV-formaat Geldnerd

- Minste informatie van alle grote banken; lastig voor automatische categorisatie

- Ondersteunt zowel CSV als JSON export
- Geen downloadin-limiet: gebruikers kunnen transacties exporteren voor elke gewenste periode Spreadsheet Shop
- Modern digitaal platform, waarschijnlijk gestructureerde API-achtige output

- Max 2000 transacties per download
- Tot 24 maanden terug downloadbaar Spreadsheet Shop

- Bestandsformaat: Microsoft Excel, CSV-bestand
- Geen MT940-ondersteuning meer sinds juli 2022
- Tot 5 jaar terug downloadbaar Spreadsheet ShopMoneymonk

- Technische grenzen:

ING's max download: 2000 transacties per export Spreadsheet Shop
Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- UX Overwegingen:

3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
Voorkomt "analysis paralysis" bij onboarding
Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- Privacy & Data Ownership:

Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
Minder data = minder risico bij opslag/verwerking
- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues

- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)

- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ✅ Bank-onafhankelijk MAAR wel gebruiksvriendelijk

Geen directe API-koppeling (privacy-first)
Wél intelligente presets voor gemak
- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak
- ✅ Schaalbaar & Onderhoudbaar

n8n workflows zijn visueel en gemakkelijk uit te breiden
Nieuwe bank toevoegen = nieuwe parser-node
- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node
- ✅ 3-maanden limiet = Sweet Spot

| UX: genoeg data voor inzicht | niet overweldigend |
| --- | --- |
| - UX: genoeg data voor inzicht | niet overweldigend |

Duplicaatherkenning via fingerprinting
Validatie op elk niveau
Error handling per bank-parser
- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak

- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node

| Key | Value |
| --- | --- |
| Technisch haalbaar binnen bank | limieten |
| UX | genoeg data voor inzicht, niet overweldigend |
| Privacy | beperkte historische data-opslag |

- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

| Key | Value |
| --- | --- |
| ✅ GO | Deze n8n-workflow architectuur opnemen in de MVP 1.0 scope? |
| ✅ GO | 3-maanden limiet instellen voor historische bulk-import? |
| ✅ GO | Starten met Phase 1 (ING + Rabobank + ABN AMRO) en later uitbreiden? |

- Andere limiet dan 3 maanden? (bijv. 1 maand of 6 maanden)
- Andere banken prioriteren?
- Voorkeur voor andere technologie dan n8n?

- "Nice-to-have voor migratie, niet essentieel"
- "Gebruikers kunnen vanaf nu beginnen tracken"
- "Valideer eerst basis-import"

- Top 3 banken (ING, Rabobank, ABN) dekken ~70%+ van Nederlandse markt

Focus op deze 3 = maximale ROI met beperkte scope
- Focus op deze 3 = maximale ROI met beperkte scope
- Rabobank's rijke metadata (mutatiesoort, meerdere omschrijvingsvelden) maakt automatische categorisatie mogelijk

Dit is een killer feature die handmatige apps niet hebben
Verhoogt UVP substantieel: "Eenvoud door slimme import"
- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"
- ABN AMRO's minimalisme toont aan dat zelfs beperkte CSV-import beter is dan geen import

| Key | Value |
| --- | --- |
| Gebruikers verwachten dit als baseline | feature |
| Gebruikers verwachten dit als baseline | feature |
| 3 | maanden limiet lost technische barrières op: |

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

- Focus op deze 3 = maximale ROI met beperkte scope

- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"

- Gebruikers verwachten dit als baseline-feature

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

| Key | Value |
| --- | --- |
| Versie 1.0 | Generieke CSV (M) + uitstellen bank-presets |
| Versie 2.0 | Generieke CSV + Top 3 bank-presets (L) |
| Delta | +1-2 weken effort |

- Strategische waarde >> Effort-kosten

CSV-import is primaire differentiator vs handmatige apps
Zonder dit faalt de kern-USP
- CSV-import is primaire differentiator vs handmatige apps
- Zonder dit faalt de kern-USP
- n8n workflow = toekomstige schaalbaarheid

Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
Visual workflow = makkelijk onderhoudbaar
- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar
- 3-maanden limiet = effort-begrenzer

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Bank | presets = vertrouwen-multiplier |

"Het werkt gewoon" = kritiek voor early adopters
Goede eerste indruk = retention
- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

| Key | Value |
| --- | --- |
| CSV | import is primaire differentiator vs handmatige apps |
| Zonder dit faalt de kern | USP |

- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |

- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

- Concurrentievoordeel:

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Onboarding | kritiek: |

| Falen = churn | slagen = engagement |
| --- | --- |
| - Falen = churn | slagen = engagement |

n8n workflow = fundament voor toekomstige features
Automatische categorisatie (MVP+) bouwt hierop voort
Investering nu = snellere iteraties later
- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |

- Eerste 5 minuten bepalen of gebruiker blijft
- "Importeer je bankdata" = eerste actie
- Falen = churn, slagen = engagement

- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Versie 1.0 | ~6-9 weken |
| Versie 2.0 | ~8-12 weken (+2-3 weken voor robuuste CSV-import) |

- ⏱️ +2-3 weken development time
- ✅ Veel sterkere product-market fit
- ✅ Lagere churn bij onboarding
- ✅ Duidelijke differentiatie vs concurrentie

| Key | Value |
| --- | --- |
| MVP 1.0a | Alleen ING-preset (grootste bank, ~40% markt) = M effort (1 week) |
| MVP 1.0b | Rabobank + ABN toevoegen = +1 week |

| - ✅ Optie A (Aanbevolen): GO voor Feature B in MVP 1.0 met Top 3 bank-presets (L effort | 2-3 weken extra) |
| --- | --- |
| - ⚡ Optie B (Sneller): GO voor Feature B in MVP 1.0 met alleen ING-preset (M effort | 1 week extra) |
| - ⏸️ Optie C (Oorspronkelijk plan): Uitstellen Feature B naar MVP+ (geen extra tijd | maar zwakkere UVP) |

- 3 verschillende formuleringen
- Geen enkele is één duidelijke zin zoals gevraagd
- Versie B is te lang (2 zinnen)
- Geen formele goedkeuring van Lead op specifieke formulering

- PIN/Biometrie
- Handmatige invoer
- Categorisering & budgettering
- Basis rapportage
- Privacy-first data model
- Flexibele account types
- CSV-import met bank-presets

| Key | Value |
| --- | --- |
| Scope creep | 7 features ≠ 3 kernfuncties |
| Niet georganiseerd volgens het gevraagde framework | Setup → Invoer → Dashboard |
| Features zijn technische bouwblokken, geen gebruikers | gerichte functies |

- Stelden vragen: "Ben je akkoord?", "Welke optie kies je?"
- Geen duidelijk GO/STOP framework met criteria
- Geen expliciete "Sign-off" vereiste van Lead

- Formele beslissingsprocedure
- Duidelijke criteria voor GO (bijv. "UVP moet X scoren op Y")
- Risico-overzicht bij STOP-beslissing
- Expliciete handtekening/akkoord-moment

| Key | Value |
| --- | --- |
| ✅ Privacy | first: Expliciet genoemd |
| ✅ Geen bankkoppeling | Kernonderscheid vs concurrentie |
| ✅ Automatisch verwerkt | CSV-import als gemak |
| ✅ Cashflow | controle: Hoofdfunctie |
| ✅ Contant/onregelmatig | Doelgroep-differentiatie |
| ✅ Één zin | 23 woorden, helder en scannabel |

- ✅ Voldoet aan "3 kernfuncties" vereiste
- ✅ Georganiseerd volgens Setup → Invoer → Dashboard
- ✅ Alle 7 technische features blijven behouden, maar nu gestructureerd

- ✅ Vult gat in markt (privacy vs gemak)
- ✅ Duidelijk onderscheidend vs concurrentie
- ✅ Ondersteuning door 3 kernfuncties (zie hieronder)

| - Setup = Features 1 | 5 | 6 |
| --- | --- | --- |
| - Invoer = Features 2 | 3 | 7 |

- ✅ GO → We gaan door naar Stap 3
- ⏸️ REVISE → Specificeer welke aanpassingen nodig zijn
- ❌ STOP → Motiveer waarom we stoppen

| Key | Value |
| --- | --- |
| Voor correctie | 43% compliant |
| Na correctie | 93% compliant (laatste 7% = Lead-beslissing) |

- ✅ Goedkeuring of aanpassing van de Definitieve UVP:

| Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |
| --- | --- |
| - Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |

Akkoord met deze structuur?
Ontbreekt er iets essentieel?
- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?
- ✅ Formele GO/STOP/REVISE beslissing:

| Geef expliciet aan: GO | STOP of REVISE |
| --- | --- |
| - Geef expliciet aan: GO | STOP of REVISE |

| Key | Value |
| --- | --- |
| Akkoord met | "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen." |
| Of | voorgestelde wijziging |

- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?

- Vul het beslissingskader in (zie boven)
- Geef expliciet aan: GO, STOP of REVISE

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes
- Validatie-vragen voor gebruikerstests

- Privacy-bewuste gebruikers die geen bankkoppeling willen
- Mensen met contant geld of onregelmatig inkomen (freelancers, ZZP'ers, wisselende inkomsten)
- Casual budgetters die een simpel overzicht willen zonder complexe features
- Leeftijd: 25-45 jaar
- Locatie: Nederland (primair), EU (secundair)
- Tech-savviness: Gemiddeld tot hoog (comfortabel met CSV-bestanden downloaden)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| --- | --- |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |

- Handmatige Invoer

Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

CTA: "Opslaan" button (prominent)
- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)
- CSV Import

| Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |
| --- | --- | --- | --- |
| - Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |

- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)

- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

- Upload-zone (drag & drop of file picker)
- Bank-selectie (dropdown: ING, Rabobank, ABN AMRO, Andere)
- Preview van eerste 3 transacties (tabel) na upload
- Waarschuwing: "Max 3 maanden terug" (info-icoon met uitleg)
- CTA: "Importeer [X] transacties" button

| Key | Value |
| --- | --- |
| Privacy | signaal: Toon ergens subtiel: "🔒 Data blijft op jouw apparaat" (niet opdringerig) |
| Snelheid | Handmatige invoer moet binnen 3 taps/clicks voltooid zijn |
| Foutpreventie | Validatie op bedrag (geen 0, geen letters), datum (niet in toekomst voor uitgaven) |
| Feedback | Bevestiging na opslaan ("✓ Transactie toegevoegd") |

- Welke modus is default? Handmatig of Import? (Advies: Handmatig, want lagere drempel)
- Hoe switchen tussen modi? Tabs, toggle, of aparte schermen?
- Hoe visueel onderscheiden tussen Uitgave/Inkomst? Kleur, icoon, positie?
- Waar plaats je privacy-signalen zonder dat het opdringerig wordt?

- Hoofd-KPI (Hero Section)

"Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

Visueel: Progress bar of cirkel (groen = goed, oranje = op, rood = over budget)
- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |
| Maand | selector |

Dropdown of swipe-interface: "December 2024" ← →
Quick stats: "✓ 47 transacties deze maand"
- Dropdown of swipe-interface: "December 2024" ← →
- Quick stats: "✓ 47 transacties deze maand"
- Inkomsten vs Uitgaven (Simpele Grafiek)

| 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |
| --- | --- |
| - 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |

Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Quick Actions (FAB of Bottom Bar)

| "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |
| --- | --- |
| - "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |

- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

| Key | Value |
| --- | --- |
| Dropdown of swipe | interface: "December 2024" ← → |
| Quick stats | "✓ 47 transacties deze maand" |

- Bar chart of lijndiagram
- 2 kleuren: Groen (inkomsten), Rood (uitgaven)
- X-as: Weken of dagen (afhankelijk van zoom-niveau)

- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)

| Key | Value |
| --- | --- |
| "+" button | Transactie toevoegen (shortcut naar Invoer-scherm) |
| "📊" button | Rapporten (toekomstig, mag disabled zijn in wireframe) |
| "⚙️" button | Instellingen |

| Key | Value |
| --- | --- |
| Informatiehiërarchie | Belangrijkste info bovenaan (Vrije Bestedingsruimte) |
| Scannability | Moet binnen 3 seconden te begrijpen zijn |
| Actie | gericht: Duidelijke CTA ("Transactie toevoegen") altijd zichtbaar |
| Emotionele respons | Gebruik kleur psychologie (groen = goed, rood = waarschuwing, niet judgmental) |
| Privacy | signaal: Eventueel subtiele indicator dat data lokaal is (geen sync-icoon) |

- Hoe presenteer je "Vrije Bestedingsruimte" visueel krachtig zonder overdrijving?
- Welke grafiektype is meest intuïtief voor non-finance users?
- Hoe balanceer je informatiedichtheid vs white space? (minimalistisch maar compleet)
- Waar plaats je Quick Actions? FAB (Floating Action Button) of Bottom Navigation?

| Key | Value |
| --- | --- |
| Primair | iOS (iPhone) - design voor iPhone 13/14/15 standaard formaat |
| Secundair | Android (kan later aangepast worden) |
| Orientatie | Portrait (staand) |

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Niet nodig | Hi-fi mockups, animaties, interactions (komt later) |

- Figma (preferred voor collaborative review)
- Sketch
- Adobe XD
- Balsamiq
- Of zelfs pen & papier gescand

- Tap/click areas
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale database")
- Edge cases (bijv. "Wat als geen transacties deze maand?")

- "Wat denk je dat er gebeurt als je op deze knop klikt?" (voor Invoer-scherm)
- "Wat vertelt dit scherm jou over jouw financiële situatie?" (voor Dashboard)
- "Hoe zou je een uitgave toevoegen?" (task-based test)
- "Voel je je comfortabel met waar je data blijft?" (privacy-perceptie)

- Waarom heb je gekozen voor deze layout?
- Welke UX-patterns heb je toegepast? (bijv. progressive disclosure, chunking)
- Waar heb je bewust gekozen voor eenvoud over features?

- Wireframe 1: INVOER-scherm

 Handmatige invoer versie
 CSV import versie
 Annotaties voor interacties
- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties
- Wireframe 2: DASHBOARD-scherm

 Hero section (Vrije Bestedingsruimte)
 Inkomsten vs Uitgaven grafiek
 Budget per Categorie lijst
 Quick Actions
 Annotaties voor data-sources
- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources
- Design Rationale document (1-2 pagina's)

 Keuzes uitgelegd
 UX-patterns toegelicht
 Privacy-signalering strategie
- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie
- Gebruikerstest Script (Concept)

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties

- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources

- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF |
| Documenten | Markdown of PDF |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 2-3 uur |
| Wireframe 2 (Dashboard) | 2-3 uur |
| Documentatie | 1-2 uur |
| Totaal | 5-8 uur (1 werkdag) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)

| Key | Value |
| --- | --- |
| Dyme (NL) | bekijk hun handmatige invoer flow |
| Wallet by BudgetBakers | bekijk dashboard indeling |
| Spendle | bekijk privacy-signalering |

- Te veel features op 1 scherm (zoals Mint)
- Onduidelijke categorisering (zoals Toshl)
- Privacy-signalen die angstig maken (zoals Revolut's security pop-ups)

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor technische haalbaarheid | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | Quick call (15 min) - vragen over briefing |
| 50% milestone | Review schetsen (30 min) - richting valideren |
| 100% | Final review (45 min) - deliverables doorlopen |

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Privacy-first aanpak is zichtbaar in design
- Handmatige invoer flow is binnen 3 taps/clicks te voltooien
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 3 seconden scannen
- Design rationale legt keuzes uit
- Gebruikerstest script is klaar voor validatie
- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ 0 critical usability issues (blockers voor MVP)

| - Complexiteit te versimpelen (CSV-import voelt technisch | maar moet toegankelijk aanvoelen) |
| --- | --- |
| - Privacy visueel te maken (niet alleen zeggen | maar laten zien) |

- ✅ Akkoord met scope & deliverables
- 📅 Verwachte opleveringsdatum
- ❓ Eventuele vragen of onduidelijkheden

| Key | Value |
| --- | --- |
| GO | Start opdracht |
| REVISE | Aanpassingen nodig (specificeer hieronder) |

- Mensen in armoede of met schuldenproblematiek
- Jong tot oud (breed leeftijdsspectrum: 18-65+)
- Variërend opleidingsniveau en digitale vaardigheden

- ✅ Toegankelijkheid is KRITIEK (WCAG-compliant, duidelijke taal, grote touch targets)
- ✅ Geen stigmatisering (vermijd "budget overschreden" met negatieve framing)
- ✅ Empathie in UX (begrijp stress van financiële onzekerheid)
- ✅ Laagdrempelig (ook voor mensen met beperkte smartphone-ervaring)

| Key | Value |
| --- | --- |
| Cross | platform: iOS EN Android (React Native) |
| Design moet werken binnen React Native component | beperkingen |
| Gebruik universele UI | patterns (geen platform-specifieke elementen) |

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes (incl. toegankelijkheid)
- Validatie-vragen voor gebruikerstests (inclusief voor diverse doelgroepen)

- Privacy-bewuste gebruikers

Willen geen bankkoppeling
Technisch vaardig (25-45 jaar)
- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)
- Mensen met onregelmatig inkomen

| Freelancers | ZZP'ers | wisselende inkomsten |
| --- | --- | --- |
| - Freelancers | ZZP'ers | wisselende inkomsten |

| Beperkt budget | elke euro telt |
| --- | --- |
| - Beperkt budget | elke euro telt |

55-75+ jaar
Mogelijk beperkte digitale vaardigheden
Waarde autonomie en controle
Kunnen visuele beperkingen hebben
- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben
- Jongeren die leren budgetteren ⚠️ NIEUW

| Studenten | starters op arbeidsmarkt |
| --- | --- |
| - Studenten | starters op arbeidsmarkt |

- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)

- Freelancers, ZZP'ers, wisselende inkomsten
- Veel contant geld
- 25-55 jaar

- Beperkt budget, elke euro telt
- Kunnen stress/angst ervaren bij financiën
- Alle leeftijden (18-65+)
- Mogelijk lager opleidingsniveau

- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben

- 18-25 jaar
- Eerste keer zelfstandig financiën beheren
- Studenten, starters op arbeidsmarkt

| Key | Value |
| --- | --- |
| ❌ VERMIJD | Schuld-inducerende taal ("Je hebt te veel uitgegeven", rode waarschuwingen) |
| ✅ GEBRUIK | Neutrale, helpende taal ("Nog €50 beschikbaar deze week", "Budget bijna bereikt") |
| ✅ FOCUS | Op wat WEL kan, niet wat NIET kan |

- ✅ Grote tekst (minimaal 16px body text)
- ✅ Grote touch targets (minimaal 44x44px)
- ✅ Duidelijke labels (geen iconen zonder tekst)
- ✅ Eenvoudige navigatie (max 3 niveaus diep)
- ✅ Bevestigingen bij belangrijke acties

- ✅ Hoog contrast (WCAG AA minimaal, AAA ideaal)
- ✅ Kleur is NIET de enige informatie-drager (iconen + tekst)
- ✅ Screen reader support (semantische labels)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Inclusief & empathisch - geen stigmatisering | begrijp financiële stress |
| --- | --- |
| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| - ✅ Eenvoud boven volledigheid (geen feature-overload | ook voor beginners) |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |
| - ✅ Snelle onboarding (binnen 5 minuten productief | ook voor ouderen) |

| Key | Value |
| --- | --- |
| Handmatige Invoer (Default | laagste drempel) |
| Velden (in deze volgorde | logische flow): |

Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

Bedrag (numeriek keyboard, EUR symbool, groot invoerveld)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

Categorie (dropdown met iconen + tekst)

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

Wanneer? (datepicker, default: vandaag)

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| Key | Value |
| --- | --- |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

CTA:

| "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- Rekening (dropdown: Bankrekening, Cash, Spaarrekening)
- Notitie (optioneel tekstveld, placeholder: "Bijv. 'Albert Heijn'")
- "Opslaan" button (prominent, groot - min 44px hoog)
- ⚠️ Toegankelijkheid: Duidelijk contrast, loading state bij tap
- CSV Import (Optioneel - voor gevorderde gebruikers)
Flow:

Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

Stap 2: Upload-zone

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

Stap 3: Preview (tabel van eerste 3 transacties)

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

Waarschuwing (duidelijk zichtbaar):

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

CTA:

"Importeer [X] transacties" button (groot, duidelijk)
Annuleren-optie (evengroot, secondary style)
- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

- ⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| - "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- ⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

| - "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| - Annuleren-optie (evengroot | secondary style) |

| Key | Value |
| --- | --- |
| Toon subtiel | "🔒 Blijft op jouw apparaat" (klein, onder CTA) |
| NIET | "Je data is veilig bij ons" (suggereert cloud-opslag) |

| - Tekst grootte: Minimaal 16px body | 18px voor invoervelden |
| --- | --- |
| - Kleur contrast: Minimaal 4.5:1 voor tekst | 3:1 voor UI-elementen |
| - Error messages: Duidelijk | helpend (niet "Ongeldige invoer" maar "Vul een bedrag in") |

| Key | Value |
| --- | --- |
| Handmatige invoer | Max 5 taps/inputs (Type → Bedrag → Categorie → Opslaan, rest heeft defaults) |
| CSV import | Max 3 stappen (Bank → Upload → Bevestig) |

| - Validatie: Bedrag niet 0/negatief | datum niet ver in toekomst |
| --- | --- |
| - Maar: Zacht valideren - geen rode errors | wel helpers ("Bedrag moet meer dan €0 zijn") |

| Key | Value |
| --- | --- |
| Bevestiging na opslaan | "✓ Transactie toegevoegd" (toast, verdwijnt na 2 sec) |
| Bij import | "✓ [X] transacties geïmporteerd" + optie om te bekijken |

| Key | Value |
| --- | --- |
| Bij negatief saldo | NIET "Je gaat over budget!" |
| WEL | "Let op: je hebt €50 minder dan gepland" (neutraal, informatief) |

- Welke modus is default?

| Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| CSV import moet duidelijk zijn | maar niet opdringerig |
| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

| Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |
| --- | --- |
| - Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |

| Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |
| --- | --- |
| - Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |

| Advies: Footer van scherm | klein maar leesbaar |
| --- | --- |
| - Advies: Footer van scherm | klein maar leesbaar |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

- Advies: Tabs boven (universeel pattern, werkt op iOS + Android)
- Vermijd hamburger menu (niet toegankelijk voor ouderen)

| Key | Value |
| --- | --- |
| Advies | Iconen + kleur + labels (➖🔴 Uitgave, ➕🟢 Inkomst) |
| NIET | Alleen kleur (kleurenblindheid) |

| Key | Value |
| --- | --- |
| Advies | Footer van scherm, klein maar leesbaar |
| Optioneel | ℹ️ info-icoon met meer uitleg (opt-in) |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

- Hoofd-KPI (Hero Section) - HERZIEN voor Empathie
Optie A (Voor gebruikers met positief saldo):

"Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

| Key | Value |
| --- | --- |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

Optie B (Voor gebruikers met negatief saldo/schulden):

"Je tekort deze maand" (neutraal, niet beschuldigend)

Voorbeeld: "€ 127,80 tekort"

| Visueel: Progress ring (rood | maar met helper-tekst) |
| --- | --- |
| Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

Cruciale Toegankelijkheid:

Groot cijfer: Minimaal 28-32px font
Hoog contrast: Minimaal 7:1 (AAA rating)
Niet alleen kleur: Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!)
- "Nog beschikbaar deze maand" (groot, prominent)

Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
Voorbeeld: "€ 342,50"
- Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
- Voorbeeld: "€ 342,50"
- Visueel: Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort)
- Toon: "Je hebt nog goed ruimte" (positief, ondersteunend)
- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

| Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |
| - Quick stat: "47 transacties" (klein | onder maand) |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
X-as: Weken van de maand (Week 1, Week 2, etc.)
⚠️ Toegankelijkheid:

Labels BOVEN bars (niet binnen - leesbaar op klein scherm)
Minimaal 12px font voor as-labels
Hoog contrast bars (#00A86B groen, #DC143C rood - colorblind safe)
- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Layout: Icoon | Naam | Bedrag | Progress bar |
| --- | --- | --- | --- |
| - Layout: Icoon | Naam | Bedrag | Progress bar |

- "Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

- Voorbeeld: "€ 127,80 tekort"

| Key | Value |
| --- | --- |
| Groot cijfer | Minimaal 28-32px font |
| Hoog contrast | Minimaal 7:1 (AAA rating) |
| Niet alleen kleur | Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!) |

| - Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Key | Value |
| --- | --- |
| Labels BOVEN bars (niet binnen | leesbaar op klein scherm) |
| Minimaal 12px font voor as | labels |
| Hoog contrast bars (#00A86B groen, #DC143C rood | colorblind safe) |

- Layout: Icoon | Naam | Bedrag | Progress bar
- Voorbeeld:

- Kleurlogica (HERZIEN):

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |

100%: Rood + helper ("€20 meer dan gepland")
- 0-70%: Groen (ruimte over)
- 71-90%: Geel (bijna op)
- 91-100%: Oranje (budget bereikt)
- 100%: Rood + helper ("€20 meer dan gepland")
- ⚠️ Toegankelijkheid:

Icoon + tekst (niet alleen icoon)
Progress bar + percentage (niet alleen bar)
Minimaal 16px font voor categorie-namen
48px hoog per rij (makkelijk tappen)
- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)
- ⚠️ Empathie:

| WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |
| --- | --- |
| - WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |
| 100% | Rood + helper ("€20 meer dan gepland") |

- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)

| Key | Value |
| --- | --- |
| NIET | "Budget overschreden! ⛔" |
| WEL | "€20 meer uitgegeven dan gepland" (neutraal, feitelijk) |

- Quick Actions (Bottom Bar - React Native Safe Area)
Layout: Bottom Navigation (3-4 items, universeel pattern)
Items:

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

⚠️ Toegankelijkheid:

| Icoon + label (altijd beide | niet alleen icoon) |
| --- | --- |
| - Icoon + label (altijd beide | niet alleen icoon) |

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

- Icoon + label (altijd beide, niet alleen icoon)
- Minimaal 56px hoog (React Native safe area)
- Haptic feedback bij tap (Android + iOS)
- Duidelijke active state (kleur + onderstreping)

| Key | Value |
| --- | --- |
| Belangrijkste info bovenaan | "Nog beschikbaar" of "Tekort" |
| Scannability | Max 5 seconden om hoofdvraag te beantwoorden |
| Progressive disclosure | Details (categorieën) komen daarna |

- Kleurpsychologie - empathisch:

| Groen = positief | ruimte | controle |
| --- | --- | --- |
| Geel = attentie | bijna op | let op |
| - Groen = positief | ruimte | controle |
| - Geel = attentie | bijna op | let op |

✅ "Nog over", "beschikbaar", "meer uitgegeven"
❌ "Schuld", "overschrijding", "fout", "probleem"
- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Groen = positief | ruimte | controle |
| --- | --- | --- |
| - Geel = attentie | bijna op | let op |

- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Tekst grootte: Min 16px body | 28-32px voor hoofd-KPI |
| --- | --- |
| - Screen reader: Semantische HTML | alt-texts voor grafieken |

| Key | Value |
| --- | --- |
| Subtle indicator | Klein 🔒 icoon in app header (altijd zichtbaar) |
| Geen sync | icoon (suggereert cloud) |

- Geen verborgen navigatie (hamburger menu)
- Duidelijke labels (niet alleen iconen)
- Grote touch areas (vermijd accidental taps)
- Confirmatie bij belangrijke acties ("Weet je zeker dat je...")

- Geen alarmbells (❌ "URGENT: Budget overschreden!")
- Wel actionable helpers (✅ "Bekijk waar je kunt besparen")
- Focus op controle (niet op falen)

- Hoe presenteer je "Tekort" zonder stigma?

| Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |
| --- | --- | --- |
| - Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |

| Advies: Vertical bar chart (simpelste | meest universeel) |
| --- | --- |
| - Advies: Vertical bar chart (simpelste | meest universeel) |

Advies: Meer white space voor toegankelijkheid (ook ouderen)
Max 3-4 data-punten per sectie
- Advies: Meer white space voor toegankelijkheid (ook ouderen)
- Max 3-4 data-punten per sectie
- Waar plaats je Quick Actions?

| Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |
| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- Advies: Neutraal icoon (⚠️ niet ⛔), helpende tekst, focus op oplossing

| Key | Value |
| --- | --- |
| Advies | Vertical bar chart (simpelste, meest universeel) |
| Alternatief | Line chart (voor trends over weken) |
| VERMIJD | Pie charts (moeilijk te lezen op klein scherm) |

| Key | Value |
| --- | --- |
| Advies | Meer white space voor toegankelijkheid (ook ouderen) |
| Max 3 | 4 data-punten per sectie |

| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- ⚠️ HERZIEN: iOS EN Android (React Native)
- Design voor:

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| Orientatie | Portrait (staand) - primair |
| Dark mode | Moet ondersteund worden (React Native native support) |

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |

- ✅ Bottom Tab Navigation (werkt native op beide platforms)
- ✅ Modal sheets (React Native's Modal component)
- ✅ Standard buttons (TouchableOpacity/Pressable)
- ✅ TextInput (native keyboard support)
- ❌ VERMIJD: Platform-specific gestures (3D Touch, force touch)
- ❌ VERMIJD: Custom native components (te complex voor MVP)

| Key | Value |
| --- | --- |
| iOS | Notch + home indicator (gebruik SafeAreaView) |
| Android | Status bar + navigation bar |
| Bottom navigation | Min 56px hoog + safe area insets |

| Key | Value |
| --- | --- |
| ✅ Kleurcontrast | Min 4.5:1 voor normale tekst, 3:1 voor grote tekst (>18px) |
| ✅ Touch targets | Min 44x44px (iOS) / 48x48dp (Android) |
| ✅ Tekst resize | Tot 200% zonder content loss |
| ✅ Focus indicators | Duidelijk zichtbaar (min 2px border) |

- ✅ Kleurcontrast: Min 7:1 voor normale tekst
- ✅ Touch targets: Min 48x48px overal
- ✅ Geen animaties >3 seconden (optie om uit te zetten)

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Annoteer | Lettergroottes, touch target sizes, kleurcontrasten |
| Niet nodig | Hi-fi mockups, animaties, micro-interactions (komt later) |

- Figma (preferred - collaborative review + React Native plugins)
- Sketch + React Native plugin
- Adobe XD
- Balsamiq
- Of pen & papier gescand

- React Native Design System
- Accessibility Checker (Stark)
- Contrast (voor WCAG checks)

- Tap/click areas (met minimale sizes: 44px/48dp)
- Tekst sizes (minimaal 16px voor body)
- Kleurcontrasten (bijv. "#333 op #FFF = 12.6:1 ✓")
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale SQLite database")
- Edge cases:

Wat als geen transacties deze maand?
Wat als gebruiker negatief saldo heeft?
Wat als ouderen de CSV-import niet begrijpen?
- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?
- Toegankelijkheid notes (bijv. "Alt-text voor grafiek: 'Bar chart met inkomsten €1200 en uitgaven €857'")

- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?

- "Wat zou je doen om bij te houden dat je €15 hebt uitgegeven aan boodschappen?" (task-based)
- "Waar zou je klikken om een uitgave toe te voegen?" (navigatie)
- "Wat gebeurt er als je op 'CSV Import' klikt?" (begrip)

- "Wat vertelt dit scherm jou over jouw financiële situatie?" (comprehensie)
- "Hoeveel heb je nog over deze maand?" (scannability - moet binnen 5 sec antwoord hebben)
- "Waar kijk je als eerste naar?" (visuele hiërarchie)

- Wireframe 1: INVOER-scherm

[
- [

- [

- CSV import versie (optioneel, met hulp)
- Annotaties: touch targets (min 44/48px), lettergroottes (min 16px), contrasten
- Toegankelijkheid notes: WCAG-checks, screen reader labels, color-blind safe
- Wireframe 2: DASHBOARD-scherm

 Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
 Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
 Budget per Categorie lijst (icoon + tekst, progress bar + %)
 Quick Actions (bottom navigation, 3-4 items)
 Annotaties: data-sources, edge cases, toegankelijkheid
 Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Design Rationale document (2-3 pagina's)

| Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| --- | --- |
| - Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| - Gebruikerstest Script (Concept | 3-4 pagina's) |

 5-7 validatievragen per scherm
 Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |

 2-3 task-based scenarios (bijv. "Voeg een uitgave toe")
- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?

- Layout keuzes uitgelegd
- UX-patterns toegelicht
- Toegankelijkheidsstrategie (WCAG AA/AAA compliance)
- Empathie & inclusiviteit (taalgebruik, kleurpsychologie)
- Privacy-signalering strategie
- React Native overwegingen (cross-platform patterns)

- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| - Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF (met annotaties leesbaar) |
| Documenten | Markdown of PDF |
| Toegankelijkheid audit | Gebruik Figma plugin "Stark" of "Contrast" voor WCAG-checks |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 3-4 uur (incl. toegankelijkheids-annotaties) |
| Wireframe 2 (Dashboard) | 3-4 uur (incl. diverse scenario's: positief/negatief saldo) |
| Documentatie (rationale + empathie) | 2-3 uur |
| Gebruikerstest script (inclusief diverse doelgroepen) | 1-2 uur |
| Totaal | 9-13 uur (~1.5-2 werkdagen) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)
- WCAG 2.1 Guidelines - https://www.w3.org/WAI/WCAG21/quickref/ (voor toegankelijkheidsreferentie)

| - Microsoft Outlook Mobile - grote touch targets | duidelijke navigatie |
| --- | --- |
| - Google Keep - simpele UI | geschikt voor alle leeftijden |

| Key | Value |
| --- | --- |
| Qapital (US) | positieve framing van sparen |
| Emma (UK) | geen stigmatiserende taal bij overschrijding |
| ❌ NIET Mint | té complex, overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Spendle (NL) | goede privacy-communicatie |
| Standard Notes | duidelijke lokale/versleutelde data-indicatoren |

| Key | Value |
| --- | --- |
| ❌ Kleine tekst (<16px) | onleesbaar voor ouderen |
| ❌ Kleine touch targets (<44px) | moeilijk tappen |
| ❌ Alleen kleur voor informatie | kleurenblindheid |
| ❌ Negatieve taal bij budget | overschrijding - stigmatiserend |
| ❌ Complexe grafieken (pie charts, multi | line) - overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor toegankelijkheidsvragen | [Accessibility Lead naam, of externe consultant] |
| Voor React Native constraints | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | 2: Quick call (20 min) - vragen over briefing + toegankelijkheidseisen |
| 50% milestone | Review schetsen (45 min) - valideer richting + toegankelijkheid |

| Check: WCAG AA contrasten | touch target sizes | empathische taal |
| --- | --- | --- |
| - Check: WCAG AA contrasten | touch target sizes | empathische taal |

- Check: WCAG AA contrasten, touch target sizes, empathische taal

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Handmatige invoer flow is binnen 5 taps/clicks te voltooien (ook voor ouderen)
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 5 seconden scannen

- WCAG 2.1 AA minimaal voldaan:

| Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |
| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

- Geen stigmatiserende taal (✓ "tekort" ipv ✗ "schuld")
- Positief/neutraal framing bij negatieve situaties
- Helpende actionables bij waarschuwingen (niet alleen alarm)

| Key | Value |
| --- | --- |
| Privacy | first aanpak is subtiel maar zichtbaar in design |
| Geen cloud/sync | iconen (communiceert lokale opslag) |

- Design werkt binnen React Native constraints
- Geen platform-specific patterns (werkt op iOS + Android)
- Safe areas gemarkeerd (notch, home indicator, status bar)

- Design rationale legt keuzes uit (incl. toegankelijkheid + empathie)
- Gebruikerstest script is klaar voor validatie met diverse doelgroepen
- Annotaties zijn compleet (sizes, contrasten, edge cases)

- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests
- Toegankelijkheidsaudit is gedaan (via Figma plugin of handmatig)

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ 0 critical usability issues (blockers voor MVP)

- ✅ ≥90% ouderen (55+) kan handmatige invoer voltooien
- ✅ ≥80% gebruikers met lage digitale vaardigheden begrijpt hoofdscherm
- ✅ ≥95% gebruikers kan tekst lezen (geen klachten over te kleine letters)
- ✅ ≥90% gebruikers kan knoppen makkelijk tappen (geen mistaps)

- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ ≥80% gebruikers met schulden/financiële stress voelt zich NIET veroordeeld door de app
- ✅ ≥70% gebruikers vindt de taal begrijpelijk en ondersteunend (niet jargon/technisch)

- ✅ Geen visuele/interactie-verschillen tussen iOS en Android testgebruikers

- Complexiteit te versimpelen

| CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| Financiële data kan overweldigend zijn | maar moet scanbaar blijven |
| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

| Niet alleen zeggen | maar laten zien |
| --- | --- |
| - Niet alleen zeggen | maar laten zien |

| Ondersteunende taal | niet veroordelend |
| --- | --- |
| Focus op controle en mogelijkheden | niet op falen |
| - Ondersteunende taal | niet veroordelend |
| - Focus op controle en mogelijkheden | niet op falen |

| Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |
| - Grote tekst | grote knoppen | hoog contrast |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

Werkt identiek goed op iOS en Android
Binnen React Native constraints
- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

- Niet alleen zeggen, maar laten zien
- Zonder opdringerig te zijn

| - Ondersteunende taal | niet veroordelend |
| --- | --- |
| - Focus op controle en mogelijkheden | niet op falen |

| - Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

- ✅ Akkoord met scope & deliverables (incl. toegankelijkheidseisen)
- 📅 Verwachte opleveringsdatum (hou rekening met 1.5-2 werkdagen)
- ❓ Eventuele vragen of onduidelijkheden
- 🛠️ Welke tool ga je gebruiken? (Figma aanbevolen voor WCAG-plugins)
- 🧪 Heb je toegang tot Figma accessibility plugins? (Stark, Contrast)

- ✅ GO - Start opdracht
- ⚠️ REVISE - Aanpassingen nodig (specificeer hieronder):
- 
-

- 
-

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drabobank.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dopleidingscentrum.eu&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dspreadsheet-shop.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dstamrechtingenieur.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dabnamro.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbankingtools.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddanielhaitink.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dclearvault.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

### rapportage_totaal.docx

## Beslissingsmatrix: MVP Feature Prioritering

## Toelichting per Feature

### Feature A: PIN/Biometrie (Aanbeveling: GO)

### Feature B: Historische Bulk CSV-Import (Aanbeveling: MVP+)

## Conclusie & Aanbeveling aan Lead

### Naamloos document.docx

## 📋 Definitieve MVP Feature List - Project Minimal Cashflow

### ✅ Kern-Features (MUST HAVE - GO voor MVP)

### ⚠️ CSV-Import: Gefaseerde Aanpak (Risicomitigatie)

### ❌ Uitgesteld naar MVP+ (STOP voor nu)

## 🎯 MVP Definitie Samenvatting

### Scope Statement:

### UVP Validatie:

### Total Effort Estimate:

## 🚦 Beslissingsvraag aan Lead (Manasse)

## 🏦 CSV-Structuuranalyse: Top 6 Nederlandse Banken

### 📊 Bevindingen uit Onderzoek

### 🔍 CSV-Structuur per Bank

#### 1. ING Bank

#### 2. Rabobank

#### 3. ABN AMRO

#### 4. Bunq

#### 5. Knab

#### 6. SNS Bank (Volksbank: SNS, ASN, RegioBank)

### n8n Node-by-Node Implementatie

#### Node 1: File Upload (HTTP Webhook of Binary Input)

#### Node 2: Bank Detection (Function Node)

#### Node 3: Parse & Clean (Switch Node → Bank-Specific Parsers)

#### Node 4: Map to Unified Data Model (Function Node)

#### Node 5: Validate & Dedupe (Function Node)

#### Node 6: Output (HTTP Response / Database Insert)

## 🚨 Max Limiet voor Historische Bulk Data

### ✅ Aanbevolen Limiet: 3 Maanden (90 Dagen)

## 📋 Implementatie Roadmap

### MVP 1.0: Gefaseerde Aanpak

## ✅ Voordelen van Deze Aanpak

## 🚦 Vraag aan Jou (Goedkeuring)

# 🔄 Heroverweging: MVP-Scope Prioritering met CSV-Onderzoek

## 📊 Beslissingsmatrix: MVP Feature Prioritering (Versie 2.0)

## 🔍 Gedetailleerde Heroverweging Feature B

### ❌ Oorspronkelijke Analyse (Versie 1.0)

### ✅ Nieuwe Analyse (Versie 2.0 - Na CSV-Onderzoek)

### 1️⃣ UVP-Fit Score: 3 → 4 (+1 punt)

### 2️⃣ Vertrouwen Score: 2 → 4 (+2 punten)

### 3️⃣ Complexity/Effort: S → M-L (Verhoogd, maar acceptabel)

## 🎯 Strategische Implicaties

### Wat verandert er in MVP 1.0 Scope?

### Waarom deze heroverweeging strategisch cruciaal is:

## 📋 Bijgewerkte MVP 1.0 Scope

### ✅ Definitieve Feature List:

## 🚦 Aanbeveling aan Lead

## ❓ Vraag aan Jou (Goedkeuring Vereist)

# 📊 Audit: Voldoen We Aan Stap 2 Doelstellingen?

## ✅ Checklist: Vereiste Outputs voor Stap 2

## 🔍 Gedetailleerde Analyse per Output

### Output 1: Concept UVP (één duidelijke zin)

### Output 2: Definitieve Minimale Scope (3 Kernfuncties)

### Output 3: Formeel GO/STOP Keuzemoment

## 🔧 Correctieplan: Hoe We Dit Oplossen

### Actie 1: Consolideer UVP tot Eén Definitieve Zin

### Actie 2: Herstructureer Scope naar 3 Kernfuncties

### Actie 3: Formeel GO/STOP Beslissingskader

## 📋 Finale Deliverable: Gecorrigeerde Output voor Stap 2

### 1. Concept UVP (Definitief)

### 2. Definitieve Minimale Scope (3 Kernfuncties)

### 3. Formeel GO/STOP Keuzemoment

## ✅ Herziene Antwoord op Jouw Vraag

## 🚦 Actie Vereist van Jou (Lead)

# 📐 Opdracht voor David - UX/UI Designer (Consult)

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (Primair)

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden

### Platform

### Design Fidelity

### Tools (Keuze David)

### Annotaties

## 🧪 Validatie-ondersteuning

### 1. Gebruikerstest Script (Concept)

### 2. Design Rationale (Korte toelichting)

## 📦 Deliverables Checklist

## ⏱️ Tijdsinschatting & Prioriteit

## 🔗 Relevante Documentatie

## 💬 Communicatie & Vragen

## ✅ Acceptatiecriteria (Wat is "Done"?)

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?)

## 📝 Slot: Waarom Dit Belangrijk Is

## ✍️ Akkoord & Kickoff

# 📐 Opdracht voor David - UX/UI Designer (Consult) [HERZIENE VERSIE]

## 🔄 Belangrijke Herziene Punten

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (HERZIEN - Breed & Inclusief)

### Cruciale Toegankelijkheids-overwegingen

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes (HERZIEN)

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden (HERZIEN)

### Platform

### React Native Component Constraints

### Toegankelijkheids-specificaties (WCAG 2.1)

### Design Fidelity

### Tools (Keuze David)

### Annotaties (MUST HAVE)

## 🧪 Validatie-ondersteuning (HERZIEN)

### 1. Gebruikerstest Script (Concept) - Inclusief voor Diverse Doelgroepen

#### Voor INVOER-scherm:

#### Voor DASHBOARD-scherm:

### 2. Design Rationale (Korte toelichting) - HERZIEN

## 📦 Deliverables Checklist (HERZIEN)

## ⏱️ Tijdsinschatting & Prioriteit (HERZIEN)

## 🔗 Relevante Documentatie (HERZIEN)

## 💬 Communicatie & Vragen (HERZIEN)

## ✅ Acceptatiecriteria (Wat is "Done"?) - HERZIEN

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?) - HERZIEN

## 📝 Slot: Waarom Dit Belangrijk Is (HERZIEN)

## ✍️ Akkoord & Kickoff (HERZIEN)

## 📎 Bijlage: Quick Reference - Toegankelijkheidseisen

> "Als de import faalt (bijv. verkeerde categorisatie, missende transacties, of crashende import), ondermijnt dit direct onze Unique Value Proposition (UVP) van 'Privacy-first & Controle'. Het faalt in het leveren van het beloofde gemak van automatisch inlezen én veroorzaakt frustratie, wat leidt tot afhaken van gebruikers bij de eerste essentiële actie."

> "Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard)."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Dashboard: Koos voor cirkel-progress ipv bar omdat dit visueel compacter is en emotioneel minder 'judgmental' aanvoelt. Gebruikers zien ratio vs absoluut getal."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

MVP-prioritering beslissingsmatrix voor featuresShare667 linesdocxVraag 2: Elias - MVP-Scope Prioritering
Target AI: claude
Uw Geoptimaliseerde Prompt:
PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP).
 
CONTEXT:
Lees bijgevoegd rapport
1.  [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516].
2.  **Te Prioriteren Features (Optioneel):**
    * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524].
    * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525].
 
TAAK:
Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP).
 
CRITERIA VOOR AFWEGING:
1.  **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst).
2.  **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5).
3.  **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1).
 
OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel):
Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025Ik ga de beslissingsmatrix genereren voor de twee optionele features, gebaseerd op de context uit het rapport en de drie opgegeven criteria.

Waarom GO voor MVP:

Risico bij weglaten: App wordt niet serieus genomen als privacy-tool, reputatieschade, gebruikers haken af voordat ze beginnen.

Waarom MVP+ (uitstellen):

Wanneer wel toevoegen (MVP+):

| Key | Value |
| --- | --- |
| Motivatie | De MVP moet 'Minimal' blijven. Feature A is een fundamentele voorwaarde voor de privacy-belofte. Feature B is waardevol maar niet kritisch – gebruikers kunnen vanaf vandaag beginnen tracken. Houd de scope scherp en valideer eerst de kernfunctionaliteit voordat je optimaliseert voor migratie van oude data. |
| Volgende stap | Als je akkoord gaat met deze prioritering, kan ik een definitieve MVP Feature List opstellen met alle GO-features gerangschikt op implementatievolgorde.63 linesdocxneem dit document mee in jouw overwegingen voor het samenstellen van de definitieve mvp; vraag daarna om mijn goedkeuring2 dec 2025Ik heb beide documenten nu geanalyseerd. Het tweede document voegt een kritische risicoanalyse toe over de CSV-parser die impact heeft op de MVP-scope. Laat me de definitieve MVP samenstellen met deze nieuwe inzichten. |

KRITISCH INZICHT uit Document 2:
CSV-headers/formaten verschillen per bank, wat leidt tot risico van onbetrouwbare data-import. Dit ondermijnt direct de UVP als het faalt.
Gefaseerde implementatie (MVP → MVP+):

Mitigerende Acties (voor MVP 1.1):

Strategische Redenering:

"Een werkende, beveiligde app die handmatige invoer en basis CSV-import ondersteunt, met categorisering, budgettering en cashflow-overzicht. Data blijft privé en lokaal. Gebruikers kunnen direct beginnen met tracken."

Ik adviseer de volgende scope voor MVP 1.0:

Voordelen van deze aanpak:

Vraag aan jou:

Laat me weten of je goedkeuring geeft, of dat je aanpassingen wilt voordat we deze scope formaliseren.Kunnen we onderzoeken hoe de 6 grootste banken in NL hun csv samenstellen en bedenken hoe een n8n workflow het 'lezen' en verwerken van de data kan aanpakken? Én een max stellen aan de upload van historisch bulk data? Bijvoorbeeld max 3 maanden terug?2 dec 2025Uitstekende pragmatische aanpak! Dit combineert het beste van beide werelden: robuuste bank-support vanaf dag 1, maar met duidelijke scope-begrenzing. Laat me dit onderzoeken.2 stepsRabobank ABN AMRO CSV export kolommen velden structuur10 resultsInformatie over bestandsformaten Rabo Business Banking Professional - Rabobankrabobank.nlEn weer een bank erbij in de spreadsheet – Geldnerd.nlgeldnerd.nlMicrosoft Excel - Rabobank bankrekening transacties download omzetten naar Excelopleidingscentrum.euBanktransacties downloaden doe je zo! Alle Nederlandse banken – Spreadsheet Shopspreadsheet-shop.nlDownloadinstructies Bankmutatiesstamrechtingenieur.nlExporteren naar je boekhoudprogramma - Internetbankieren - ABN AMROabnamro.nlMeestgestelde vragen | BankingToolsbankingtools.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlGitHub - ToonvdPas/rabobank-csv-conversie: Conversie-tool om een CSV-download van de Rabobank te converteren, rubriceren en organiseren voor gebruik in een spreadsheet.github.comFinanciën op orde (2): Inkomsten en Uitgaven in beeld – Geldnerd.nlgeldnerd.nlbunq knab SNS CSV export format kolommen structuur10 resultsList of supported bank and online payment providers export formats : Yuki Support Nederlandyuki.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlYNAB Going Dutchdanielhaitink.nlHow do I create a CSV export - bunq Togetherbunq.comCashflow online software csv export - bunq Togetherbunq.comExport a set of payments - bunq Togetherbunq.comExport rekening overzicht - bunq Togetherbunq.comKnab bank export files : Yuki Support Nederlandyuki.nlPDF to MT940, CAMT.053 & CSV Converter | Bankafschriften + Creditcard Omzettenclearvault.nlExport statements with filter/search/selection - bunq Togetherbunq.comPerfect! Ik heb nu voldoende informatie verzameld. Laat me een uitgebreid overzicht maken van de CSV-structuren van de 6 grootste Nederlandse banken en een n8n workflow-strategie opstellen.

Belangrijkste Inzichten:

Hieronder een reconstructie gebaseerd op de onderzoeksbronnen:

Huidige structuur (na augustus 2020):
csv
Kenmerken:

Uitdagingen:

Uitgebreide CSV-structuur:
csv
Kenmerken:

Voordeel:

Beperkte TXT/CSV-structuur:
txt
Kenmerken:

Uitdaging:

CSV & JSON ondersteuning:

Geschatte structuur (veelvoorkomend bij neobanken):
csv

CSV-ondersteuning:

Vermoedelijke structuur (vergelijkbaar met andere moderne banken):
csv

CSV met IBAN:

Vermoedelijke structuur:
csv

javascript

Detectielogica gebaseerd op CSV-headers:
javascript

ING Parser (Function Node):
javascript
Rabobank Parser (Function Node):
javascript
ABN AMRO Parser (Function Node):
javascript

Unified Transaction Schema:
javascript

Duplicaat-detectie strategie:
javascript

Output JSON voor frontend:
javascript

Rationale:

Implementatie in n8n:
javascript

Wil je dat ik:

Of heb je aanpassingen:

| Key | Value |
| --- | --- |
| Laat me weten of je deze aanpak goedkeurt, dan werk ik de definitieve MVP | scope uit! 🚀Heroverweeg Vraag 2 Elias en gebruik al het bovenstaande CSV onderzoek als input. Vraag 2: Elias - MVP-Scope Prioritering Target AI: claude Uw Geoptimaliseerde Prompt: PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP). CONTEXT: Lees bijgevoegd rapport 1. [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516]. 2. **Te Prioriteren Features (Optioneel):** * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524]. * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525]. TAAK: Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP). CRITERIA VOOR AFWEGING: 1. **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst). 2. **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5). 3. **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1). OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel): Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025 |
| Als Lyra, Beslissingsmatrix Generator | geüpdatet met CSV-structuurinzichten |

Conclusie: MVP+ (uitstellen)
Rationale:

Conclusie: GO voor MVP 1.0
Rationale:

Waarom deze stijging?
Het CSV-onderzoek onthult dat bankvariatie substantieel maar beheersbaar is:

Cruciale inzichten:

Conclusie: CSV-import is niet "nice-to-have" maar essentieel voor differentiatie. Zonder goede import-ervaring valt de kern-USP weg: "Privacy zonder bankkoppeling, maar toch gemak".

Waarom deze stijging?
Het rapport waarschuwt expliciet voor "onbetrouwbare data-import" als kritiek risico:

Risico-analyse:

Conclusie: Een half-werkende CSV-import is slechter dan geen import. Gebruikers die hun eerste import proberen en falen, verliezen direct vertrouwen. Bank-presets (ING/Rabobank/ABN) met robuuste validatie zijn vertrouwen-kritiek.

Effort Breakdown:

Vergelijking met oorspronkelijke schatting:

Is deze effort-investering gerechtvaardigd?
✅ JA, om volgende redenen:

Total MVP 1.0 Effort:

Herziene beslissing:

Trade-off:

Alternatief (indien tijd kritiek is):

Keuze:

Welke optie kies je?
Mijn strategische advies: Optie A. De extra investering (2-3 weken) levert een veel sterker product op dat de kern-UVP waarmaakt. Zonder robuuste CSV-import riskeren we dat gebruikers afhaken bij hun eerste kritieke actie.Voldoen we aan deze doelstellingen? 
Stap 2: De Kern: Bepaling van de UVP (Onder leiding van Elias)
 * Input: De goedgekeurde Concurrentie-matrix en Doelgroep Hypothese (uit Stap 1).
 * Activiteit: Formulering van de kernboodschap die de gaten in de markt vult. Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard).
 * Output Vereisten:
   * De Concept UVP (één duidelijke zin).
   * De Definitieve Minimale Scope (3 Kernfuncties) die de UVP ondersteunen.
 * Definitief Keuzemoment voor de Lead: Formele GO/STOP op de Concept UVP en de Minimale Scope.2 dec 2025
Systematische controle van outputvereisten

Status: ⚠️ GEDEELTELIJK VOLDAAN
Wat we hebben (verspreid door documentatie):

Probleem:

Status: ❌ NIET VOLDAAN
Wat gevraagd werd:

Wat we leverden:
7 features in MVP 1.0:

Probleem:

Status: ❌ NIET VOLDAAN
Wat we deden:

Wat ontbreekt:

Ik stel voor:
📌 DEFINITIEVE CONCEPT UVP (Versie 1.0):

Validatie tegen UVP-criteria:

Framework: Setup → Invoer → Dashboard

Mapping van 7 features naar 3 kernfuncties:

Result:

Framework voor Lead-beslissing:

📌 Kernboodschap:

Validatie:

Technische mapping:

Status: ⏳ WACHTEND OP LEAD-BESLISSING
Vereiste actie van Lead (Manasse):
Vul het bovenstaande beslissingskader in en geef expliciet aan:

"Voldoen we aan deze doelstellingen?"

OVERALL:

Om Stap 2 formeel af te ronden, heb ik nodig:

| Zodra ik dit heb | is Stap 2 formeel afgerond en kunnen we door naar Stap 3 (Wireframes & User Flows). 🚀 |
| --- | --- |
| Wat is jouw beslissing?Schrijf de opdracht voor David | onze UX/UI Designer (Consult). Hij levert ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie2 dec 2025 |
| Fase: Fase 1 | Stap 3 - Wireframes & User Flows |

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voordat we investeren in volledige development. Focus op gebruiksvriendelijkheid, privacy-gevoel en snelheid van begrip.
Deliverables:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 3 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden):

Gebruik de tool die je het snelst laat werken:

Voeg bij wireframes korte notities toe:

Naast de wireframes, lever ook:

Stel 3-5 vragen op die we kunnen stellen tijdens validatie:
Voorbeeld vragen:

Leg per scherm kort uit (3-5 bullets):

Voorbeeld:

David levert op:

Formaat:

Geschatte effort:

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 3-5 werkdagen] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):

Anti-patterns (vermijden):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:

Na gebruikerstests (Stap 4) verwachten we:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP. Als gebruikers hier niet doorheen komen, faalt het hele product. We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Laat zien waarom eenvoud zo krachtig is! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze opdracht te geven?

Succes David! We kijken uit naar je werk. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Teamtwee opmerkingen (revisie) 1) We maken de app voor mensen die meer duidelijkheid en grip willen hebben op hun financiën. Dat kunnen ook mensen zijn in armoede of met schulden van jong tot oud. 
2) We maken de app voor zowel IOS als Android. Native React dus2 dec 2025
Project: Minimal Cashflow - Privacy-First Budget App
Fase: Fase 1, Stap 3 - Wireframes & User Flows
Opdrachtgever: Manasse (Lead) via Elias (Product Strategist)
Datum: [Vandaag]
Deadline: [Te bepalen door Lead]
Versie: 2.0 (Herzien na feedback)

⚠️ REVISIE 1 - Doelgroep Verbreding:
De app is bedoeld voor iedereen die duidelijkheid en grip wil op hun financiën, inclusief:

Impact op design:

⚠️ REVISIE 2 - Platform:

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voor diverse gebruikers (incl. mensen met schulden, ouderen, lage digitale vaardigheden) voordat we investeren in development.
Deliverables:

Primaire doelgroepen:

Locatie: Nederland (primair), EU (secundair)

Voor mensen in financiële stress:

Voor ouderen/lage digitale vaardigheden:

Voor mensen met visuele beperkingen:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

Privacy-signaal:

Toegankelijkheid - Kritieke punten:

Snelheid:

Foutpreventie:

Feedback:

Empathie voor financiële stress:

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 5 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden - logische prioriteit):

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

Informatiehiërarchie:

Emotionele Respons (KRITIEK):

Toegankelijkheid - Kritieke punten:

Privacy-signaal:

Voor ouderen/lage digitale vaardigheden:

Voor mensen in financiële stress:

⚠️ BELANGRIJK voor David:
Gebruik universele patterns die werken in React Native:

Safe Areas (React Native):

MUST HAVE (AA-rating):

NICE TO HAVE (AAA-rating):

Gebruik de tool die je het snelst laat werken:

Handige Figma plugins voor React Native:

Voeg bij wireframes toe:

Naast de wireframes, lever ook:

Stel 5-7 vragen op per scherm, inclusief specifieke vragen voor diverse gebruikers:

Algemeen (alle gebruikers):

Voor ouderen/lage digitale vaardigheden:
4. "Is het duidelijk wat je moet doen om te beginnen?" (onboarding)
5. "Zijn de knoppen groot genoeg om op te klikken?" (touch targets)
6. "Begrijp je wat 'CSV-bestand' betekent?" (jargon-check)
Voor mensen in financiële stress:
7. "Hoe voel je je als je een uitgave toevoegt die je budget overschrijdt?" (emotionele respons)

Algemeen:

Voor ouderen:
4. "Is de tekst groot genoeg om te lezen?" (lettergrootte)
5. "Zijn er dingen die je niet begrijpt?" (duidelijkheid)
Voor mensen met schulden:
6. "Als je een tekort hebt, voelt dit scherm dan beschuldigend of helpt het je?" (empathie-check)
7. "Wat zou je doen om je tekort te verminderen?" (actionability)
Privacy-perceptie (alle gebruikers):
8. "Waar denk je dat je gegevens worden opgeslagen?" (privacy-signalen effectiviteit)
9. "Voel je je comfortabel met het invoeren van je financiële data?" (vertrouwen)

Leg per scherm uit (5-7 bullets), inclusief toegankelijkheidskeuzes:
Template:

Voorbeeld (Dashboard):

David levert op:
Continue2 dec 2025x] Handmatige invoer versie (default, toegankelijk)

Formaat:

Geschatte effort (verhoogd vanwege toegankelijkheidseisen):

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 5-7 werkdagen, vanwege verhoogde complexiteit] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):
Voor toegankelijkheid:

Voor empathische financiële UX:

Voor privacy-signalering:

Anti-patterns (VERMIJDEN):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:
Functioneel:

Toegankelijkheid (KRITIEK):

Empathie & Inclusiviteit:

Privacy:

Cross-Platform:

Documentatie:

Goedkeuring:

Na gebruikerstests (Stap 4) verwachten we:
Algemene bruikbaarheid:

Toegankelijkheid (specifiek):

Empathie & Vertrouwen:

Cross-Platform:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes en toegankelijkheid zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP, en de toegankelijkheid en empathie zijn cruciaal. Als mensen in armoede, ouderen, of gebruikers met beperkte digitale vaardigheden hier niet doorheen komen, falen we in onze missie om iedereen grip te geven op hun financiën.
We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Dit is design met impact - het kan mensen helpen die echte financiële stress ervaren. Laat zien hoe krachtig empathisch, toegankelijk design kan zijn! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze herziene opdracht te geven?

Succes David! We kijken uit naar toegankelijk, empathisch design dat écht voor iedereen werkt. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Team

Print dit uit voor tijdens het ontwerpen:
Claude is AI and can make mistakes. Please double-check responses. Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

MVP-prioritering beslissingsmatrix voor featuresShare

---

**Claude:**

MVP-prioritering beslissingsmatrix voor features

---

**Claude:**

Share

---

**Claude:**

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | 10 | GO (MVP) | Privacy-first is een kernpijler van de UVP. Zonder basale toegangsbeveiliging is de privacy-belofte niet geloofwaardig. Financiële data op een onbeveiligde app ondermijnt het hele vertrouwensverhaal. Dit is een 'table stakes' feature voor elke finance app die privacy claimt. Lage complexiteit (standaard OS-functionaliteit), hoge impact op vertrouwen. |
| Feature B: Historische CSV-import (bulk) | 3 | 2 | 5 | MVP+ | Ondersteunt de UVP (flexibiliteit + privacy zonder bankkoppeling), maar is niet essentieel voor een werkende MVP. Gebruikers kunnen ook vanaf 'nu' beginnen met tracken. De feature voegt vooral gemak toe voor power users die hun volledige historie willen migreren. CSV-import is al onderdeel van MVP-scope, maar de bulkimport van historische data brengt extra complexiteit (duplicaatherkenning over langere periodes, data-cleaning van oude exports, performance bij grote datasets). Kan worden uitgesteld tot na validatie van basis-import functionaliteit. |

| Beslissing | Actie |
| --- | --- |
| Feature A (PIN/Biometrie) | ✅ Opnemen in MVP – niet-onderhandelbaar voor privacy-UVP |
| Feature B (Historische Import) | ⏸️ Uitstellen naar MVP+ – valideer eerst basis-functionaliteit |

| # | Feature | Prioriteit | T-Shirt Size | Motivering |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegangsbeveiliging | P0 | S | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig. Essentieel voor gebruikersvertrouwen bij financiële data. Lage complexiteit (standaard OS-functionaliteit). |
| 2 | Handmatige invoer uitgaven/inkomsten | P0 | M | Basis van de app - essentieel voor gebruikers die controle en privacy willen. Simpele UX voor dagelijks gebruik. |
| 3 | Categorisering & budgettering | P0 | M | Vaste lasten, variabel budget, sparen, vrije bestedingsruimte. Kern van cashflow-controle functionaliteit. |
| 4 | Basis rapportage/overzicht | P0 | M | Maandelijkse cashflow, saldo, uitgaven vs inkomsten. Basisgrafieken voor inzicht. Zonder dit is de app alleen een logboek. |
| 5 | Privacy-first data model | P0 | M | Data lokaal of versleuteld opgeslagen, duidelijke export/backup/data-ownership opties. Architecturele beslissing die hele app beïnvloedt. |
| 6 | Flexibele account types | P0 | S | Cash, bank, spaargeld, contant, meerdere rekeningen. Ondersteunt diverse gebruikerssituaties. Relatief simpel data model. |

| Fase | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| MVP 1.0 | Basis CSV-import (generiek) | P1 | M | ✅ GO - Simpele parser voor standaard CSV-structuur, handmatige kolom-mapping door gebruiker. Risico: Gebruikers moeten zelf kolommen selecteren = hogere leercurve. |
| MVP 1.1 | Voorinstellingen top 3 banken | P2 | L | ⏸️ MVP+ - ING, Rabobank, ABN AMRO voorinstellingen, inclusief robuuste foutafhandeling en duplicaatdetectie. Vereist eerst: Benchmark van andere apps + verzamelen testdata. |

| Feature | Motivering Uitstel |
| --- | --- |
| Historische bulk CSV-import | Nice-to-have voor migratie, niet essentieel. Gebruikers kunnen vanaf nu beginnen tracken. Extra complexiteit: performance bij grote datasets, edge cases in oude formats. Valideer eerst basis-import. |

| Fase | Features | Effort | Prioriteit |
| --- | --- | --- | --- |
| Phase 1 | n8n workflow met ING + Rabobank + ABN AMRO presets | L | P0 |
| Phase 2 | Bunq + Knab + SNS presets toevoegen | M | P1 |
| Phase 3 | Generic CSV parser (handmatige kolom-mapping) | M | P2 |
| Phase 4 | Auto-categorisatie op basis van historische data | XL | MVP+ |

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Complexity/Effort | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | S | 10 | ✅ GO (MVP 1.0) | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig bij financiële data. Lage complexiteit (standaard OS-API's), hoge impact. Onveranderd t.o.v. eerdere analyse. |
| Feature B: Historische CSV-import met 3-maanden limiet | 4 | 4 | M → L | 8 | ✅ GO (MVP 1.0) ⚠️ GEWIJZIGD | Substantiële heroverweeging: CSV-onderzoek toont dat bank-presets (ING/Rabobank/ABN) technisch haalbaar zijn en kritiek voor UVP-differentiatie. 3-maanden limiet maakt complexiteit beheersbaar. Zonder goede CSV-import mist de kern-USP: "geen bankkoppeling, maar wél gemak". Effort verhoogd naar M-L vanwege bank-specifieke parsers, maar strategische waarde rechtvaardigt investering. |

| Bank | CSV-Rijkheid | Import Limiet | Parsing Complexity |
| --- | --- | --- | --- |
| ING | Middel (11 kolommen) | 2000 tx, 18 maanden | Medium - puntkomma-delimiter, aanhalingstekens |
| Rabobank | Zeer hoog (18 kolommen) | 8 jaar | Medium - komma-delimiter, rijke metadata |
| ABN AMRO | Zeer laag (5 kolommen) | 18 maanden | Laag - tab-delimited, minimaal |
| Bunq | Hoog (modern) | Onbeperkt | Laag - gestandaardiseerd |
| Knab | Middel | 2000 tx, 24 maanden | Medium |
| SNS | Middel | 5 jaar | Medium |

| Scenario | Impact op Vertrouwen | Waarschijnlijkheid zonder Bank-Presets | Mitigatie met Bank-Presets |
| --- | --- | --- | --- |
| Import faalt volledig | ⛔ Kritisch - gebruiker haakt af | Hoog (generieke parser = trial & error) | Laag (geteste presets) |
| Verkeerde categorisatie | ⚠️ Middel - frustratie, handmatig fixen | Hoog (geen contextbegrip) | Middel (Rabobank metadata helpt) |
| Missende transacties | ⛔ Kritisch - wantrouwen in app | Middel (parsing errors) | Laag (robuuste validatie) |
| Dubbele transacties | ⚠️ Middel - verwarring | Hoog (zonder fingerprinting) | Laag (duplicaatdetectie in n8n) |

| Component | Complexity | Rationale |
| --- | --- | --- |
| Generieke CSV-parser (basis) | S | PapaParse library, simpele kolom-mapping |
| Bank-detectie logic | S | Header-matching met 70% threshold |
| ING-specifieke parser | M | Puntkomma-delimiter, aanhalingstekens-handling, 11 kolommen |
| Rabobank-specifieke parser | M | Komma-delimiter, 18 kolommen, rijke metadata-extractie |
| ABN AMRO-specifieke parser | S | Tab-delimited, 5 kolommen, minimaal |
| Unified schema mapping | S | Datum-normalisatie, bedrag-parsing |
| Duplicaatdetectie | M | Fingerprinting (datum + bedrag + tegenrekening) |
| 3-maanden date-range filter | S | Simpele datum-vergelijking |
| n8n workflow orchestration | M | 6 nodes, error handling |
| Testing met real bank data | M | Verzamelen testdata, edge cases |
| TOTAAL (Top 3 banken) | L | Geschat: 2-3 weken development |

| Aspect | Versie 1.0 (Oorspronkelijk) | Versie 2.0 (Na CSV-Onderzoek) |
| --- | --- | --- |
| CSV-Import | Generieke parser (handmatige mapping) | Bank-presets voor ING + Rabobank + ABN AMRO |
| Historische Import | Uitgesteld naar MVP+ | ✅ Opgenomen met 3-maanden limiet |
| Effort Estimate | M (1 week) | L (2-3 weken) |
| UVP-Differentiatie | Basis import-mogelijkheid | Sterke differentiatie: "Werkt out-of-the-box" |
| Gebruikersvertrouwen | Onzeker (trial & error) | Hoog (geteste presets) |

| # | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegang | P0 | S | GO |
| 2 | Handmatige invoer | P0 | M | GO |
| 3 | Categorisering & budgettering | P0 | M | GO |
| 4 | Basis rapportage/overzicht | P0 | M | GO |
| 5 | Privacy-first data model | P0 | M | GO |
| 6 | Flexibele account types | P0 | S | GO |
| 7 | CSV-import met bank-presets (ING/Rabo/ABN) + 3-maanden limiet | P1 | L | ✅ GO |

| Feature | Aanbeveling | Rationale |
| --- | --- | --- |
| Feature A (PIN/Biometrie) | ✅ GO | Onveranderd - essentieel voor privacy-UVP |
| Feature B (CSV-import) | ⚠️ GO → van MVP+ naar MVP 1.0 | CSV-onderzoek toont dat dit niet optioneel is voor UVP-differentiatie. 3-maanden limiet maakt het haalbaar. Zonder dit mist de kern-USP. |

| # | Vereiste Output | Status | Locatie in Documentatie | Volledigheid |
| --- | --- | --- | --- | --- |
| 1 | Concept UVP (één duidelijke zin) | ⚠️ Gedeeltelijk | Meerdere versies verspreid door rapport | 60% - Niet geconsolideerd tot één definitieve zin |
| 2 | Definitieve Minimale Scope (3 Kernfuncties) | ❌ Nee | 7 features in plaats van 3 | 40% - Scope creep, geen focus op Setup/Invoer/Dashboard |
| 3 | Formeel GO/STOP Keuzemoment voor Lead | ❌ Nee | Vraag gesteld maar niet afgedwongen | 30% - Geen duidelijk beslissingskader |

| Versie | Locatie | Formulering |
| --- | --- | --- |
| Versie A | Rapport pagina 4 | "Privacy-first budget app die toch automatisch transacties kan verwerken -- zonder bankkoppeling." |
| Versie B | Rapport pagina 7 | "Een eenvoudige, privacy-gerichte, flexibele financiën-tracker: geen bank-koppeling nodig, maar wél overzicht en import-opties. Grip op cashflow, ook bij contant geld of variabel inkomen." |
| Versie C | Beslissingsmatrix | "Privacy-first & Controle met CSV-import als differentiator" (impliciet) |

| Kernfunctie | Definitie | Onderliggende Features (technisch) | User Story |
| --- | --- | --- | --- |
| 1. SETUP | Eerste configuratie van de app om te kunnen beginnen | • PIN/Biometrie toegang• Privacy-first data model (lokale opslag)• Flexibele account types (cash/bank/sparen)• Categorisering structuur aanmaken | "Als nieuwe gebruiker wil ik veilig en snel mijn accounts en categorieën instellen, zodat ik binnen 5 minuten kan beginnen met tracken." |
| 2. INVOER | Transacties toevoegen (handmatig of via import) | • Handmatige invoer (uitgaven/inkomsten)• CSV-import met bank-presets (ING/Rabo/ABN)• 3-maanden historische import limiet• Automatische categorisatie (basis) | "Als gebruiker wil ik makkelijk mijn uitgaven toevoegen — ofwel handmatig, ofwel door mijn bankafschrift te uploaden — zodat ik tijd bespaar en een compleet overzicht krijg." |
| 3. DASHBOARD | Inzicht in cashflow en budgetstatus | • Basis rapportage (maandelijks overzicht)• Uitgaven vs inkomsten grafiek• Budget per categorie (vrije bestedingsruimte)• Saldo-overzicht (per account) | "Als gebruiker wil ik in één oogopslag zien hoeveel ik deze maand heb uitgegeven en hoeveel ik nog vrij heb om uit te geven, zodat ik controle houd." |

| # | Kernfunctie | Doel | Ondersteunt UVP Element |
| --- | --- | --- | --- |
| 1 | SETUP | Veilige, snelle eerste configuratie (accounts, categorieën, privacy) | "Privacy-first" + "Controle" |
| 2 | INVOER | Flexibel transacties toevoegen (handmatig of CSV-import) | "Automatisch verwerkt" + "Zonder bankkoppeling" |
| 3 | DASHBOARD | Inzicht in cashflow, budget en vrije bestedingsruimte | "Controle over cashflow" |

| Doelstelling | Oorspronkelijke Status | Herziene Status (Na Correctie) |
| --- | --- | --- |
| Concept UVP (één zin) | ⚠️ Gedeeltelijk (60%) | ✅ Voldaan (100%) |
| 3 Kernfuncties (Setup/Invoer/Dashboard) | ❌ Niet voldaan (40%) | ✅ Voldaan (100%) |
| Formeel GO/STOP Keuzemoment | ❌ Niet voldaan (30%) | ⏳ Framework klaar (80% - wacht op Lead) |

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```js
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

- Privacy-first is expliciet onderdeel van de kern-UVP
- Gebruikers hebben privacyzorgen en willen data-controle bij finance apps
- Zonder toegangsbeveiliging is er geen geloofwaardige privacy-bescherming
- Technisch eenvoudig: standaard iOS/Android biometrie-API's
- Essentieel voor vertrouwen: gebruikers zullen niet hun financiële data invoeren in een onbeveiligde app
- Lage development effort, maar hoge perceptiewaarde

- Basis CSV-import staat al in MVP-scope – die volstaat voor lopende transacties
- Historische bulk-import is een nice-to-have voor migratie, niet essentieel voor werking
- Extra complexiteit:

| UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |
| --- | --- |
| - UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |

- Duplicaatherkenning wordt complexer bij grote volumes
- Performance-optimalisatie nodig voor datasets van meerdere jaren
- Edge cases in oude CSV-formaten (banken veranderen hun export-structuur)
- UX-uitdagingen: progressie-indicatoren, error handling bij grote bestanden

- Na validatie dat gebruikers CSV-import daadwerkelijk gebruiken
- Wanneer er vraag is van early adopters om historie te migreren
- Na optimalisatie van parsing en duplicaat-detectie

- Benchmark onderzoek: hoe bieden andere apps CSV-import aan
- Verzamelen/creëren van geanonimiseerde testdata van top 3 banken
- Feature-schets voor robuuste CSV-import valideren met testdata

| Key | Value |
| --- | --- |
| MVP 1.0 (Generieke CSV) | Valideert technische haalbaarheid + gebruikersbehoefte aan import-functie. Lagere barrier to launch. |
| MVP 1.1 (Bank | presets): Verhoogt gebruiksvriendelijkheid drastisch, maar vereist significant meer investering (L). Uitstel voorkomt dat we tijd/resources investeren in bank-specifieke parsers voordat we weten of generieke import überhaupt wordt gebruikt. |

| Key | Value |
| --- | --- |
| ✅ Privacy | first: PIN/biometrie + lokale data opslag |
| ✅ Eenvoud | Minimalistisch, zonder overbodige features |
| ✅ Controle | Handmatige invoer + flexibele accounts |
| ✅ Flexibiliteit | Generieke CSV-import als optie (bank-presets volgen later) |

| Key | Value |
| --- | --- |
| 6 Core Features | 2x S + 4x M = ~4-6 weken development (schatting voor 1-2 developers) |
| CSV | Import (generiek): +1 week |
| Testing & Polish | +1-2 weken |
| Total MVP 1.0 | ~6-9 weken |

| Key | Value |
| --- | --- |
| ✅ GO | Alle 6 kern-features (inclusief PIN/biometrie) |
| ✅ GO | Generieke CSV-import (gebruiker selecteert kolommen handmatig) |
| ⏸️ MVP 1.1 | Bank-specifieke voorinstellingen (na benchmark + testdata) |
| ❌ STOP | Historische bulk-import (naar MVP+) |

| Key | Value |
| --- | --- |
| Snellere time | to-market (geen L-size bank-parser werk) |
| Risico | mitigatie: valideer eerst of CSV-import überhaupt wordt gebruikt |
| Focus blijft op kern | UVP (privacy + controle) |
| Ruimte om te leren van early adopters voordat we investeren in complexe bank | presets |

- Ben je akkoord met deze MVP 1.0 scope?
- Wil je toch bank-presets in MVP 1.0, ondanks het hogere risico en langere ontwikkeltijd?
- Heb je aanvullende features die je essentieel vindt voor MVP 1.0?

- Download-limieten per bank:

| - Scheidingstekens variëren: ING wijzigde in 2020 van komma (,) naar puntkomma ( | ) als scheidingsteken Banktrans |
| --- | --- |
| - MT940 wordt afgebouwd: SNS/ASN/RegioBank (Volksbank) ondersteunt sinds juli 2022 geen MT940 meer | Rabobank stopt MT940-ondersteuning vanaf 2025 Moneymonk |

| Key | Value |
| --- | --- |
| ING | max 18 maanden terug |
| ABN AMRO | max 24 maanden (maar slechts 18 maanden in XLS/CSV) |
| Rabobank | tot 8 jaar terug |
| Knab | tot 24 maanden terug |
| bunq | onbeperkt (elke gewenste periode) |
| SNS | tot 5 jaar terug Spreadsheet Shop |

- Scheidingsteken: puntkomma (;)
- 11 kolommen (2 kolommen toegevoegd in 2020: "Saldo na mutatie" en "Tag")
- Datumformaat: JJJJMMDD (yyyymmdd)
- Max 2000 transacties per export Banktrans

- Velden staan tussen aanhalingstekens; Excel voegt soms dubbele/driedubbele aanhalingstekens toe bij bewerking Banktrans

- Scheidingsteken: komma (,)
- Zeer informatierijk: bevat mutatiesoort, rentedatum, meerdere omschrijvingsvelden
- Datumformaat: DD-MM-YYYY
- Meest gedetailleerde CSV van alle banken GeldnerdGitHub

- Veel metadata voor automatische categorisatie (mutatiesoort, meerdere omschrijvingsvelden)

- Scheidingsteken: Tab (TXT) of komma (CSV)
- Zeer beperkt: bevat minimale informatie
- Geen mutatiesoort, geen extra metadata
- Download limiet: 18 maanden in XLS/CSV-formaat Geldnerd

- Minste informatie van alle grote banken; lastig voor automatische categorisatie

- Ondersteunt zowel CSV als JSON export
- Geen downloadin-limiet: gebruikers kunnen transacties exporteren voor elke gewenste periode Spreadsheet Shop
- Modern digitaal platform, waarschijnlijk gestructureerde API-achtige output

- Max 2000 transacties per download
- Tot 24 maanden terug downloadbaar Spreadsheet Shop

- Bestandsformaat: Microsoft Excel, CSV-bestand
- Geen MT940-ondersteuning meer sinds juli 2022
- Tot 5 jaar terug downloadbaar Spreadsheet ShopMoneymonk

- Technische grenzen:

ING's max download: 2000 transacties per export Spreadsheet Shop
Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- UX Overwegingen:

3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
Voorkomt "analysis paralysis" bij onboarding
Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- Privacy & Data Ownership:

Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
Minder data = minder risico bij opslag/verwerking
- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues

- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)

- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ✅ Bank-onafhankelijk MAAR wel gebruiksvriendelijk

Geen directe API-koppeling (privacy-first)
Wél intelligente presets voor gemak
- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak
- ✅ Schaalbaar & Onderhoudbaar

n8n workflows zijn visueel en gemakkelijk uit te breiden
Nieuwe bank toevoegen = nieuwe parser-node
- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node
- ✅ 3-maanden limiet = Sweet Spot

| UX: genoeg data voor inzicht | niet overweldigend |
| --- | --- |
| - UX: genoeg data voor inzicht | niet overweldigend |

Duplicaatherkenning via fingerprinting
Validatie op elk niveau
Error handling per bank-parser
- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak

- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node

| Key | Value |
| --- | --- |
| Technisch haalbaar binnen bank | limieten |
| UX | genoeg data voor inzicht, niet overweldigend |
| Privacy | beperkte historische data-opslag |

- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

| Key | Value |
| --- | --- |
| ✅ GO | Deze n8n-workflow architectuur opnemen in de MVP 1.0 scope? |
| ✅ GO | 3-maanden limiet instellen voor historische bulk-import? |
| ✅ GO | Starten met Phase 1 (ING + Rabobank + ABN AMRO) en later uitbreiden? |

- Andere limiet dan 3 maanden? (bijv. 1 maand of 6 maanden)
- Andere banken prioriteren?
- Voorkeur voor andere technologie dan n8n?

- "Nice-to-have voor migratie, niet essentieel"
- "Gebruikers kunnen vanaf nu beginnen tracken"
- "Valideer eerst basis-import"

- Top 3 banken (ING, Rabobank, ABN) dekken ~70%+ van Nederlandse markt

Focus op deze 3 = maximale ROI met beperkte scope
- Focus op deze 3 = maximale ROI met beperkte scope
- Rabobank's rijke metadata (mutatiesoort, meerdere omschrijvingsvelden) maakt automatische categorisatie mogelijk

Dit is een killer feature die handmatige apps niet hebben
Verhoogt UVP substantieel: "Eenvoud door slimme import"
- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"
- ABN AMRO's minimalisme toont aan dat zelfs beperkte CSV-import beter is dan geen import

| Key | Value |
| --- | --- |
| Gebruikers verwachten dit als baseline | feature |
| Gebruikers verwachten dit als baseline | feature |
| 3 | maanden limiet lost technische barrières op: |

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

- Focus op deze 3 = maximale ROI met beperkte scope

- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"

- Gebruikers verwachten dit als baseline-feature

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

| Key | Value |
| --- | --- |
| Versie 1.0 | Generieke CSV (M) + uitstellen bank-presets |
| Versie 2.0 | Generieke CSV + Top 3 bank-presets (L) |
| Delta | +1-2 weken effort |

- Strategische waarde >> Effort-kosten

CSV-import is primaire differentiator vs handmatige apps
Zonder dit faalt de kern-USP
- CSV-import is primaire differentiator vs handmatige apps
- Zonder dit faalt de kern-USP
- n8n workflow = toekomstige schaalbaarheid

Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
Visual workflow = makkelijk onderhoudbaar
- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar
- 3-maanden limiet = effort-begrenzer

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Bank | presets = vertrouwen-multiplier |

"Het werkt gewoon" = kritiek voor early adopters
Goede eerste indruk = retention
- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

| Key | Value |
| --- | --- |
| CSV | import is primaire differentiator vs handmatige apps |
| Zonder dit faalt de kern | USP |

- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |

- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

- Concurrentievoordeel:

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Onboarding | kritiek: |

| Falen = churn | slagen = engagement |
| --- | --- |
| - Falen = churn | slagen = engagement |

n8n workflow = fundament voor toekomstige features
Automatische categorisatie (MVP+) bouwt hierop voort
Investering nu = snellere iteraties later
- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |

- Eerste 5 minuten bepalen of gebruiker blijft
- "Importeer je bankdata" = eerste actie
- Falen = churn, slagen = engagement

- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Versie 1.0 | ~6-9 weken |
| Versie 2.0 | ~8-12 weken (+2-3 weken voor robuuste CSV-import) |

- ⏱️ +2-3 weken development time
- ✅ Veel sterkere product-market fit
- ✅ Lagere churn bij onboarding
- ✅ Duidelijke differentiatie vs concurrentie

| Key | Value |
| --- | --- |
| MVP 1.0a | Alleen ING-preset (grootste bank, ~40% markt) = M effort (1 week) |
| MVP 1.0b | Rabobank + ABN toevoegen = +1 week |

| - ✅ Optie A (Aanbevolen): GO voor Feature B in MVP 1.0 met Top 3 bank-presets (L effort | 2-3 weken extra) |
| --- | --- |
| - ⚡ Optie B (Sneller): GO voor Feature B in MVP 1.0 met alleen ING-preset (M effort | 1 week extra) |
| - ⏸️ Optie C (Oorspronkelijk plan): Uitstellen Feature B naar MVP+ (geen extra tijd | maar zwakkere UVP) |

- 3 verschillende formuleringen
- Geen enkele is één duidelijke zin zoals gevraagd
- Versie B is te lang (2 zinnen)
- Geen formele goedkeuring van Lead op specifieke formulering

- PIN/Biometrie
- Handmatige invoer
- Categorisering & budgettering
- Basis rapportage
- Privacy-first data model
- Flexibele account types
- CSV-import met bank-presets

| Key | Value |
| --- | --- |
| Scope creep | 7 features ≠ 3 kernfuncties |
| Niet georganiseerd volgens het gevraagde framework | Setup → Invoer → Dashboard |
| Features zijn technische bouwblokken, geen gebruikers | gerichte functies |

- Stelden vragen: "Ben je akkoord?", "Welke optie kies je?"
- Geen duidelijk GO/STOP framework met criteria
- Geen expliciete "Sign-off" vereiste van Lead

- Formele beslissingsprocedure
- Duidelijke criteria voor GO (bijv. "UVP moet X scoren op Y")
- Risico-overzicht bij STOP-beslissing
- Expliciete handtekening/akkoord-moment

| Key | Value |
| --- | --- |
| ✅ Privacy | first: Expliciet genoemd |
| ✅ Geen bankkoppeling | Kernonderscheid vs concurrentie |
| ✅ Automatisch verwerkt | CSV-import als gemak |
| ✅ Cashflow | controle: Hoofdfunctie |
| ✅ Contant/onregelmatig | Doelgroep-differentiatie |
| ✅ Één zin | 23 woorden, helder en scannabel |

- ✅ Voldoet aan "3 kernfuncties" vereiste
- ✅ Georganiseerd volgens Setup → Invoer → Dashboard
- ✅ Alle 7 technische features blijven behouden, maar nu gestructureerd

- ✅ Vult gat in markt (privacy vs gemak)
- ✅ Duidelijk onderscheidend vs concurrentie
- ✅ Ondersteuning door 3 kernfuncties (zie hieronder)

| - Setup = Features 1 | 5 | 6 |
| --- | --- | --- |
| - Invoer = Features 2 | 3 | 7 |

- ✅ GO → We gaan door naar Stap 3
- ⏸️ REVISE → Specificeer welke aanpassingen nodig zijn
- ❌ STOP → Motiveer waarom we stoppen

| Key | Value |
| --- | --- |
| Voor correctie | 43% compliant |
| Na correctie | 93% compliant (laatste 7% = Lead-beslissing) |

- ✅ Goedkeuring of aanpassing van de Definitieve UVP:

| Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |
| --- | --- |
| - Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |

Akkoord met deze structuur?
Ontbreekt er iets essentieel?
- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?
- ✅ Formele GO/STOP/REVISE beslissing:

| Geef expliciet aan: GO | STOP of REVISE |
| --- | --- |
| - Geef expliciet aan: GO | STOP of REVISE |

| Key | Value |
| --- | --- |
| Akkoord met | "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen." |
| Of | voorgestelde wijziging |

- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?

- Vul het beslissingskader in (zie boven)
- Geef expliciet aan: GO, STOP of REVISE

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes
- Validatie-vragen voor gebruikerstests

- Privacy-bewuste gebruikers die geen bankkoppeling willen
- Mensen met contant geld of onregelmatig inkomen (freelancers, ZZP'ers, wisselende inkomsten)
- Casual budgetters die een simpel overzicht willen zonder complexe features
- Leeftijd: 25-45 jaar
- Locatie: Nederland (primair), EU (secundair)
- Tech-savviness: Gemiddeld tot hoog (comfortabel met CSV-bestanden downloaden)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| --- | --- |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |

- Handmatige Invoer

Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

CTA: "Opslaan" button (prominent)
- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)
- CSV Import

| Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |
| --- | --- | --- | --- |
| - Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |

- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)

- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

- Upload-zone (drag & drop of file picker)
- Bank-selectie (dropdown: ING, Rabobank, ABN AMRO, Andere)
- Preview van eerste 3 transacties (tabel) na upload
- Waarschuwing: "Max 3 maanden terug" (info-icoon met uitleg)
- CTA: "Importeer [X] transacties" button

| Key | Value |
| --- | --- |
| Privacy | signaal: Toon ergens subtiel: "🔒 Data blijft op jouw apparaat" (niet opdringerig) |
| Snelheid | Handmatige invoer moet binnen 3 taps/clicks voltooid zijn |
| Foutpreventie | Validatie op bedrag (geen 0, geen letters), datum (niet in toekomst voor uitgaven) |
| Feedback | Bevestiging na opslaan ("✓ Transactie toegevoegd") |

- Welke modus is default? Handmatig of Import? (Advies: Handmatig, want lagere drempel)
- Hoe switchen tussen modi? Tabs, toggle, of aparte schermen?
- Hoe visueel onderscheiden tussen Uitgave/Inkomst? Kleur, icoon, positie?
- Waar plaats je privacy-signalen zonder dat het opdringerig wordt?

- Hoofd-KPI (Hero Section)

"Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

Visueel: Progress bar of cirkel (groen = goed, oranje = op, rood = over budget)
- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |
| Maand | selector |

Dropdown of swipe-interface: "December 2024" ← →
Quick stats: "✓ 47 transacties deze maand"
- Dropdown of swipe-interface: "December 2024" ← →
- Quick stats: "✓ 47 transacties deze maand"
- Inkomsten vs Uitgaven (Simpele Grafiek)

| 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |
| --- | --- |
| - 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |

Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Quick Actions (FAB of Bottom Bar)

| "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |
| --- | --- |
| - "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |

- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

| Key | Value |
| --- | --- |
| Dropdown of swipe | interface: "December 2024" ← → |
| Quick stats | "✓ 47 transacties deze maand" |

- Bar chart of lijndiagram
- 2 kleuren: Groen (inkomsten), Rood (uitgaven)
- X-as: Weken of dagen (afhankelijk van zoom-niveau)

- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)

| Key | Value |
| --- | --- |
| "+" button | Transactie toevoegen (shortcut naar Invoer-scherm) |
| "📊" button | Rapporten (toekomstig, mag disabled zijn in wireframe) |
| "⚙️" button | Instellingen |

| Key | Value |
| --- | --- |
| Informatiehiërarchie | Belangrijkste info bovenaan (Vrije Bestedingsruimte) |
| Scannability | Moet binnen 3 seconden te begrijpen zijn |
| Actie | gericht: Duidelijke CTA ("Transactie toevoegen") altijd zichtbaar |
| Emotionele respons | Gebruik kleur psychologie (groen = goed, rood = waarschuwing, niet judgmental) |
| Privacy | signaal: Eventueel subtiele indicator dat data lokaal is (geen sync-icoon) |

- Hoe presenteer je "Vrije Bestedingsruimte" visueel krachtig zonder overdrijving?
- Welke grafiektype is meest intuïtief voor non-finance users?
- Hoe balanceer je informatiedichtheid vs white space? (minimalistisch maar compleet)
- Waar plaats je Quick Actions? FAB (Floating Action Button) of Bottom Navigation?

| Key | Value |
| --- | --- |
| Primair | iOS (iPhone) - design voor iPhone 13/14/15 standaard formaat |
| Secundair | Android (kan later aangepast worden) |
| Orientatie | Portrait (staand) |

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Niet nodig | Hi-fi mockups, animaties, interactions (komt later) |

- Figma (preferred voor collaborative review)
- Sketch
- Adobe XD
- Balsamiq
- Of zelfs pen & papier gescand

- Tap/click areas
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale database")
- Edge cases (bijv. "Wat als geen transacties deze maand?")

- "Wat denk je dat er gebeurt als je op deze knop klikt?" (voor Invoer-scherm)
- "Wat vertelt dit scherm jou over jouw financiële situatie?" (voor Dashboard)
- "Hoe zou je een uitgave toevoegen?" (task-based test)
- "Voel je je comfortabel met waar je data blijft?" (privacy-perceptie)

- Waarom heb je gekozen voor deze layout?
- Welke UX-patterns heb je toegepast? (bijv. progressive disclosure, chunking)
- Waar heb je bewust gekozen voor eenvoud over features?

- Wireframe 1: INVOER-scherm

 Handmatige invoer versie
 CSV import versie
 Annotaties voor interacties
- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties
- Wireframe 2: DASHBOARD-scherm

 Hero section (Vrije Bestedingsruimte)
 Inkomsten vs Uitgaven grafiek
 Budget per Categorie lijst
 Quick Actions
 Annotaties voor data-sources
- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources
- Design Rationale document (1-2 pagina's)

 Keuzes uitgelegd
 UX-patterns toegelicht
 Privacy-signalering strategie
- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie
- Gebruikerstest Script (Concept)

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties

- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources

- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF |
| Documenten | Markdown of PDF |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 2-3 uur |
| Wireframe 2 (Dashboard) | 2-3 uur |
| Documentatie | 1-2 uur |
| Totaal | 5-8 uur (1 werkdag) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)

| Key | Value |
| --- | --- |
| Dyme (NL) | bekijk hun handmatige invoer flow |
| Wallet by BudgetBakers | bekijk dashboard indeling |
| Spendle | bekijk privacy-signalering |

- Te veel features op 1 scherm (zoals Mint)
- Onduidelijke categorisering (zoals Toshl)
- Privacy-signalen die angstig maken (zoals Revolut's security pop-ups)

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor technische haalbaarheid | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | Quick call (15 min) - vragen over briefing |
| 50% milestone | Review schetsen (30 min) - richting valideren |
| 100% | Final review (45 min) - deliverables doorlopen |

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Privacy-first aanpak is zichtbaar in design
- Handmatige invoer flow is binnen 3 taps/clicks te voltooien
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 3 seconden scannen
- Design rationale legt keuzes uit
- Gebruikerstest script is klaar voor validatie
- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ 0 critical usability issues (blockers voor MVP)

| - Complexiteit te versimpelen (CSV-import voelt technisch | maar moet toegankelijk aanvoelen) |
| --- | --- |
| - Privacy visueel te maken (niet alleen zeggen | maar laten zien) |

- ✅ Akkoord met scope & deliverables
- 📅 Verwachte opleveringsdatum
- ❓ Eventuele vragen of onduidelijkheden

| Key | Value |
| --- | --- |
| GO | Start opdracht |
| REVISE | Aanpassingen nodig (specificeer hieronder) |

- Mensen in armoede of met schuldenproblematiek
- Jong tot oud (breed leeftijdsspectrum: 18-65+)
- Variërend opleidingsniveau en digitale vaardigheden

- ✅ Toegankelijkheid is KRITIEK (WCAG-compliant, duidelijke taal, grote touch targets)
- ✅ Geen stigmatisering (vermijd "budget overschreden" met negatieve framing)
- ✅ Empathie in UX (begrijp stress van financiële onzekerheid)
- ✅ Laagdrempelig (ook voor mensen met beperkte smartphone-ervaring)

| Key | Value |
| --- | --- |
| Cross | platform: iOS EN Android (React Native) |
| Design moet werken binnen React Native component | beperkingen |
| Gebruik universele UI | patterns (geen platform-specifieke elementen) |

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes (incl. toegankelijkheid)
- Validatie-vragen voor gebruikerstests (inclusief voor diverse doelgroepen)

- Privacy-bewuste gebruikers

Willen geen bankkoppeling
Technisch vaardig (25-45 jaar)
- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)
- Mensen met onregelmatig inkomen

| Freelancers | ZZP'ers | wisselende inkomsten |
| --- | --- | --- |
| - Freelancers | ZZP'ers | wisselende inkomsten |

| Beperkt budget | elke euro telt |
| --- | --- |
| - Beperkt budget | elke euro telt |

55-75+ jaar
Mogelijk beperkte digitale vaardigheden
Waarde autonomie en controle
Kunnen visuele beperkingen hebben
- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben
- Jongeren die leren budgetteren ⚠️ NIEUW

| Studenten | starters op arbeidsmarkt |
| --- | --- |
| - Studenten | starters op arbeidsmarkt |

- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)

- Freelancers, ZZP'ers, wisselende inkomsten
- Veel contant geld
- 25-55 jaar

- Beperkt budget, elke euro telt
- Kunnen stress/angst ervaren bij financiën
- Alle leeftijden (18-65+)
- Mogelijk lager opleidingsniveau

- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben

- 18-25 jaar
- Eerste keer zelfstandig financiën beheren
- Studenten, starters op arbeidsmarkt

| Key | Value |
| --- | --- |
| ❌ VERMIJD | Schuld-inducerende taal ("Je hebt te veel uitgegeven", rode waarschuwingen) |
| ✅ GEBRUIK | Neutrale, helpende taal ("Nog €50 beschikbaar deze week", "Budget bijna bereikt") |
| ✅ FOCUS | Op wat WEL kan, niet wat NIET kan |

- ✅ Grote tekst (minimaal 16px body text)
- ✅ Grote touch targets (minimaal 44x44px)
- ✅ Duidelijke labels (geen iconen zonder tekst)
- ✅ Eenvoudige navigatie (max 3 niveaus diep)
- ✅ Bevestigingen bij belangrijke acties

- ✅ Hoog contrast (WCAG AA minimaal, AAA ideaal)
- ✅ Kleur is NIET de enige informatie-drager (iconen + tekst)
- ✅ Screen reader support (semantische labels)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Inclusief & empathisch - geen stigmatisering | begrijp financiële stress |
| --- | --- |
| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| - ✅ Eenvoud boven volledigheid (geen feature-overload | ook voor beginners) |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |
| - ✅ Snelle onboarding (binnen 5 minuten productief | ook voor ouderen) |

| Key | Value |
| --- | --- |
| Handmatige Invoer (Default | laagste drempel) |
| Velden (in deze volgorde | logische flow): |

Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

Bedrag (numeriek keyboard, EUR symbool, groot invoerveld)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

Categorie (dropdown met iconen + tekst)

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

Wanneer? (datepicker, default: vandaag)

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| Key | Value |
| --- | --- |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

CTA:

| "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- Rekening (dropdown: Bankrekening, Cash, Spaarrekening)
- Notitie (optioneel tekstveld, placeholder: "Bijv. 'Albert Heijn'")
- "Opslaan" button (prominent, groot - min 44px hoog)
- ⚠️ Toegankelijkheid: Duidelijk contrast, loading state bij tap
- CSV Import (Optioneel - voor gevorderde gebruikers)
Flow:

Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

Stap 2: Upload-zone

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

Stap 3: Preview (tabel van eerste 3 transacties)

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

Waarschuwing (duidelijk zichtbaar):

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

CTA:

"Importeer [X] transacties" button (groot, duidelijk)
Annuleren-optie (evengroot, secondary style)
- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

- ⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| - "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- ⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

| - "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| - Annuleren-optie (evengroot | secondary style) |

| Key | Value |
| --- | --- |
| Toon subtiel | "🔒 Blijft op jouw apparaat" (klein, onder CTA) |
| NIET | "Je data is veilig bij ons" (suggereert cloud-opslag) |

| - Tekst grootte: Minimaal 16px body | 18px voor invoervelden |
| --- | --- |
| - Kleur contrast: Minimaal 4.5:1 voor tekst | 3:1 voor UI-elementen |
| - Error messages: Duidelijk | helpend (niet "Ongeldige invoer" maar "Vul een bedrag in") |

| Key | Value |
| --- | --- |
| Handmatige invoer | Max 5 taps/inputs (Type → Bedrag → Categorie → Opslaan, rest heeft defaults) |
| CSV import | Max 3 stappen (Bank → Upload → Bevestig) |

| - Validatie: Bedrag niet 0/negatief | datum niet ver in toekomst |
| --- | --- |
| - Maar: Zacht valideren - geen rode errors | wel helpers ("Bedrag moet meer dan €0 zijn") |

| Key | Value |
| --- | --- |
| Bevestiging na opslaan | "✓ Transactie toegevoegd" (toast, verdwijnt na 2 sec) |
| Bij import | "✓ [X] transacties geïmporteerd" + optie om te bekijken |

| Key | Value |
| --- | --- |
| Bij negatief saldo | NIET "Je gaat over budget!" |
| WEL | "Let op: je hebt €50 minder dan gepland" (neutraal, informatief) |

- Welke modus is default?

| Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| CSV import moet duidelijk zijn | maar niet opdringerig |
| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

| Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |
| --- | --- |
| - Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |

| Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |
| --- | --- |
| - Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |

| Advies: Footer van scherm | klein maar leesbaar |
| --- | --- |
| - Advies: Footer van scherm | klein maar leesbaar |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

- Advies: Tabs boven (universeel pattern, werkt op iOS + Android)
- Vermijd hamburger menu (niet toegankelijk voor ouderen)

| Key | Value |
| --- | --- |
| Advies | Iconen + kleur + labels (➖🔴 Uitgave, ➕🟢 Inkomst) |
| NIET | Alleen kleur (kleurenblindheid) |

| Key | Value |
| --- | --- |
| Advies | Footer van scherm, klein maar leesbaar |
| Optioneel | ℹ️ info-icoon met meer uitleg (opt-in) |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

- Hoofd-KPI (Hero Section) - HERZIEN voor Empathie
Optie A (Voor gebruikers met positief saldo):

"Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

| Key | Value |
| --- | --- |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

Optie B (Voor gebruikers met negatief saldo/schulden):

"Je tekort deze maand" (neutraal, niet beschuldigend)

Voorbeeld: "€ 127,80 tekort"

| Visueel: Progress ring (rood | maar met helper-tekst) |
| --- | --- |
| Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

Cruciale Toegankelijkheid:

Groot cijfer: Minimaal 28-32px font
Hoog contrast: Minimaal 7:1 (AAA rating)
Niet alleen kleur: Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!)
- "Nog beschikbaar deze maand" (groot, prominent)

Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
Voorbeeld: "€ 342,50"
- Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
- Voorbeeld: "€ 342,50"
- Visueel: Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort)
- Toon: "Je hebt nog goed ruimte" (positief, ondersteunend)
- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

| Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |
| - Quick stat: "47 transacties" (klein | onder maand) |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
X-as: Weken van de maand (Week 1, Week 2, etc.)
⚠️ Toegankelijkheid:

Labels BOVEN bars (niet binnen - leesbaar op klein scherm)
Minimaal 12px font voor as-labels
Hoog contrast bars (#00A86B groen, #DC143C rood - colorblind safe)
- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Layout: Icoon | Naam | Bedrag | Progress bar |
| --- | --- | --- | --- |
| - Layout: Icoon | Naam | Bedrag | Progress bar |

- "Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

- Voorbeeld: "€ 127,80 tekort"

| Key | Value |
| --- | --- |
| Groot cijfer | Minimaal 28-32px font |
| Hoog contrast | Minimaal 7:1 (AAA rating) |
| Niet alleen kleur | Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!) |

| - Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Key | Value |
| --- | --- |
| Labels BOVEN bars (niet binnen | leesbaar op klein scherm) |
| Minimaal 12px font voor as | labels |
| Hoog contrast bars (#00A86B groen, #DC143C rood | colorblind safe) |

- Layout: Icoon | Naam | Bedrag | Progress bar
- Voorbeeld:

- Kleurlogica (HERZIEN):

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |

100%: Rood + helper ("€20 meer dan gepland")
- 0-70%: Groen (ruimte over)
- 71-90%: Geel (bijna op)
- 91-100%: Oranje (budget bereikt)
- 100%: Rood + helper ("€20 meer dan gepland")
- ⚠️ Toegankelijkheid:

Icoon + tekst (niet alleen icoon)
Progress bar + percentage (niet alleen bar)
Minimaal 16px font voor categorie-namen
48px hoog per rij (makkelijk tappen)
- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)
- ⚠️ Empathie:

| WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |
| --- | --- |
| - WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |
| 100% | Rood + helper ("€20 meer dan gepland") |

- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)

| Key | Value |
| --- | --- |
| NIET | "Budget overschreden! ⛔" |
| WEL | "€20 meer uitgegeven dan gepland" (neutraal, feitelijk) |

- Quick Actions (Bottom Bar - React Native Safe Area)
Layout: Bottom Navigation (3-4 items, universeel pattern)
Items:

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

⚠️ Toegankelijkheid:

| Icoon + label (altijd beide | niet alleen icoon) |
| --- | --- |
| - Icoon + label (altijd beide | niet alleen icoon) |

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

- Icoon + label (altijd beide, niet alleen icoon)
- Minimaal 56px hoog (React Native safe area)
- Haptic feedback bij tap (Android + iOS)
- Duidelijke active state (kleur + onderstreping)

| Key | Value |
| --- | --- |
| Belangrijkste info bovenaan | "Nog beschikbaar" of "Tekort" |
| Scannability | Max 5 seconden om hoofdvraag te beantwoorden |
| Progressive disclosure | Details (categorieën) komen daarna |

- Kleurpsychologie - empathisch:

| Groen = positief | ruimte | controle |
| --- | --- | --- |
| Geel = attentie | bijna op | let op |
| - Groen = positief | ruimte | controle |
| - Geel = attentie | bijna op | let op |

✅ "Nog over", "beschikbaar", "meer uitgegeven"
❌ "Schuld", "overschrijding", "fout", "probleem"
- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Groen = positief | ruimte | controle |
| --- | --- | --- |
| - Geel = attentie | bijna op | let op |

- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Tekst grootte: Min 16px body | 28-32px voor hoofd-KPI |
| --- | --- |
| - Screen reader: Semantische HTML | alt-texts voor grafieken |

| Key | Value |
| --- | --- |
| Subtle indicator | Klein 🔒 icoon in app header (altijd zichtbaar) |
| Geen sync | icoon (suggereert cloud) |

- Geen verborgen navigatie (hamburger menu)
- Duidelijke labels (niet alleen iconen)
- Grote touch areas (vermijd accidental taps)
- Confirmatie bij belangrijke acties ("Weet je zeker dat je...")

- Geen alarmbells (❌ "URGENT: Budget overschreden!")
- Wel actionable helpers (✅ "Bekijk waar je kunt besparen")
- Focus op controle (niet op falen)

- Hoe presenteer je "Tekort" zonder stigma?

| Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |
| --- | --- | --- |
| - Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |

| Advies: Vertical bar chart (simpelste | meest universeel) |
| --- | --- |
| - Advies: Vertical bar chart (simpelste | meest universeel) |

Advies: Meer white space voor toegankelijkheid (ook ouderen)
Max 3-4 data-punten per sectie
- Advies: Meer white space voor toegankelijkheid (ook ouderen)
- Max 3-4 data-punten per sectie
- Waar plaats je Quick Actions?

| Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |
| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- Advies: Neutraal icoon (⚠️ niet ⛔), helpende tekst, focus op oplossing

| Key | Value |
| --- | --- |
| Advies | Vertical bar chart (simpelste, meest universeel) |
| Alternatief | Line chart (voor trends over weken) |
| VERMIJD | Pie charts (moeilijk te lezen op klein scherm) |

| Key | Value |
| --- | --- |
| Advies | Meer white space voor toegankelijkheid (ook ouderen) |
| Max 3 | 4 data-punten per sectie |

| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- ⚠️ HERZIEN: iOS EN Android (React Native)
- Design voor:

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| Orientatie | Portrait (staand) - primair |
| Dark mode | Moet ondersteund worden (React Native native support) |

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |

- ✅ Bottom Tab Navigation (werkt native op beide platforms)
- ✅ Modal sheets (React Native's Modal component)
- ✅ Standard buttons (TouchableOpacity/Pressable)
- ✅ TextInput (native keyboard support)
- ❌ VERMIJD: Platform-specific gestures (3D Touch, force touch)
- ❌ VERMIJD: Custom native components (te complex voor MVP)

| Key | Value |
| --- | --- |
| iOS | Notch + home indicator (gebruik SafeAreaView) |
| Android | Status bar + navigation bar |
| Bottom navigation | Min 56px hoog + safe area insets |

| Key | Value |
| --- | --- |
| ✅ Kleurcontrast | Min 4.5:1 voor normale tekst, 3:1 voor grote tekst (>18px) |
| ✅ Touch targets | Min 44x44px (iOS) / 48x48dp (Android) |
| ✅ Tekst resize | Tot 200% zonder content loss |
| ✅ Focus indicators | Duidelijk zichtbaar (min 2px border) |

- ✅ Kleurcontrast: Min 7:1 voor normale tekst
- ✅ Touch targets: Min 48x48px overal
- ✅ Geen animaties >3 seconden (optie om uit te zetten)

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Annoteer | Lettergroottes, touch target sizes, kleurcontrasten |
| Niet nodig | Hi-fi mockups, animaties, micro-interactions (komt later) |

- Figma (preferred - collaborative review + React Native plugins)
- Sketch + React Native plugin
- Adobe XD
- Balsamiq
- Of pen & papier gescand

- React Native Design System
- Accessibility Checker (Stark)
- Contrast (voor WCAG checks)

- Tap/click areas (met minimale sizes: 44px/48dp)
- Tekst sizes (minimaal 16px voor body)
- Kleurcontrasten (bijv. "#333 op #FFF = 12.6:1 ✓")
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale SQLite database")
- Edge cases:

Wat als geen transacties deze maand?
Wat als gebruiker negatief saldo heeft?
Wat als ouderen de CSV-import niet begrijpen?
- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?
- Toegankelijkheid notes (bijv. "Alt-text voor grafiek: 'Bar chart met inkomsten €1200 en uitgaven €857'")

- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?

- "Wat zou je doen om bij te houden dat je €15 hebt uitgegeven aan boodschappen?" (task-based)
- "Waar zou je klikken om een uitgave toe te voegen?" (navigatie)
- "Wat gebeurt er als je op 'CSV Import' klikt?" (begrip)

- "Wat vertelt dit scherm jou over jouw financiële situatie?" (comprehensie)
- "Hoeveel heb je nog over deze maand?" (scannability - moet binnen 5 sec antwoord hebben)
- "Waar kijk je als eerste naar?" (visuele hiërarchie)

- Wireframe 1: INVOER-scherm

[
- [

- [

- CSV import versie (optioneel, met hulp)
- Annotaties: touch targets (min 44/48px), lettergroottes (min 16px), contrasten
- Toegankelijkheid notes: WCAG-checks, screen reader labels, color-blind safe
- Wireframe 2: DASHBOARD-scherm

 Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
 Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
 Budget per Categorie lijst (icoon + tekst, progress bar + %)
 Quick Actions (bottom navigation, 3-4 items)
 Annotaties: data-sources, edge cases, toegankelijkheid
 Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Design Rationale document (2-3 pagina's)

| Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| --- | --- |
| - Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| - Gebruikerstest Script (Concept | 3-4 pagina's) |

 5-7 validatievragen per scherm
 Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |

 2-3 task-based scenarios (bijv. "Voeg een uitgave toe")
- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?

- Layout keuzes uitgelegd
- UX-patterns toegelicht
- Toegankelijkheidsstrategie (WCAG AA/AAA compliance)
- Empathie & inclusiviteit (taalgebruik, kleurpsychologie)
- Privacy-signalering strategie
- React Native overwegingen (cross-platform patterns)

- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| - Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF (met annotaties leesbaar) |
| Documenten | Markdown of PDF |
| Toegankelijkheid audit | Gebruik Figma plugin "Stark" of "Contrast" voor WCAG-checks |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 3-4 uur (incl. toegankelijkheids-annotaties) |
| Wireframe 2 (Dashboard) | 3-4 uur (incl. diverse scenario's: positief/negatief saldo) |
| Documentatie (rationale + empathie) | 2-3 uur |
| Gebruikerstest script (inclusief diverse doelgroepen) | 1-2 uur |
| Totaal | 9-13 uur (~1.5-2 werkdagen) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)
- WCAG 2.1 Guidelines - https://www.w3.org/WAI/WCAG21/quickref/ (voor toegankelijkheidsreferentie)

| - Microsoft Outlook Mobile - grote touch targets | duidelijke navigatie |
| --- | --- |
| - Google Keep - simpele UI | geschikt voor alle leeftijden |

| Key | Value |
| --- | --- |
| Qapital (US) | positieve framing van sparen |
| Emma (UK) | geen stigmatiserende taal bij overschrijding |
| ❌ NIET Mint | té complex, overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Spendle (NL) | goede privacy-communicatie |
| Standard Notes | duidelijke lokale/versleutelde data-indicatoren |

| Key | Value |
| --- | --- |
| ❌ Kleine tekst (<16px) | onleesbaar voor ouderen |
| ❌ Kleine touch targets (<44px) | moeilijk tappen |
| ❌ Alleen kleur voor informatie | kleurenblindheid |
| ❌ Negatieve taal bij budget | overschrijding - stigmatiserend |
| ❌ Complexe grafieken (pie charts, multi | line) - overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor toegankelijkheidsvragen | [Accessibility Lead naam, of externe consultant] |
| Voor React Native constraints | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | 2: Quick call (20 min) - vragen over briefing + toegankelijkheidseisen |
| 50% milestone | Review schetsen (45 min) - valideer richting + toegankelijkheid |

| Check: WCAG AA contrasten | touch target sizes | empathische taal |
| --- | --- | --- |
| - Check: WCAG AA contrasten | touch target sizes | empathische taal |

- Check: WCAG AA contrasten, touch target sizes, empathische taal

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Handmatige invoer flow is binnen 5 taps/clicks te voltooien (ook voor ouderen)
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 5 seconden scannen

- WCAG 2.1 AA minimaal voldaan:

| Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |
| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

- Geen stigmatiserende taal (✓ "tekort" ipv ✗ "schuld")
- Positief/neutraal framing bij negatieve situaties
- Helpende actionables bij waarschuwingen (niet alleen alarm)

| Key | Value |
| --- | --- |
| Privacy | first aanpak is subtiel maar zichtbaar in design |
| Geen cloud/sync | iconen (communiceert lokale opslag) |

- Design werkt binnen React Native constraints
- Geen platform-specific patterns (werkt op iOS + Android)
- Safe areas gemarkeerd (notch, home indicator, status bar)

- Design rationale legt keuzes uit (incl. toegankelijkheid + empathie)
- Gebruikerstest script is klaar voor validatie met diverse doelgroepen
- Annotaties zijn compleet (sizes, contrasten, edge cases)

- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests
- Toegankelijkheidsaudit is gedaan (via Figma plugin of handmatig)

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ 0 critical usability issues (blockers voor MVP)

- ✅ ≥90% ouderen (55+) kan handmatige invoer voltooien
- ✅ ≥80% gebruikers met lage digitale vaardigheden begrijpt hoofdscherm
- ✅ ≥95% gebruikers kan tekst lezen (geen klachten over te kleine letters)
- ✅ ≥90% gebruikers kan knoppen makkelijk tappen (geen mistaps)

- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ ≥80% gebruikers met schulden/financiële stress voelt zich NIET veroordeeld door de app
- ✅ ≥70% gebruikers vindt de taal begrijpelijk en ondersteunend (niet jargon/technisch)

- ✅ Geen visuele/interactie-verschillen tussen iOS en Android testgebruikers

- Complexiteit te versimpelen

| CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| Financiële data kan overweldigend zijn | maar moet scanbaar blijven |
| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

| Niet alleen zeggen | maar laten zien |
| --- | --- |
| - Niet alleen zeggen | maar laten zien |

| Ondersteunende taal | niet veroordelend |
| --- | --- |
| Focus op controle en mogelijkheden | niet op falen |
| - Ondersteunende taal | niet veroordelend |
| - Focus op controle en mogelijkheden | niet op falen |

| Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |
| - Grote tekst | grote knoppen | hoog contrast |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

Werkt identiek goed op iOS en Android
Binnen React Native constraints
- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

- Niet alleen zeggen, maar laten zien
- Zonder opdringerig te zijn

| - Ondersteunende taal | niet veroordelend |
| --- | --- |
| - Focus op controle en mogelijkheden | niet op falen |

| - Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

- ✅ Akkoord met scope & deliverables (incl. toegankelijkheidseisen)
- 📅 Verwachte opleveringsdatum (hou rekening met 1.5-2 werkdagen)
- ❓ Eventuele vragen of onduidelijkheden
- 🛠️ Welke tool ga je gebruiken? (Figma aanbevolen voor WCAG-plugins)
- 🧪 Heb je toegang tot Figma accessibility plugins? (Stark, Contrast)

- ✅ GO - Start opdracht
- ⚠️ REVISE - Aanpassingen nodig (specificeer hieronder):
- 
-

- 
-

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drabobank.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dopleidingscentrum.eu&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dspreadsheet-shop.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dstamrechtingenieur.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dabnamro.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbankingtools.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddanielhaitink.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dclearvault.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

### rapportage_totaal.docx

## Beslissingsmatrix: MVP Feature Prioritering

## Toelichting per Feature

### Feature A: PIN/Biometrie (Aanbeveling: GO)

### Feature B: Historische Bulk CSV-Import (Aanbeveling: MVP+)

## Conclusie & Aanbeveling aan Lead

### Naamloos document.docx

## 📋 Definitieve MVP Feature List - Project Minimal Cashflow

### ✅ Kern-Features (MUST HAVE - GO voor MVP)

### ⚠️ CSV-Import: Gefaseerde Aanpak (Risicomitigatie)

### ❌ Uitgesteld naar MVP+ (STOP voor nu)

## 🎯 MVP Definitie Samenvatting

### Scope Statement:

### UVP Validatie:

### Total Effort Estimate:

## 🚦 Beslissingsvraag aan Lead (Manasse)

## 🏦 CSV-Structuuranalyse: Top 6 Nederlandse Banken

### 📊 Bevindingen uit Onderzoek

### 🔍 CSV-Structuur per Bank

#### 1. ING Bank

#### 2. Rabobank

#### 3. ABN AMRO

#### 4. Bunq

#### 5. Knab

#### 6. SNS Bank (Volksbank: SNS, ASN, RegioBank)

### n8n Node-by-Node Implementatie

#### Node 1: File Upload (HTTP Webhook of Binary Input)

#### Node 2: Bank Detection (Function Node)

#### Node 3: Parse & Clean (Switch Node → Bank-Specific Parsers)

#### Node 4: Map to Unified Data Model (Function Node)

#### Node 5: Validate & Dedupe (Function Node)

#### Node 6: Output (HTTP Response / Database Insert)

## 🚨 Max Limiet voor Historische Bulk Data

### ✅ Aanbevolen Limiet: 3 Maanden (90 Dagen)

## 📋 Implementatie Roadmap

### MVP 1.0: Gefaseerde Aanpak

## ✅ Voordelen van Deze Aanpak

## 🚦 Vraag aan Jou (Goedkeuring)

# 🔄 Heroverweging: MVP-Scope Prioritering met CSV-Onderzoek

## 📊 Beslissingsmatrix: MVP Feature Prioritering (Versie 2.0)

## 🔍 Gedetailleerde Heroverweging Feature B

### ❌ Oorspronkelijke Analyse (Versie 1.0)

### ✅ Nieuwe Analyse (Versie 2.0 - Na CSV-Onderzoek)

### 1️⃣ UVP-Fit Score: 3 → 4 (+1 punt)

### 2️⃣ Vertrouwen Score: 2 → 4 (+2 punten)

### 3️⃣ Complexity/Effort: S → M-L (Verhoogd, maar acceptabel)

## 🎯 Strategische Implicaties

### Wat verandert er in MVP 1.0 Scope?

### Waarom deze heroverweeging strategisch cruciaal is:

## 📋 Bijgewerkte MVP 1.0 Scope

### ✅ Definitieve Feature List:

## 🚦 Aanbeveling aan Lead

## ❓ Vraag aan Jou (Goedkeuring Vereist)

# 📊 Audit: Voldoen We Aan Stap 2 Doelstellingen?

## ✅ Checklist: Vereiste Outputs voor Stap 2

## 🔍 Gedetailleerde Analyse per Output

### Output 1: Concept UVP (één duidelijke zin)

### Output 2: Definitieve Minimale Scope (3 Kernfuncties)

### Output 3: Formeel GO/STOP Keuzemoment

## 🔧 Correctieplan: Hoe We Dit Oplossen

### Actie 1: Consolideer UVP tot Eén Definitieve Zin

### Actie 2: Herstructureer Scope naar 3 Kernfuncties

### Actie 3: Formeel GO/STOP Beslissingskader

## 📋 Finale Deliverable: Gecorrigeerde Output voor Stap 2

### 1. Concept UVP (Definitief)

### 2. Definitieve Minimale Scope (3 Kernfuncties)

### 3. Formeel GO/STOP Keuzemoment

## ✅ Herziene Antwoord op Jouw Vraag

## 🚦 Actie Vereist van Jou (Lead)

# 📐 Opdracht voor David - UX/UI Designer (Consult)

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (Primair)

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden

### Platform

### Design Fidelity

### Tools (Keuze David)

### Annotaties

## 🧪 Validatie-ondersteuning

### 1. Gebruikerstest Script (Concept)

### 2. Design Rationale (Korte toelichting)

## 📦 Deliverables Checklist

## ⏱️ Tijdsinschatting & Prioriteit

## 🔗 Relevante Documentatie

## 💬 Communicatie & Vragen

## ✅ Acceptatiecriteria (Wat is "Done"?)

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?)

## 📝 Slot: Waarom Dit Belangrijk Is

## ✍️ Akkoord & Kickoff

# 📐 Opdracht voor David - UX/UI Designer (Consult) [HERZIENE VERSIE]

## 🔄 Belangrijke Herziene Punten

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (HERZIEN - Breed & Inclusief)

### Cruciale Toegankelijkheids-overwegingen

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes (HERZIEN)

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden (HERZIEN)

### Platform

### React Native Component Constraints

### Toegankelijkheids-specificaties (WCAG 2.1)

### Design Fidelity

### Tools (Keuze David)

### Annotaties (MUST HAVE)

## 🧪 Validatie-ondersteuning (HERZIEN)

### 1. Gebruikerstest Script (Concept) - Inclusief voor Diverse Doelgroepen

#### Voor INVOER-scherm:

#### Voor DASHBOARD-scherm:

### 2. Design Rationale (Korte toelichting) - HERZIEN

## 📦 Deliverables Checklist (HERZIEN)

## ⏱️ Tijdsinschatting & Prioriteit (HERZIEN)

## 🔗 Relevante Documentatie (HERZIEN)

## 💬 Communicatie & Vragen (HERZIEN)

## ✅ Acceptatiecriteria (Wat is "Done"?) - HERZIEN

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?) - HERZIEN

## 📝 Slot: Waarom Dit Belangrijk Is (HERZIEN)

## ✍️ Akkoord & Kickoff (HERZIEN)

## 📎 Bijlage: Quick Reference - Toegankelijkheidseisen

> "Als de import faalt (bijv. verkeerde categorisatie, missende transacties, of crashende import), ondermijnt dit direct onze Unique Value Proposition (UVP) van 'Privacy-first & Controle'. Het faalt in het leveren van het beloofde gemak van automatisch inlezen én veroorzaakt frustratie, wat leidt tot afhaken van gebruikers bij de eerste essentiële actie."

> "Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard)."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Dashboard: Koos voor cirkel-progress ipv bar omdat dit visueel compacter is en emotioneel minder 'judgmental' aanvoelt. Gebruikers zien ratio vs absoluut getal."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

667 linesdocxVraag 2: Elias - MVP-Scope Prioritering
Target AI: claude
Uw Geoptimaliseerde Prompt:
PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP).
 
CONTEXT:
Lees bijgevoegd rapport
1.  [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516].
2.  **Te Prioriteren Features (Optioneel):**
    * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524].
    * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525].
 
TAAK:
Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP).
 
CRITERIA VOOR AFWEGING:
1.  **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst).
2.  **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5).
3.  **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1).
 
OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel):
Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025Ik ga de beslissingsmatrix genereren voor de twee optionele features, gebaseerd op de context uit het rapport en de drie opgegeven criteria.

Waarom GO voor MVP:

Risico bij weglaten: App wordt niet serieus genomen als privacy-tool, reputatieschade, gebruikers haken af voordat ze beginnen.

Waarom MVP+ (uitstellen):

Wanneer wel toevoegen (MVP+):

| Key | Value |
| --- | --- |
| Motivatie | De MVP moet 'Minimal' blijven. Feature A is een fundamentele voorwaarde voor de privacy-belofte. Feature B is waardevol maar niet kritisch – gebruikers kunnen vanaf vandaag beginnen tracken. Houd de scope scherp en valideer eerst de kernfunctionaliteit voordat je optimaliseert voor migratie van oude data. |
| Volgende stap | Als je akkoord gaat met deze prioritering, kan ik een definitieve MVP Feature List opstellen met alle GO-features gerangschikt op implementatievolgorde.63 linesdocxneem dit document mee in jouw overwegingen voor het samenstellen van de definitieve mvp; vraag daarna om mijn goedkeuring2 dec 2025Ik heb beide documenten nu geanalyseerd. Het tweede document voegt een kritische risicoanalyse toe over de CSV-parser die impact heeft op de MVP-scope. Laat me de definitieve MVP samenstellen met deze nieuwe inzichten. |

KRITISCH INZICHT uit Document 2:
CSV-headers/formaten verschillen per bank, wat leidt tot risico van onbetrouwbare data-import. Dit ondermijnt direct de UVP als het faalt.
Gefaseerde implementatie (MVP → MVP+):

Mitigerende Acties (voor MVP 1.1):

Strategische Redenering:

"Een werkende, beveiligde app die handmatige invoer en basis CSV-import ondersteunt, met categorisering, budgettering en cashflow-overzicht. Data blijft privé en lokaal. Gebruikers kunnen direct beginnen met tracken."

Ik adviseer de volgende scope voor MVP 1.0:

Voordelen van deze aanpak:

Vraag aan jou:

Laat me weten of je goedkeuring geeft, of dat je aanpassingen wilt voordat we deze scope formaliseren.Kunnen we onderzoeken hoe de 6 grootste banken in NL hun csv samenstellen en bedenken hoe een n8n workflow het 'lezen' en verwerken van de data kan aanpakken? Én een max stellen aan de upload van historisch bulk data? Bijvoorbeeld max 3 maanden terug?2 dec 2025Uitstekende pragmatische aanpak! Dit combineert het beste van beide werelden: robuuste bank-support vanaf dag 1, maar met duidelijke scope-begrenzing. Laat me dit onderzoeken.2 stepsRabobank ABN AMRO CSV export kolommen velden structuur10 resultsInformatie over bestandsformaten Rabo Business Banking Professional - Rabobankrabobank.nlEn weer een bank erbij in de spreadsheet – Geldnerd.nlgeldnerd.nlMicrosoft Excel - Rabobank bankrekening transacties download omzetten naar Excelopleidingscentrum.euBanktransacties downloaden doe je zo! Alle Nederlandse banken – Spreadsheet Shopspreadsheet-shop.nlDownloadinstructies Bankmutatiesstamrechtingenieur.nlExporteren naar je boekhoudprogramma - Internetbankieren - ABN AMROabnamro.nlMeestgestelde vragen | BankingToolsbankingtools.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlGitHub - ToonvdPas/rabobank-csv-conversie: Conversie-tool om een CSV-download van de Rabobank te converteren, rubriceren en organiseren voor gebruik in een spreadsheet.github.comFinanciën op orde (2): Inkomsten en Uitgaven in beeld – Geldnerd.nlgeldnerd.nlbunq knab SNS CSV export format kolommen structuur10 resultsList of supported bank and online payment providers export formats : Yuki Support Nederlandyuki.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlYNAB Going Dutchdanielhaitink.nlHow do I create a CSV export - bunq Togetherbunq.comCashflow online software csv export - bunq Togetherbunq.comExport a set of payments - bunq Togetherbunq.comExport rekening overzicht - bunq Togetherbunq.comKnab bank export files : Yuki Support Nederlandyuki.nlPDF to MT940, CAMT.053 & CSV Converter | Bankafschriften + Creditcard Omzettenclearvault.nlExport statements with filter/search/selection - bunq Togetherbunq.comPerfect! Ik heb nu voldoende informatie verzameld. Laat me een uitgebreid overzicht maken van de CSV-structuren van de 6 grootste Nederlandse banken en een n8n workflow-strategie opstellen.

Belangrijkste Inzichten:

Hieronder een reconstructie gebaseerd op de onderzoeksbronnen:

Huidige structuur (na augustus 2020):
csv
Kenmerken:

Uitdagingen:

Uitgebreide CSV-structuur:
csv
Kenmerken:

Voordeel:

Beperkte TXT/CSV-structuur:
txt
Kenmerken:

Uitdaging:

CSV & JSON ondersteuning:

Geschatte structuur (veelvoorkomend bij neobanken):
csv

CSV-ondersteuning:

Vermoedelijke structuur (vergelijkbaar met andere moderne banken):
csv

CSV met IBAN:

Vermoedelijke structuur:
csv

javascript

Detectielogica gebaseerd op CSV-headers:
javascript

ING Parser (Function Node):
javascript
Rabobank Parser (Function Node):
javascript
ABN AMRO Parser (Function Node):
javascript

Unified Transaction Schema:
javascript

Duplicaat-detectie strategie:
javascript

Output JSON voor frontend:
javascript

Rationale:

Implementatie in n8n:
javascript

Wil je dat ik:

Of heb je aanpassingen:

| Key | Value |
| --- | --- |
| Laat me weten of je deze aanpak goedkeurt, dan werk ik de definitieve MVP | scope uit! 🚀Heroverweeg Vraag 2 Elias en gebruik al het bovenstaande CSV onderzoek als input. Vraag 2: Elias - MVP-Scope Prioritering Target AI: claude Uw Geoptimaliseerde Prompt: PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP). CONTEXT: Lees bijgevoegd rapport 1. [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516]. 2. **Te Prioriteren Features (Optioneel):** * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524]. * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525]. TAAK: Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP). CRITERIA VOOR AFWEGING: 1. **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst). 2. **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5). 3. **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1). OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel): Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025 |
| Als Lyra, Beslissingsmatrix Generator | geüpdatet met CSV-structuurinzichten |

Conclusie: MVP+ (uitstellen)
Rationale:

Conclusie: GO voor MVP 1.0
Rationale:

Waarom deze stijging?
Het CSV-onderzoek onthult dat bankvariatie substantieel maar beheersbaar is:

Cruciale inzichten:

Conclusie: CSV-import is niet "nice-to-have" maar essentieel voor differentiatie. Zonder goede import-ervaring valt de kern-USP weg: "Privacy zonder bankkoppeling, maar toch gemak".

Waarom deze stijging?
Het rapport waarschuwt expliciet voor "onbetrouwbare data-import" als kritiek risico:

Risico-analyse:

Conclusie: Een half-werkende CSV-import is slechter dan geen import. Gebruikers die hun eerste import proberen en falen, verliezen direct vertrouwen. Bank-presets (ING/Rabobank/ABN) met robuuste validatie zijn vertrouwen-kritiek.

Effort Breakdown:

Vergelijking met oorspronkelijke schatting:

Is deze effort-investering gerechtvaardigd?
✅ JA, om volgende redenen:

Total MVP 1.0 Effort:

Herziene beslissing:

Trade-off:

Alternatief (indien tijd kritiek is):

Keuze:

Welke optie kies je?
Mijn strategische advies: Optie A. De extra investering (2-3 weken) levert een veel sterker product op dat de kern-UVP waarmaakt. Zonder robuuste CSV-import riskeren we dat gebruikers afhaken bij hun eerste kritieke actie.Voldoen we aan deze doelstellingen? 
Stap 2: De Kern: Bepaling van de UVP (Onder leiding van Elias)
 * Input: De goedgekeurde Concurrentie-matrix en Doelgroep Hypothese (uit Stap 1).
 * Activiteit: Formulering van de kernboodschap die de gaten in de markt vult. Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard).
 * Output Vereisten:
   * De Concept UVP (één duidelijke zin).
   * De Definitieve Minimale Scope (3 Kernfuncties) die de UVP ondersteunen.
 * Definitief Keuzemoment voor de Lead: Formele GO/STOP op de Concept UVP en de Minimale Scope.2 dec 2025
Systematische controle van outputvereisten

Status: ⚠️ GEDEELTELIJK VOLDAAN
Wat we hebben (verspreid door documentatie):

Probleem:

Status: ❌ NIET VOLDAAN
Wat gevraagd werd:

Wat we leverden:
7 features in MVP 1.0:

Probleem:

Status: ❌ NIET VOLDAAN
Wat we deden:

Wat ontbreekt:

Ik stel voor:
📌 DEFINITIEVE CONCEPT UVP (Versie 1.0):

Validatie tegen UVP-criteria:

Framework: Setup → Invoer → Dashboard

Mapping van 7 features naar 3 kernfuncties:

Result:

Framework voor Lead-beslissing:

📌 Kernboodschap:

Validatie:

Technische mapping:

Status: ⏳ WACHTEND OP LEAD-BESLISSING
Vereiste actie van Lead (Manasse):
Vul het bovenstaande beslissingskader in en geef expliciet aan:

"Voldoen we aan deze doelstellingen?"

OVERALL:

Om Stap 2 formeel af te ronden, heb ik nodig:

| Zodra ik dit heb | is Stap 2 formeel afgerond en kunnen we door naar Stap 3 (Wireframes & User Flows). 🚀 |
| --- | --- |
| Wat is jouw beslissing?Schrijf de opdracht voor David | onze UX/UI Designer (Consult). Hij levert ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie2 dec 2025 |
| Fase: Fase 1 | Stap 3 - Wireframes & User Flows |

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voordat we investeren in volledige development. Focus op gebruiksvriendelijkheid, privacy-gevoel en snelheid van begrip.
Deliverables:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 3 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden):

Gebruik de tool die je het snelst laat werken:

Voeg bij wireframes korte notities toe:

Naast de wireframes, lever ook:

Stel 3-5 vragen op die we kunnen stellen tijdens validatie:
Voorbeeld vragen:

Leg per scherm kort uit (3-5 bullets):

Voorbeeld:

David levert op:

Formaat:

Geschatte effort:

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 3-5 werkdagen] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):

Anti-patterns (vermijden):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:

Na gebruikerstests (Stap 4) verwachten we:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP. Als gebruikers hier niet doorheen komen, faalt het hele product. We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Laat zien waarom eenvoud zo krachtig is! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze opdracht te geven?

Succes David! We kijken uit naar je werk. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Teamtwee opmerkingen (revisie) 1) We maken de app voor mensen die meer duidelijkheid en grip willen hebben op hun financiën. Dat kunnen ook mensen zijn in armoede of met schulden van jong tot oud. 
2) We maken de app voor zowel IOS als Android. Native React dus2 dec 2025
Project: Minimal Cashflow - Privacy-First Budget App
Fase: Fase 1, Stap 3 - Wireframes & User Flows
Opdrachtgever: Manasse (Lead) via Elias (Product Strategist)
Datum: [Vandaag]
Deadline: [Te bepalen door Lead]
Versie: 2.0 (Herzien na feedback)

⚠️ REVISIE 1 - Doelgroep Verbreding:
De app is bedoeld voor iedereen die duidelijkheid en grip wil op hun financiën, inclusief:

Impact op design:

⚠️ REVISIE 2 - Platform:

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voor diverse gebruikers (incl. mensen met schulden, ouderen, lage digitale vaardigheden) voordat we investeren in development.
Deliverables:

Primaire doelgroepen:

Locatie: Nederland (primair), EU (secundair)

Voor mensen in financiële stress:

Voor ouderen/lage digitale vaardigheden:

Voor mensen met visuele beperkingen:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

Privacy-signaal:

Toegankelijkheid - Kritieke punten:

Snelheid:

Foutpreventie:

Feedback:

Empathie voor financiële stress:

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 5 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden - logische prioriteit):

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

Informatiehiërarchie:

Emotionele Respons (KRITIEK):

Toegankelijkheid - Kritieke punten:

Privacy-signaal:

Voor ouderen/lage digitale vaardigheden:

Voor mensen in financiële stress:

⚠️ BELANGRIJK voor David:
Gebruik universele patterns die werken in React Native:

Safe Areas (React Native):

MUST HAVE (AA-rating):

NICE TO HAVE (AAA-rating):

Gebruik de tool die je het snelst laat werken:

Handige Figma plugins voor React Native:

Voeg bij wireframes toe:

Naast de wireframes, lever ook:

Stel 5-7 vragen op per scherm, inclusief specifieke vragen voor diverse gebruikers:

Algemeen (alle gebruikers):

Voor ouderen/lage digitale vaardigheden:
4. "Is het duidelijk wat je moet doen om te beginnen?" (onboarding)
5. "Zijn de knoppen groot genoeg om op te klikken?" (touch targets)
6. "Begrijp je wat 'CSV-bestand' betekent?" (jargon-check)
Voor mensen in financiële stress:
7. "Hoe voel je je als je een uitgave toevoegt die je budget overschrijdt?" (emotionele respons)

Algemeen:

Voor ouderen:
4. "Is de tekst groot genoeg om te lezen?" (lettergrootte)
5. "Zijn er dingen die je niet begrijpt?" (duidelijkheid)
Voor mensen met schulden:
6. "Als je een tekort hebt, voelt dit scherm dan beschuldigend of helpt het je?" (empathie-check)
7. "Wat zou je doen om je tekort te verminderen?" (actionability)
Privacy-perceptie (alle gebruikers):
8. "Waar denk je dat je gegevens worden opgeslagen?" (privacy-signalen effectiviteit)
9. "Voel je je comfortabel met het invoeren van je financiële data?" (vertrouwen)

Leg per scherm uit (5-7 bullets), inclusief toegankelijkheidskeuzes:
Template:

Voorbeeld (Dashboard):

David levert op:
Continue2 dec 2025x] Handmatige invoer versie (default, toegankelijk)

Formaat:

Geschatte effort (verhoogd vanwege toegankelijkheidseisen):

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 5-7 werkdagen, vanwege verhoogde complexiteit] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):
Voor toegankelijkheid:

Voor empathische financiële UX:

Voor privacy-signalering:

Anti-patterns (VERMIJDEN):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:
Functioneel:

Toegankelijkheid (KRITIEK):

Empathie & Inclusiviteit:

Privacy:

Cross-Platform:

Documentatie:

Goedkeuring:

Na gebruikerstests (Stap 4) verwachten we:
Algemene bruikbaarheid:

Toegankelijkheid (specifiek):

Empathie & Vertrouwen:

Cross-Platform:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes en toegankelijkheid zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP, en de toegankelijkheid en empathie zijn cruciaal. Als mensen in armoede, ouderen, of gebruikers met beperkte digitale vaardigheden hier niet doorheen komen, falen we in onze missie om iedereen grip te geven op hun financiën.
We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Dit is design met impact - het kan mensen helpen die echte financiële stress ervaren. Laat zien hoe krachtig empathisch, toegankelijk design kan zijn! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze herziene opdracht te geven?

Succes David! We kijken uit naar toegankelijk, empathisch design dat écht voor iedereen werkt. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Team

Print dit uit voor tijdens het ontwerpen:
Claude is AI and can make mistakes. Please double-check responses. Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

### rapportage_totaal.docx

667 linesdocx

---

**Claude:**

### rapportage_totaal.docx

667 lines

---

**Claude:**

docx

---

**User:**

Vraag 2: Elias - MVP-Scope Prioritering
Target AI: claude
Uw Geoptimaliseerde Prompt:
PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP).
 
CONTEXT:
Lees bijgevoegd rapport
1.  [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516].
2.  **Te Prioriteren Features (Optioneel):**
    * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524].
    * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525].
 
TAAK:
Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP).
 
CRITERIA VOOR AFWEGING:
1.  **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst).
2.  **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5).
3.  **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1).
 
OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel):
Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025

---

**Claude:**

2 dec 2025

---

**Claude:**

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | 10 | GO (MVP) | Privacy-first is een kernpijler van de UVP. Zonder basale toegangsbeveiliging is de privacy-belofte niet geloofwaardig. Financiële data op een onbeveiligde app ondermijnt het hele vertrouwensverhaal. Dit is een 'table stakes' feature voor elke finance app die privacy claimt. Lage complexiteit (standaard OS-functionaliteit), hoge impact op vertrouwen. |
| Feature B: Historische CSV-import (bulk) | 3 | 2 | 5 | MVP+ | Ondersteunt de UVP (flexibiliteit + privacy zonder bankkoppeling), maar is niet essentieel voor een werkende MVP. Gebruikers kunnen ook vanaf 'nu' beginnen met tracken. De feature voegt vooral gemak toe voor power users die hun volledige historie willen migreren. CSV-import is al onderdeel van MVP-scope, maar de bulkimport van historische data brengt extra complexiteit (duplicaatherkenning over langere periodes, data-cleaning van oude exports, performance bij grote datasets). Kan worden uitgesteld tot na validatie van basis-import functionaliteit. |

| Beslissing | Actie |
| --- | --- |
| Feature A (PIN/Biometrie) | ✅ Opnemen in MVP – niet-onderhandelbaar voor privacy-UVP |
| Feature B (Historische Import) | ⏸️ Uitstellen naar MVP+ – valideer eerst basis-functionaliteit |

- Privacy-first is expliciet onderdeel van de kern-UVP
- Gebruikers hebben privacyzorgen en willen data-controle bij finance apps
- Zonder toegangsbeveiliging is er geen geloofwaardige privacy-bescherming
- Technisch eenvoudig: standaard iOS/Android biometrie-API's
- Essentieel voor vertrouwen: gebruikers zullen niet hun financiële data invoeren in een onbeveiligde app
- Lage development effort, maar hoge perceptiewaarde

- Basis CSV-import staat al in MVP-scope – die volstaat voor lopende transacties
- Historische bulk-import is een nice-to-have voor migratie, niet essentieel voor werking
- Extra complexiteit:

| UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |
| --- | --- |
| - UX-uitdagingen: progressie-indicatoren | error handling bij grote bestanden |

- Duplicaatherkenning wordt complexer bij grote volumes
- Performance-optimalisatie nodig voor datasets van meerdere jaren
- Edge cases in oude CSV-formaten (banken veranderen hun export-structuur)
- UX-uitdagingen: progressie-indicatoren, error handling bij grote bestanden

- Na validatie dat gebruikers CSV-import daadwerkelijk gebruiken
- Wanneer er vraag is van early adopters om historie te migreren
- Na optimalisatie van parsing en duplicaat-detectie

## Beslissingsmatrix: MVP Feature Prioritering

## Toelichting per Feature

### Feature A: PIN/Biometrie (Aanbeveling: GO)

### Feature B: Historische Bulk CSV-Import (Aanbeveling: MVP+)

## Conclusie & Aanbeveling aan Lead

Ik ga de beslissingsmatrix genereren voor de twee optionele features, gebaseerd op de context uit het rapport en de drie opgegeven criteria.

Waarom GO voor MVP:

Risico bij weglaten: App wordt niet serieus genomen als privacy-tool, reputatieschade, gebruikers haken af voordat ze beginnen.

Waarom MVP+ (uitstellen):

Wanneer wel toevoegen (MVP+):

| Key | Value |
| --- | --- |
| Motivatie | De MVP moet 'Minimal' blijven. Feature A is een fundamentele voorwaarde voor de privacy-belofte. Feature B is waardevol maar niet kritisch – gebruikers kunnen vanaf vandaag beginnen tracken. Houd de scope scherp en valideer eerst de kernfunctionaliteit voordat je optimaliseert voor migratie van oude data. |
| Volgende stap | Als je akkoord gaat met deze prioritering, kan ik een definitieve MVP Feature List opstellen met alle GO-features gerangschikt op implementatievolgorde. |

---

**Claude:**

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | 10 | GO (MVP) | Privacy-first is een kernpijler van de UVP. Zonder basale toegangsbeveiliging is de privacy-belofte niet geloofwaardig. Financiële data op een onbeveiligde app ondermijnt het hele vertrouwensverhaal. Dit is een 'table stakes' feature voor elke finance app die privacy claimt. Lage complexiteit (standaard OS-functionaliteit), hoge impact op vertrouwen. |
| Feature B: Historische CSV-import (bulk) | 3 | 2 | 5 | MVP+ | Ondersteunt de UVP (flexibiliteit + privacy zonder bankkoppeling), maar is niet essentieel voor een werkende MVP. Gebruikers kunnen ook vanaf 'nu' beginnen met tracken. De feature voegt vooral gemak toe voor power users die hun volledige historie willen migreren. CSV-import is al onderdeel van MVP-scope, maar de bulkimport van historische data brengt extra complexiteit (duplicaatherkenning over langere periodes, data-cleaning van oude exports, performance bij grote datasets). Kan worden uitgesteld tot na validatie van basis-import functionaliteit. |

---

**Claude:**

| Beslissing | Actie |
| --- | --- |
| Feature A (PIN/Biometrie) | ✅ Opnemen in MVP – niet-onderhandelbaar voor privacy-UVP |
| Feature B (Historische Import) | ⏸️ Uitstellen naar MVP+ – valideer eerst basis-functionaliteit |

---

**Claude:**

### Naamloos document.docx

63 linesdocxneem dit document mee in jouw overwegingen voor het samenstellen van de definitieve mvp; vraag daarna om mijn goedkeuring2 dec 2025

---

**Claude:**

### Naamloos document.docx

63 linesdocx

---

**Claude:**

### Naamloos document.docx

63 lines

---

**Claude:**

neem dit document mee in jouw overwegingen voor het samenstellen van de definitieve mvp; vraag daarna om mijn goedkeuring2 dec 2025

---

**Claude:**

neem dit document mee in jouw overwegingen voor het samenstellen van de definitieve mvp; vraag daarna om mijn goedkeuring

---

**Claude:**

| # | Feature | Prioriteit | T-Shirt Size | Motivering |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegangsbeveiliging | P0 | S | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig. Essentieel voor gebruikersvertrouwen bij financiële data. Lage complexiteit (standaard OS-functionaliteit). |
| 2 | Handmatige invoer uitgaven/inkomsten | P0 | M | Basis van de app - essentieel voor gebruikers die controle en privacy willen. Simpele UX voor dagelijks gebruik. |
| 3 | Categorisering & budgettering | P0 | M | Vaste lasten, variabel budget, sparen, vrije bestedingsruimte. Kern van cashflow-controle functionaliteit. |
| 4 | Basis rapportage/overzicht | P0 | M | Maandelijkse cashflow, saldo, uitgaven vs inkomsten. Basisgrafieken voor inzicht. Zonder dit is de app alleen een logboek. |
| 5 | Privacy-first data model | P0 | M | Data lokaal of versleuteld opgeslagen, duidelijke export/backup/data-ownership opties. Architecturele beslissing die hele app beïnvloedt. |
| 6 | Flexibele account types | P0 | S | Cash, bank, spaargeld, contant, meerdere rekeningen. Ondersteunt diverse gebruikerssituaties. Relatief simpel data model. |

| Fase | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| MVP 1.0 | Basis CSV-import (generiek) | P1 | M | ✅ GO - Simpele parser voor standaard CSV-structuur, handmatige kolom-mapping door gebruiker. Risico: Gebruikers moeten zelf kolommen selecteren = hogere leercurve. |
| MVP 1.1 | Voorinstellingen top 3 banken | P2 | L | ⏸️ MVP+ - ING, Rabobank, ABN AMRO voorinstellingen, inclusief robuuste foutafhandeling en duplicaatdetectie. Vereist eerst: Benchmark van andere apps + verzamelen testdata. |

| Feature | Motivering Uitstel |
| --- | --- |
| Historische bulk CSV-import | Nice-to-have voor migratie, niet essentieel. Gebruikers kunnen vanaf nu beginnen tracken. Extra complexiteit: performance bij grote datasets, edge cases in oude formats. Valideer eerst basis-import. |

- Benchmark onderzoek: hoe bieden andere apps CSV-import aan
- Verzamelen/creëren van geanonimiseerde testdata van top 3 banken
- Feature-schets voor robuuste CSV-import valideren met testdata

| Key | Value |
| --- | --- |
| MVP 1.0 (Generieke CSV) | Valideert technische haalbaarheid + gebruikersbehoefte aan import-functie. Lagere barrier to launch. |
| MVP 1.1 (Bank | presets): Verhoogt gebruiksvriendelijkheid drastisch, maar vereist significant meer investering (L). Uitstel voorkomt dat we tijd/resources investeren in bank-specifieke parsers voordat we weten of generieke import überhaupt wordt gebruikt. |

| Key | Value |
| --- | --- |
| ✅ Privacy | first: PIN/biometrie + lokale data opslag |
| ✅ Eenvoud | Minimalistisch, zonder overbodige features |
| ✅ Controle | Handmatige invoer + flexibele accounts |
| ✅ Flexibiliteit | Generieke CSV-import als optie (bank-presets volgen later) |

| Key | Value |
| --- | --- |
| 6 Core Features | 2x S + 4x M = ~4-6 weken development (schatting voor 1-2 developers) |
| CSV | Import (generiek): +1 week |
| Testing & Polish | +1-2 weken |
| Total MVP 1.0 | ~6-9 weken |

| Key | Value |
| --- | --- |
| ✅ GO | Alle 6 kern-features (inclusief PIN/biometrie) |
| ✅ GO | Generieke CSV-import (gebruiker selecteert kolommen handmatig) |
| ⏸️ MVP 1.1 | Bank-specifieke voorinstellingen (na benchmark + testdata) |
| ❌ STOP | Historische bulk-import (naar MVP+) |

| Key | Value |
| --- | --- |
| Snellere time | to-market (geen L-size bank-parser werk) |
| Risico | mitigatie: valideer eerst of CSV-import überhaupt wordt gebruikt |
| Focus blijft op kern | UVP (privacy + controle) |
| Ruimte om te leren van early adopters voordat we investeren in complexe bank | presets |

- Ben je akkoord met deze MVP 1.0 scope?
- Wil je toch bank-presets in MVP 1.0, ondanks het hogere risico en langere ontwikkeltijd?
- Heb je aanvullende features die je essentieel vindt voor MVP 1.0?

## 📋 Definitieve MVP Feature List - Project Minimal Cashflow

### ✅ Kern-Features (MUST HAVE - GO voor MVP)

### ⚠️ CSV-Import: Gefaseerde Aanpak (Risicomitigatie)

### ❌ Uitgesteld naar MVP+ (STOP voor nu)

## 🎯 MVP Definitie Samenvatting

### Scope Statement:

### UVP Validatie:

### Total Effort Estimate:

## 🚦 Beslissingsvraag aan Lead (Manasse)

Ik heb beide documenten nu geanalyseerd. Het tweede document voegt een kritische risicoanalyse toe over de CSV-parser die impact heeft op de MVP-scope. Laat me de definitieve MVP samenstellen met deze nieuwe inzichten.

KRITISCH INZICHT uit Document 2:
CSV-headers/formaten verschillen per bank, wat leidt tot risico van onbetrouwbare data-import. Dit ondermijnt direct de UVP als het faalt.
Gefaseerde implementatie (MVP → MVP+):

Mitigerende Acties (voor MVP 1.1):

Strategische Redenering:

"Een werkende, beveiligde app die handmatige invoer en basis CSV-import ondersteunt, met categorisering, budgettering en cashflow-overzicht. Data blijft privé en lokaal. Gebruikers kunnen direct beginnen met tracken."

Ik adviseer de volgende scope voor MVP 1.0:

Voordelen van deze aanpak:

Vraag aan jou:

Laat me weten of je goedkeuring geeft, of dat je aanpassingen wilt voordat we deze scope formaliseren.

---

**Claude:**

| # | Feature | Prioriteit | T-Shirt Size | Motivering |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegangsbeveiliging | P0 | S | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig. Essentieel voor gebruikersvertrouwen bij financiële data. Lage complexiteit (standaard OS-functionaliteit). |
| 2 | Handmatige invoer uitgaven/inkomsten | P0 | M | Basis van de app - essentieel voor gebruikers die controle en privacy willen. Simpele UX voor dagelijks gebruik. |
| 3 | Categorisering & budgettering | P0 | M | Vaste lasten, variabel budget, sparen, vrije bestedingsruimte. Kern van cashflow-controle functionaliteit. |
| 4 | Basis rapportage/overzicht | P0 | M | Maandelijkse cashflow, saldo, uitgaven vs inkomsten. Basisgrafieken voor inzicht. Zonder dit is de app alleen een logboek. |
| 5 | Privacy-first data model | P0 | M | Data lokaal of versleuteld opgeslagen, duidelijke export/backup/data-ownership opties. Architecturele beslissing die hele app beïnvloedt. |
| 6 | Flexibele account types | P0 | S | Cash, bank, spaargeld, contant, meerdere rekeningen. Ondersteunt diverse gebruikerssituaties. Relatief simpel data model. |

---

**Claude:**

| Fase | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| MVP 1.0 | Basis CSV-import (generiek) | P1 | M | ✅ GO - Simpele parser voor standaard CSV-structuur, handmatige kolom-mapping door gebruiker. Risico: Gebruikers moeten zelf kolommen selecteren = hogere leercurve. |
| MVP 1.1 | Voorinstellingen top 3 banken | P2 | L | ⏸️ MVP+ - ING, Rabobank, ABN AMRO voorinstellingen, inclusief robuuste foutafhandeling en duplicaatdetectie. Vereist eerst: Benchmark van andere apps + verzamelen testdata. |

---

**Claude:**

| Feature | Motivering Uitstel |
| --- | --- |
| Historische bulk CSV-import | Nice-to-have voor migratie, niet essentieel. Gebruikers kunnen vanaf nu beginnen tracken. Extra complexiteit: performance bij grote datasets, edge cases in oude formats. Valideer eerst basis-import. |

---

**Claude:**

Kunnen we onderzoeken hoe de 6 grootste banken in NL hun csv samenstellen en bedenken hoe een n8n workflow het 'lezen' en verwerken van de data kan aanpakken? Én een max stellen aan de upload van historisch bulk data? Bijvoorbeeld max 3 maanden terug?2 dec 2025

---

**Claude:**

| Fase | Features | Effort | Prioriteit |
| --- | --- | --- | --- |
| Phase 1 | n8n workflow met ING + Rabobank + ABN AMRO presets | L | P0 |
| Phase 2 | Bunq + Knab + SNS presets toevoegen | M | P1 |
| Phase 3 | Generic CSV parser (handmatige kolom-mapping) | M | P2 |
| Phase 4 | Auto-categorisatie op basis van historische data | XL | MVP+ |

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```js
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

- Download-limieten per bank:

| - Scheidingstekens variëren: ING wijzigde in 2020 van komma (,) naar puntkomma ( | ) als scheidingsteken Banktrans |
| --- | --- |
| - MT940 wordt afgebouwd: SNS/ASN/RegioBank (Volksbank) ondersteunt sinds juli 2022 geen MT940 meer | Rabobank stopt MT940-ondersteuning vanaf 2025 Moneymonk |

| Key | Value |
| --- | --- |
| ING | max 18 maanden terug |
| ABN AMRO | max 24 maanden (maar slechts 18 maanden in XLS/CSV) |
| Rabobank | tot 8 jaar terug |
| Knab | tot 24 maanden terug |
| bunq | onbeperkt (elke gewenste periode) |
| SNS | tot 5 jaar terug Spreadsheet Shop |

- Scheidingsteken: puntkomma (;)
- 11 kolommen (2 kolommen toegevoegd in 2020: "Saldo na mutatie" en "Tag")
- Datumformaat: JJJJMMDD (yyyymmdd)
- Max 2000 transacties per export Banktrans

- Velden staan tussen aanhalingstekens; Excel voegt soms dubbele/driedubbele aanhalingstekens toe bij bewerking Banktrans

- Scheidingsteken: komma (,)
- Zeer informatierijk: bevat mutatiesoort, rentedatum, meerdere omschrijvingsvelden
- Datumformaat: DD-MM-YYYY
- Meest gedetailleerde CSV van alle banken GeldnerdGitHub

- Veel metadata voor automatische categorisatie (mutatiesoort, meerdere omschrijvingsvelden)

- Scheidingsteken: Tab (TXT) of komma (CSV)
- Zeer beperkt: bevat minimale informatie
- Geen mutatiesoort, geen extra metadata
- Download limiet: 18 maanden in XLS/CSV-formaat Geldnerd

- Minste informatie van alle grote banken; lastig voor automatische categorisatie

- Ondersteunt zowel CSV als JSON export
- Geen downloadin-limiet: gebruikers kunnen transacties exporteren voor elke gewenste periode Spreadsheet Shop
- Modern digitaal platform, waarschijnlijk gestructureerde API-achtige output

- Max 2000 transacties per download
- Tot 24 maanden terug downloadbaar Spreadsheet Shop

- Bestandsformaat: Microsoft Excel, CSV-bestand
- Geen MT940-ondersteuning meer sinds juli 2022
- Tot 5 jaar terug downloadbaar Spreadsheet ShopMoneymonk

- Technische grenzen:

ING's max download: 2000 transacties per export Spreadsheet Shop
Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- UX Overwegingen:

3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
Voorkomt "analysis paralysis" bij onboarding
Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- Privacy & Data Ownership:

Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
Minder data = minder risico bij opslag/verwerking
- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues

- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)

- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ✅ Bank-onafhankelijk MAAR wel gebruiksvriendelijk

Geen directe API-koppeling (privacy-first)
Wél intelligente presets voor gemak
- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak
- ✅ Schaalbaar & Onderhoudbaar

n8n workflows zijn visueel en gemakkelijk uit te breiden
Nieuwe bank toevoegen = nieuwe parser-node
- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node
- ✅ 3-maanden limiet = Sweet Spot

| UX: genoeg data voor inzicht | niet overweldigend |
| --- | --- |
| - UX: genoeg data voor inzicht | niet overweldigend |

Duplicaatherkenning via fingerprinting
Validatie op elk niveau
Error handling per bank-parser
- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak

- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node

| Key | Value |
| --- | --- |
| Technisch haalbaar binnen bank | limieten |
| UX | genoeg data voor inzicht, niet overweldigend |
| Privacy | beperkte historische data-opslag |

- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

| Key | Value |
| --- | --- |
| ✅ GO | Deze n8n-workflow architectuur opnemen in de MVP 1.0 scope? |
| ✅ GO | 3-maanden limiet instellen voor historische bulk-import? |
| ✅ GO | Starten met Phase 1 (ING + Rabobank + ABN AMRO) en later uitbreiden? |

- Andere limiet dan 3 maanden? (bijv. 1 maand of 6 maanden)
- Andere banken prioriteren?
- Voorkeur voor andere technologie dan n8n?

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drabobank.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dopleidingscentrum.eu&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dspreadsheet-shop.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dstamrechtingenieur.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dabnamro.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbankingtools.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddanielhaitink.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dclearvault.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

## 🏦 CSV-Structuuranalyse: Top 6 Nederlandse Banken

### 📊 Bevindingen uit Onderzoek

### 🔍 CSV-Structuur per Bank

#### 1. ING Bank

#### 2. Rabobank

#### 3. ABN AMRO

#### 4. Bunq

#### 5. Knab

#### 6. SNS Bank (Volksbank: SNS, ASN, RegioBank)

### n8n Node-by-Node Implementatie

#### Node 1: File Upload (HTTP Webhook of Binary Input)

#### Node 2: Bank Detection (Function Node)

#### Node 3: Parse & Clean (Switch Node → Bank-Specific Parsers)

#### Node 4: Map to Unified Data Model (Function Node)

#### Node 5: Validate & Dedupe (Function Node)

#### Node 6: Output (HTTP Response / Database Insert)

## 🚨 Max Limiet voor Historische Bulk Data

### ✅ Aanbevolen Limiet: 3 Maanden (90 Dagen)

## 📋 Implementatie Roadmap

### MVP 1.0: Gefaseerde Aanpak

## ✅ Voordelen van Deze Aanpak

## 🚦 Vraag aan Jou (Goedkeuring)

Uitstekende pragmatische aanpak! Dit combineert het beste van beide werelden: robuuste bank-support vanaf dag 1, maar met duidelijke scope-begrenzing. Laat me dit onderzoeken.2 stepsRabobank ABN AMRO CSV export kolommen velden structuur10 resultsInformatie over bestandsformaten Rabo Business Banking Professional - Rabobankrabobank.nlEn weer een bank erbij in de spreadsheet – Geldnerd.nlgeldnerd.nlMicrosoft Excel - Rabobank bankrekening transacties download omzetten naar Excelopleidingscentrum.euBanktransacties downloaden doe je zo! Alle Nederlandse banken – Spreadsheet Shopspreadsheet-shop.nlDownloadinstructies Bankmutatiesstamrechtingenieur.nlExporteren naar je boekhoudprogramma - Internetbankieren - ABN AMROabnamro.nlMeestgestelde vragen | BankingToolsbankingtools.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlGitHub - ToonvdPas/rabobank-csv-conversie: Conversie-tool om een CSV-download van de Rabobank te converteren, rubriceren en organiseren voor gebruik in een spreadsheet.github.comFinanciën op orde (2): Inkomsten en Uitgaven in beeld – Geldnerd.nlgeldnerd.nlbunq knab SNS CSV export format kolommen structuur10 resultsList of supported bank and online payment providers export formats : Yuki Support Nederlandyuki.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlYNAB Going Dutchdanielhaitink.nlHow do I create a CSV export - bunq Togetherbunq.comCashflow online software csv export - bunq Togetherbunq.comExport a set of payments - bunq Togetherbunq.comExport rekening overzicht - bunq Togetherbunq.comKnab bank export files : Yuki Support Nederlandyuki.nlPDF to MT940, CAMT.053 & CSV Converter | Bankafschriften + Creditcard Omzettenclearvault.nlExport statements with filter/search/selection - bunq Togetherbunq.comPerfect! Ik heb nu voldoende informatie verzameld. Laat me een uitgebreid overzicht maken van de CSV-structuren van de 6 grootste Nederlandse banken en een n8n workflow-strategie opstellen.

Belangrijkste Inzichten:

Hieronder een reconstructie gebaseerd op de onderzoeksbronnen:

Huidige structuur (na augustus 2020):
csv
Kenmerken:

Uitdagingen:

Uitgebreide CSV-structuur:
csv
Kenmerken:

Voordeel:

Beperkte TXT/CSV-structuur:
txt
Kenmerken:

Uitdaging:

CSV & JSON ondersteuning:

Geschatte structuur (veelvoorkomend bij neobanken):
csv

CSV-ondersteuning:

Vermoedelijke structuur (vergelijkbaar met andere moderne banken):
csv

CSV met IBAN:

Vermoedelijke structuur:
csv

javascript

Detectielogica gebaseerd op CSV-headers:
javascript

ING Parser (Function Node):
javascript
Rabobank Parser (Function Node):
javascript
ABN AMRO Parser (Function Node):
javascript

Unified Transaction Schema:
javascript

Duplicaat-detectie strategie:
javascript

Output JSON voor frontend:
javascript

Rationale:

Implementatie in n8n:
javascript

Wil je dat ik:

Of heb je aanpassingen:

Laat me weten of je deze aanpak goedkeurt, dan werk ik de definitieve MVP-scope uit! 🚀

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drabobank.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dopleidingscentrum.eu&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dspreadsheet-shop.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dstamrechtingenieur.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dabnamro.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbankingtools.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddanielhaitink.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dclearvault.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

2 stepsRabobank ABN AMRO CSV export kolommen velden structuur10 resultsInformatie over bestandsformaten Rabo Business Banking Professional - Rabobankrabobank.nlEn weer een bank erbij in de spreadsheet – Geldnerd.nlgeldnerd.nlMicrosoft Excel - Rabobank bankrekening transacties download omzetten naar Excelopleidingscentrum.euBanktransacties downloaden doe je zo! Alle Nederlandse banken – Spreadsheet Shopspreadsheet-shop.nlDownloadinstructies Bankmutatiesstamrechtingenieur.nlExporteren naar je boekhoudprogramma - Internetbankieren - ABN AMROabnamro.nlMeestgestelde vragen | BankingToolsbankingtools.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlGitHub - ToonvdPas/rabobank-csv-conversie: Conversie-tool om een CSV-download van de Rabobank te converteren, rubriceren en organiseren voor gebruik in een spreadsheet.github.comFinanciën op orde (2): Inkomsten en Uitgaven in beeld – Geldnerd.nlgeldnerd.nlbunq knab SNS CSV export format kolommen structuur10 resultsList of supported bank and online payment providers export formats : Yuki Support Nederlandyuki.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlYNAB Going Dutchdanielhaitink.nlHow do I create a CSV export - bunq Togetherbunq.comCashflow online software csv export - bunq Togetherbunq.comExport a set of payments - bunq Togetherbunq.comExport rekening overzicht - bunq Togetherbunq.comKnab bank export files : Yuki Support Nederlandyuki.nlPDF to MT940, CAMT.053 & CSV Converter | Bankafschriften + Creditcard Omzettenclearvault.nlExport statements with filter/search/selection - bunq Togetherbunq.com

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drabobank.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dopleidingscentrum.eu&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dspreadsheet-shop.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dstamrechtingenieur.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dabnamro.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbankingtools.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

Rabobank ABN AMRO CSV export kolommen velden structuur10 resultsInformatie over bestandsformaten Rabo Business Banking Professional - Rabobankrabobank.nlEn weer een bank erbij in de spreadsheet – Geldnerd.nlgeldnerd.nlMicrosoft Excel - Rabobank bankrekening transacties download omzetten naar Excelopleidingscentrum.euBanktransacties downloaden doe je zo! Alle Nederlandse banken – Spreadsheet Shopspreadsheet-shop.nlDownloadinstructies Bankmutatiesstamrechtingenieur.nlExporteren naar je boekhoudprogramma - Internetbankieren - ABN AMROabnamro.nlMeestgestelde vragen | BankingToolsbankingtools.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlGitHub - ToonvdPas/rabobank-csv-conversie: Conversie-tool om een CSV-download van de Rabobank te converteren, rubriceren en organiseren voor gebruik in een spreadsheet.github.comFinanciën op orde (2): Inkomsten en Uitgaven in beeld – Geldnerd.nlgeldnerd.nl

---

**Claude:**

Rabobank ABN AMRO CSV export kolommen velden structuur

---

**Claude:**

10 results

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Drabobank.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dopleidingscentrum.eu&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dspreadsheet-shop.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dstamrechtingenieur.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dabnamro.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbankingtools.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgithub.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dgeldnerd.nl&w=32&q=75)

Informatie over bestandsformaten Rabo Business Banking Professional - Rabobankrabobank.nlEn weer een bank erbij in de spreadsheet – Geldnerd.nlgeldnerd.nlMicrosoft Excel - Rabobank bankrekening transacties download omzetten naar Excelopleidingscentrum.euBanktransacties downloaden doe je zo! Alle Nederlandse banken – Spreadsheet Shopspreadsheet-shop.nlDownloadinstructies Bankmutatiesstamrechtingenieur.nlExporteren naar je boekhoudprogramma - Internetbankieren - ABN AMROabnamro.nlMeestgestelde vragen | BankingToolsbankingtools.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlGitHub - ToonvdPas/rabobank-csv-conversie: Conversie-tool om een CSV-download van de Rabobank te converteren, rubriceren en organiseren voor gebruik in een spreadsheet.github.comFinanciën op orde (2): Inkomsten en Uitgaven in beeld – Geldnerd.nlgeldnerd.nl

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddanielhaitink.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dclearvault.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

bunq knab SNS CSV export format kolommen structuur10 resultsList of supported bank and online payment providers export formats : Yuki Support Nederlandyuki.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlYNAB Going Dutchdanielhaitink.nlHow do I create a CSV export - bunq Togetherbunq.comCashflow online software csv export - bunq Togetherbunq.comExport a set of payments - bunq Togetherbunq.comExport rekening overzicht - bunq Togetherbunq.comKnab bank export files : Yuki Support Nederlandyuki.nlPDF to MT940, CAMT.053 & CSV Converter | Bankafschriften + Creditcard Omzettenclearvault.nlExport statements with filter/search/selection - bunq Togetherbunq.com

---

**Claude:**

bunq knab SNS CSV export format kolommen structuur

---

**Claude:**

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dmoneymonk.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Ddanielhaitink.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dyuki.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dclearvault.nl&w=32&q=75)

![favicon](https://claude.ai/_next/image?url=https%3A%2F%2Fwww.google.com%2Fs2%2Ffavicons%3Fsz%3D64%26domain%3Dbunq.com&w=32&q=75)

List of supported bank and online payment providers export formats : Yuki Support Nederlandyuki.nlWelke formaten kan ik importeren voor de bankafschriften?moneymonk.nlYNAB Going Dutchdanielhaitink.nlHow do I create a CSV export - bunq Togetherbunq.comCashflow online software csv export - bunq Togetherbunq.comExport a set of payments - bunq Togetherbunq.comExport rekening overzicht - bunq Togetherbunq.comKnab bank export files : Yuki Support Nederlandyuki.nlPDF to MT940, CAMT.053 & CSV Converter | Bankafschriften + Creditcard Omzettenclearvault.nlExport statements with filter/search/selection - bunq Togetherbunq.com

---

**Claude:**

| Fase | Features | Effort | Prioriteit |
| --- | --- | --- | --- |
| Phase 1 | n8n workflow met ING + Rabobank + ABN AMRO presets | L | P0 |
| Phase 2 | Bunq + Knab + SNS presets toevoegen | M | P1 |
| Phase 3 | Generic CSV parser (handmatige kolom-mapping) | M | P2 |
| Phase 4 | Auto-categorisatie op basis van historische data | XL | MVP+ |

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```js
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

- Download-limieten per bank:

| - Scheidingstekens variëren: ING wijzigde in 2020 van komma (,) naar puntkomma ( | ) als scheidingsteken Banktrans |
| --- | --- |
| - MT940 wordt afgebouwd: SNS/ASN/RegioBank (Volksbank) ondersteunt sinds juli 2022 geen MT940 meer | Rabobank stopt MT940-ondersteuning vanaf 2025 Moneymonk |

| Key | Value |
| --- | --- |
| ING | max 18 maanden terug |
| ABN AMRO | max 24 maanden (maar slechts 18 maanden in XLS/CSV) |
| Rabobank | tot 8 jaar terug |
| Knab | tot 24 maanden terug |
| bunq | onbeperkt (elke gewenste periode) |
| SNS | tot 5 jaar terug Spreadsheet Shop |

- Scheidingsteken: puntkomma (;)
- 11 kolommen (2 kolommen toegevoegd in 2020: "Saldo na mutatie" en "Tag")
- Datumformaat: JJJJMMDD (yyyymmdd)
- Max 2000 transacties per export Banktrans

- Velden staan tussen aanhalingstekens; Excel voegt soms dubbele/driedubbele aanhalingstekens toe bij bewerking Banktrans

- Scheidingsteken: komma (,)
- Zeer informatierijk: bevat mutatiesoort, rentedatum, meerdere omschrijvingsvelden
- Datumformaat: DD-MM-YYYY
- Meest gedetailleerde CSV van alle banken GeldnerdGitHub

- Veel metadata voor automatische categorisatie (mutatiesoort, meerdere omschrijvingsvelden)

- Scheidingsteken: Tab (TXT) of komma (CSV)
- Zeer beperkt: bevat minimale informatie
- Geen mutatiesoort, geen extra metadata
- Download limiet: 18 maanden in XLS/CSV-formaat Geldnerd

- Minste informatie van alle grote banken; lastig voor automatische categorisatie

- Ondersteunt zowel CSV als JSON export
- Geen downloadin-limiet: gebruikers kunnen transacties exporteren voor elke gewenste periode Spreadsheet Shop
- Modern digitaal platform, waarschijnlijk gestructureerde API-achtige output

- Max 2000 transacties per download
- Tot 24 maanden terug downloadbaar Spreadsheet Shop

- Bestandsformaat: Microsoft Excel, CSV-bestand
- Geen MT940-ondersteuning meer sinds juli 2022
- Tot 5 jaar terug downloadbaar Spreadsheet ShopMoneymonk

- Technische grenzen:

ING's max download: 2000 transacties per export Spreadsheet Shop
Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues
- UX Overwegingen:

3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
Voorkomt "analysis paralysis" bij onboarding
Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)
- Privacy & Data Ownership:

Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
Minder data = minder risico bij opslag/verwerking
- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ING's max download: 2000 transacties per export Spreadsheet Shop
- Gemiddeld 10-30 transacties/dag = 900-2700 transacties/3 maanden
- Dit blijft binnen ING's limiet én voorkomt memory/performance issues

- 3 maanden is genoeg om een "realistisch beeld" te krijgen van uitgavenpatronen
- Voorkomt "analysis paralysis" bij onboarding
- Gebruikers kunnen later altijd meer toevoegen (handmatig of via nieuwe import)

- Beperkte bulk-upload past bij "minimal" en "privacy-first" filosofie
- Minder data = minder risico bij opslag/verwerking

- ✅ Bank-onafhankelijk MAAR wel gebruiksvriendelijk

Geen directe API-koppeling (privacy-first)
Wél intelligente presets voor gemak
- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak
- ✅ Schaalbaar & Onderhoudbaar

n8n workflows zijn visueel en gemakkelijk uit te breiden
Nieuwe bank toevoegen = nieuwe parser-node
- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node
- ✅ 3-maanden limiet = Sweet Spot

| UX: genoeg data voor inzicht | niet overweldigend |
| --- | --- |
| - UX: genoeg data voor inzicht | niet overweldigend |

Duplicaatherkenning via fingerprinting
Validatie op elk niveau
Error handling per bank-parser
- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

- Geen directe API-koppeling (privacy-first)
- Wél intelligente presets voor gemak

- n8n workflows zijn visueel en gemakkelijk uit te breiden
- Nieuwe bank toevoegen = nieuwe parser-node

| Key | Value |
| --- | --- |
| Technisch haalbaar binnen bank | limieten |
| UX | genoeg data voor inzicht, niet overweldigend |
| Privacy | beperkte historische data-opslag |

- Duplicaatherkenning via fingerprinting
- Validatie op elk niveau
- Error handling per bank-parser

| Key | Value |
| --- | --- |
| ✅ GO | Deze n8n-workflow architectuur opnemen in de MVP 1.0 scope? |
| ✅ GO | 3-maanden limiet instellen voor historische bulk-import? |
| ✅ GO | Starten met Phase 1 (ING + Rabobank + ABN AMRO) en later uitbreiden? |

- Andere limiet dan 3 maanden? (bijv. 1 maand of 6 maanden)
- Andere banken prioriteren?
- Voorkeur voor andere technologie dan n8n?

## 🏦 CSV-Structuuranalyse: Top 6 Nederlandse Banken

### 📊 Bevindingen uit Onderzoek

### 🔍 CSV-Structuur per Bank

#### 1. ING Bank

#### 2. Rabobank

#### 3. ABN AMRO

#### 4. Bunq

#### 5. Knab

#### 6. SNS Bank (Volksbank: SNS, ASN, RegioBank)

### n8n Node-by-Node Implementatie

#### Node 1: File Upload (HTTP Webhook of Binary Input)

#### Node 2: Bank Detection (Function Node)

#### Node 3: Parse & Clean (Switch Node → Bank-Specific Parsers)

#### Node 4: Map to Unified Data Model (Function Node)

#### Node 5: Validate & Dedupe (Function Node)

#### Node 6: Output (HTTP Response / Database Insert)

## 🚨 Max Limiet voor Historische Bulk Data

### ✅ Aanbevolen Limiet: 3 Maanden (90 Dagen)

## 📋 Implementatie Roadmap

### MVP 1.0: Gefaseerde Aanpak

## ✅ Voordelen van Deze Aanpak

## 🚦 Vraag aan Jou (Goedkeuring)

Perfect! Ik heb nu voldoende informatie verzameld. Laat me een uitgebreid overzicht maken van de CSV-structuren van de 6 grootste Nederlandse banken en een n8n workflow-strategie opstellen.

Belangrijkste Inzichten:

Hieronder een reconstructie gebaseerd op de onderzoeksbronnen:

Huidige structuur (na augustus 2020):
csv
Kenmerken:

Uitdagingen:

Uitgebreide CSV-structuur:
csv
Kenmerken:

Voordeel:

Beperkte TXT/CSV-structuur:
txt
Kenmerken:

Uitdaging:

CSV & JSON ondersteuning:

Geschatte structuur (veelvoorkomend bij neobanken):
csv

CSV-ondersteuning:

Vermoedelijke structuur (vergelijkbaar met andere moderne banken):
csv

CSV met IBAN:

Vermoedelijke structuur:
csv

javascript

Detectielogica gebaseerd op CSV-headers:
javascript

ING Parser (Function Node):
javascript
Rabobank Parser (Function Node):
javascript
ABN AMRO Parser (Function Node):
javascript

Unified Transaction Schema:
javascript

Duplicaat-detectie strategie:
javascript

Output JSON voor frontend:
javascript

Rationale:

Implementatie in n8n:
javascript

Wil je dat ik:

Of heb je aanpassingen:

Laat me weten of je deze aanpak goedkeurt, dan werk ik de definitieve MVP-scope uit! 🚀

---

**Claude:**

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

csv

---

**Claude:**

csv

---

**Claude:**

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

```
"Datum";"Naam / Omschrijving";"Rekening";"Tegenrekening";"Code";"Af Bij";"Bedrag (EUR)";"Mutatiesoort";"Mededelingen";"Saldo na mutatie";"Tag"
```

---

**Claude:**

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

csv

---

**Claude:**

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

```
IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo na trn,Tegenrekening IBAN/BBAN,Naam tegenpartij,Omschrijving-1,Omschrijving-2,Omschrijving-3,Reden retour,Kenmerk,Mutatiesoort,Naam tegenpartij oorspronkelijk,Tag
```

---

**Claude:**

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

txt

---

**Claude:**

txt

---

**Claude:**

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

```
Datum,Bedrag,Tegenrekening,Naam tegenpartij,Omschrijving
```

---

**Claude:**

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

csv

---

**Claude:**

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

```
Date,Description,Amount,Currency,Account,Counterparty,Counterparty_Account,Balance_After
```

---

**Claude:**

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

csv

---

**Claude:**

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

```
Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Af/Bij,Saldo
```

---

**Claude:**

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

csv

---

**Claude:**

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

```
Datum,IBAN,Naam,Tegenrekening,Bedrag,Af/Bij,Omschrijving,Saldo
```

---

## 🤖 n8n Workflow Strategie: CSV Parser & Data Verwerking

### Voorgestelde n8n Workflow Architectuur
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CSV Import Workflow                         │
└─────────────────────────────────────────────────────────────────────┘

| ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ | ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ |
| --- | --- |
| │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ | │ 1. Upload │────▶│ 2. Detect │────▶│ 3. Parse │ |
| │ CSV File │ │ Bank Type │ │ & Clean │ | │ CSV File │ │ Bank Type │ │ & Clean │ |
| └──────────────┘ └──────────────┘ └──────────────┘ | └──────────────┘ └──────────────┘ └──────────────┘ |
| │ | │ |
| ▼ | ▼ |
| ┌─────────────────┐ | ┌─────────────────┐ |
| │ Bank Presets: │ | │ Bank Presets: │ |
| │ - ING │ | │ - ING │ |
| │ - Rabobank │ | │ - Rabobank │ |
| │ - ABN AMRO │ | │ - ABN AMRO │ |
| │ - Bunq │ | │ - Bunq │ |
| │ - Knab │ | │ - Knab │ |
| │ - SNS │ | │ - SNS │ |
| └─────────────────┘ | └─────────────────┘ |

      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │  4. Map to   │────▶│  5. Validate │────▶│  6. Output   │
      │ Unified Data │      │  & Dedupe    │      │  JSON/Store  │
      └──────────────┘      └──────────────┘      └──────────────┘
```

---

**Claude:**

```
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

javascript

---

**Claude:**

javascript

---

**Claude:**

```
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

```js
// Accept CSV file upload
{
  "filename": "ing_transacties_2024.csv",
  "mimetype": "text/csv",
  "data": "base64_encoded_csv..."
}
```

---

**Claude:**

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

javascript

---

**Claude:**

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

```js
// Node: Detect Bank Type
const csvHeaders = $input.item.json.headers; // First line of CSV

// Detection patterns
const bankPatterns = {
  "ING": ["Datum", "Naam / Omschrijving", "Saldo na mutatie", "Tag"],
  "Rabobank": ["IBAN/BBAN", "Munt", "BIC", "Volgnr", "Mutatiesoort"],
  "ABN_AMRO": ["Datum", "Bedrag", "Tegenrekening"], // Minimale set
  "Bunq": ["Date", "Description", "Amount", "Currency"],
  "Knab": ["Datum", "Omschrijving", "Rekening"],
  "SNS": ["IBAN", "Naam", "Tegenrekening"]
};

| const matches = pattern.filter(col => headers.includes(col)) |  |
| --- | --- |
| return bank |  |
| return "GENERIC" | // Fallback to generic parser |

const detectedBank = detectBank(csvHeaders);

return {
  json: {
    bank: detectedBank,
    filename: $input.item.json.filename,
    rawData: $input.item.json.data
  }
};
```

---

**Claude:**

```
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```js
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

javascript

---

**Claude:**

```
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

```js
// Node: ING CSV Parser
const Papa = require('papaparse'); // n8n heeft PapaParse beschikbaar

const csvData = $input.item.json.rawData;

| const parsed = Papa.parse(csvData | { |
| --- | --- |
| header: true |  |
| delimiter: ";" | // ING gebruikt puntkomma |
| skipEmptyLines: true |  |

| balance_after: parseFloat(row["Saldo na mutatie"]?.replace(",", ".") |  | 0), |
| --- | --- | --- |
| tag: row["Tag"] |  | "", |

return transactions.map(t => ({ json: t }));
```

---

**Claude:**

```
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

javascript

---

**Claude:**

```
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: Rabobank CSV Parser
const Papa = require('papaparse');

const parsed = Papa.parse($input.item.json.rawData, {
  header: true,
  delimiter: ",",
  skipEmptyLines: true
});

const transactions = parsed.data.map((row, index) => ({
  id: `rabo_${Date.now()}_${index}`,
  date: row["Datum"], // DD-MM-YYYY format
  account: row["IBAN/BBAN"],
  counterparty_account: row["Tegenrekening IBAN/BBAN"],
  counterparty_name: row["Naam tegenpartij"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  balance_after: parseFloat(row["Saldo na trn"].replace(",", ".")),
  mutation_type: row["Mutatiesoort"], // ⭐ Rijke metadata
  description: `${row["Omschrijving-1"]} ${row["Omschrijving-2"]} ${row["Omschrijving-3"]}`.trim(),
  reference: row["Kenmerk"],
  tag: row["Tag"] || "",
  bank: "Rabobank",
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

---

**Claude:**

```
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

javascript

---

**Claude:**

```
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

```js
// Node: ABN AMRO TXT/CSV Parser
const Papa = require('papaparse');

| const parsed = Papa.parse($input.item.json.rawData | { |
| --- | --- |
| header: true |  |
| delimiter: "\t" | // Tab-delimited TXT format |

const transactions = parsed.data.map((row, index) => ({
  id: `abn_${Date.now()}_${index}`,
  date: row["Datum"],
  amount: parseFloat(row["Bedrag"].replace(",", ".")),
  counterparty_account: row["Tegenrekening"],
  counterparty_name: row["Naam tegenpartij"],
  description: row["Omschrijving"],
  bank: "ABN_AMRO",
  // ⚠️ Limited metadata - will need manual categorization support
  raw: row
}));

return transactions.map(t => ({ json: t }));
```

---

**Claude:**

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

javascript

---

**Claude:**

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

```js
// Node: Map to Unified Schema
const transaction = $input.item.json;

| ).toISOString() |  |
| --- | --- |
| const parts = dateStr.split("-") |  |
| return new Date(parts[2], parts[1] - 1, parts[0]).toISOString() |  |
| return new Date(dateStr).toISOString() | // Fallback |

// Unified schema
return {
  json: {
    // Core fields (always present)
    transaction_id: transaction.id,
    date: parseDate(transaction.date, transaction.bank === "ING" ? "YYYYMMDD" : "DD-MM-YYYY"),
    amount: transaction.amount,
    description: transaction.description,
    bank_source: transaction.bank,
    
    // Optional fields (may be null)
    account_iban: transaction.account || null,
    counterparty_iban: transaction.counterparty_account || null,
    counterparty_name: transaction.counterparty_name || null,
    mutation_type: transaction.mutation_type || null,
    balance_after: transaction.balance_after || null,
    notes: transaction.notes || null,
    tags: transaction.tag ? [transaction.tag] : [],
    
    // Metadata
    imported_at: new Date().toISOString(),
    raw_data: transaction.raw
  }
};
```

---

**Claude:**

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

javascript

---

**Claude:**

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

```js
// Node: Duplicate Detection & Validation
const transactions = $input.all().map(item => item.json);

| if (!tx.date |  | isNaN(Date.parse(tx.date))) { |
| --- | --- | --- |
| if (tx.amount === 0 |  | isNaN(tx.amount)) { |
| if (!tx.description |  | tx.description.trim() === "") { |

// Duplicate detection (based on date + amount + counterparty)
function generateFingerprint(tx) {
  return `${tx.date.split('T')[0]}_${tx.amount}_${tx.counterparty_iban || 'none'}`;
}

| const validated = transactions.map(validateTransaction) |  |
| --- | --- |
| const seen = new Set() |  |
| const deduplicated = [] |  |

| const fingerprint = generateFingerprint(tx) |  |
| --- | --- |
| seen.add(fingerprint) |  |
| deduplicated.push(tx) |  |
| console.log(`Duplicate detected: ${fingerprint}`) |  |

return deduplicated.map(tx => ({ json: tx }));
```

---

**Claude:**

```
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

javascript

---

**Claude:**

```
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

```js
// Node: Format Response
return {
  json: {
    success: true,
    imported_count: $input.all().length,
    bank_detected: $input.first().json.bank_source,
    transactions: $input.all().map(item => item.json),
    metadata: {
      processed_at: new Date().toISOString(),
      workflow_version: "1.0"
    }
  }
};
```

---

**Claude:**

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

javascript

---

**Claude:**

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

```js
// Node: Date Range Validator
const MAX_DAYS_BACK = 90; // 3 months

| accepted: filtered |  |
| --- | --- |
| rejected_count: rejected |  |

const result = validateDateRange($input.all().map(item => item.json));

// Return only accepted transactions
return result.accepted.map(tx => ({ json: tx }));
```

---

**Claude:**

| Fase | Features | Effort | Prioriteit |
| --- | --- | --- | --- |
| Phase 1 | n8n workflow met ING + Rabobank + ABN AMRO presets | L | P0 |
| Phase 2 | Bunq + Knab + SNS presets toevoegen | M | P1 |
| Phase 3 | Generic CSV parser (handmatige kolom-mapping) | M | P2 |
| Phase 4 | Auto-categorisatie op basis van historische data | XL | MVP+ |

---

**Claude:**

Heroverweeg Vraag 2 Elias en gebruik al het bovenstaande CSV onderzoek als input. Vraag 2: Elias - MVP-Scope Prioritering Target AI: claude Uw Geoptimaliseerde Prompt: PROMPT: Je bent Lyra, de Beslissingsmatrix Generator voor Project Minimal Cashflow. Je taak is om objectieve prioritering te bieden op basis van strategische constraints en de gedefinieerde Unique Value Proposition (UVP).   CONTEXT: Lees bijgevoegd rapport 1.  [cite_start]**MVP-Constraint:** De MVP moet 'Minimal' blijven en zich strikt focussen op de kern-UVP (Privacy, Eenvoud, Controle)[cite: 277, 516]. 2.  **Te Prioriteren Features (Optioneel):**     * [cite_start]**Feature A:** PIN / Biometrie voor App-toegang (Basis beveiliging)[cite: 524].     * [cite_start]**Feature B:** Historische gegevens importeren via CSV (Eerste keer inladen van grote hoeveelheden bankdata)[cite: 525].   TAAK: Creëer een beslissingsmatrix om te bepalen of Feature A en Feature B moeten worden opgenomen in de MVP (GO), worden uitgesteld (MVP+), of worden geschrapt (STOP).   CRITERIA VOOR AFWEGING: 1.  **UVP-Fit:** Hoe noodzakelijk is de feature voor het waarmaken van de kern-UVP (Privacy-first, Eenvoud, Controle)? (Score 1-5, 5 is hoogst). 2.  **Risico Mitigatie / Vertrouwen:** In hoeverre verhoogt de feature het essentiële gebruikersvertrouwen (bijv. beveiliging/privacy)? (Score 1-5). 3.  **Complexity/Effort (uit Vraag 1):** (Neem aan dat complexiteit van A en B vergelijkbaar is met een 'S' van Vraag 1).   OUTPUT VEREISTEN (Gebruik een Decision Matrix in een markdown-tabel): Een tabel met de kolommen: Feature, Score UVP-Fit, Score Vertrouwen, Totaalscore, Aanbeveling (GO / MVP+ / STOP) en Korte Motivering.Show more2 dec 2025

---

**Claude:**

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Complexity/Effort | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | S | 10 | ✅ GO (MVP 1.0) | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig bij financiële data. Lage complexiteit (standaard OS-API's), hoge impact. Onveranderd t.o.v. eerdere analyse. |
| Feature B: Historische CSV-import met 3-maanden limiet | 4 | 4 | M → L | 8 | ✅ GO (MVP 1.0) ⚠️ GEWIJZIGD | Substantiële heroverweeging: CSV-onderzoek toont dat bank-presets (ING/Rabobank/ABN) technisch haalbaar zijn en kritiek voor UVP-differentiatie. 3-maanden limiet maakt complexiteit beheersbaar. Zonder goede CSV-import mist de kern-USP: "geen bankkoppeling, maar wél gemak". Effort verhoogd naar M-L vanwege bank-specifieke parsers, maar strategische waarde rechtvaardigt investering. |

| Bank | CSV-Rijkheid | Import Limiet | Parsing Complexity |
| --- | --- | --- | --- |
| ING | Middel (11 kolommen) | 2000 tx, 18 maanden | Medium - puntkomma-delimiter, aanhalingstekens |
| Rabobank | Zeer hoog (18 kolommen) | 8 jaar | Medium - komma-delimiter, rijke metadata |
| ABN AMRO | Zeer laag (5 kolommen) | 18 maanden | Laag - tab-delimited, minimaal |
| Bunq | Hoog (modern) | Onbeperkt | Laag - gestandaardiseerd |
| Knab | Middel | 2000 tx, 24 maanden | Medium |
| SNS | Middel | 5 jaar | Medium |

| Scenario | Impact op Vertrouwen | Waarschijnlijkheid zonder Bank-Presets | Mitigatie met Bank-Presets |
| --- | --- | --- | --- |
| Import faalt volledig | ⛔ Kritisch - gebruiker haakt af | Hoog (generieke parser = trial & error) | Laag (geteste presets) |
| Verkeerde categorisatie | ⚠️ Middel - frustratie, handmatig fixen | Hoog (geen contextbegrip) | Middel (Rabobank metadata helpt) |
| Missende transacties | ⛔ Kritisch - wantrouwen in app | Middel (parsing errors) | Laag (robuuste validatie) |
| Dubbele transacties | ⚠️ Middel - verwarring | Hoog (zonder fingerprinting) | Laag (duplicaatdetectie in n8n) |

| Component | Complexity | Rationale |
| --- | --- | --- |
| Generieke CSV-parser (basis) | S | PapaParse library, simpele kolom-mapping |
| Bank-detectie logic | S | Header-matching met 70% threshold |
| ING-specifieke parser | M | Puntkomma-delimiter, aanhalingstekens-handling, 11 kolommen |
| Rabobank-specifieke parser | M | Komma-delimiter, 18 kolommen, rijke metadata-extractie |
| ABN AMRO-specifieke parser | S | Tab-delimited, 5 kolommen, minimaal |
| Unified schema mapping | S | Datum-normalisatie, bedrag-parsing |
| Duplicaatdetectie | M | Fingerprinting (datum + bedrag + tegenrekening) |
| 3-maanden date-range filter | S | Simpele datum-vergelijking |
| n8n workflow orchestration | M | 6 nodes, error handling |
| Testing met real bank data | M | Verzamelen testdata, edge cases |
| TOTAAL (Top 3 banken) | L | Geschat: 2-3 weken development |

| Aspect | Versie 1.0 (Oorspronkelijk) | Versie 2.0 (Na CSV-Onderzoek) |
| --- | --- | --- |
| CSV-Import | Generieke parser (handmatige mapping) | Bank-presets voor ING + Rabobank + ABN AMRO |
| Historische Import | Uitgesteld naar MVP+ | ✅ Opgenomen met 3-maanden limiet |
| Effort Estimate | M (1 week) | L (2-3 weken) |
| UVP-Differentiatie | Basis import-mogelijkheid | Sterke differentiatie: "Werkt out-of-the-box" |
| Gebruikersvertrouwen | Onzeker (trial & error) | Hoog (geteste presets) |

| # | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegang | P0 | S | GO |
| 2 | Handmatige invoer | P0 | M | GO |
| 3 | Categorisering & budgettering | P0 | M | GO |
| 4 | Basis rapportage/overzicht | P0 | M | GO |
| 5 | Privacy-first data model | P0 | M | GO |
| 6 | Flexibele account types | P0 | S | GO |
| 7 | CSV-import met bank-presets (ING/Rabo/ABN) + 3-maanden limiet | P1 | L | ✅ GO |

| Feature | Aanbeveling | Rationale |
| --- | --- | --- |
| Feature A (PIN/Biometrie) | ✅ GO | Onveranderd - essentieel voor privacy-UVP |
| Feature B (CSV-import) | ⚠️ GO → van MVP+ naar MVP 1.0 | CSV-onderzoek toont dat dit niet optioneel is voor UVP-differentiatie. 3-maanden limiet maakt het haalbaar. Zonder dit mist de kern-USP. |

- "Nice-to-have voor migratie, niet essentieel"
- "Gebruikers kunnen vanaf nu beginnen tracken"
- "Valideer eerst basis-import"

- Top 3 banken (ING, Rabobank, ABN) dekken ~70%+ van Nederlandse markt

Focus op deze 3 = maximale ROI met beperkte scope
- Focus op deze 3 = maximale ROI met beperkte scope
- Rabobank's rijke metadata (mutatiesoort, meerdere omschrijvingsvelden) maakt automatische categorisatie mogelijk

Dit is een killer feature die handmatige apps niet hebben
Verhoogt UVP substantieel: "Eenvoud door slimme import"
- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"
- ABN AMRO's minimalisme toont aan dat zelfs beperkte CSV-import beter is dan geen import

| Key | Value |
| --- | --- |
| Gebruikers verwachten dit als baseline | feature |
| Gebruikers verwachten dit als baseline | feature |
| 3 | maanden limiet lost technische barrières op: |

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

- Focus op deze 3 = maximale ROI met beperkte scope

- Dit is een killer feature die handmatige apps niet hebben
- Verhoogt UVP substantieel: "Eenvoud door slimme import"

- Gebruikers verwachten dit als baseline-feature

| Key | Value |
| --- | --- |
| Past binnen ING's 2000 | transactie limiet (10-30 tx/dag × 90 dagen = 900-2700 tx) |
| Voorkomt performance | problemen |
| UX | genoeg voor "snel aan de slag" zonder overweldiging |

| Key | Value |
| --- | --- |
| Versie 1.0 | Generieke CSV (M) + uitstellen bank-presets |
| Versie 2.0 | Generieke CSV + Top 3 bank-presets (L) |
| Delta | +1-2 weken effort |

- Strategische waarde >> Effort-kosten

CSV-import is primaire differentiator vs handmatige apps
Zonder dit faalt de kern-USP
- CSV-import is primaire differentiator vs handmatige apps
- Zonder dit faalt de kern-USP
- n8n workflow = toekomstige schaalbaarheid

Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
Visual workflow = makkelijk onderhoudbaar
- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar
- 3-maanden limiet = effort-begrenzer

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |
| Bank | presets = vertrouwen-multiplier |

"Het werkt gewoon" = kritiek voor early adopters
Goede eerste indruk = retention
- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

| Key | Value |
| --- | --- |
| CSV | import is primaire differentiator vs handmatige apps |
| Zonder dit faalt de kern | USP |

- Bunq/Knab/SNS toevoegen = +1 dag per bank (niet +1 week)
- Visual workflow = makkelijk onderhoudbaar

| Key | Value |
| --- | --- |
| Geen performance | optimalisatie voor grote datasets nodig |
| Geen complexe historische data | migratie logic |

- "Het werkt gewoon" = kritiek voor early adopters
- Goede eerste indruk = retention

- Concurrentievoordeel:

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |
| Onboarding | kritiek: |

| Falen = churn | slagen = engagement |
| --- | --- |
| - Falen = churn | slagen = engagement |

n8n workflow = fundament voor toekomstige features
Automatische categorisatie (MVP+) bouwt hierop voort
Investering nu = snellere iteraties later
- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Apps mét bankkoppeling | privacy-risico's |
| Apps zonder bankkoppeling | vaak geen goede import |
| Wij | Privacy + goede import = sweet spot |

- Eerste 5 minuten bepalen of gebruiker blijft
- "Importeer je bankdata" = eerste actie
- Falen = churn, slagen = engagement

- n8n workflow = fundament voor toekomstige features
- Automatische categorisatie (MVP+) bouwt hierop voort
- Investering nu = snellere iteraties later

| Key | Value |
| --- | --- |
| Versie 1.0 | ~6-9 weken |
| Versie 2.0 | ~8-12 weken (+2-3 weken voor robuuste CSV-import) |

- ⏱️ +2-3 weken development time
- ✅ Veel sterkere product-market fit
- ✅ Lagere churn bij onboarding
- ✅ Duidelijke differentiatie vs concurrentie

| Key | Value |
| --- | --- |
| MVP 1.0a | Alleen ING-preset (grootste bank, ~40% markt) = M effort (1 week) |
| MVP 1.0b | Rabobank + ABN toevoegen = +1 week |

| - ✅ Optie A (Aanbevolen): GO voor Feature B in MVP 1.0 met Top 3 bank-presets (L effort | 2-3 weken extra) |
| --- | --- |
| - ⚡ Optie B (Sneller): GO voor Feature B in MVP 1.0 met alleen ING-preset (M effort | 1 week extra) |
| - ⏸️ Optie C (Oorspronkelijk plan): Uitstellen Feature B naar MVP+ (geen extra tijd | maar zwakkere UVP) |

# 🔄 Heroverweging: MVP-Scope Prioritering met CSV-Onderzoek

## 📊 Beslissingsmatrix: MVP Feature Prioritering (Versie 2.0)

## 🔍 Gedetailleerde Heroverweging Feature B

### ❌ Oorspronkelijke Analyse (Versie 1.0)

### ✅ Nieuwe Analyse (Versie 2.0 - Na CSV-Onderzoek)

### 1️⃣ UVP-Fit Score: 3 → 4 (+1 punt)

### 2️⃣ Vertrouwen Score: 2 → 4 (+2 punten)

### 3️⃣ Complexity/Effort: S → M-L (Verhoogd, maar acceptabel)

## 🎯 Strategische Implicaties

### Wat verandert er in MVP 1.0 Scope?

### Waarom deze heroverweeging strategisch cruciaal is:

## 📋 Bijgewerkte MVP 1.0 Scope

### ✅ Definitieve Feature List:

## 🚦 Aanbeveling aan Lead

## ❓ Vraag aan Jou (Goedkeuring Vereist)

> "Als de import faalt (bijv. verkeerde categorisatie, missende transacties, of crashende import), ondermijnt dit direct onze Unique Value Proposition (UVP) van 'Privacy-first & Controle'. Het faalt in het leveren van het beloofde gemak van automatisch inlezen én veroorzaakt frustratie, wat leidt tot afhaken van gebruikers bij de eerste essentiële actie."

Als Lyra, Beslissingsmatrix Generator - geüpdatet met CSV-structuurinzichten

Conclusie: MVP+ (uitstellen)
Rationale:

Conclusie: GO voor MVP 1.0
Rationale:

Waarom deze stijging?
Het CSV-onderzoek onthult dat bankvariatie substantieel maar beheersbaar is:

Cruciale inzichten:

Conclusie: CSV-import is niet "nice-to-have" maar essentieel voor differentiatie. Zonder goede import-ervaring valt de kern-USP weg: "Privacy zonder bankkoppeling, maar toch gemak".

Waarom deze stijging?
Het rapport waarschuwt expliciet voor "onbetrouwbare data-import" als kritiek risico:

Risico-analyse:

Conclusie: Een half-werkende CSV-import is slechter dan geen import. Gebruikers die hun eerste import proberen en falen, verliezen direct vertrouwen. Bank-presets (ING/Rabobank/ABN) met robuuste validatie zijn vertrouwen-kritiek.

Effort Breakdown:

Vergelijking met oorspronkelijke schatting:

Is deze effort-investering gerechtvaardigd?
✅ JA, om volgende redenen:

Total MVP 1.0 Effort:

Herziene beslissing:

Trade-off:

Alternatief (indien tijd kritiek is):

Keuze:

Welke optie kies je?
Mijn strategische advies: Optie A. De extra investering (2-3 weken) levert een veel sterker product op dat de kern-UVP waarmaakt. Zonder robuuste CSV-import riskeren we dat gebruikers afhaken bij hun eerste kritieke actie.

---

**Claude:**

| Feature | Score UVP-Fit (1-5) | Score Vertrouwen (1-5) | Complexity/Effort | Totaalscore (Max 10) | Aanbeveling | Korte Motivering |
| --- | --- | --- | --- | --- | --- | --- |
| Feature A: PIN/Biometrie voor App-toegang | 5 | 5 | S | 10 | ✅ GO (MVP 1.0) | Privacy-first is kernpijler van UVP. Zonder toegangsbeveiliging is privacy-belofte niet geloofwaardig bij financiële data. Lage complexiteit (standaard OS-API's), hoge impact. Onveranderd t.o.v. eerdere analyse. |
| Feature B: Historische CSV-import met 3-maanden limiet | 4 | 4 | M → L | 8 | ✅ GO (MVP 1.0) ⚠️ GEWIJZIGD | Substantiële heroverweeging: CSV-onderzoek toont dat bank-presets (ING/Rabobank/ABN) technisch haalbaar zijn en kritiek voor UVP-differentiatie. 3-maanden limiet maakt complexiteit beheersbaar. Zonder goede CSV-import mist de kern-USP: "geen bankkoppeling, maar wél gemak". Effort verhoogd naar M-L vanwege bank-specifieke parsers, maar strategische waarde rechtvaardigt investering. |

---

**Claude:**

| Bank | CSV-Rijkheid | Import Limiet | Parsing Complexity |
| --- | --- | --- | --- |
| ING | Middel (11 kolommen) | 2000 tx, 18 maanden | Medium - puntkomma-delimiter, aanhalingstekens |
| Rabobank | Zeer hoog (18 kolommen) | 8 jaar | Medium - komma-delimiter, rijke metadata |
| ABN AMRO | Zeer laag (5 kolommen) | 18 maanden | Laag - tab-delimited, minimaal |
| Bunq | Hoog (modern) | Onbeperkt | Laag - gestandaardiseerd |
| Knab | Middel | 2000 tx, 24 maanden | Medium |
| SNS | Middel | 5 jaar | Medium |

---

**Claude:**

| Scenario | Impact op Vertrouwen | Waarschijnlijkheid zonder Bank-Presets | Mitigatie met Bank-Presets |
| --- | --- | --- | --- |
| Import faalt volledig | ⛔ Kritisch - gebruiker haakt af | Hoog (generieke parser = trial & error) | Laag (geteste presets) |
| Verkeerde categorisatie | ⚠️ Middel - frustratie, handmatig fixen | Hoog (geen contextbegrip) | Middel (Rabobank metadata helpt) |
| Missende transacties | ⛔ Kritisch - wantrouwen in app | Middel (parsing errors) | Laag (robuuste validatie) |
| Dubbele transacties | ⚠️ Middel - verwarring | Hoog (zonder fingerprinting) | Laag (duplicaatdetectie in n8n) |

---

**Claude:**

| Component | Complexity | Rationale |
| --- | --- | --- |
| Generieke CSV-parser (basis) | S | PapaParse library, simpele kolom-mapping |
| Bank-detectie logic | S | Header-matching met 70% threshold |
| ING-specifieke parser | M | Puntkomma-delimiter, aanhalingstekens-handling, 11 kolommen |
| Rabobank-specifieke parser | M | Komma-delimiter, 18 kolommen, rijke metadata-extractie |
| ABN AMRO-specifieke parser | S | Tab-delimited, 5 kolommen, minimaal |
| Unified schema mapping | S | Datum-normalisatie, bedrag-parsing |
| Duplicaatdetectie | M | Fingerprinting (datum + bedrag + tegenrekening) |
| 3-maanden date-range filter | S | Simpele datum-vergelijking |
| n8n workflow orchestration | M | 6 nodes, error handling |
| Testing met real bank data | M | Verzamelen testdata, edge cases |
| TOTAAL (Top 3 banken) | L | Geschat: 2-3 weken development |

---

**Claude:**

| Aspect | Versie 1.0 (Oorspronkelijk) | Versie 2.0 (Na CSV-Onderzoek) |
| --- | --- | --- |
| CSV-Import | Generieke parser (handmatige mapping) | Bank-presets voor ING + Rabobank + ABN AMRO |
| Historische Import | Uitgesteld naar MVP+ | ✅ Opgenomen met 3-maanden limiet |
| Effort Estimate | M (1 week) | L (2-3 weken) |
| UVP-Differentiatie | Basis import-mogelijkheid | Sterke differentiatie: "Werkt out-of-the-box" |
| Gebruikersvertrouwen | Onzeker (trial & error) | Hoog (geteste presets) |

---

**Claude:**

| # | Feature | Prioriteit | T-Shirt Size | Status |
| --- | --- | --- | --- | --- |
| 1 | PIN/Biometrie toegang | P0 | S | GO |
| 2 | Handmatige invoer | P0 | M | GO |
| 3 | Categorisering & budgettering | P0 | M | GO |
| 4 | Basis rapportage/overzicht | P0 | M | GO |
| 5 | Privacy-first data model | P0 | M | GO |
| 6 | Flexibele account types | P0 | S | GO |
| 7 | CSV-import met bank-presets (ING/Rabo/ABN) + 3-maanden limiet | P1 | L | ✅ GO |

---

**Claude:**

| Feature | Aanbeveling | Rationale |
| --- | --- | --- |
| Feature A (PIN/Biometrie) | ✅ GO | Onveranderd - essentieel voor privacy-UVP |
| Feature B (CSV-import) | ⚠️ GO → van MVP+ naar MVP 1.0 | CSV-onderzoek toont dat dit niet optioneel is voor UVP-differentiatie. 3-maanden limiet maakt het haalbaar. Zonder dit mist de kern-USP. |

---

**Claude:**

Voldoen we aan deze doelstellingen? 
Stap 2: De Kern: Bepaling van de UVP (Onder leiding van Elias)
 * Input: De goedgekeurde Concurrentie-matrix en Doelgroep Hypothese (uit Stap 1).
 * Activiteit: Formulering van de kernboodschap die de gaten in de markt vult. Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard).
 * Output Vereisten:
   * De Concept UVP (één duidelijke zin).
   * De Definitieve Minimale Scope (3 Kernfuncties) die de UVP ondersteunen.
 * Definitief Keuzemoment voor de Lead: Formele GO/STOP op de Concept UVP en de Minimale Scope.2 dec 2025

---

**Claude:**

| # | Vereiste Output | Status | Locatie in Documentatie | Volledigheid |
| --- | --- | --- | --- | --- |
| 1 | Concept UVP (één duidelijke zin) | ⚠️ Gedeeltelijk | Meerdere versies verspreid door rapport | 60% - Niet geconsolideerd tot één definitieve zin |
| 2 | Definitieve Minimale Scope (3 Kernfuncties) | ❌ Nee | 7 features in plaats van 3 | 40% - Scope creep, geen focus op Setup/Invoer/Dashboard |
| 3 | Formeel GO/STOP Keuzemoment voor Lead | ❌ Nee | Vraag gesteld maar niet afgedwongen | 30% - Geen duidelijk beslissingskader |

| Versie | Locatie | Formulering |
| --- | --- | --- |
| Versie A | Rapport pagina 4 | "Privacy-first budget app die toch automatisch transacties kan verwerken -- zonder bankkoppeling." |
| Versie B | Rapport pagina 7 | "Een eenvoudige, privacy-gerichte, flexibele financiën-tracker: geen bank-koppeling nodig, maar wél overzicht en import-opties. Grip op cashflow, ook bij contant geld of variabel inkomen." |
| Versie C | Beslissingsmatrix | "Privacy-first & Controle met CSV-import als differentiator" (impliciet) |

| Kernfunctie | Definitie | Onderliggende Features (technisch) | User Story |
| --- | --- | --- | --- |
| 1. SETUP | Eerste configuratie van de app om te kunnen beginnen | • PIN/Biometrie toegang• Privacy-first data model (lokale opslag)• Flexibele account types (cash/bank/sparen)• Categorisering structuur aanmaken | "Als nieuwe gebruiker wil ik veilig en snel mijn accounts en categorieën instellen, zodat ik binnen 5 minuten kan beginnen met tracken." |
| 2. INVOER | Transacties toevoegen (handmatig of via import) | • Handmatige invoer (uitgaven/inkomsten)• CSV-import met bank-presets (ING/Rabo/ABN)• 3-maanden historische import limiet• Automatische categorisatie (basis) | "Als gebruiker wil ik makkelijk mijn uitgaven toevoegen — ofwel handmatig, ofwel door mijn bankafschrift te uploaden — zodat ik tijd bespaar en een compleet overzicht krijg." |
| 3. DASHBOARD | Inzicht in cashflow en budgetstatus | • Basis rapportage (maandelijks overzicht)• Uitgaven vs inkomsten grafiek• Budget per categorie (vrije bestedingsruimte)• Saldo-overzicht (per account) | "Als gebruiker wil ik in één oogopslag zien hoeveel ik deze maand heb uitgegeven en hoeveel ik nog vrij heb om uit te geven, zodat ik controle houd." |

| # | Kernfunctie | Doel | Ondersteunt UVP Element |
| --- | --- | --- | --- |
| 1 | SETUP | Veilige, snelle eerste configuratie (accounts, categorieën, privacy) | "Privacy-first" + "Controle" |
| 2 | INVOER | Flexibel transacties toevoegen (handmatig of CSV-import) | "Automatisch verwerkt" + "Zonder bankkoppeling" |
| 3 | DASHBOARD | Inzicht in cashflow, budget en vrije bestedingsruimte | "Controle over cashflow" |

| Doelstelling | Oorspronkelijke Status | Herziene Status (Na Correctie) |
| --- | --- | --- |
| Concept UVP (één zin) | ⚠️ Gedeeltelijk (60%) | ✅ Voldaan (100%) |
| 3 Kernfuncties (Setup/Invoer/Dashboard) | ❌ Niet voldaan (40%) | ✅ Voldaan (100%) |
| Formeel GO/STOP Keuzemoment | ❌ Niet voldaan (30%) | ⏳ Framework klaar (80% - wacht op Lead) |

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

- 3 verschillende formuleringen
- Geen enkele is één duidelijke zin zoals gevraagd
- Versie B is te lang (2 zinnen)
- Geen formele goedkeuring van Lead op specifieke formulering

- PIN/Biometrie
- Handmatige invoer
- Categorisering & budgettering
- Basis rapportage
- Privacy-first data model
- Flexibele account types
- CSV-import met bank-presets

| Key | Value |
| --- | --- |
| Scope creep | 7 features ≠ 3 kernfuncties |
| Niet georganiseerd volgens het gevraagde framework | Setup → Invoer → Dashboard |
| Features zijn technische bouwblokken, geen gebruikers | gerichte functies |

- Stelden vragen: "Ben je akkoord?", "Welke optie kies je?"
- Geen duidelijk GO/STOP framework met criteria
- Geen expliciete "Sign-off" vereiste van Lead

- Formele beslissingsprocedure
- Duidelijke criteria voor GO (bijv. "UVP moet X scoren op Y")
- Risico-overzicht bij STOP-beslissing
- Expliciete handtekening/akkoord-moment

| Key | Value |
| --- | --- |
| ✅ Privacy | first: Expliciet genoemd |
| ✅ Geen bankkoppeling | Kernonderscheid vs concurrentie |
| ✅ Automatisch verwerkt | CSV-import als gemak |
| ✅ Cashflow | controle: Hoofdfunctie |
| ✅ Contant/onregelmatig | Doelgroep-differentiatie |
| ✅ Één zin | 23 woorden, helder en scannabel |

- ✅ Voldoet aan "3 kernfuncties" vereiste
- ✅ Georganiseerd volgens Setup → Invoer → Dashboard
- ✅ Alle 7 technische features blijven behouden, maar nu gestructureerd

- ✅ Vult gat in markt (privacy vs gemak)
- ✅ Duidelijk onderscheidend vs concurrentie
- ✅ Ondersteuning door 3 kernfuncties (zie hieronder)

| - Setup = Features 1 | 5 | 6 |
| --- | --- | --- |
| - Invoer = Features 2 | 3 | 7 |

- ✅ GO → We gaan door naar Stap 3
- ⏸️ REVISE → Specificeer welke aanpassingen nodig zijn
- ❌ STOP → Motiveer waarom we stoppen

| Key | Value |
| --- | --- |
| Voor correctie | 43% compliant |
| Na correctie | 93% compliant (laatste 7% = Lead-beslissing) |

- ✅ Goedkeuring of aanpassing van de Definitieve UVP:

| Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |
| --- | --- |
| - Akkoord met: "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow | ook bij contant geld of onregelmatig inkomen." |

Akkoord met deze structuur?
Ontbreekt er iets essentieel?
- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?
- ✅ Formele GO/STOP/REVISE beslissing:

| Geef expliciet aan: GO | STOP of REVISE |
| --- | --- |
| - Geef expliciet aan: GO | STOP of REVISE |

| Key | Value |
| --- | --- |
| Akkoord met | "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen." |
| Of | voorgestelde wijziging |

- Akkoord met deze structuur?
- Ontbreekt er iets essentieel?

- Vul het beslissingskader in (zie boven)
- Geef expliciet aan: GO, STOP of REVISE

# 📊 Audit: Voldoen We Aan Stap 2 Doelstellingen?

## ✅ Checklist: Vereiste Outputs voor Stap 2

## 🔍 Gedetailleerde Analyse per Output

### Output 1: Concept UVP (één duidelijke zin)

### Output 2: Definitieve Minimale Scope (3 Kernfuncties)

### Output 3: Formeel GO/STOP Keuzemoment

## 🔧 Correctieplan: Hoe We Dit Oplossen

### Actie 1: Consolideer UVP tot Eén Definitieve Zin

### Actie 2: Herstructureer Scope naar 3 Kernfuncties

### Actie 3: Formeel GO/STOP Beslissingskader

## 📋 Finale Deliverable: Gecorrigeerde Output voor Stap 2

### 1. Concept UVP (Definitief)

### 2. Definitieve Minimale Scope (3 Kernfuncties)

### 3. Formeel GO/STOP Keuzemoment

## ✅ Herziene Antwoord op Jouw Vraag

## 🚦 Actie Vereist van Jou (Lead)

> "Definiëren van de 3 minimale kernfuncties (Setup, Invoer, Dashboard)."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

Systematische controle van outputvereisten

Status: ⚠️ GEDEELTELIJK VOLDAAN
Wat we hebben (verspreid door documentatie):

Probleem:

Status: ❌ NIET VOLDAAN
Wat gevraagd werd:

Wat we leverden:
7 features in MVP 1.0:

Probleem:

Status: ❌ NIET VOLDAAN
Wat we deden:

Wat ontbreekt:

Ik stel voor:
📌 DEFINITIEVE CONCEPT UVP (Versie 1.0):

Validatie tegen UVP-criteria:

Framework: Setup → Invoer → Dashboard

Mapping van 7 features naar 3 kernfuncties:

Result:

Framework voor Lead-beslissing:

📌 Kernboodschap:

Validatie:

Technische mapping:

Status: ⏳ WACHTEND OP LEAD-BESLISSING
Vereiste actie van Lead (Manasse):
Vul het bovenstaande beslissingskader in en geef expliciet aan:

"Voldoen we aan deze doelstellingen?"

OVERALL:

Om Stap 2 formeel af te ronden, heb ik nodig:

Zodra ik dit heb, is Stap 2 formeel afgerond en kunnen we door naar Stap 3 (Wireframes & User Flows). 🚀
Wat is jouw beslissing?

---

**Claude:**

| # | Vereiste Output | Status | Locatie in Documentatie | Volledigheid |
| --- | --- | --- | --- | --- |
| 1 | Concept UVP (één duidelijke zin) | ⚠️ Gedeeltelijk | Meerdere versies verspreid door rapport | 60% - Niet geconsolideerd tot één definitieve zin |
| 2 | Definitieve Minimale Scope (3 Kernfuncties) | ❌ Nee | 7 features in plaats van 3 | 40% - Scope creep, geen focus op Setup/Invoer/Dashboard |
| 3 | Formeel GO/STOP Keuzemoment voor Lead | ❌ Nee | Vraag gesteld maar niet afgedwongen | 30% - Geen duidelijk beslissingskader |

---

**Claude:**

| Versie | Locatie | Formulering |
| --- | --- | --- |
| Versie A | Rapport pagina 4 | "Privacy-first budget app die toch automatisch transacties kan verwerken -- zonder bankkoppeling." |
| Versie B | Rapport pagina 7 | "Een eenvoudige, privacy-gerichte, flexibele financiën-tracker: geen bank-koppeling nodig, maar wél overzicht en import-opties. Grip op cashflow, ook bij contant geld of variabel inkomen." |
| Versie C | Beslissingsmatrix | "Privacy-first & Controle met CSV-import als differentiator" (impliciet) |

---

**Claude:**

| Kernfunctie | Definitie | Onderliggende Features (technisch) | User Story |
| --- | --- | --- | --- |
| 1. SETUP | Eerste configuratie van de app om te kunnen beginnen | • PIN/Biometrie toegang• Privacy-first data model (lokale opslag)• Flexibele account types (cash/bank/sparen)• Categorisering structuur aanmaken | "Als nieuwe gebruiker wil ik veilig en snel mijn accounts en categorieën instellen, zodat ik binnen 5 minuten kan beginnen met tracken." |
| 2. INVOER | Transacties toevoegen (handmatig of via import) | • Handmatige invoer (uitgaven/inkomsten)• CSV-import met bank-presets (ING/Rabo/ABN)• 3-maanden historische import limiet• Automatische categorisatie (basis) | "Als gebruiker wil ik makkelijk mijn uitgaven toevoegen — ofwel handmatig, ofwel door mijn bankafschrift te uploaden — zodat ik tijd bespaar en een compleet overzicht krijg." |
| 3. DASHBOARD | Inzicht in cashflow en budgetstatus | • Basis rapportage (maandelijks overzicht)• Uitgaven vs inkomsten grafiek• Budget per categorie (vrije bestedingsruimte)• Saldo-overzicht (per account) | "Als gebruiker wil ik in één oogopslag zien hoeveel ik deze maand heb uitgegeven en hoeveel ik nog vrij heb om uit te geven, zodat ik controle houd." |

---

**Claude:**

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

```
SETUP (Functie 1)
├── Feature 1: PIN/Biometrie
├── Feature 5: Privacy-first data model
└── Feature 6: Flexibele account types

INVOER (Functie 2)
├── Feature 2: Handmatige invoer
├── Feature 7: CSV-import met bank-presets
└── Feature 3: Categorisering (gekoppeld aan invoer)

DASHBOARD (Functie 3)
└── Feature 4: Basis rapportage/overzicht
```

---

**Claude:**

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│             FORMEEL GO/STOP KEUZEMOMENT                     │
│                 Stap 2: UVP & Minimale Scope                │
└─────────────────────────────────────────────────────────────┘

TE BEOORDELEN:
1. Concept UVP: "Privacy-first budgetapp die bankdata automatisch 
   verwerkt zonder bankkoppeling — controle over cashflow, ook bij 
   contant geld of onregelmatig inkomen."

2. Minimale Scope (3 Kernfuncties):
   - Setup (PIN, privacy, accounts)
   - Invoer (handmatig + CSV-import)
   - Dashboard (overzicht + budget)

BESLISSINGSCRITERIA:

┌──────────────────────────────────────────────────────────────┐
│ GO-criteria (alle moeten JA zijn):                          │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is onderscheidend vs concurrentie                     │
│ □ 3 Kernfuncties ondersteunen UVP direct                    │
│ □ Scope is minimaal (geen overbodige features)              │
│ □ Technische haalbaarheid binnen 8-12 weken                 │
│ □ Budget/resources beschikbaar voor deze scope              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ STOP-signalen (één is genoeg voor heroverwegen):            │
├──────────────────────────────────────────────────────────────┤
│ □ UVP is niet onderscheidend (concurrenten doen dit al)     │
│ □ Scope is te groot (>12 weken development)                 │
│ □ Technische risico's te hoog (CSV-parser onhaalbaar)       │
│ □ Budget/resources ontoereikend                             │
│ □ Doelgroep niet duidelijk gedefinieerd                     │
└──────────────────────────────────────────────────────────────┘

| Key | Value |
| --- | --- |
| RISICO | OVERZICHT BIJ GO: |
| CSV | parser complexiteit (mitigatie: n8n workflow, 3 banken) |
| Concurrentie van established apps (mitigatie | privacy-first USP) |
| Gebruikersadoptie onzeker (mitigatie | MVP-validatie) |

RISICO-OVERZICHT BIJ STOP:
- Gemiste marktopportunity (privacy-gat in markt)
- Sunk cost van research/analyse
- Concurrentie vult gat eerder

┌──────────────────────────────────────────────────────────────┐
│                   FORMELE BESLISSING                         │
├──────────────────────────────────────────────────────────────┤
│ □ GO - Ga door naar Stap 3 (Wireframes & User Flows)        │
│ □ STOP - Heroverweeg strategie/scope                        │
│ □ REVISE - Aanpassingen vereist (specificeer hieronder)     │
│                                                              │
│ Lead: _____________________ Datum: ___________              │
│                                                              │
│ Opmerkingen/Aanpassingen:                                   │
│ ____________________________________________________________ │
│ ____________________________________________________________ │
└──────────────────────────────────────────────────────────────┘
```

---

**Claude:**

| # | Kernfunctie | Doel | Ondersteunt UVP Element |
| --- | --- | --- | --- |
| 1 | SETUP | Veilige, snelle eerste configuratie (accounts, categorieën, privacy) | "Privacy-first" + "Controle" |
| 2 | INVOER | Flexibel transacties toevoegen (handmatig of CSV-import) | "Automatisch verwerkt" + "Zonder bankkoppeling" |
| 3 | DASHBOARD | Inzicht in cashflow, budget en vrije bestedingsruimte | "Controle over cashflow" |

---

**Claude:**

| Doelstelling | Oorspronkelijke Status | Herziene Status (Na Correctie) |
| --- | --- | --- |
| Concept UVP (één zin) | ⚠️ Gedeeltelijk (60%) | ✅ Voldaan (100%) |
| 3 Kernfuncties (Setup/Invoer/Dashboard) | ❌ Niet voldaan (40%) | ✅ Voldaan (100%) |
| Formeel GO/STOP Keuzemoment | ❌ Niet voldaan (30%) | ⏳ Framework klaar (80% - wacht op Lead) |

---

**Claude:**

Schrijf de opdracht voor David, onze UX/UI Designer (Consult). Hij levert ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie2 dec 2025

---

**Claude:**

Schrijf de opdracht voor David, onze UX/UI Designer (Consult). Hij levert ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie

---

**Claude:**

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes
- Validatie-vragen voor gebruikerstests

- Privacy-bewuste gebruikers die geen bankkoppeling willen
- Mensen met contant geld of onregelmatig inkomen (freelancers, ZZP'ers, wisselende inkomsten)
- Casual budgetters die een simpel overzicht willen zonder complexe features
- Leeftijd: 25-45 jaar
- Locatie: Nederland (primair), EU (secundair)
- Tech-savviness: Gemiddeld tot hoog (comfortabel met CSV-bestanden downloaden)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| --- | --- |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |

- Handmatige Invoer

Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

CTA: "Opslaan" button (prominent)
- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)
- CSV Import

| Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |
| --- | --- | --- | --- |
| - Bank-selectie (dropdown: ING | Rabobank | ABN AMRO | Andere) |

- Velden:

Datum (datepicker, default: vandaag)
Bedrag (numeriek keyboard, EUR symbool)
Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
Account (dropdown: Bankrekening, Cash, Spaarrekening)
Omschrijving (optioneel tekstveld)
Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)
- CTA: "Opslaan" button (prominent)

- Datum (datepicker, default: vandaag)
- Bedrag (numeriek keyboard, EUR symbool)
- Categorie (dropdown: Vaste lasten, Boodschappen, Vervoer, Vrije tijd, etc.)
- Account (dropdown: Bankrekening, Cash, Spaarrekening)
- Omschrijving (optioneel tekstveld)
- Type (toggle: Uitgave / Inkomst - visueel onderscheidend, bijv. rood/groen)

- Upload-zone (drag & drop of file picker)
- Bank-selectie (dropdown: ING, Rabobank, ABN AMRO, Andere)
- Preview van eerste 3 transacties (tabel) na upload
- Waarschuwing: "Max 3 maanden terug" (info-icoon met uitleg)
- CTA: "Importeer [X] transacties" button

| Key | Value |
| --- | --- |
| Privacy | signaal: Toon ergens subtiel: "🔒 Data blijft op jouw apparaat" (niet opdringerig) |
| Snelheid | Handmatige invoer moet binnen 3 taps/clicks voltooid zijn |
| Foutpreventie | Validatie op bedrag (geen 0, geen letters), datum (niet in toekomst voor uitgaven) |
| Feedback | Bevestiging na opslaan ("✓ Transactie toegevoegd") |

- Welke modus is default? Handmatig of Import? (Advies: Handmatig, want lagere drempel)
- Hoe switchen tussen modi? Tabs, toggle, of aparte schermen?
- Hoe visueel onderscheiden tussen Uitgave/Inkomst? Kleur, icoon, positie?
- Waar plaats je privacy-signalen zonder dat het opdringerig wordt?

- Hoofd-KPI (Hero Section)

"Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

Visueel: Progress bar of cirkel (groen = goed, oranje = op, rood = over budget)
- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |
| Maand | selector |

Dropdown of swipe-interface: "December 2024" ← →
Quick stats: "✓ 47 transacties deze maand"
- Dropdown of swipe-interface: "December 2024" ← →
- Quick stats: "✓ 47 transacties deze maand"
- Inkomsten vs Uitgaven (Simpele Grafiek)

| 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |
| --- | --- |
| - 2 kleuren: Groen (inkomsten) | Rood (uitgaven) |

Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)
- Quick Actions (FAB of Bottom Bar)

| "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |
| --- | --- |
| - "📊" button: Rapporten (toekomstig | mag disabled zijn in wireframe) |

- "Vrije Bestedingsruimte" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |
| Visueel | Progress bar of cirkel (groen = goed, oranje = op, rood = over budget) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50 over deze maand" |

| Key | Value |
| --- | --- |
| Dropdown of swipe | interface: "December 2024" ← → |
| Quick stats | "✓ 47 transacties deze maand" |

- Bar chart of lijndiagram
- 2 kleuren: Groen (inkomsten), Rood (uitgaven)
- X-as: Weken of dagen (afhankelijk van zoom-niveau)

- Top 5 categorieën (bijv. Boodschappen, Vervoer, Vaste lasten)
- Per categorie:

Naam + icoon
Bedrag besteed vs budget (€120 / €150)
Progress bar (groen → rood)
- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)
- Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

- Naam + icoon
- Bedrag besteed vs budget (€120 / €150)
- Progress bar (groen → rood)

| Key | Value |
| --- | --- |
| "+" button | Transactie toevoegen (shortcut naar Invoer-scherm) |
| "📊" button | Rapporten (toekomstig, mag disabled zijn in wireframe) |
| "⚙️" button | Instellingen |

| Key | Value |
| --- | --- |
| Informatiehiërarchie | Belangrijkste info bovenaan (Vrije Bestedingsruimte) |
| Scannability | Moet binnen 3 seconden te begrijpen zijn |
| Actie | gericht: Duidelijke CTA ("Transactie toevoegen") altijd zichtbaar |
| Emotionele respons | Gebruik kleur psychologie (groen = goed, rood = waarschuwing, niet judgmental) |
| Privacy | signaal: Eventueel subtiele indicator dat data lokaal is (geen sync-icoon) |

- Hoe presenteer je "Vrije Bestedingsruimte" visueel krachtig zonder overdrijving?
- Welke grafiektype is meest intuïtief voor non-finance users?
- Hoe balanceer je informatiedichtheid vs white space? (minimalistisch maar compleet)
- Waar plaats je Quick Actions? FAB (Floating Action Button) of Bottom Navigation?

| Key | Value |
| --- | --- |
| Primair | iOS (iPhone) - design voor iPhone 13/14/15 standaard formaat |
| Secundair | Android (kan later aangepast worden) |
| Orientatie | Portrait (staand) |

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Niet nodig | Hi-fi mockups, animaties, interactions (komt later) |

- Figma (preferred voor collaborative review)
- Sketch
- Adobe XD
- Balsamiq
- Of zelfs pen & papier gescand

- Tap/click areas
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale database")
- Edge cases (bijv. "Wat als geen transacties deze maand?")

- "Wat denk je dat er gebeurt als je op deze knop klikt?" (voor Invoer-scherm)
- "Wat vertelt dit scherm jou over jouw financiële situatie?" (voor Dashboard)
- "Hoe zou je een uitgave toevoegen?" (task-based test)
- "Voel je je comfortabel met waar je data blijft?" (privacy-perceptie)

- Waarom heb je gekozen voor deze layout?
- Welke UX-patterns heb je toegepast? (bijv. progressive disclosure, chunking)
- Waar heb je bewust gekozen voor eenvoud over features?

- Wireframe 1: INVOER-scherm

 Handmatige invoer versie
 CSV import versie
 Annotaties voor interacties
- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties
- Wireframe 2: DASHBOARD-scherm

 Hero section (Vrije Bestedingsruimte)
 Inkomsten vs Uitgaven grafiek
 Budget per Categorie lijst
 Quick Actions
 Annotaties voor data-sources
- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources
- Design Rationale document (1-2 pagina's)

 Keuzes uitgelegd
 UX-patterns toegelicht
 Privacy-signalering strategie
- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie
- Gebruikerstest Script (Concept)

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

- Handmatige invoer versie
- CSV import versie
- Annotaties voor interacties

- Hero section (Vrije Bestedingsruimte)
- Inkomsten vs Uitgaven grafiek
- Budget per Categorie lijst
- Quick Actions
- Annotaties voor data-sources

- Keuzes uitgelegd
- UX-patterns toegelicht
- Privacy-signalering strategie

| Key | Value |
| --- | --- |
| 3 | 5 validatievragen per scherm |
| 1 | 2 task-based scenarios |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF |
| Documenten | Markdown of PDF |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 2-3 uur |
| Wireframe 2 (Dashboard) | 2-3 uur |
| Documentatie | 1-2 uur |
| Totaal | 5-8 uur (1 werkdag) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)

| Key | Value |
| --- | --- |
| Dyme (NL) | bekijk hun handmatige invoer flow |
| Wallet by BudgetBakers | bekijk dashboard indeling |
| Spendle | bekijk privacy-signalering |

- Te veel features op 1 scherm (zoals Mint)
- Onduidelijke categorisering (zoals Toshl)
- Privacy-signalen die angstig maken (zoals Revolut's security pop-ups)

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor technische haalbaarheid | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | Quick call (15 min) - vragen over briefing |
| 50% milestone | Review schetsen (30 min) - richting valideren |
| 100% | Final review (45 min) - deliverables doorlopen |

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Privacy-first aanpak is zichtbaar in design
- Handmatige invoer flow is binnen 3 taps/clicks te voltooien
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 3 seconden scannen
- Design rationale legt keuzes uit
- Gebruikerstest script is klaar voor validatie
- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ 0 critical usability issues (blockers voor MVP)

| - Complexiteit te versimpelen (CSV-import voelt technisch | maar moet toegankelijk aanvoelen) |
| --- | --- |
| - Privacy visueel te maken (niet alleen zeggen | maar laten zien) |

- ✅ Akkoord met scope & deliverables
- 📅 Verwachte opleveringsdatum
- ❓ Eventuele vragen of onduidelijkheden

| Key | Value |
| --- | --- |
| GO | Start opdracht |
| REVISE | Aanpassingen nodig (specificeer hieronder) |

# 📐 Opdracht voor David - UX/UI Designer (Consult)

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (Primair)

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen:

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden

### Platform

### Design Fidelity

### Tools (Keuze David)

### Annotaties

## 🧪 Validatie-ondersteuning

### 1. Gebruikerstest Script (Concept)

### 2. Design Rationale (Korte toelichting)

## 📦 Deliverables Checklist

## ⏱️ Tijdsinschatting & Prioriteit

## 🔗 Relevante Documentatie

## 💬 Communicatie & Vragen

## ✅ Acceptatiecriteria (Wat is "Done"?)

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?)

## 📝 Slot: Waarom Dit Belangrijk Is

## ✍️ Akkoord & Kickoff

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

> "Dashboard: Koos voor cirkel-progress ipv bar omdat dit visueel compacter is en emotioneel minder 'judgmental' aanvoelt. Gebruikers zien ratio vs absoluut getal."

| Key | Value |
| --- | --- |
| Project | Minimal Cashflow - Privacy-First Budget App |
| Fase | Fase 1, Stap 3 - Wireframes & User Flows |
| Opdrachtgever | Manasse (Lead) via Elias (Product Strategist) |
| Datum | [Vandaag] |
| Deadline | [Te bepalen door Lead] |

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voordat we investeren in volledige development. Focus op gebruiksvriendelijkheid, privacy-gevoel en snelheid van begrip.
Deliverables:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 3 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden):

Gebruik de tool die je het snelst laat werken:

Voeg bij wireframes korte notities toe:

Naast de wireframes, lever ook:

Stel 3-5 vragen op die we kunnen stellen tijdens validatie:
Voorbeeld vragen:

Leg per scherm kort uit (3-5 bullets):

Voorbeeld:

David levert op:

Formaat:

Geschatte effort:

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 3-5 werkdagen] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):

Anti-patterns (vermijden):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:

Na gebruikerstests (Stap 4) verwachten we:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP. Als gebruikers hier niet doorheen komen, faalt het hele product. We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Laat zien waarom eenvoud zo krachtig is! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze opdracht te geven?

Succes David! We kijken uit naar je werk. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Team

---

**Claude:**

twee opmerkingen (revisie) 1) We maken de app voor mensen die meer duidelijkheid en grip willen hebben op hun financiën. Dat kunnen ook mensen zijn in armoede of met schulden van jong tot oud. 
2) We maken de app voor zowel IOS als Android. Native React dus2 dec 2025

---

**Claude:**

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

- Mensen in armoede of met schuldenproblematiek
- Jong tot oud (breed leeftijdsspectrum: 18-65+)
- Variërend opleidingsniveau en digitale vaardigheden

- ✅ Toegankelijkheid is KRITIEK (WCAG-compliant, duidelijke taal, grote touch targets)
- ✅ Geen stigmatisering (vermijd "budget overschreden" met negatieve framing)
- ✅ Empathie in UX (begrijp stress van financiële onzekerheid)
- ✅ Laagdrempelig (ook voor mensen met beperkte smartphone-ervaring)

| Key | Value |
| --- | --- |
| Cross | platform: iOS EN Android (React Native) |
| Design moet werken binnen React Native component | beperkingen |
| Gebruik universele UI | patterns (geen platform-specifieke elementen) |

- 2 sets wireframes (lo-fi schetsen of mid-fi mockups)
- Korte toelichting bij ontwerpkeuzes (incl. toegankelijkheid)
- Validatie-vragen voor gebruikerstests (inclusief voor diverse doelgroepen)

- Privacy-bewuste gebruikers

Willen geen bankkoppeling
Technisch vaardig (25-45 jaar)
- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)
- Mensen met onregelmatig inkomen

| Freelancers | ZZP'ers | wisselende inkomsten |
| --- | --- | --- |
| - Freelancers | ZZP'ers | wisselende inkomsten |

| Beperkt budget | elke euro telt |
| --- | --- |
| - Beperkt budget | elke euro telt |

55-75+ jaar
Mogelijk beperkte digitale vaardigheden
Waarde autonomie en controle
Kunnen visuele beperkingen hebben
- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben
- Jongeren die leren budgetteren ⚠️ NIEUW

| Studenten | starters op arbeidsmarkt |
| --- | --- |
| - Studenten | starters op arbeidsmarkt |

- Willen geen bankkoppeling
- Technisch vaardig (25-45 jaar)

- Freelancers, ZZP'ers, wisselende inkomsten
- Veel contant geld
- 25-55 jaar

- Beperkt budget, elke euro telt
- Kunnen stress/angst ervaren bij financiën
- Alle leeftijden (18-65+)
- Mogelijk lager opleidingsniveau

- 55-75+ jaar
- Mogelijk beperkte digitale vaardigheden
- Waarde autonomie en controle
- Kunnen visuele beperkingen hebben

- 18-25 jaar
- Eerste keer zelfstandig financiën beheren
- Studenten, starters op arbeidsmarkt

| Key | Value |
| --- | --- |
| ❌ VERMIJD | Schuld-inducerende taal ("Je hebt te veel uitgegeven", rode waarschuwingen) |
| ✅ GEBRUIK | Neutrale, helpende taal ("Nog €50 beschikbaar deze week", "Budget bijna bereikt") |
| ✅ FOCUS | Op wat WEL kan, niet wat NIET kan |

- ✅ Grote tekst (minimaal 16px body text)
- ✅ Grote touch targets (minimaal 44x44px)
- ✅ Duidelijke labels (geen iconen zonder tekst)
- ✅ Eenvoudige navigatie (max 3 niveaus diep)
- ✅ Bevestigingen bij belangrijke acties

- ✅ Hoog contrast (WCAG AA minimaal, AAA ideaal)
- ✅ Kleur is NIET de enige informatie-drager (iconen + tekst)
- ✅ Screen reader support (semantische labels)

| Key | Value |
| --- | --- |
| SETUP | Veilige eerste configuratie (PIN, accounts, categorieën) |
| INVOER | Transacties toevoegen (handmatig + CSV-import) |
| DASHBOARD | Inzicht in cashflow en budget |

| - ✅ Inclusief & empathisch - geen stigmatisering | begrijp financiële stress |
| --- | --- |
| - ✅ Privacy-first visueel communiceren (geen cloud-iconen | wel lokaal/versleuteld-gevoel) |
| - ✅ Eenvoud boven volledigheid (geen feature-overload | ook voor beginners) |
| - ✅ Transparantie (duidelijk waar data naartoe gaat | wat er gebeurt) |
| - ✅ Snelle onboarding (binnen 5 minuten productief | ook voor ouderen) |

| Key | Value |
| --- | --- |
| Handmatige Invoer (Default | laagste drempel) |
| Velden (in deze volgorde | logische flow): |

Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

Bedrag (numeriek keyboard, EUR symbool, groot invoerveld)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

Categorie (dropdown met iconen + tekst)

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

Wanneer? (datepicker, default: vandaag)

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| Key | Value |
| --- | --- |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

CTA:

| "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field
- Rekening (dropdown: Bankrekening, Cash, Spaarrekening)
- Notitie (optioneel tekstveld, placeholder: "Bijv. 'Albert Heijn'")
- "Opslaan" button (prominent, groot - min 44px hoog)
- ⚠️ Toegankelijkheid: Duidelijk contrast, loading state bij tap
- CSV Import (Optioneel - voor gevorderde gebruikers)
Flow:

Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

Stap 2: Upload-zone

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

Stap 3: Preview (tabel van eerste 3 transacties)

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

Waarschuwing (duidelijk zichtbaar):

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

CTA:

"Importeer [X] transacties" button (groot, duidelijk)
Annuleren-optie (evengroot, secondary style)
- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- Type (toggle met duidelijke labels: "Uitgave" / "Inkomst" - visueel onderscheidend)

| ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| --- | --- | --- |
| - ⚠️ Toegankelijkheid: Niet alleen kleur | ook iconen (➖ Uitgave | ➕ Inkomst) |
| - Bedrag (numeriek keyboard | EUR symbool | groot invoerveld) |

| ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |
| --- | --- |
| - ⚠️ Toegankelijkheid: Minimaal 18px font | duidelijk focus state |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |
| Wanneer? (datepicker, default | vandaag) |

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| ⚠️ Toegankelijkheid | Grote kalender-UI, niet alleen input field |
| Rekening (dropdown | Bankrekening, Cash, Spaarrekening) |
| Notitie (optioneel tekstveld, placeholder | "Bijv. 'Albert Heijn'") |

- ⚠️ Toegankelijkheid: Niet alleen kleur, ook iconen (➖ Uitgave, ➕ Inkomst)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Minimaal 18px font, duidelijk focus state |
| Label | "Hoeveel?" (niet "Bedrag" - begrijpelijker) |

| Key | Value |
| --- | --- |
| Voorbeelden | 🏠 Vaste lasten, 🛒 Boodschappen, 🚗 Vervoer, 🎉 Vrije tijd |
| ⚠️ Toegankelijkheid | Iconen hebben alt-text voor screen readers |

- ⚠️ Toegankelijkheid: Grote kalender-UI, niet alleen input field

| - "Opslaan" button (prominent | groot - min 44px hoog) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Duidelijk contrast | loading state bij tap |

- Stap 1: "Van welke bank?" (dropdown: ING, Rabobank, ABN AMRO, Bunq, Knab, SNS, Andere)

| Key | Value |
| --- | --- |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| ⚠️ Toegankelijkheid | Bank-logo's + naam (visueel + tekst) |
| Stap 2 | Upload-zone |

| Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |
| --- | --- |
| - Grote knop: "Kies CSV-bestand" (drag & drop is optioneel | niet primair) |

| Kolommen: Datum | Omschrijving | Bedrag |
| --- | --- | --- |
| - Kolommen: Datum | Omschrijving | Bedrag |

| ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |
| --- | --- |
| - ⚠️ Toegankelijkheid: Neutral toon (niet dreigend) | info-icoon met uitleg |

| "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| Annuleren-optie (evengroot | secondary style) |
| - "Importeer [X] transacties" button (groot | duidelijk) |
| - Annuleren-optie (evengroot | secondary style) |

- ⚠️ Toegankelijkheid: Bank-logo's + naam (visueel + tekst)

| Key | Value |
| --- | --- |
| Grote knop | "Kies CSV-bestand" (drag & drop is optioneel, niet primair) |
| ⚠️ Toegankelijkheid | Grote touch area (min 60px hoog) |
| Instructie | "Download eerst je bankafschrift als CSV-bestand" (link naar help) |

| Key | Value |
| --- | --- |
| Kolommen | Datum \| Omschrijving \| Bedrag |
| ⚠️ Toegankelijkheid | Scroll-baar, responsive tabel |

| Key | Value |
| --- | --- |
| ℹ️ "Let op | Alleen transacties van de afgelopen 3 maanden worden geïmporteerd" |
| ⚠️ Toegankelijkheid | Neutral toon (niet dreigend), info-icoon met uitleg |

| - "Importeer [X] transacties" button (groot | duidelijk) |
| --- | --- |
| - Annuleren-optie (evengroot | secondary style) |

| Key | Value |
| --- | --- |
| Toon subtiel | "🔒 Blijft op jouw apparaat" (klein, onder CTA) |
| NIET | "Je data is veilig bij ons" (suggereert cloud-opslag) |

| - Tekst grootte: Minimaal 16px body | 18px voor invoervelden |
| --- | --- |
| - Kleur contrast: Minimaal 4.5:1 voor tekst | 3:1 voor UI-elementen |
| - Error messages: Duidelijk | helpend (niet "Ongeldige invoer" maar "Vul een bedrag in") |

| Key | Value |
| --- | --- |
| Handmatige invoer | Max 5 taps/inputs (Type → Bedrag → Categorie → Opslaan, rest heeft defaults) |
| CSV import | Max 3 stappen (Bank → Upload → Bevestig) |

| - Validatie: Bedrag niet 0/negatief | datum niet ver in toekomst |
| --- | --- |
| - Maar: Zacht valideren - geen rode errors | wel helpers ("Bedrag moet meer dan €0 zijn") |

| Key | Value |
| --- | --- |
| Bevestiging na opslaan | "✓ Transactie toegevoegd" (toast, verdwijnt na 2 sec) |
| Bij import | "✓ [X] transacties geïmporteerd" + optie om te bekijken |

| Key | Value |
| --- | --- |
| Bij negatief saldo | NIET "Je gaat over budget!" |
| WEL | "Let op: je hebt €50 minder dan gepland" (neutraal, informatief) |

- Welke modus is default?

| Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| CSV import moet duidelijk zijn | maar niet opdringerig |
| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

| Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |
| --- | --- |
| - Advies: Tabs boven (universeel pattern | werkt op iOS + Android) |

| Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |
| --- | --- |
| - Advies: Iconen + kleur + labels (➖🔴 Uitgave | ➕🟢 Inkomst) |

| Advies: Footer van scherm | klein maar leesbaar |
| --- | --- |
| - Advies: Footer van scherm | klein maar leesbaar |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

| - Advies: Handmatig (laagste drempel | ook voor ouderen/beginners) |
| --- | --- |
| - CSV import moet duidelijk zijn | maar niet opdringerig |

- Advies: Tabs boven (universeel pattern, werkt op iOS + Android)
- Vermijd hamburger menu (niet toegankelijk voor ouderen)

| Key | Value |
| --- | --- |
| Advies | Iconen + kleur + labels (➖🔴 Uitgave, ➕🟢 Inkomst) |
| NIET | Alleen kleur (kleurenblindheid) |

| Key | Value |
| --- | --- |
| Advies | Footer van scherm, klein maar leesbaar |
| Optioneel | ℹ️ info-icoon met meer uitleg (opt-in) |

| Key | Value |
| --- | --- |
| Advies | Help-link naar uitleg met screenshots per bank |
| Fallback | "Geen CSV? Gebruik handmatige invoer" (duidelijk zichtbaar) |

- Hoofd-KPI (Hero Section) - HERZIEN voor Empathie
Optie A (Voor gebruikers met positief saldo):

"Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

| Key | Value |
| --- | --- |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

Optie B (Voor gebruikers met negatief saldo/schulden):

"Je tekort deze maand" (neutraal, niet beschuldigend)

Voorbeeld: "€ 127,80 tekort"

| Visueel: Progress ring (rood | maar met helper-tekst) |
| --- | --- |
| Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

Cruciale Toegankelijkheid:

Groot cijfer: Minimaal 28-32px font
Hoog contrast: Minimaal 7:1 (AAA rating)
Niet alleen kleur: Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!)
- "Nog beschikbaar deze maand" (groot, prominent)

Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
Voorbeeld: "€ 342,50"
- Formule: Inkomen - Vaste lasten - Variabele uitgaven (deze maand)
- Voorbeeld: "€ 342,50"
- Visueel: Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort)
- Toon: "Je hebt nog goed ruimte" (positief, ondersteunend)
- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

| Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |
| - Quick stat: "47 transacties" (klein | onder maand) |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
X-as: Weken van de maand (Week 1, Week 2, etc.)
⚠️ Toegankelijkheid:

Labels BOVEN bars (niet binnen - leesbaar op klein scherm)
Minimaal 12px font voor as-labels
Hoog contrast bars (#00A86B groen, #DC143C rood - colorblind safe)
- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Layout: Icoon | Naam | Bedrag | Progress bar |
| --- | --- | --- | --- |
| - Layout: Icoon | Naam | Bedrag | Progress bar |

- "Nog beschikbaar deze maand" (groot, prominent)

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |
| Visueel | Progress ring/bar (groen = ruimte over, geel = bijna op, rood = tekort) |
| Toon | "Je hebt nog goed ruimte" (positief, ondersteunend) |

| Key | Value |
| --- | --- |
| Formule | Inkomen - Vaste lasten - Variabele uitgaven (deze maand) |
| Voorbeeld | "€ 342,50" |

- "Je tekort deze maand" (neutraal, niet beschuldigend)

| Voorbeeld: "€ 127 | 80 tekort" |
| --- | --- |
| - Voorbeeld: "€ 127 | 80 tekort" |
| - Visueel: Progress ring (rood | maar met helper-tekst) |
| - Toon: "Kijk waar je kunt besparen ↓" (actionable | niet judgmental) |
| - ⚠️ Toegankelijkheid: GEEN negatieve framing ("schuld" | "overschrijding") |

- Voorbeeld: "€ 127,80 tekort"

| Key | Value |
| --- | --- |
| Groot cijfer | Minimaal 28-32px font |
| Hoog contrast | Minimaal 7:1 (AAA rating) |
| Niet alleen kleur | Icoon + tekst + kleur (🟢✓ / 🟡⚠️ / 🔴!) |

| - Quick stat: "47 transacties" (klein | onder maand) |
| --- | --- |
| - ⚠️ Toegankelijkheid: Min 44px hoog per knop | duidelijke labels |

- 2 kleuren: 🟢 Groen (inkomsten), 🔴 Rood (uitgaven)
- Labels: "Inkomsten: €1.200" | "Uitgaven: €857,50" (groot, boven bars)
- X-as: Weken van de maand (Week 1, Week 2, etc.)
- ⚠️ Toegankelijkheid:

| Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |
| --- | --- |
| - Hoog contrast bars (#00A86B groen | #DC143C rood - colorblind safe) |

| Key | Value |
| --- | --- |
| Labels BOVEN bars (niet binnen | leesbaar op klein scherm) |
| Minimaal 12px font voor as | labels |
| Hoog contrast bars (#00A86B groen, #DC143C rood | colorblind safe) |

- Layout: Icoon | Naam | Bedrag | Progress bar
- Voorbeeld:

- Kleurlogica (HERZIEN):

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |

100%: Rood + helper ("€20 meer dan gepland")
- 0-70%: Groen (ruimte over)
- 71-90%: Geel (bijna op)
- 91-100%: Oranje (budget bereikt)
- 100%: Rood + helper ("€20 meer dan gepland")
- ⚠️ Toegankelijkheid:

Icoon + tekst (niet alleen icoon)
Progress bar + percentage (niet alleen bar)
Minimaal 16px font voor categorie-namen
48px hoog per rij (makkelijk tappen)
- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)
- ⚠️ Empathie:

| WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |
| --- | --- |
| - WEL: "€20 meer uitgegeven dan gepland" (neutraal | feitelijk) |

| Key | Value |
| --- | --- |
| 0 | 70%: Groen (ruimte over) |
| 71 | 90%: Geel (bijna op) |
| 91 | 100%: Oranje (budget bereikt) |
| 100% | Rood + helper ("€20 meer dan gepland") |

- Icoon + tekst (niet alleen icoon)
- Progress bar + percentage (niet alleen bar)
- Minimaal 16px font voor categorie-namen
- 48px hoog per rij (makkelijk tappen)

| Key | Value |
| --- | --- |
| NIET | "Budget overschreden! ⛔" |
| WEL | "€20 meer uitgegeven dan gepland" (neutraal, feitelijk) |

- Quick Actions (Bottom Bar - React Native Safe Area)
Layout: Bottom Navigation (3-4 items, universeel pattern)
Items:

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

⚠️ Toegankelijkheid:

| Icoon + label (altijd beide | niet alleen icoon) |
| --- | --- |
| - Icoon + label (altijd beide | niet alleen icoon) |

| Key | Value |
| --- | --- |
| "Toevoegen" (➕) | Grootste button (primary action) |
| "Overzicht" (📊) | Huidige scherm (actief) |
| "Instellingen" (⚙️) | Navigatie |

- Icoon + label (altijd beide, niet alleen icoon)
- Minimaal 56px hoog (React Native safe area)
- Haptic feedback bij tap (Android + iOS)
- Duidelijke active state (kleur + onderstreping)

| Key | Value |
| --- | --- |
| Belangrijkste info bovenaan | "Nog beschikbaar" of "Tekort" |
| Scannability | Max 5 seconden om hoofdvraag te beantwoorden |
| Progressive disclosure | Details (categorieën) komen daarna |

- Kleurpsychologie - empathisch:

| Groen = positief | ruimte | controle |
| --- | --- | --- |
| Geel = attentie | bijna op | let op |
| - Groen = positief | ruimte | controle |
| - Geel = attentie | bijna op | let op |

✅ "Nog over", "beschikbaar", "meer uitgegeven"
❌ "Schuld", "overschrijding", "fout", "probleem"
- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Groen = positief | ruimte | controle |
| --- | --- | --- |
| - Geel = attentie | bijna op | let op |

- ✅ "Nog over", "beschikbaar", "meer uitgegeven"
- ❌ "Schuld", "overschrijding", "fout", "probleem"

| - Tekst grootte: Min 16px body | 28-32px voor hoofd-KPI |
| --- | --- |
| - Screen reader: Semantische HTML | alt-texts voor grafieken |

| Key | Value |
| --- | --- |
| Subtle indicator | Klein 🔒 icoon in app header (altijd zichtbaar) |
| Geen sync | icoon (suggereert cloud) |

- Geen verborgen navigatie (hamburger menu)
- Duidelijke labels (niet alleen iconen)
- Grote touch areas (vermijd accidental taps)
- Confirmatie bij belangrijke acties ("Weet je zeker dat je...")

- Geen alarmbells (❌ "URGENT: Budget overschreden!")
- Wel actionable helpers (✅ "Bekijk waar je kunt besparen")
- Focus op controle (niet op falen)

- Hoe presenteer je "Tekort" zonder stigma?

| Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |
| --- | --- | --- |
| - Advies: Neutraal icoon (⚠️ niet ⛔) | helpende tekst | focus op oplossing |

| Advies: Vertical bar chart (simpelste | meest universeel) |
| --- | --- |
| - Advies: Vertical bar chart (simpelste | meest universeel) |

Advies: Meer white space voor toegankelijkheid (ook ouderen)
Max 3-4 data-punten per sectie
- Advies: Meer white space voor toegankelijkheid (ook ouderen)
- Max 3-4 data-punten per sectie
- Waar plaats je Quick Actions?

| Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |
| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- Advies: Neutraal icoon (⚠️ niet ⛔), helpende tekst, focus op oplossing

| Key | Value |
| --- | --- |
| Advies | Vertical bar chart (simpelste, meest universeel) |
| Alternatief | Line chart (voor trends over weken) |
| VERMIJD | Pie charts (moeilijk te lezen op klein scherm) |

| Key | Value |
| --- | --- |
| Advies | Meer white space voor toegankelijkheid (ook ouderen) |
| Max 3 | 4 data-punten per sectie |

| - Advies: Bottom Navigation Bar (React Native standaard | werkt cross-platform) |
| --- | --- |
| - NIET: Floating Action Button (FAB) - té iOS-centric | niet toegankelijk |

| Key | Value |
| --- | --- |
| Advies | Tooltips/info-iconen (opt-in uitleg) |
| Onboarding | Eerste keer = korte tutorial (skippable) |

- ⚠️ HERZIEN: iOS EN Android (React Native)
- Design voor:

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |
| Orientatie | Portrait (staand) - primair |
| Dark mode | Moet ondersteund worden (React Native native support) |

| Key | Value |
| --- | --- |
| iOS | iPhone 13/14/15 standaard (390x844pt) |
| Android | Samsung Galaxy S21/S22 (360x800dp) |

- ✅ Bottom Tab Navigation (werkt native op beide platforms)
- ✅ Modal sheets (React Native's Modal component)
- ✅ Standard buttons (TouchableOpacity/Pressable)
- ✅ TextInput (native keyboard support)
- ❌ VERMIJD: Platform-specific gestures (3D Touch, force touch)
- ❌ VERMIJD: Custom native components (te complex voor MVP)

| Key | Value |
| --- | --- |
| iOS | Notch + home indicator (gebruik SafeAreaView) |
| Android | Status bar + navigation bar |
| Bottom navigation | Min 56px hoog + safe area insets |

| Key | Value |
| --- | --- |
| ✅ Kleurcontrast | Min 4.5:1 voor normale tekst, 3:1 voor grote tekst (>18px) |
| ✅ Touch targets | Min 44x44px (iOS) / 48x48dp (Android) |
| ✅ Tekst resize | Tot 200% zonder content loss |
| ✅ Focus indicators | Duidelijk zichtbaar (min 2px border) |

- ✅ Kleurcontrast: Min 7:1 voor normale tekst
- ✅ Touch targets: Min 48x48px overal
- ✅ Geen animaties >3 seconden (optie om uit te zetten)

| Key | Value |
| --- | --- |
| Minimaal | Lo-fi schetsen (pen & papier of digitaal) |
| Aanbevolen | Mid-fi wireframes (grijstinten, geen branding/kleuren) |
| Annoteer | Lettergroottes, touch target sizes, kleurcontrasten |
| Niet nodig | Hi-fi mockups, animaties, micro-interactions (komt later) |

- Figma (preferred - collaborative review + React Native plugins)
- Sketch + React Native plugin
- Adobe XD
- Balsamiq
- Of pen & papier gescand

- React Native Design System
- Accessibility Checker (Stark)
- Contrast (voor WCAG checks)

- Tap/click areas (met minimale sizes: 44px/48dp)
- Tekst sizes (minimaal 16px voor body)
- Kleurcontrasten (bijv. "#333 op #FFF = 12.6:1 ✓")
- Waar data vandaan komt (bijv. "Haalt totaal uit lokale SQLite database")
- Edge cases:

Wat als geen transacties deze maand?
Wat als gebruiker negatief saldo heeft?
Wat als ouderen de CSV-import niet begrijpen?
- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?
- Toegankelijkheid notes (bijv. "Alt-text voor grafiek: 'Bar chart met inkomsten €1200 en uitgaven €857'")

- Wat als geen transacties deze maand?
- Wat als gebruiker negatief saldo heeft?
- Wat als ouderen de CSV-import niet begrijpen?

- "Wat zou je doen om bij te houden dat je €15 hebt uitgegeven aan boodschappen?" (task-based)
- "Waar zou je klikken om een uitgave toe te voegen?" (navigatie)
- "Wat gebeurt er als je op 'CSV Import' klikt?" (begrip)

- "Wat vertelt dit scherm jou over jouw financiële situatie?" (comprehensie)
- "Hoeveel heb je nog over deze maand?" (scannability - moet binnen 5 sec antwoord hebben)
- "Waar kijk je als eerste naar?" (visuele hiërarchie)

- Wireframe 1: INVOER-scherm

[
- [

- [

# 📐 Opdracht voor David - UX/UI Designer (Consult) [HERZIENE VERSIE]

## 🔄 Belangrijke Herziene Punten

## 🎯 Opdracht Samenvatting

## 📋 Context & Achtergrondinformatie

### Goedgekeurde Concept UVP

### Doelgroep (HERZIEN - Breed & Inclusief)

### Cruciale Toegankelijkheids-overwegingen

### Kernfuncties (Uit Stap 2)

### Belangrijke Design Principes (HERZIEN)

## 🖼️ Te Ontwerpen Schermen (2 Kernschermen)

### Kernscherm 1: INVOER-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

### Kernscherm 2: DASHBOARD-scherm (Primair)

#### Functionele Vereisten:

#### UX-overwegingen (HERZIEN):

#### Design Vraagstukken voor David:

## 📐 Specificaties & Technische Randvoorwaarden (HERZIEN)

### Platform

### React Native Component Constraints

### Toegankelijkheids-specificaties (WCAG 2.1)

### Design Fidelity

### Tools (Keuze David)

### Annotaties (MUST HAVE)

## 🧪 Validatie-ondersteuning (HERZIEN)

### 1. Gebruikerstest Script (Concept) - Inclusief voor Diverse Doelgroepen

#### Voor INVOER-scherm:

#### Voor DASHBOARD-scherm:

### 2. Design Rationale (Korte toelichting) - HERZIEN

## 📦 Deliverables Checklist (HERZIEN)

> "Privacy-first budgetapp die bankdata automatisch verwerkt zonder bankkoppeling — controle over cashflow, ook bij contant geld of onregelmatig inkomen."

| Key | Value |
| --- | --- |
| Project | Minimal Cashflow - Privacy-First Budget App |
| Fase | Fase 1, Stap 3 - Wireframes & User Flows |
| Opdrachtgever | Manasse (Lead) via Elias (Product Strategist) |
| Datum | [Vandaag] |
| Deadline | [Te bepalen door Lead] |
| Versie | 2.0 (Herzien na feedback) |

⚠️ REVISIE 1 - Doelgroep Verbreding:
De app is bedoeld voor iedereen die duidelijkheid en grip wil op hun financiën, inclusief:

Impact op design:

⚠️ REVISIE 2 - Platform:

Wat: Creëer ruwe schetsen/wireframes van de 2 kernschermen voor kwalitatieve validatie met potentiële gebruikers.
Waarom: We moeten valideren of onze UX-aanpak intuïtief is voor diverse gebruikers (incl. mensen met schulden, ouderen, lage digitale vaardigheden) voordat we investeren in development.
Deliverables:

Primaire doelgroepen:

Locatie: Nederland (primair), EU (secundair)

Voor mensen in financiële stress:

Voor ouderen/lage digitale vaardigheden:

Voor mensen met visuele beperkingen:

| Key | Value |
| --- | --- |
| Scherm | "Transactie Toevoegen / Importeren" |
| Waarom dit scherm | Dit is de meest frequente actie die gebruikers uitvoeren. Als dit niet intuïtief is, faalt de app. |

Twee invoermodi (tabs/toggle):

Privacy-signaal:

Toegankelijkheid - Kritieke punten:

Snelheid:

Foutpreventie:

Feedback:

Empathie voor financiële stress:

| Key | Value |
| --- | --- |
| Scherm | "Cashflow Overzicht (Maandelijks)" |
| Waarom dit scherm | Dit is het startscherm waar gebruikers landen na inloggen. Het moet in 5 seconden antwoord geven op: "Hoe sta ik ervoor?" |

Informatieblokken (van boven naar beneden - logische prioriteit):

Link: "Alle categorieën >" (naar detail-scherm, niet onderdeel van deze opdracht)

Informatiehiërarchie:

Emotionele Respons (KRITIEK):

Toegankelijkheid - Kritieke punten:

Privacy-signaal:

Voor ouderen/lage digitale vaardigheden:

Voor mensen in financiële stress:

⚠️ BELANGRIJK voor David:
Gebruik universele patterns die werken in React Native:

Safe Areas (React Native):

MUST HAVE (AA-rating):

NICE TO HAVE (AAA-rating):

Gebruik de tool die je het snelst laat werken:

Handige Figma plugins voor React Native:

Voeg bij wireframes toe:

Naast de wireframes, lever ook:

Stel 5-7 vragen op per scherm, inclusief specifieke vragen voor diverse gebruikers:

Algemeen (alle gebruikers):

Voor ouderen/lage digitale vaardigheden:
4. "Is het duidelijk wat je moet doen om te beginnen?" (onboarding)
5. "Zijn de knoppen groot genoeg om op te klikken?" (touch targets)
6. "Begrijp je wat 'CSV-bestand' betekent?" (jargon-check)
Voor mensen in financiële stress:
7. "Hoe voel je je als je een uitgave toevoegt die je budget overschrijdt?" (emotionele respons)

Algemeen:

Voor ouderen:
4. "Is de tekst groot genoeg om te lezen?" (lettergrootte)
5. "Zijn er dingen die je niet begrijpt?" (duidelijkheid)
Voor mensen met schulden:
6. "Als je een tekort hebt, voelt dit scherm dan beschuldigend of helpt het je?" (empathie-check)
7. "Wat zou je doen om je tekort te verminderen?" (actionability)
Privacy-perceptie (alle gebruikers):
8. "Waar denk je dat je gegevens worden opgeslagen?" (privacy-signalen effectiviteit)
9. "Voel je je comfortabel met het invoeren van je financiële data?" (vertrouwen)

Leg per scherm uit (5-7 bullets), inclusief toegankelijkheidskeuzes:
Template:

Voorbeeld (Dashboard):

David levert op:

---

**Claude:**

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

```
🛒 Boodschappen          €120 / €150
     [████████░░] 80%
```

---

**Claude:**

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

```yaml
SCHERM: [Naam]

LAYOUT KEUZES:
- [Waarom deze structuur?]
- [Welke UX-patterns gebruikt?]

TOEGANKELIJKHEID:
- [Hoe voldoen we aan WCAG AA?]
- [Specifieke overwegingen voor ouderen/lage digitale vaardigheden]

EMPATHIE & INCLUSIVITEIT:
- [Hoe vermijden we stigmatisering?]
- [Hoe helpen we gebruikers in financiële stress?]

EENVOUD:
- [Waar hebben we bewust gekozen voor eenvoud over features?]

CROSS-PLATFORM:
- [Hoe werkt dit in React Native op iOS + Android?]
```

---

**Claude:**

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

```yaml
SCHERM: Dashboard - Cashflow Overzicht

| - Vertical bar chart ipv line chart → simpelste grafiektype | meest universeel begrepen |
| --- | --- |
| - Categorieën als lijst ipv grid → scannability | ook op kleine schermen |

| - Touch targets 48px hoog → makkelijk tappen | ook met beperkte motoriek |
| --- | --- |
| - Icoon + tekst bij categorieën → niet alleen visueel | ook screen reader friendly |

| - Bij negatief saldo: "Je tekort" ipv "Schuld" → neutraal | geen stigma |
| --- | --- |
| - Kleur rood = waarschuwing | niet falen → met helper-tekst "Bekijk waar je kunt besparen" |
| - Progress bars groen/geel/oranje/rood → gradueel | niet binair (goed/fout) |

EENVOUD:
- Max 5 categorieën zichtbaar → vermijdt overwelming
- Geen complexe filters/settings op hoofdscherm → focus op kernvraag

CROSS-PLATFORM:
- Bottom navigation (React Native standard) → werkt identiek op iOS + Android
- SafeAreaView voor notch-support → native handling
```

---

**Claude:**

Continue2 dec 2025

---

**Claude:**

Continue

---

**Claude:**

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

- CSV import versie (optioneel, met hulp)
- Annotaties: touch targets (min 44/48px), lettergroottes (min 16px), contrasten
- Toegankelijkheid notes: WCAG-checks, screen reader labels, color-blind safe
- Wireframe 2: DASHBOARD-scherm

 Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
 Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
 Budget per Categorie lijst (icoon + tekst, progress bar + %)
 Quick Actions (bottom navigation, 3-4 items)
 Annotaties: data-sources, edge cases, toegankelijkheid
 Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?
- Design Rationale document (2-3 pagina's)

| Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| --- | --- |
| - Empathie & inclusiviteit (taalgebruik | kleurpsychologie) |
| - Gebruikerstest Script (Concept | 3-4 pagina's) |

 5-7 validatievragen per scherm
 Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |

 2-3 task-based scenarios (bijv. "Voeg een uitgave toe")
- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

- Hero section ("Nog beschikbaar" OF "Je tekort" - beide scenarios)
- Inkomsten vs Uitgaven grafiek (bar chart, labels boven bars)
- Budget per Categorie lijst (icoon + tekst, progress bar + %)
- Quick Actions (bottom navigation, 3-4 items)
- Annotaties: data-sources, edge cases, toegankelijkheid
- Empathie notes: Hoe vermijden we stigma? Hoe helpen we bij stress?

- Layout keuzes uitgelegd
- UX-patterns toegelicht
- Toegankelijkheidsstrategie (WCAG AA/AAA compliance)
- Empathie & inclusiviteit (taalgebruik, kleurpsychologie)
- Privacy-signalering strategie
- React Native overwegingen (cross-platform patterns)

- 5-7 validatievragen per scherm
- Specifieke vragen voor diverse doelgroepen:

| Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| Lage digitale vaardigheden (jargon | complexiteit) |
| Financiële stress (emotionele respons | stigma) |
| - Ouderen (duidelijkheid | lettergrootte) |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| - Ouderen (duidelijkheid | lettergrootte) |
| --- | --- |
| - Lage digitale vaardigheden (jargon | complexiteit) |
| - Financiële stress (emotionele respons | stigma) |

| Key | Value |
| --- | --- |
| Wireframes | Figma link (view-only) of PDF (met annotaties leesbaar) |
| Documenten | Markdown of PDF |
| Toegankelijkheid audit | Gebruik Figma plugin "Stark" of "Contrast" voor WCAG-checks |

| Key | Value |
| --- | --- |
| Wireframe 1 (Invoer) | 3-4 uur (incl. toegankelijkheids-annotaties) |
| Wireframe 2 (Dashboard) | 3-4 uur (incl. diverse scenario's: positief/negatief saldo) |
| Documentatie (rationale + empathie) | 2-3 uur |
| Gebruikerstest script (inclusief diverse doelgroepen) | 1-2 uur |
| Totaal | 9-13 uur (~1.5-2 werkdagen) |

- Rapport: Marktlandschap & Concurrentieanalyse (zie bijlage) - voor context over concurrenten
- Goedgekeurde UVP & 3 Kernfuncties (hierboven samengevat)
- CSV-onderzoek (optioneel, voor begrip van import-flow complexiteit)
- WCAG 2.1 Guidelines - https://www.w3.org/WAI/WCAG21/quickref/ (voor toegankelijkheidsreferentie)

| - Microsoft Outlook Mobile - grote touch targets | duidelijke navigatie |
| --- | --- |
| - Google Keep - simpele UI | geschikt voor alle leeftijden |

| Key | Value |
| --- | --- |
| Qapital (US) | positieve framing van sparen |
| Emma (UK) | geen stigmatiserende taal bij overschrijding |
| ❌ NIET Mint | té complex, overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Spendle (NL) | goede privacy-communicatie |
| Standard Notes | duidelijke lokale/versleutelde data-indicatoren |

| Key | Value |
| --- | --- |
| ❌ Kleine tekst (<16px) | onleesbaar voor ouderen |
| ❌ Kleine touch targets (<44px) | moeilijk tappen |
| ❌ Alleen kleur voor informatie | kleurenblindheid |
| ❌ Negatieve taal bij budget | overschrijding - stigmatiserend |
| ❌ Complexe grafieken (pie charts, multi | line) - overweldigend voor beginners |

| Key | Value |
| --- | --- |
| Voor UX | vragen: Elias (Product Strategist) - [contact] |
| Voor toegankelijkheidsvragen | [Accessibility Lead naam, of externe consultant] |
| Voor React Native constraints | [Tech Lead naam] - [contact] |
| Voor strategische richting | Manasse (Lead) - [contact] |

| Key | Value |
| --- | --- |
| Dag 1 | 2: Quick call (20 min) - vragen over briefing + toegankelijkheidseisen |
| 50% milestone | Review schetsen (45 min) - valideer richting + toegankelijkheid |

| Check: WCAG AA contrasten | touch target sizes | empathische taal |
| --- | --- | --- |
| - Check: WCAG AA contrasten | touch target sizes | empathische taal |

- Check: WCAG AA contrasten, touch target sizes, empathische taal

- Beide wireframes zijn visueel duidelijk (iemand zonder uitleg begrijpt de flow)
- Handmatige invoer flow is binnen 5 taps/clicks te voltooien (ook voor ouderen)
- Dashboard communiceert "Hoe sta ik ervoor?" binnen 5 seconden scannen

- WCAG 2.1 AA minimaal voldaan:

| Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |
| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

| - Kleurcontrasten ≥ 4.5:1 (normale tekst) | ≥ 3:1 (grote tekst/UI) |
| --- | --- |
| - Tekst ≥ 16px (body) | ≥ 28px (hoofdbedragen) |

- Geen stigmatiserende taal (✓ "tekort" ipv ✗ "schuld")
- Positief/neutraal framing bij negatieve situaties
- Helpende actionables bij waarschuwingen (niet alleen alarm)

| Key | Value |
| --- | --- |
| Privacy | first aanpak is subtiel maar zichtbaar in design |
| Geen cloud/sync | iconen (communiceert lokale opslag) |

- Design werkt binnen React Native constraints
- Geen platform-specific patterns (werkt op iOS + Android)
- Safe areas gemarkeerd (notch, home indicator, status bar)

- Design rationale legt keuzes uit (incl. toegankelijkheid + empathie)
- Gebruikerstest script is klaar voor validatie met diverse doelgroepen
- Annotaties zijn compleet (sizes, contrasten, edge cases)

- Lead (Manasse) + Elias hebben wireframes goedgekeurd voor gebruikerstests
- Toegankelijkheidsaudit is gedaan (via Figma plugin of handmatig)

- ✅ ≥80% gebruikers begrijpt hoe een transactie toe te voegen (zonder hulp)
- ✅ ≥70% gebruikers begrijpt het dashboard binnen 10 seconden
- ✅ 0 critical usability issues (blockers voor MVP)

- ✅ ≥90% ouderen (55+) kan handmatige invoer voltooien
- ✅ ≥80% gebruikers met lage digitale vaardigheden begrijpt hoofdscherm
- ✅ ≥95% gebruikers kan tekst lezen (geen klachten over te kleine letters)
- ✅ ≥90% gebruikers kan knoppen makkelijk tappen (geen mistaps)

- ✅ ≥90% gebruikers voelt dat privacy serieus genomen wordt
- ✅ ≥80% gebruikers met schulden/financiële stress voelt zich NIET veroordeeld door de app
- ✅ ≥70% gebruikers vindt de taal begrijpelijk en ondersteunend (niet jargon/technisch)

- ✅ Geen visuele/interactie-verschillen tussen iOS en Android testgebruikers

- Complexiteit te versimpelen

| CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| Financiële data kan overweldigend zijn | maar moet scanbaar blijven |
| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

| Niet alleen zeggen | maar laten zien |
| --- | --- |
| - Niet alleen zeggen | maar laten zien |

| Ondersteunende taal | niet veroordelend |
| --- | --- |
| Focus op controle en mogelijkheden | niet op falen |
| - Ondersteunende taal | niet veroordelend |
| - Focus op controle en mogelijkheden | niet op falen |

| Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |
| - Grote tekst | grote knoppen | hoog contrast |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

Werkt identiek goed op iOS en Android
Binnen React Native constraints
- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

| - CSV-import voelt technisch | maar moet toegankelijk zijn |
| --- | --- |
| - Financiële data kan overweldigend zijn | maar moet scanbaar blijven |

- Niet alleen zeggen, maar laten zien
- Zonder opdringerig te zijn

| - Ondersteunende taal | niet veroordelend |
| --- | --- |
| - Focus op controle en mogelijkheden | niet op falen |

| - Grote tekst | grote knoppen | hoog contrast |
| --- | --- | --- |
| - Werkt voor ouderen | slechtzienden | mensen met beperkte motoriek |

- Werkt identiek goed op iOS en Android
- Binnen React Native constraints

- ✅ Akkoord met scope & deliverables (incl. toegankelijkheidseisen)
- 📅 Verwachte opleveringsdatum (hou rekening met 1.5-2 werkdagen)
- ❓ Eventuele vragen of onduidelijkheden
- 🛠️ Welke tool ga je gebruiken? (Figma aanbevolen voor WCAG-plugins)
- 🧪 Heb je toegang tot Figma accessibility plugins? (Stark, Contrast)

- ✅ GO - Start opdracht
- ⚠️ REVISE - Aanpassingen nodig (specificeer hieronder):
- 
-

- 
-

## ⏱️ Tijdsinschatting & Prioriteit (HERZIEN)

## 🔗 Relevante Documentatie (HERZIEN)

## 💬 Communicatie & Vragen (HERZIEN)

## ✅ Acceptatiecriteria (Wat is "Done"?) - HERZIEN

## 🎯 Succesindicatoren (Hoe meten we of dit goed is?) - HERZIEN

## 📝 Slot: Waarom Dit Belangrijk Is (HERZIEN)

## ✍️ Akkoord & Kickoff (HERZIEN)

## 📎 Bijlage: Quick Reference - Toegankelijkheidseisen

x] Handmatige invoer versie (default, toegankelijk)

Formaat:

Geschatte effort (verhoogd vanwege toegankelijkheidseisen):

| Key | Value |
| --- | --- |
| Prioriteit | 🔴 Hoog - Stap 3 is kritisch pad naar MVP |
| Deadline | [Lead vult in - Voorstel: binnen 5-7 werkdagen, vanwege verhoogde complexiteit] |

David heeft toegang nodig tot:

Referentie-apps (voor inspiratie, NIET kopiëren):
Voor toegankelijkheid:

Voor empathische financiële UX:

Voor privacy-signalering:

Anti-patterns (VERMIJDEN):

Contact tijdens opdracht:

Verwachte check-ins:

Deze opdracht is afgerond wanneer:
Functioneel:

Toegankelijkheid (KRITIEK):

Empathie & Inclusiviteit:

Privacy:

Cross-Platform:

Documentatie:

Goedkeuring:

Na gebruikerstests (Stap 4) verwachten we:
Algemene bruikbaarheid:

Toegankelijkheid (specifiek):

Empathie & Vertrouwen:

Cross-Platform:

Dit zijn geen criteria voor David's werk, maar wel de context waarom deze wireframes en toegankelijkheid zo belangrijk zijn.

David, deze 2 schermen zijn het hart van de MVP, en de toegankelijkheid en empathie zijn cruciaal. Als mensen in armoede, ouderen, of gebruikers met beperkte digitale vaardigheden hier niet doorheen komen, falen we in onze missie om iedereen grip te geven op hun financiën.
We vertrouwen op jouw expertise om:

Jouw output bepaalt of we met vertrouwen door kunnen naar development. Dit is design met impact - het kan mensen helpen die echte financiële stress ervaren. Laat zien hoe krachtig empathisch, toegankelijk design kan zijn! 💪

David, bevestig ontvangst van deze opdracht door te antwoorden met:

Manasse (Lead): Goedkeuring om David deze herziene opdracht te geven?

Succes David! We kijken uit naar toegankelijk, empathisch design dat écht voor iedereen werkt. 🚀
— Elias (Product Strategist) namens het Minimal Cashflow Team

Print dit uit voor tijdens het ontwerpen:

---

**Claude:**

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────┐
│              TOEGANKELIJKHEID CHECKLIST (WCAG 2.1 AA)        │
├─────────────────────────────────────────────────────────────┤
│ TEKST                                                        │
│ ☐ Body text: min 16px                                       │
│ ☐ Hoofdbedragen: min 28-32px                                │
│ ☐ Contrast normale tekst: min 4.5:1                         │
│ ☐ Contrast grote tekst (>18px): min 3:1                     │
│                                                              │
│ INTERACTIE                                                   │
│ ☐ Touch targets: min 44x44px (iOS) / 48x48dp (Android)      │
│ ☐ Focus states: duidelijk zichtbaar (min 2px border)        │
│ ☐ Geen informatie alleen via kleur (altijd + icoon/tekst)   │
│                                                              │
│ TAAL & EMPATHIE                                              │
│ ☐ Geen stigmatiserende termen (schuld → tekort)             │
│ ☐ Positief/neutraal framing bij negatieve situaties         │
│ ☐ Actionable helpers bij waarschuwingen                     │
│                                                              │
│ SCREEN READERS                                               │
│ ☐ Alt-text voor alle iconen & grafieken                     │
│ ☐ Semantische labels (niet "Button 1" maar "Opslaan")       │
│                                                              │
│ CROSS-PLATFORM (React Native)                               │
│ ☐ Bottom navigation (niet tabs-top)                         │
│ ☐ SafeAreaView voor notch/home indicator                    │
│ ☐ Geen platform-specific gestures                           │
└─────────────────────────────────────────────────────────────┘
```

---

**Claude:**

Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Sonnet 4.5

---

**Claude:**

Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Export (MD)Export (JSON)✅ Lazy-load klaar (0 blokken)

---

**Claude:**

✅ Lazy-load klaar (0 blokken)
