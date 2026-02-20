/**
 * @file_intent Definieert een abstractie (interface) voor het schrijven van data naar een state-container. Dit ontkoppelt de businesslogica van de concrete state management implementatie (bv. Redux, Zustand, of een simpele React state hook).
 * @repo_architecture Domain Layer - Interfaces.
 * @term_definition
 *   - `StateWriter`: Een interface die de *intentie* om een deel van de applicatiestaat te wijzigen representeert. Het is een `Command` in het Command/Query Responsibility Segregation (CQRS) patroon.
 *   - `Decoupling`: Het ontwerpprincipe van het verminderen van afhankelijkheden tussen componenten. Hier wordt de domeinlogica ontkoppeld van de UI- of state-management-bibliotheek.
 * @contract Dit bestand exporteert de `StateWriter` interface. Een implementatie van deze interface *moet* een `updateField` methode bevatten die een `fieldId` (de sleutel in de state) en een `value` accepteert. De methode retourneert niets (`void`).
 * @ai_instruction Implementeer deze interface in de `Presentation Layer` (bv. in een React-component of een specifieke state-management-module). De domeinlogica roept de methoden op deze interface aan, maar weet niets over de uiteindelijke implementatie. Dit maakt de domeinlogica herbruikbaar en testbaar los van de UI. Voor testen, gebruik een mock-implementatie van `StateWriter` om te verifiëren dat de juiste updates worden aangeroepen.
 */
export interface StateWriter { updateField(fieldId: string, value: unknown): void; }
