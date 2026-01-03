# Test Title Index (samenvatting.txt)

Dit document is automatisch uit **samenvatting.txt** gegenereerd. Het toont alle `describe` en `it/test`-titels (incl. `.each`) per bestand, met markering voor dynamische titels.

## `src/screens/Wizard/__tests__/WizardPage.test.tsx`
**Describe**
- sumL2186 WizardPage

**It/Test**
- sumL2187 renders without crashing

## `src/__tests__/App.projector.test.tsx`
**Describe**
- sumL2263 WizardPage
- sumL28477 Projector: Navigator & WAI Integriteit
- sumL36354 Household Logic: Status Determination
- sumL43474 App Projector Flow
- sumL44534 Finance Integratie

**It/Test**
- sumL2264 renders without crashing
- sumL23034 moet namen strippen uit de export (Privacy Contract)
- L26 rendeert WelcomeWizard bij status UNBOARDING
- L32 moet false teruggeven bij een lege state
- L32 moet false teruggeven bij een lege state
- L26 rendeert WelcomeWizard bij status UNBOARDING
- L26 rendeert WelcomeWizard bij status UNBOARDING
- L32 moet namen strippen uit de export (Privacy Contract)
- L32 moet de special status vlag zetten bij > 5 volwassenen [2025-12-07]
- L32 moet de special status vlag zetten bij > 5 volwassenen [2025-12-07]
- sumL28486 WAI Check: LandingScreen moet toegankelijke knoppen hebben
- sumL28498 Projector: Moet naar Wizard switchen bij actie
- sumL28513 WAI Check: Dashboard moet direct bereikbaar zijn via Inloggen
- sumL36355 moet "SPECIAL_LARGE" teruggeven voor meer dan 5 volwassenen
- sumL36360 moet "STANDARD" teruggeven voor een klein huishouden
- sumL39654 should migrate correctly
- sumL42109 WAI Check: LandingScreen heeft toegankelijke knoppen
- sumL42117 Projector: switch LANDING → WIZARD rendert wizard UI
- sumL42629 vereist expliciet schemaVersion 1.0
- sumL42636 moet "complete" teruggeven voor 2 volwassenen
- sumL42658 weigert oude versies
- sumL43475 WAI Check: LandingScreen heeft toegankelijke knoppen
- L17 Projector: switch LANDING → WIZARD rendert wizard UI
- sumL44535 berekent netto correct uit de finance tak
- sumL44554 aggregatie met maandnormalisatie

## `WizardController.test.tsx`
**Describe**
- sumL39755 Legacy → Phoenix migratie (leden → members)
- sumL39793 Legacy → Phoenix migratie (leden → members)
- sumL39898 WizardController
- sumL39942 WizardController Integration

**It/Test**
- sumL12222 should update setup data via SET_FIELD
- sumL38079 moet "STANDARD" teruggeven voor klein huishouden (2 volwassenen)
- sumL38090 moet "STANDARD" teruggeven voor klein huishouden (2 volwassenen)
- sumL38096 moet "STANDARD" teruggeven bij alleen kinderen (geen volwassenen)
- sumL38107 moet "STANDARD" teruggeven bij alleen kinderen (geen volwassenen)
- sumL38113 moet SPECIAL_LARGE teruggeven bij 6 volwassenen + kinderen
- sumL39756 zet household.leden om naar data.household.members
- sumL39773 should migrate correctly
- sumL39795 zet household.leden om naar data.household.members
- sumL39899 renders correctly with initial state
- sumL39944 rendert zonder crash en toont de eerste stap
- sumL40313 rendert zonder crash en toont de eerste stap

## `useAppOrchestration.test.tsx`
**Describe**
- sumL12415 householdSelectors

**It/Test**
- sumL12416 should return true if more than 5 adults
- sumL41151 HYDRATING → ONBOARDING bij null
- sumL42483 accepteert Phoenix v1.0 met centen integers
- sumL42519 moet "STANDARD" teruggeven voor 2 volwassenen
- sumL42537 moet "STANDARD" teruggeven voor 2 volwassenen
- sumL42562 moet "complete" teruggeven voor 2 volwassenen
- sumL42572 moet "empty" teruggeven bij een lege lijst
- sumL42579 vereist expliciet schemaVersion 1.0

