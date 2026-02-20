// src/domain/index.ts
/**
 * @file_intent Facade voor de domeinlaag, exporteert publieke interfaces en constanten.
 * @repo_architecture Domain Layer - Public API.
 * @term_definition Facade Pattern = Een ontwerppatroon dat een vereenvoudigde interface biedt aan een groter geheel van code, zoals een class library.
 * @contract Dit bestand definieert de publieke API van de domeinlaag. Alleen expliciet geëxporteerde types en constanten zijn bedoeld voor gebruik door andere lagen van de applicatie.
 * @ai_instruction Gebruik deze facade om de koppeling tussen de domeinlaag en de applicatielaag te beheren. Voeg hier alleen exports toe voor elementen die stabiel en bedoeld voor extern gebruik zijn.
 */
// Verwijder deze regel:
// export * from './interfaces';

// Behoud alleen expliciete façade-exports:
export type { ValueProvider } from './interfaces/ValueProvider';
export type { StateWriter } from './interfaces/StateWriter';

// Constants blijven:
export const DATA_KEYS = {
  SETUP: 'setup',
  MEMBERS: 'members',
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
} as const;