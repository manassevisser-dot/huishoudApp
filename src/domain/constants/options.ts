/**
 * PHOENIX DOMAIN OPTIONS
 * Dit is de enige plek waar de keuzes voor de UI en Staat worden gedefinieerd.
 */

export const AUTO_COUNT_OPTIONS = ['Geen', 'Een', 'Twee'] as const;
export type AutoCount = typeof AUTO_COUNT_OPTIONS[number];

export const WONING_TYPE_OPTIONS = ['Huur', 'Koop', 'Inwonend'] as const;
export type WoningType = typeof WONING_TYPE_OPTIONS[number];

// Je kunt hier later makkelijk opties toevoegen zonder de UI te raken