## `(onbekend-bestand)`
**Describe**
- sumL12504 WAI-004C Finance Integratie
- sumL12521 Household Domain Logic
- sumL12545 WAI-004C Finance Integratie
- sumL12565 Household Domain Logic
- sumL12582 Storage Migratie
- sumL12601 WAI-003: Household Selectors
- sumL13093 GM-001: Euro NumericParser Baseline
- sumL13108 GM-002: Sanitisatie Check
- sumL13137 WAI-004-D: Frequency & Normalisatie Tests
- sumL13146 convertToMonthlyCents (Integer validatie)
- sumL14826 Phoenix Migration
- sumL14871 Phoenix Migration Service
- sumL14938 Phoenix Migration Specialist
- sumL21700 Phoenix Migration Specialist
- sumL21788 Phoenix Migration Specialist
- sumL21996 Phoenix Migration Specialist
- sumL23825 WAI-005C: Export Aggregator
- sumL29534 Phoenix Financial Flow: Validatie op basis van broncode
- sumL37355 Export Logic
- sumL37414 Export Logic
- sumL37476 Export Logic
- sumL37533 Export Logic
- sumL42251 WAI-004C Finance Integratie (Phoenix)
- sumL43254 WAI-004C Finance Integratie (Phoenix)
- sumL45417 FinancialFlow Selectors
- sumL45451 Migration Fixture
- sumL45688 Migration Fixture
- sumL46245 Migration Member Mapping
- sumL46328 Migration Member Mapping
- sumL46407 Migration Member Mapping
- sumL46494 Migration Member Mapping
- sumL46848 Migration Member Mapping
- sumL47135 Migration Member Mapping & Research Data
- sumL47384 Migration Member Mapping & Research Data
- sumL47459 Migration Member Mapping & Research Data
- sumL47981 🔍 Data Orchestrator: Privacy & Research Filter
- sumL48067 🚀 Phoenix Research & Finance Validator
- sumL48122 Migration Member Mapping & Research Data
- sumL48329 🚀 De Grote Verzamelaar: UX & Onderzoek Validatie

