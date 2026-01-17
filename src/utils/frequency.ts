// frequency.ts (refined)
export const WEEKS_PER_YEAR = 52 as const;
export const MONTHS_PER_YEAR = 12 as const;

export type Frequency = 'week' | '4wk' | 'month' | 'quarter' | 'year';

// Interne helper om exhaustiveness af te dwingen bij switch
//const assertNever = (x: never): never => {
//  throw new Error(`Unsupported frequency: ${String(x)}`);
//};

/**
 * Berekent de factor om een bedrag naar een maandbedrag te converteren.
 * - Voor bekende Frequency union waarden is de switch exhaustief.
 * - Voor string buiten de union valt de default naar 1.
 */
export const getMonthlyFactor = (freq?: Frequency | string): number => {
  // Probeer te narrowen naar de union en behandel overige strings als unknown
  switch (freq as Frequency) {
    case 'week':
      return WEEKS_PER_YEAR / MONTHS_PER_YEAR; // ≈ 4.3333
    case '4wk':
      return 13 / 12; // ≈ 1.08333
    case 'month':
      return 1;
    case 'quarter':
      return 1 / 3;
    case 'year':
      return 1 / MONTHS_PER_YEAR;
    default:
      // Voor onbekende strings (niet in union): factor 1
      return 1;
  }
};

/**
 * Converteert centen naar maandelijkse centen op basis van frequentie.
 * - Centen blijven integer via Math.round.
 * - Negatieve bedragen blijven toegestaan als je dat wil (soms relevant voor correcties),
 *   maar je kunt ze ook expliciet blokkeren met een guard.
 */
export const convertToMonthlyCents = (cents: number, freq?: Frequency | string): number => {
  if (!Number.isFinite(cents)) throw new Error('Invalid cents: not a finite number');
  // Optionele guard: blokkeer negatieve centen (comment uit indien gewenst)
  // if (cents < 0) throw new Error('Invalid cents: must be non-negative');

  const factor = getMonthlyFactor(freq);
  return Math.round(cents * factor);
};
