/**
 * @file_intent Dient als een "barrel"-bestand dat alle herbruikbare helper- en utility-functies exporteert. Het functioneert als een centrale 'hub', waardoor andere delen van de applicatie utilities kunnen importeren vanuit één consistente locatie (`@/utils`) zonder zich bewust te hoeven zijn van de specifieke locatie van de bestanden (sommige lokaal, sommige in `@domain`).
 * @repo_architecture Utils Layer - Public API Facade. Dit bestand definieert de publieke API van de `utils`-map. Het is een 'facade' die de interne bestandsstructuur verbergt. De re-exports van `@domain/helpers` maken dit ook een 'bridge', die een naadloze overgang biedt voor functies die van `utils` naar `domain` zijn verplaatst.
 * @term_definition
 *   - `Barrel File`: Een bestand dat exports van andere modules verzamelt en opnieuw exporteert.
 *   - `Re-export`: De `export * from '...'` syntax, die alle exports van een andere module direct doorgeeft.
 *   - `Facade Pattern`: Een ontwerppatroon dat een vereenvoudigde interface biedt voor een groter en complexer geheel van code. Dit `index.ts`-bestand is de facade voor de `utils`-functionaliteit.
 *   - `Bridge`: Een term die hier wordt gebruikt om aan te geven dat dit bestand een koppeling legt tussen de `utils`-map en de `@domain/helpers`-map.
 * @contract Dit bestand exporteert alle functies en constanten uit de gespecificeerde modules. Het voegt zelf geen nieuwe logica toe. Code die `@/utils` importeert, krijgt toegang tot alle geëxporteerde leden. Elke nieuwe utility-module die aan de `utils`-map wordt toegevoegd, moet hier worden geëxporteerd om deel uit te maken van de publieke API.
 * @ai_instruction Om een utility-functie te gebruiken (bijv. `parseRawCsv` of `isNumeric`), importeer deze dan altijd vanuit de `utils`-map (`import { parseRawCsv } from '@/utils'`). Voeg een nieuwe `export * from './[bestandsnaam]'` regel toe aan dit bestand wanneer je een nieuw utility-bestand aanmaakt, zodat deze consistent beschikbaar wordt voor de rest van de applicatie.
 */
// Bridge: Verwijst nu naar de nieuwe domein-locaties
export * from '@domain/helpers/frequency';
export * from '@domain/helpers/numbers';

// Blijft lokaal (bestaat nog in src/utils)
export * from './csvHelper';
export * from './objects';
export * from './ping';
export * from './strings';
// export * from './AuditLogger'; // Optioneel, check of deze bestaat