**It/Test**
- sumL12505 berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent
- sumL12517 moet strings ("10,50") via de NumericParser omzetten naar centen
- sumL12522 RULE [2024-12-07]: moet een speciale status geven bij > 5 volwassenen
- sumL12527 moet een standaard status geven bij exact 5 volwassenen
- sumL12546 berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent
- sumL12566 RULE [2024-12-07]: geeft SPECIAL_LARGE status bij > 5 volwassenen
- sumL12571 geeft STANDARD status bij exact 5 volwassenen
- sumL12583 moet legacy C7 data ("10,50") omzetten naar Phoenix centen (1050)
- sumL12602 moet true teruggeven voor 6 volwassenen (Project Eis 2025)
- sumL13109 moet omgaan met spaties en vreemde tekens
- sumL13138 getMonthlyFactor geeft de juiste ratio voor alle types
- sumL13147 Week naar Maand: €100/wk wordt €433,33/pm
- sumL13152 4-Weken naar Maand: €1000 per 4wk wordt €1083,33/pm
- sumL13157 Kwartaal naar Maand: €300/kw wordt €100/pm
- sumL13161 Jaar naar Maand: €12.000/jr wordt €1.000/pm
- sumL13165 Default/Onbekend: geeft originele bedrag terug (factor 1)
- sumL14827 should transform legacy C7 income to Phoenix Finance cents
- sumL14872 should migrate legacy data to the new Phoenix structure
- sumL14939 should transform legacy C7 data to new Phoenix Finance cents
- sumL14967 valideert de financiële lade dynamisch
- sumL21701 should transform legacy C7 data to new Phoenix Finance cents
- sumL21789 should transform legacy C7 data to new Phoenix Finance cents
- sumL21997 should transform legacy C7 data to new Phoenix Finance cents
- sumL23776 moet namen strippen uit de export (Privacy Contract)
- sumL23829 moet namen strippen uit de export (Privacy Contract)
- sumL23833 moet de special status vlag zetten bij > 5 volwassenen
- sumL29549 Logic: computePhoenixSummary moet centen correct optellen
- sumL29556 Selector: selectFinancialSummaryVM moet de totals nesting bevatten
- sumL36027 moet false teruggeven bij een lege state
- sumL37361 moet alle transacties kunnen wissen voor een export
- sumL37366 should correctly store and retrieve a transaction
- sumL37420 moet alle transacties kunnen wissen voor een export
- sumL37425 should correctly store and retrieve a transaction
- sumL37482 moet alle transacties kunnen wissen voor een export
- sumL37487 should correctly store and retrieve a transaction
- sumL37540 moet alle transacties kunnen wissen voor een export
- sumL37546 should correctly store and retrieve a transaction
- sumL38039 moet "SPECIAL_LARGE" teruggeven voor > 5 volwassenen
- sumL38045 moet "STANDARD" teruggeven voor exact 5 volwassenen
- sumL38056 moet "STANDARD" teruggeven voor exact 5 volwassenen
- sumL38062 moet "STANDARD" blijven bij gemengde samenstelling met 5 volwassenen en 2 kinderen
- sumL38558 migreert legacy data naar Phoenix
- sumL41832 uses removeItem instead of clear() for compliance (Safety gate)
- sumL41846 moet "SPECIAL_LARGE" teruggeven voor > 5 volwassenen
- sumL41852 moet "STANDARD" teruggeven voor exact 5 volwassenen
- sumL41863 moet "STANDARD" teruggeven voor exact 5 volwassenen
- sumL41869 moet "STANDARD" blijven bij gemengde samenstelling met 5 volwassenen en 2 kinderen
- sumL41886 moet "STANDARD" teruggeven voor klein huishouden (2 volwassenen)
- sumL41897 moet "STANDARD" teruggeven voor klein huishouden (2 volwassenen)
- sumL41903 moet "STANDARD" teruggeven bij alleen kinderen (geen volwassenen)
- sumL41914 moet "STANDARD" teruggeven bij alleen kinderen (geen volwassenen)
- sumL41920 moet SPECIAL_LARGE teruggeven bij 6 volwassenen + kinderen
- sumL41931 moet SPECIAL_LARGE teruggeven bij 6 volwassenen + kinderen
- sumL41937 moet "STANDARD" teruggeven bij lege lijst
- sumL42253 berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent
- sumL42278 aggregatie met verschillende frequenties: week/4wk/quarter/year → maandnormalisatie
- sumL42400 berekent netto correct
- sumL42421 Phoenix envelope v2 → READY
- sumL42447 berekent netto correct
- sumL42607 accepteert Phoenix v1.0 met centen integers
- sumL42808 moet "STANDARD" teruggeven voor exact 5 volwassenen
- sumL42819 moet "STANDARD" teruggeven voor exact 5 volwassenen
- sumL42825 moet "STANDARD" blijven bij gemengde samenstelling met 5 volwassenen en 2 kinderen
- sumL42859 moet "STANDARD" teruggeven bij alleen kinderen (geen volwassenen)
- sumL42870 moet "STANDARD" teruggeven bij alleen kinderen (geen volwassenen)
- sumL42876 moet SPECIAL_LARGE teruggeven bij 6 volwassenen + kinderen
- sumL42887 moet SPECIAL_LARGE teruggeven bij 6 volwassenen + kinderen
- sumL42893 moet "STANDARD" teruggeven bij lege lijst
- sumL42904 moet "STANDARD" teruggeven bij lege lijst
- sumL43256 berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent
- sumL43895 moet "complete" teruggeven voor > 5 volwassenen (voorheen SPECIAL_LARGE)
- sumL43912 moet "partial" teruggeven bij gemengde samenstelling
- sumL43929 moet "empty" teruggeven bij lege lijst
- sumL44575 lege items geeft overal 0
- sumL45418 haalt de juiste totalen op in EUR formaat
- sumL45437 geeft nul-waarden bij lege state
- sumL45452 migreert oude data naar de nieuwe Phoenix structuur
- sumL45689 migreert oude data naar de nieuwe Phoenix structuur
- sumL46246 moet oude leden correct transformeren naar Member objecten
- sumL46329 moet oude leden correct transformeren naar Member objecten
- sumL46408 moet oude leden correct transformeren naar Member objecten
- sumL46431 moet fallback IDs genereren
- sumL46505 moet oude leden correct transformeren
- sumL46687 moet oude leden correct transformeren
- sumL46857 moet oude leden correct transformeren naar Member objecten
- sumL46861 moet oude leden correct transformeren
- sumL46868 moet fallback IDs genereren
- sumL46901 moet een complete household migreren
- sumL46947 moet alle member types correct mappen
- sumL47137 moet een divers huishouden correct transformeren voor onderzoek
- sumL47156 moet namen en types correct mappen zonder dataverlies
- sumL47167 moet robuust omgaan met ontbrekende types (fallback naar adult)
- sumL47278 moet UX namen splitsen maar onderzoeks-type behouden
- sumL47358 moet namen splitsen voor UX maar types behouden voor onderzoek
- sumL47386 moet een divers huishouden correct transformeren voor onderzoek
- sumL47405 moet namen en types correct mappen zonder dataverlies
- sumL47416 moet robuust omgaan met ontbrekende types (fallback naar adult)
- sumL47422 moet UX namen splitsen maar onderzoeks-type behouden
- sumL47434 moet namen splitsen voor UX maar types behouden voor onderzoek
- sumL47461 moet een divers huishouden correct transformeren voor onderzoek
- sumL47480 moet robuust omgaan met ontbrekende types (fallback naar adult)
- sumL47491 moet namen splitsen voor UX maar types behouden voor onderzoek
- sumL47510 moet namen zonder achternaam correct afhandelen
- sumL47819 moet een perfecte payload genereren voor de n8n workflow
- sumL47896 moet data strippen van persoonsgegevens voor n8n export
- sumL47983 moet namen behouden voor lokaal gebruik, maar strippen voor onderzoek
- sumL48069 moet de strikte scheiding tussen UX en Onderzoek bewaken
- sumL48098 moet alle kritieke leeftijdscategorieën voor het onderzoek mappen
- sumL48124 moet een divers huishouden correct transformeren voor onderzoek
- sumL48143 moet robuust omgaan met ontbrekende types (fallback naar adult)
- sumL48154 moet namen splitsen voor UX maar types behouden voor onderzoek
- sumL48173 moet namen zonder achternaam correct afhandelen
- sumL48179 moet data strippen van persoonsgegevens voor n8n export
- sumL48332 moet oude leden migreren naar de nieuwe structuur met naam-splitsing
- sumL48354 moet een anonieme payload maken voor n8n zonder persoonsgegevens
- sumL48379 moet altijd terugvallen op adult als het type onbekend is
- sumL13102 ⚠️ (dynamic) moet "${input}" parsen naar ${expected} centen

