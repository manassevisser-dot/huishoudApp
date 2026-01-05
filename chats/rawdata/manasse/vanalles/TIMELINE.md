# Tijdslijn (Niet-code conversatie)
Deze tijdlijn reconstrueert de belangrijkste fasen en besluiten uit de niet-code tekst.

## 1. Fase 2: Testomgeving & Providers
**Positie in bron**: regel-index ~18
**Excerpt**:

```text
"config/tokens/*": "颜色/间距/字体/半径等",
Type-Safe: De compiler ziet nu alleen properties die daadwerkelijk in je src/ui/styles/modules/*.ts bestanden staan.
at Object.react_stack_bottom_frame (node_modules/react-test-renderer/cjs/react-test-renderer.deve
at runWithFiberInDEV (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:231
``` [cite: 47, 48, 49, 160]
```

## 2. Fase 6: Financiën & Armoede indicatoren
**Positie in bron**: regel-index ~21
**Excerpt**:

```text
at runWithFiberInDEV (node_modules/react-test-renderer/cjs/react-test-renderer.development.js:231
``` [cite: 47, 48, 49, 160]
Deze segmentatie maakt het mogelijk om later queries uit te voeren zoals: *"Wat is het gemiddelde bedrag aan dagelijkse boodschappen in huishoudens met ten minste één 'Teenager'?"*
**Zal ik de `migrationTestHelpers.ts` nu volledig voor je uitschrijven, zodat we deze categorieën direct op de juiste manier in de database krijgen?**
Yes, migrationtesthelpers :)
```

## 3. Export/Mining: Download & Opslag
**Positie in bron**: regel-index ~30
**Excerpt**:

```text
* Deze helpers zorgen voor consistente testdata en validatie,
* met speciale aandacht voor leeftijdscategorieën (eetpatroon onderzoek).
export const testDataGenerators = {
* Genereert een lid zoals ze in de "oude" state stonden.
createOldMember: (id: string, name: string, type: string = 'adult') => ({
```

## 4. Fase 3: UX vs Onderzoek scheiding
**Positie in bron**: regel-index ~53
**Excerpt**:

```text
assertValidMember: (member: any) => {
expect(member).toHaveProperty('id');
expect(member).toHaveProperty('firstName');
expect(member).toHaveProperty('memberType');
// Check of het type binnen onze onderzoeks-scope valt
```

## 5. Fase 5: n8n export & Privacy by Design
**Positie in bron**: regel-index ~190
**Excerpt**:

```text
PS: Hoe heet het bestand waar je Member type gedefinieerd staat precies? Is dat src/domain/household.ts? Dan kunnen we daar ook even de interface checken.
JA, maar namen ga ik enkel gebruiken in UX, absoluut NIET in data onderzoek
Dat is een heel belangrijk onderscheid! Voor je data-onderzoek wil je natuurlijk volledig geanonimiseerde data om privacy-redenen (GDPR/AVG), terwijl je in de UX wel gewoon "Jan" of "Hanna" wilt zien om het persoonlijk te maken.
De Strategie: Splitsen voor de UX, Categorieën voor de Data
We gaan de migratie zo inrichten dat:
```

## 6. Fase 4: Orchestrator besluit (Verzamelaar)
**Positie in bron**: regel-index ~432
**Excerpt**:

```text
Nu de types centraal staan in Household, zal TypeScript stoppen met klagen over botsingen en heb je een solide basis voor je analyse van eetpatronen per leeftijdscategorie.
Zullen we nu kijken of de tests in migration.members.test.ts weer vlekkeloos draaien met deze nieuwe interface?
Nee, beter plan; SSOT EN scheiding van taken /machten; we maken verzamelaar voor onderzoeksgegevens (een doorgeefluik van verschillende soorten data van de ene laag (UI) naar de andere (testen of whatever EN naar de database <later via n8n met workflow>)
Dit is een uitstekend architecturaal inzicht. Wat jij voorstelt is een Data Orchestrator of Data Hub. In plaats van dat de UI direct bepaalt wat de database krijgt, creëer je een onafhankelijke laag die data verzamelt, valideert en formatteert voor verschillende eindpunten (UX, Onderzoek, n8n).
Dit is de ultieme vorm van Separation of Concerns. Laten we dit "doorgeefluik" opzetten.
```

## 7. Stop/Heroriëntatie: Focus herstellen
**Positie in bron**: regel-index ~756
**Excerpt**:

```text
Nu de verzamelaar ook de financiële export (transacties) voor n8n voorbereidt, is je data-onderzoek veiliggesteld.
Zal ik een specifieke test schrijven die controleert of de verhouding tussen 'inkomsten' en 'uitgaven' voor een 'senior' correct geanonimiseerd wordt verzonden naar n8n?
Stop stop
Je hebt gelijk. We dwalen af in de code-details terwijl we de essentie van wat jij aan het bouwen bent uit het oog verliezen.
Laten we even pas op de plaats maken en teruggaan naar jouw visie:
```
