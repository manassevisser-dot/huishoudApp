**Geëxporteerd:** 4-1-2026, 16:07:05
**Aantal berichten:** 2

---
**User:**

```
daysUntilDeadline
```

```
isAuthorized
```

```
({ title })
```

```
type Status = 'open' | 'closed'
```

```
{ success: boolean, data?: T }
```

```
screen.getByRole
```

| Key | Value |
| --- | --- |
| Betekenisvolle Naamgeving | Gebruik namen die onthullen waarom iets bestaat (bijv. in plaats van d). Vermijd ruiswoorden zoals data, info of object. |
| Booleans | Begin booleans altijd met een vraagwoord zoals is, has, of should (bijv. ). |
| Vermijd any | Het gebruik van any schakelt type-checking uit. Gebruik unknown als je het type echt niet weet. |
| Kleine Componenten | Volg de basisregel: als een component te groot wordt, splits hem dan op. Houd functies bij voorkeur onder de 20 regels. |
| Destructuring | Gebruik destructuring voor props (bijv. ) om direct duidelijk te maken welke data een component gebruikt. |
| DRY & KISS | "Don't Repeat Yourself" en "Keep It Simple, Stupid". |

| - Type je Hooks: Vertrouw niet alleen op type-inference. Geef types expliciet mee bij useState of useRef | vooral bij complexe objecten of DOM-elementen. |
| --- | --- |
| - Utility Types: Gebruik ingebouwde hulpjes zoals Omit | Pick en ReturnType om je code droog te houden. |

| - Parse | don't validate: Transformeer data van externe bronnen direct naar een betrouwbaar type (bijv. met Zod) aan de rand van je systeem. |
| --- | --- |
| - Ondiepe Codebase: Houd je mappenstructuur ondiep en groepeer bestanden op basis van 'Features' (hooks | types en componenten samen). |

| - Test Gedrag | niet Implementatie: Schrijf tests vanuit het perspectief van de gebruiker (bijv. via ) zodat ze niet breken bij interne refactors. |
| --- | --- |
| - AI-Assisted Development: Gebruik AI voor boilerplate | maar behoud altijd de controle over de logica en architectuur ("Don't Outsource Thinking"). |

| Key | Value |
| --- | --- |
| Mikado Methode | Voor het veilig doorvoeren van complexe wijzigingen zonder de stabiliteit te verliezen. |
| Strangler Fig Pattern | Het geleidelijk vervangen van oude systemen door nieuwe functionaliteit eromheen te bouwen. |

![Google Documenten-icoon](https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.document)

tips clean code
Google Documenten

Zet al deze tips netjes op een rij van basisniveau tot superexpert niveau.

Denkproces tonen

Hier is een gestructureerd overzicht van de "Clean Code" principes voor React en TypeScript, gerangschikt van basis tot expert-niveau op basis van de verstrekte bronnen.

🟢 Basis: Naamgeving & Fundamenten
🟡 Intermediate: React & TypeScript Best Practices
🟠 Advanced: Architectuur & Patronen
🔴 Expert: Strategie & Systeemontwerp
ℹ️ Huishoudelijke Status Update

In lijn met je eerdere instructies: voor alle statistische verwerkingen en demografische data binnen je (React Native) apps krijgen huishoudens met meer dan 5 volwassenen de gevraagde speciale status.

Zal ik voor een van deze niveaus een specifiek code-voorbeeld uitwerken, zoals het implementeren van 'Discriminated Unions' in een React component?

Bronnen

---

**User:**

| Niveau | Toetspunt | Beschrijving & Criterium |
| --- | --- | --- |
| 1. Basis | Naamgeving | Zijn variabelen betekenisvol (bijv. daysUntilDeadline) en gebruiken booleans de prefix is, has of should? |
|  | Type Veiligheid | Wordt het gebruik van any strikt vermeden en vervangen door unknown waar nodig? |
|  | Component Omvang | Zijn componenten klein en herbruikbaar (onder de 150 regels)? |
| 2. Intermediate | Typing Props | Wordt interface gebruikt voor props vanwege de uitbreidbaarheid? |
|  | Hook Typing | Zijn complexe useState of useRef hooks expliciet getypeerd? |
|  | Logic Separation | Is de logica uit de UI gehaald en verplaatst naar Custom Hooks? |
| 3. Advanced | State Management | Worden 'Discriminated Unions' gebruikt voor complexe UI-statussen in plaats van losse booleans? |
|  | Data Integriteit | Wordt data aan de rand van het systeem 'geparsed' in plaats van alleen gevalideerd? |
|  | Immutability | Zijn arrays en objecten waar mogelijk als readonly gemarkeerd? |
| 4. Expert | Cognitieve Last | Voldoet de code aan de "Leave No Questions"-regel: is de intentie direct duidelijk? |
|  | Architectuur | Wordt compositie (children) verkozen boven overerving of complexe config-objecten? |
|  | Error Handling | Worden 'Result-objects' gebruikt in plaats van het onnodig opgooien van exceptions? |

| Key | Value |
| --- | --- |
| Basis | Controleer op betekenisvolle naamgeving, booleans met prefix (is/has), en het absolute verbod op any. |
| Structureel | Beoordeel of componenten klein genoeg zijn en of logica correct is gescheiden via Custom Hooks. |
| Type | architectuur: Toets op het gebruik van Interfaces voor props en 'Discriminated Unions' voor complexe states (voorkom onmogelijke statussen). |
| Expert | niveau: Beoordeel de 'Cognitieve Last' (is de code direct leesbaar?) en of er gebruik wordt gemaakt van het 'Parse, don't validate' principe. |

Maak van de lijst een toetsingskader. Schrijf een Prompt (zoals de vorige 2 prompts) voor een toetsingsadviseur, die het advies van de vorige AI langs dit toetsingskader legt.

Dit is het volledige toetsingskader, gerangschikt van basis tot expert-niveau, gevolgd door een specifieke prompt die je kunt gebruiken om een andere AI (of een menselijke adviseur) te laten controleren of code aan deze standaarden voldoet.

Toetsingskader: Clean Code React & TypeScript (2025)
Exporteren naar Spreadsheets
De Toetsings-Prompt

Kopieer en plak de onderstaande tekst in je AI-gesprek om de vorige resultaten te laten toetsen:

Rol: Je bent een Senior Software Quality Assurance (SQA) Adviseur gespecialiseerd in React en TypeScript (2025 best practices).

Taak: Analyseer de code of het advies uit de vorige beurt en leg deze langs het onderstaande Toetsingskader Clean Code.

Toetsingskader:

Extra Instructie: Houd bij eventuele demografische functies rekening met de speciale status voor huishoudens met meer dan 5 volwassenen.

Output: Geef per niveau een score (Voldoet / Kan Beter / Onvoldoende) en geef concrete verbeterpunten voor de onderdelen die niet aan het kader voldoen.

Zal ik een specifiek code-voorbeeld voor je schrijven dat volgens dit kader is opgesteld, zodat je de adviseur direct kunt testen?

Bronnen