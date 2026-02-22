/**
 * @file_intent Definieert pure business logic functies (`calculateAge`, `isMinor`, `isSenior`) om leeftijdscategorieën en exacte leeftijden te bepalen op basis van een geboortedatum. Het ontwerp maakt gebruik van een `TimeProvider` (Dependency Injection) om de functies testbaar en onafhankelijk van de systeemtijd te maken.
 * @repo_architecture Domain Layer - Business Rules.
 * @term_definition
 *   - `Business Rule`: Een pure functie die een specifiek stuk bedrijfslogica inkapselt, bijvoorbeeld: "een persoon is minderjarig als hij/zij jonger is dan 18 jaar".
 *   - `TimeProvider`: Een abstractie voor het aanleveren van de huidige tijd. Door dit als een afhankelijkheid te injecteren, kunnen we de regels testen tegen verschillende, gefixeerde datums, wat essentieel is voor betrouwbaarheid.
 * @contract Dit bestand exporteert de functies `calculateAge`, `isMinor` en `isSenior`. Alle functies vereisen een `Date`-object (`birthDate`) en een implementatie van de `TimeProvider`-interface. `calculateAge` retourneert de exacte leeftijd in jaren. `isMinor` en `isSenior` retourneren een `boolean`. De berekening is nauwkeurig en houdt rekening met maanden en dagen.
 * @ai_instruction Gebruik `calculateAge` wanneer de exacte leeftijd nodig is. Gebruik `isMinor` en `isSenior` voor conditionele logica. Bij het aanroepen van deze functies moet altijd een `TimeProvider` worden meegegeven. In productiecode zal dit een provider zijn die de actuele datum retourneert. In tests, gebruik een `MockTimeProvider` om verschillende scenario's en randgevallen (zoals verjaardagen en schrikkeljaren) te simuleren en de correctheid van de regels te valideren.
 */

import { TimeProvider } from "@domain/helpers/TimeProvider";

export function calculateAge(birthDate: Date, provider: TimeProvider): number {
    const today = provider.getCurrentLocalNoon();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

export function isMinor(birthDate: Date, provider: TimeProvider): boolean {
  const today = provider.getCurrentLocalNoon();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 < 18;
  }
  return age < 18;
}

export function isSenior(birthDate: Date, provider: TimeProvider): boolean {
  const today = provider.getCurrentLocalNoon();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 >= 65;
  }
  return age >= 65;
}
