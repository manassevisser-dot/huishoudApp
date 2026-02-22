/**
 * @file_intent Biedt performante, gememoiseerde selectors voor het extraheren en berekenen van afgeleide data gerelateerd aan het huishouden. Deze selectors gebruiken `reselect` om te zorgen dat berekeningen alleen opnieuw worden uitgevoerd wanneer de onderliggende data verandert.
 * @repo_architecture UI Layer - State Selector. Dit bestand demonstreert een best-practice voor het creëren van performante selectors die de `reselect`-bibliotheek gebruiken. Het vormt de brug tussen de ruwe state in `@core` en de afgeleide, berekende data die UI-componenten nodig hebben, en is geoptimaliseerd voor prestaties.
 * @term_definition
 *   - `reselect`: Een bibliotheek voor het maken van gememoiseerde, samen te stellen selector-functies.
 *   - `Memoization`: Een prestatie-optimalisatietechniek waarbij het resultaat van een functie-aanroep wordt gecached. De functie wordt alleen opnieuw uitgevoerd als de input verandert, anders wordt het gecachete resultaat teruggegeven.
 *   - `createSelector`: De belangrijkste functie van `reselect` om een gememoiseerde selector te bouwen.
 *   - `Input Selector`: Een basis-selector (zoals `selectSetupData`) die ruwe data uit de state aanlevert aan een gememoiseerde selector.
 *   - `selectHouseholdStats`: De belangrijkste gememoiseerde selector in dit bestand, die statistieken over het huishouden berekent.
 * @contract De `selectHouseholdStats`-selector is afhankelijk van `selectSetupData`. Het verwerkt de `setup`-data om de `adultCount` te berekenen. Dankzij `createSelector` wordt deze berekening alleen opnieuw uitgevoerd als het `setup`-object in de state daadwerkelijk verandert, niet bij elke willekeurige state-update. Het retourneert een object `{ adultCount: number }`.
 * @ai_instruction Gebruik `selectHouseholdStats` in je componenten om afgeleide data over het huishouden op te halen zonder onnodige re-renders te veroorzaken. Wanneer je nieuwe, rekenkundig-intensieve selectors toevoegt, volg dan dit patroon met `createSelector` voor betere prestaties. Het `SetupData`-type wordt bewust afgeleid van `FormState` om directe afhankelijkheden met andere lagen (zoals `@domain`) te vermijden en de scheiding der lagen te handhaven.
 */
import { createSelector } from 'reselect';
import { FormState } from '@core/types/core';

// We extraheren het type direct uit de FormState interface 
// zodat we niet naar 'domain' hoeven te verwijzen.
type SetupData = FormState['data']['setup'];

const selectSetupData = (state: FormState): SetupData | Record<string, never> => {
  const setup = state.data?.setup;
  
  if (setup !== null && setup !== undefined) {
    return setup;
  }
  
  return {};
};

export const selectHouseholdStats = createSelector(
  [selectSetupData], 
  (setup) => {
    // 'setup' is nu automatisch getypeerd via de FormState
    const aantal = setup?.aantalVolwassen;
    const cleanAdultCount = (aantal !== null && aantal !== undefined) ? aantal : 0;
    
    return {
      adultCount: Number(cleanAdultCount),
    };
  }
);