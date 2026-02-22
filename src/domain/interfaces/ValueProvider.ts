/**
 * @file_intent Definieert een abstractie (interface) voor het lezen van data uit een state-container. Dit is de tegenhanger van `StateWriter` en vormt de `Query`-kant van een CQRS (Command/Query Responsibility Segregation) benadering.
 * @repo_architecture Domain Layer - Interfaces.
 * @term_definition
 *   - `ValueProvider`: Een interface die de *vraag* naar een specifieke waarde uit de applicatiestaat representeert. Het ontkoppelt de domeinlogica van de kennis over waar of hoe de staat wordt opgeslagen.
 *   - `External Façade`: Deze interface fungeert als een gecontroleerd toegangspunt (een `façade`) voor externe consumenten (zoals UI-componenten of data-adapters) om waarden uit het domein op te vragen zonder de interne structuur ervan te kennen.
 * @contract Dit bestand exporteert de `ValueProvider` interface. Een implementatie hiervan *moet* een `getValue` methode hebben die een `fieldId` accepteert en een waarde van het type `unknown` retourneert. De consument is verantwoordelijk voor het casten van de waarde naar het verwachte type.
 * @ai_instruction Implementeer deze interface in de `Presentation Layer` of de state-management-module. De domeinlogica gebruikt deze provider om data uit de applicatiestaat te lezen die nodig is voor zijn berekeningen. Door deze abstractie kan de domeinlogica worden getest zonder afhankelijk te zijn van een volledige state-management-bibliotheek; in tests kan een eenvoudige mock-provider worden gebruikt die de benodigde testdata levert.
 */

// External façade for consumers outside domain (UI/adapters)
export interface ValueProvider {
  getValue(fieldId: string): unknown;
}