## `App.projector.test.tsx`
**Describe**
- sumL12632 WAI-003: Household Selectors
- sumL12670 WAI-005B: Migration Matrix (Legacy -> Phoenix)
- sumL12707 WAI-005B: Migration Matrix (Legacy -> Phoenix)
- sumL12924 App projector
- sumL12957 App projector (Phoenix Flow)
- sumL13060 WAI-006A-Projector: State Machine Rendering
- sumL13084 Phoenix Alias Sanity Check
- sumL43222 Household Logic: Status Determination
- sumL43416 Household Logic: Status Determination
- sumL43434 Finance Integratie
- sumL43650 App Projector Flow

**It/Test**
- sumL12619 moet false teruggeven bij een lege state
- sumL12633 moet true teruggeven voor 6 volwassenen (Project Eis 2025)
- sumL12652 moet false teruggeven bij een lege state
- sumL12671 moet v0 (plat object) met floats correct migreren naar v2 centen
- sumL12687 moet strings ("10,50") via de NumericParser omzetten naar centen
- sumL12712 moet v0 (C7/C10) met floats correct migreren naar Phoenix centen
- sumL12733 moet strings ("10,50") via de NumericParser omzetten naar centen
- sumL12925 renders SplashScreen on HYDRATING
- sumL12960 toont niets (null) tijdens HYDRATING (via Splash mock)
- sumL12966 rendeert de Navigator wanneer de status READY is
- sumL12973 toont het WelcomeWizard wanneer de status NEW_USER is
- sumL13063 rendeert SplashScreen bij status HYDRATING
- sumL13069 rendeert WelcomeWizard bij status UNBOARDING
- sumL13085 moet de ping functie vinden via de @utils alias
- sumL39719 should migrate correctly
- sumL40050 navigeert naar de volgende stap bij klikken op Volgende
- sumL40070 toont de Afronden knop op de laatste pagina
- sumL41165 switch LANDING → WIZARD rendert wizard UI
- sumL43223 moet "complete" teruggeven voor 2 volwassenen (voorheen STANDARD)
- sumL43228 moet "complete" teruggeven voor > 5 volwassenen (voorheen SPECIAL_LARGE)
- sumL43234 moet "partial" teruggeven bij gemengde samenstelling
- sumL43242 moet "empty" teruggeven bij lege lijst
- sumL43279 aggregatie met maandnormalisatie
- sumL43300 lege items geeft overal 0
- sumL43417 moet "complete" teruggeven voor 2 volwassenen
- sumL43423 moet "empty" teruggeven bij lege lijst
- sumL43435 berekent netto correct uit de finance tak
- sumL43608 behoudt data en focus bij navigatie naar volgende stap
- sumL43651 WAI Check: LandingScreen heeft toegankelijke knoppen
- sumL44274 focust het juiste invoerveld bij binnenkomst in de WIZARD

