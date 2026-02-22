/**
 * @file_intent Definieert een abstractie (interface) voor het ophalen van de huidige tijd, specifiek als een 'Local Noon' `Date` object. Dit is een cruciaal onderdeel van de Dependency Injection (DI) strategie om de applicatie testbaar te maken.
 * @repo_architecture Domain Layer - Helpers.
 * @term_definition
 *   - `TimeProvider`: Een interface die het concept van "het huidige moment" abstraheert. In plaats van direct `new Date()` aan te roepen, wordt een implementatie van deze interface gebruikt.
 *   - `Dependency Injection (DI)`: Een ontwerppatroon waarbij een component zijn afhankelijkheden (zoals een `TimeProvider`) van buitenaf krijgt aangeleverd, in plaats van ze zelf te creëren. Dit maakt het mogelijk om in tests een "nep"-versie (mock) te injecteren.
 *   - `Local Noon`: Een `Date` object dat is ingesteld op 12:00 uur in de lokale tijdzone. Dit voorkomt `off-by-one` datumfouten die kunnen optreden door tijdzone-verschuivingen.
 * @contract Dit bestand exporteert de `TimeProvider` interface. Elke klasse die deze interface implementeert, moet een `getCurrentLocalNoon()` methode bevatten die een `Date` object retourneert. Deze `Date` zou moeten representeren "vandaag om 12:00 uur".
 * @ai_instruction Implementeer deze interface in een concrete klasse voor productiegebruik (die de echte huidige tijd retourneert) en in mock-klassen voor testscenario's (die een vaste, voorspelbare datum retourneren). Injecteer de `TimeProvider` in elke class die afhankelijk is van de huidige tijd om de logica deterministisch en testbaar te houden.
 */
export interface TimeProvider { getCurrentLocalNoon(): Date; }
