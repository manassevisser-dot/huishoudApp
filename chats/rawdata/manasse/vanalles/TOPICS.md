# Thema-overzicht (Niet-code)
Onderstaande themaclusters zijn automatisch uit de conversatieregels gedestilleerd.

## Testing & Tooling (Jest/Coverage/Setup) (86 regels)
- at Object.react_stack_bottom_frame (node_modules/react-test-renderer/cjs/react-test-renderer.deve
- at runWithFiberInDEV (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:231
- **Zal ik de `migrationTestHelpers.ts` nu volledig voor je uitschrijven, zodat we deze categorieën direct op de juiste manier in de database krijgen?**
- Yes, migrationtesthelpers :)
- Gaan we doen! We gaan de migrationTestHelpers.ts zo opbouwen dat die leeftijdscategorieën (adult, child, teenager, senior) niet alleen worden omgezet, maar ook gevalideerd. Dit is de "goudmijn" voor je latere data-onderzoek naar eetpatronen.
- Hier is de volledige implementatie voor __tests__/helpers/migrationTestHelpers.ts.
- * 🧪 Phoenix Migration Test Helpers
- * Deze helpers zorgen voor consistente testdata en validatie,
- export const testDataGenerators = {
- * Maakt een volledige huishoud-dataset aan voor migratietests.
- Research Generator: Met createResearchHousehold kun je in één regel een testomgeving opzetten die precies simuleert hoe verschillende eters (teenager vs senior) door de migratie-engine worden gehaald.
- Sla dit bestand op als __tests__/helpers/migrationTestHelpers.ts.

## Financiën & Armoede (Huishoudboek) (86 regels)
- Deze segmentatie maakt het mogelijk om later queries uit te voeren zoals: *"Wat is het gemiddelde bedrag aan dagelijkse boodschappen in huishoudens met ten minste één 'Teenager'?"*
- **Zal ik de `migrationTestHelpers.ts` nu volledig voor je uitschrijven, zodat we deze categorieën direct op de juiste manier in de database krijgen?**
- Gaan we doen! We gaan de migrationTestHelpers.ts zo opbouwen dat die leeftijdscategorieën (adult, child, teenager, senior) niet alleen worden omgezet, maar ook gevalideerd. Dit is de "goudmijn" voor je latere data-onderzoek naar eetpatronen.
- * met speciale aandacht voor leeftijdscategorieën (eetpatroon onderzoek).
- Expliciete Type Checks: In assertValidMember dwingen we af dat elk lid één van de vier categorieën heeft. Geen "onbekende" data meer in je dataset.
- * Controleert of de migratie de leeftijdscategorieën correct heeft behouden.
- Onderhoud: Als je later besluit een extra categorie toe te voegen (bijvoorbeeld baby), hoef je alleen de generator en de assertion in dit bestand aan te passen.
- Data onderzoek: Door de createResearchDataset hier centraal te hebben, test je altijd met de data die voor jouw analyse van eetpatronen en uitgaven belangrijk is.
- Dit maakt je data veel schoner voor het koppelen van uitgaven aan specifieke gezinsleden!
- De Strategie: Splitsen voor de UX, Categorieën voor de Data
- Betrouwbaarheid: Je onderzoek naar "eetpatronen per leeftijdscategorie" blijft 100% zuiver omdat de memberType mapping nu door de migratie-tests geborgd is.
- // Onderzoek controle: Is de categorie bruikbaar?

## UX vs Onderzoek (Scheiding namen vs types) (356 regels)
- Gaan we doen! We gaan de migrationTestHelpers.ts zo opbouwen dat die leeftijdscategorieën (adult, child, teenager, senior) niet alleen worden omgezet, maar ook gevalideerd. Dit is de "goudmijn" voor je latere data-onderzoek naar eetpatronen.
- * met speciale aandacht voor leeftijdscategorieën (eetpatroon onderzoek).
- naam: name,
- * Genereert een representatief huishouden voor onderzoek naar eetpatronen.
- { id: 'm1', naam: 'Ouder 1', type: 'adult' },
- { id: 'm2', naam: 'Ouder 2', type: 'adult' },
- { id: 'm3', naam: 'Puber', type: 'teenager' }, // Hoge calorie-inname
- { id: 'm4', naam: 'Kind', type: 'child' },    // Specifiek dieet
- { id: 'm5', naam: 'Opa', type: 'senior' }     // Andere behoeftes
- expect(member).toHaveProperty('firstName');
- expect(member).toHaveProperty('memberType');
- // Check of het type binnen onze onderzoeks-scope valt

## Migratie (Phoenix) & Legacy (57 regels)
- * 🧪 Phoenix Migration Test Helpers
- * Maakt een volledige huishoud-dataset aan voor migratietests.
- * Valideert of een gemigreerd Member object voldoet aan de nieuwe Phoenix eisen.
- * Performance benchmark helper om te zorgen dat grote migraties
- Research Generator: Met createResearchHousehold kun je in één regel een testomgeving opzetten die precies simuleert hoe verschillende eters (teenager vs senior) door de migratie-engine worden gehaald.
- * Controleert of de migratie de leeftijdscategorieën correct heeft behouden.
- * Basis validatie voor een Phoenix Member object.
- * Meet hoe snel de migratie verloopt bij grote datasets.
- import { migrateTransactionsToPhoenix } from '../transactionService';
- const result = await migrateTransactionsToPhoenix(oldState);
- const result = await migrateTransactionsToPhoenix(state);
- const result = await migrateTransactionsToPhoenix(brokenState);

## n8n Workflow & Export JSON (131 regels)
- export const testDataGenerators = {
- export const assertions = {
- export const measurePerformance = async (fn: () => Promise<any>) => {
- export const measureMigrationSpeed = async (migrationFn: () => Promise<any>) => {
- export const parseName = (fullName: string) => {
- Onderzoek: We focussen op de memberType (teenager, senior, etc.) en een uniek geanonimiseerd id. De namen blijven buiten de export voor onderzoek.
- export const splitNameForUX = (fullName: string = '') => {
- Privacy: Je kunt nu een export-functie maken voor je onderzoek die simpelweg de velden firstName, lastName en fullName weglaat.
- export const migrateTransactionsToPhoenix = async (oldState: any) => {
- export type MemberType = 'adult' | 'child' | 'teenager' | 'senior';
- export interface Member {
- Betrouwbaarheid: Je weet zeker dat elke export voor je eetpatroon-onderzoek voldoet aan één van deze vier smaken.

## TypeScript/Babel Parser & Fouten (3 regels)
- it('moet een divers huishouden correct transformeren voor onderzoek', async () => {
- In je transactionService.ts (de functie migrateTransactionsToPhoenix) moet de transformatie er nu zo uit gaan zien:
- * Kern van de migratie: Transformeert oude data naar het Phoenix schema.

## Privacy by Design & Anonimisering (68 regels)
- Dat is een heel belangrijk onderscheid! Voor je data-onderzoek wil je natuurlijk volledig geanonimiseerde data om privacy-redenen (GDPR/AVG), terwijl je in de UX wel gewoon "Jan" of "Hanna" wilt zien om het persoonlijk te maken.
- Onderzoek: We focussen op de memberType (teenager, senior, etc.) en een uniek geanonimiseerd id. De namen blijven buiten de export voor onderzoek.
- Data Onderzoek (Analytics): Hier gebruiken we geanonimiseerde data. We kijken alleen naar het memberType (teenager, senior, etc.) en een abstract ID (zoals m-0). De namen worden hier volledig gestript.
- entityId: lid.id || `m-${index}`, // Geanonimiseerd ID voor onderzoek
- Privacy: Je kunt nu een export-functie maken voor je onderzoek die simpelweg de velden firstName, lastName en fullName weglaat.
- // Data Onderzoek Velden (Anoniem)
- Privacy by Design: Voor je data onderzoek naar "uitgaves voor boodschapjes per leeftijd" trek je simpelweg een rapport op basis van memberType en entityId. Je negeert de firstName en lastName kolommen volledig.
- Anonieme Koppeling: Je gebruikt entityId om transacties aan leden te koppelen in je onderzoek, waardoor je de namen (firstName) nooit in je spreadsheets of databases hoeft op te slaan.
- entityId: string;    // Anoniem ID voor onderzoek
- entityId: string;    // Database ID (Anoniem voor onderzoek)
- Stroom B (Onderzoek): Geanonimiseerde types (teenager, senior) + IDs.
- // 2. Logica voor Onderzoek (Mapping & Anonimiteit)

## Aliassen & Paden (tsconfig/jest/babel) (6 regels)
- We hebben nog een paar "kinderziektes" in de TypeScript-configuratie en de bestandspaden. Geen zorgen, dit zijn klassieke fouten bij het opzetten van een nieuwe teststructuur. Laten we ze één voor één oplossen.
- 1. Het Pad naar de Helpers (Error 2307)
- Oplossing: Gebruik een relatief pad dat exact naar de map wijst. Als je test in src/services/__tests__/ staat en je helper in src/test-utils/, dan is het pad: import { ... } from '../../test-utils/migrationHelpers'; (twee niveaus omhoog, niet drie).
- Oplossing: Voor nu gebruiken we het directe pad in src/services/transactionService.ts: import { Member, MemberType } from '../domain/household'; (Pas dit aan naar waar jouw types echt staan).
- // Check of dit pad klopt: 2 stappen omhoog naar src, dan test-utils
- Probeer de imports aan te passen naar de relatieve paden (met ../../). Gaan de rode lijntjes nu weg?

## Architectuur & Orchestrator (Verzamelaar) (84 regels)
- Nee, beter plan; SSOT EN scheiding van taken /machten; we maken verzamelaar voor onderzoeksgegevens (een doorgeefluik van verschillende soorten data van de ene laag (UI) naar de andere (testen of whatever EN naar de database <later via n8n met workflow>)
- Dit is een uitstekend architecturaal inzicht. Wat jij voorstelt is een Data Orchestrator of Data Hub. In plaats van dat de UI direct bepaalt wat de database krijgt, creëer je een onafhankelijke laag die data verzamelt, valideert en formatteert voor verschillende eindpunten (UX, Onderzoek, n8n).
- Dit is de ultieme vorm van Separation of Concerns. Laten we dit "doorgeefluik" opzetten.
- De Verzamelaar (Orchestrator): Ontvangt dit en splitst het in drie stromen:
- Stap 1: De Verzamelaar in src/services/dataOrchestrator.ts
- export const collectMemberData = (rawLid: any, index: number) => {
- Je transactionService.ts wordt nu heel simpel, omdat hij alleen de verzamelaar aanroept:
- import { collectMemberData } from './dataOrchestrator';
- const processed = rawLeden.map((lid: any, index: number) => collectMemberData(lid, index));
- Nu testen we niet alleen of de app werkt, maar of het "doorgeefluik" de juiste onderzoeksdata genereert voor n8n:
- const { workflowPayload } = collectMemberData(raw, 0);
- SSOT: De mapToResearchType is de enige plek waar je bepaalt wat een 'senior' of 'teenager' is.