## `src/app/hooks/__tests__/useAppOrchestration.test.tsx`
**Describe**
- sumL27296 useAppOrchestration
- sumL27452 useAppOrchestration
- sumL27897 useAppOrchestration
- sumL28139 useAppOrchestration hook
- sumL28290 Storage Migration
- sumL28305 useAppOrchestration logic
- sumL36000 WAI-003: Household Selectors
- sumL36330 Export Logic
- sumL42204 useAppOrchestration (Phoenix/Legacy)

**It/Test**
- sumL22948 UNBOARDING for new user (loadState=null)
- L51 READY for valid v1.0
- sumL23381 UNBOARDING for new user (loadState=null)
- L51 READY for valid v1.0
- sumL24010 UNBOARDING for new user (loadState=null)
- L51 READY for valid v1.0
- sumL27297 should initialize with initial state
- sumL27453 should initialize with initial state
- sumL27898 Initializes correctly
- sumL28140 moet initialiseren met de meegegeven initialState
- sumL28291 should run migration without errors
- sumL28306 moet de juiste initiële state teruggeven
- sumL36001 moet true teruggeven voor 6 volwassenen (Project Eis 2025)
- sumL36331 moet alle transacties kunnen wissen voor een export
- sumL41000 HYDRATING → ONBOARDING bij null
- L50 weigert legacy floats
- sumL42140 Phoenix envelope v2 → READY
- sumL42179 Phoenix envelope v2 → READY
- sumL42205 Phoenix envelope v2 → READY + SYNC_HOUSEHOLD met payload
- sumL42219 HYDRATING → ONBOARDING bij null
- sumL42306 lege income/expenses → alle totals 0
- sumL42350 Phoenix envelope v2 → READY

## `src/ui/components/__tests__/InputCounter.test.tsx`
**Describe**
- sumL28273 InputCounter
- sumL36050 WAI-003: Household Selectors
- sumL36110 Storage Migration: V0 to Phoenix
- sumL36153 InputCounter

**It/Test**
- sumL23496 moet false teruggeven bij een lege state
- sumL23507 moet false teruggeven bij een lege state
- sumL24136 moet false teruggeven bij een lege state
- sumL28276 roept onUpdate aan bij klik
- sumL36071 moet true teruggeven voor 6 volwassenen (Project Eis 2025)
- sumL36076 moet false teruggeven voor 2 volwassenen
- sumL36081 moet false teruggeven bij een lege state
- sumL36111 moet oude setup data migreren naar de nieuwe data.setup nesting
- sumL36154 moet de waarde verhogen bij een klik op de plus

