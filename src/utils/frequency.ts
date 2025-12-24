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
