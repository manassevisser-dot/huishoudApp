/**
 * @file_intent Definieert data-filterregels die fungeren als "selectors" om specifieke data te extraheren en te transformeren uit een brede `VisibilityContext`. Deze regels zijn bedoeld om dynamische UI-componenten (zoals repeaters) te voeden met de precieze data die ze nodig hebben, op een veilige en voorspelbare manier.
 * @repo_architecture Domain Layer - Business Rules.
 * @term_definition
 *   - `Data Filter Rule`: Een functie die een specifieke subset van data selecteert en eventueel transformeert uit een groter statusobject (de `VisibilityContext`). Het resultaat wordt doorgaans gebruikt om een lijst met items in de UI te renderen.
 *   - `VisibilityContext`: Een object dat de totale staat van een formulier of applicatie bevat en als afhankelijkheid wordt doorgegeven aan regels, zodat zij de nodige data kunnen raadplegen.
 *   - `Repeater`: Een UI-component dat een lijst van sub-componenten dynamisch rendert op basis van een array van data (bv. een inkomensformulier voor elk lid van een huishouden).
 *   - `Defensive Programming`: Een programmeerstijl die anticipeert op onverwachte of ongeldige data. In dit bestand wordt expliciet gecontroleerd of `household` en `household.members` bestaan en het juiste type hebben voordat ze worden gebruikt, en wordt een veilige standaardwaarde (`[]`) teruggegeven om runtime-errors te voorkomen.
 * @contract Het bestand exporteert `dataFilterRules`, een object waarbij elke sleutel (bv. `member_income_repeater`) overeenkomt met een UI-component en de waarde de bijbehorende filterfunctie is. De `member_income_repeater`-functie accepteert een `VisibilityContext` en garandeert dat er altijd een array van `Member`-objecten (`Member[]`) wordt geretourneerd, zelfs als de data niet gevonden wordt (dan is de array leeg).
 * @ai_instruction Deze data-filter regels worden aangeroepen door **orchestrators**. Een orchestrator, verantwoordelijk voor het samenstellen van de UI-staat, gebruikt een regel zoals `dataFilterRules.member_income_repeater(context)` om de benodigde data (bv. een lijst van huishoudleden) op te halen. De orchestrator voegt deze data vervolgens toe aan het state-object dat naar de (domme) mobiele UI wordt gestuurd. Dit zorgt voor een strikte scheiding: de domeinlaag filtert en levert data aan, de orchestrator beheert de state, en de UI rendert enkel wat het aangeleverd krijgt.
 */

import type { Member } from '@core/types/core';
import { VisibilityContext } from './fieldVisibility';

/**
 * ADR-06: Defensive Programming
 * Filterregels voor dynamische formulieronderdelen.
 */

// We definiëren wat we verwachten in de context voor deze specifieke regel
type HouseholdData = { members: Member[] };

export const dataFilterRules = {
  member_income_repeater: (ctx: VisibilityContext): Member[] => {
    // We halen de waarde op en vertellen TS dat dit HouseholdData moet zijn
    // De 'as un_known' is hier een veilige brug van de algemene context naar dit specifieke type
    const household = ctx.getValue('household') as unknown as HouseholdData | undefined;

    // Als household bestaat en members een array is, geven we die terug
    if (household !== undefined && household !== null && Array.isArray(household.members)) {
      return household.members;
    }

    return [];
  },
};