## `archive/legacy_screens/Wizard/__tests__/WizardPage.test.tsx`
**It/Test**
- L3 moet namen strippen uit de export (Privacy Contract)
- L3 moet de special status vlag zetten bij > 5 volwassenen [2025-12-07]
- L3 moet de special status vlag zetten bij > 5 volwassenen [2025-12-07]

## `home/user/pre7/src/app/hooks/__tests__/useAppOrchestration.test.tsx`
**Describe**
- sumL27661 Export Logic

**It/Test**
- sumL27666 should correctly store and retrieve a transaction

## `src/__tests__/WAI009_FocusManagement.test.tsx`
**Describe**
- sumL28540 WAI-009: Focus Management & Screen Reader Announcements
- sumL29204 WAI-009: Focus Management
- sumL44956 WAI009 Focus Management
- sumL45155 WAI009 Focus Management
- sumL45230 WAI009 Focus Management
- sumL45263 Migration Fixture

**It/Test**
- sumL28549 moet een toegankelijke kop (H1/Header) hebben op elk scherm voor WAI-009
- sumL28565 moet de juiste accessibilityRole="header" bevatten op het Dashboard
- sumL29205 moet de juiste titels vinden via screen methods
- L13 weigert legacy floats
- L13 Logic: computePhoenixSummary telt centen correct op
- L36 weigert legacy floats
- L36 uses removeItem instead of clear() for compliance (Safety gate)
- L36 moet "SPECIAL_LARGE" teruggeven voor > 5 volwassenen
- L15 uses removeItem instead of clear() for compliance (Safety gate)
- sumL44938 geeft nul-waarden terug als de data-tak ontbreekt
- sumL44957 zet de focus op de header bij het laden van de Landing pagina
- sumL45156 zet de focus op de header bij het laden
- sumL45231 zet de focus op de header bij het laden
- sumL45264 migreert oude leden naar het nieuwe Phoenix members formaat

## `src/ui/screens/Wizard/__tests__/WizardController.test.tsx`
**Describe**
- sumL29380 Phoenix Financial Flow: Van State naar ViewModel
- sumL29438 WizardController: Navigatie & State Synchronisatie
- sumL29843 WizardController
- sumL40033 WizardController Integration

**It/Test**
- sumL29395 moet de volledige keten correct doorlopen: State -> Logica -> VM
- sumL29419 moet robuust omgaan met lege state (Edge Case)
- sumL29439 moet bij het verlaten van de household setup de Logger aanroepen (WAI-009)
- sumL29844 moet renderen en interactie loggen
- sumL39963 navigeert naar de volgende stap bij klikken op Volgende
- sumL39989 toont de Afronden knop op de laatste pagina
- sumL40035 rendert zonder crash en toont de eerste stap
- sumL41948 moet "STANDARD" teruggeven bij lege lijst
- sumL41966 Logic: computePhoenixSummary telt centen correct op
- sumL42940 Logic: computePhoenixSummary telt centen correct op
- sumL43959 Logic: computePhoenixSummary telt centen correct op

## `WAI009_FocusManagement.test.tsx`
**Describe**
- sumL43719 WAI-009: Focus Management (Project Eis 2025)

**It/Test**
- sumL43177 moet "complete" teruggeven voor 2 volwassenen
- sumL43493 Projector: switch LANDING → WIZARD rendert wizard UI
- sumL43665 Projector: switch LANDING → WIZARD rendert wizard UI
- sumL43721 focust het juiste invoerveld bij binnenkomst in de WIZARD

## `home/user/pre7/src/__tests__/App.projector.test.tsx`
**Describe**
- sumL43556 WAI-009: Focus Management (Project Eis 2025)

**It/Test**
- sumL43558 focust het juiste invoerveld bij binnenkomst in de WIZARD

## `home/user/pre7/src/__tests__/WAI009_FocusManagement.test.tsx`
**Describe**
- sumL44911 FinancialFlow Selectors

**It/Test**
- sumL44912 haalt de juiste totalen op uit de Phoenix-state structuur
