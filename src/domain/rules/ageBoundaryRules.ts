/**
 * @file_intent Definieert de business rules die de grenzen van een "leeftijds-sandbox" bewaken. Deze regels worden gebruikt in een test- of ontwikkelomgeving om te waarborgen dat de applicatie alleen wordt gebruikt met fictieve personen die binnen een veilige, vooraf gedefinieerde leeftijdsrange vallen (bv. tussen 18 en 85 jaar). Dit is een ontwikkel-specifieke veiligheidsmaatregel.
 * @repo_architecture Domain Layer - Business Rules (Development/Test-specific).
 * @term_definition
 *   - `Age Sandbox`: Een gecontroleerde omgeving waarin de applicatie wordt getest met data die binnen specifieke leeftijdgrenzen valt. Dit voorkomt het gebruik van realistische, maar potentieel gevoelige, geboortedata in een niet-productieomgeving.
 *   - `Boundary Check`: Een validatie die controleert of een waarde binnen een minimum- en maximumgrens valt.
 * @contract Dit bestand exporteert de `isWithinAgeBoundaries` functie. Deze functie neemt een `Date` object (geboortedatum) en een `TimeProvider` als input en retourneert een `boolean`. Het berekent de leeftijd en controleert of deze binnen de gedefinieerde `MIN_AGE` en `MAX_AGE` constanten valt. Het is afhankelijk van de `calculateAge` functie en de `TimeProvider` voor een consistente en testbare tijdsberekening.
 * @ai_instruction De `isWithinAgeBoundaries` functie wordt doorgaans aangeroepen door een **orchestrator** of een validatielaag in een *ontwikkel- of testbuild* van de applicatie. Wanneer een gebruiker een geboortedatum invoert, kan de orchestrator deze regel aanroepen om te valideren of de ingevoerde datum resulteert in een leeftijd die binnen de sandbox valt. Als dat niet het geval is, kan de orchestrator een foutmelding genereren en de UI-staat bijwerken om de gebruiker te informeren. Dit zorgt ervoor dat de testdata consistent blijft en voorkomt onrealistische scenario's tijdens de ontwikkeling.
 */

import { type TimeProvider } from '@domain/helpers/TimeProvider';
import { calculateAge } from './ageRules';

const MIN_AGE = 18;
const MAX_AGE = 85;

/**
 * Functie voor de 'leeftijd-sandbox' in de DEV-omgeving.
 * Zorgt ervoor dat we alleen fictieve personen testen tussen 18-85.
 */
export function isWithinAgeBoundaries(dob: Date, provider: TimeProvider): boolean {
  const age = calculateAge(dob, provider);
  return age >= MIN_AGE && age <= MAX_AGE;
}
