/**
 * @file_intent Biedt functies om financiële bedragen te normaliseren naar een maandelijkse frequentie. Dit is essentieel om bedragen met verschillende periodiciteiten (bv. weekloon, jaarlijkse verzekering) met elkaar te kunnen vergelijken en aggregeren.
 * @repo_architecture Domain Layer - Helpers.
 * @term_definition
 *   - `Frequency`: Een type dat de periodiciteit van een bedrag definieert (bv. per week, per maand, per jaar).
 *   - `Normalisatie`: Het proces van het omrekenen van bedragen met verschillende frequenties naar één gestandaardiseerde frequentie (in dit geval, maandelijks).
 *   - `Factor`: Een vermenigvuldigingsgetal dat wordt gebruikt om een bedrag van de ene frequentie naar de andere om te rekenen.
 * @contract Dit bestand exporteert het `Frequency` type, de `getMonthlyFactor` functie die de conversiefactor berekent, en de `convertToMonthlyCents` functie die een bedrag in centen omrekent naar een maandelijks bedrag in centen. Alle berekeningen zijn puur en stateless.
 * @ai_instruction Gebruik `convertToMonthlyCents` om elk financieel bedrag dat niet maandelijks is, te normaliseren voordat het wordt gebruikt in berekeningen of aggregaties. Dit zorgt voor consistentie in het hele domein. De berekeningen worden uitgevoerd met centen (integers) om afrondingsfouten met zwevendekommagetallen te vermijden.
 */

// WAI-004-D — Frequentie & Maand-normalisatie
// -------------------------------------------------------

export const WEEKS_PER_YEAR = 52;
export const MONTHS_PER_YEAR = 12;

export type Frequency = 'week' | '4wk' | 'month' | 'quarter' | 'year';

/**
 * Berekent de factor om een bedrag naar een maandbedrag te converteren.
 */
export const getMonthlyFactor = (freq?: Frequency | string): number => {
  switch (freq) {
    case 'week':
      return WEEKS_PER_YEAR / MONTHS_PER_YEAR; // 4.333...
    case '4wk':
      return 13 / 12; // 1.0833...
    case 'month':
      return 1;
    case 'quarter':
      return 1 / 3;
    case 'year':
      return 1 / MONTHS_PER_YEAR;
    default:
      return 1;
  }
};

/**
 * Converteert centen naar maandelijkse centen op basis van frequentie.
 * We ronden af op hele centen om integers te behouden.
 */
export const convertToMonthlyCents = (cents: number, freq?: Frequency | string): number => {
  const factor = getMonthlyFactor(freq);
  return Math.round(cents * factor);
};