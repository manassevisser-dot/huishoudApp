// src/domain/constants/labelResolver.ts

/**
 * Vertaalt een string-token naar de bijbehorende meldingstekst via `WizStrings`.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 * @see {@link ../../config/WizStrings.ts | WizStrings — berichtenbron}
 */

import WizStrings from '@config/WizStrings';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';

// Type helper voor geneste objecten (verwijderd omdat niet gebruikt)
// type NestedValue = ...

/**
 * Veilige type guard voor objecten
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Haalt een waarde uit een genest object op basis van een punt-gescheiden pad.
 * 
 * @param obj - Het object om in te zoeken
 * @param path - Punt-gescheiden pad (bijv. 'screens.landing.title')
 * @returns De gevonden waarde of undefined
 */
function getNestedValue(
  obj: Record<string, unknown>, 
  path: string
): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (!isObject(current)) {
      return undefined;
    }
    current = current[part];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Helper om een platte token op te zoeken in een sectie van WizStrings.
 */
function findInSection(
  section: Record<string, string> | undefined,
  token: string
): string | undefined {
  // ✅ Expliciete null-check voor strict-boolean-expressions
  if (section === null || section === undefined) {
    return undefined;
  }
  return section[token];
}

/**
 * Zoekt `token` op in alle bekende `WizStrings`-secties en retourneert de gevonden tekst.
 * Retourneert `token` zelf als er geen match is (fail-open).
 *
 * @param token - De token-string om op te zoeken (bijv. `'wizard.title'` of `'screens.landing.title'`)
 * @returns De gevonden Nederlandse tekst, of `token` als fallback
 *
 * @example
 * labelFromToken('screens.landing.title') // → 'Welkom'
 * labelFromToken('wizard.back')           // → 'Vorige'
 * labelFromToken('onbekend.token')        // → 'onbekend.token' (fallback)
 */
export function labelFromToken(token: string): string {
  // 1. Probeer als genest pad (bijv. 'screens.landing.title')
  const nestedResult = getNestedValue(WizStrings as Record<string, unknown>, token);
  if (nestedResult !== undefined) return nestedResult;

  // 2. Probeer platte tokens in specifieke secties (voor backward compatibility)
  const sections = [
    WizStrings.wizard,
    WizStrings.dashboard,
    WizStrings.common,
    WizStrings.landing,
    WizStrings.options,
    WizStrings.undo,
    WizStrings.settings,
  ] as const;

  for (const section of sections) {
    const result = findInSection(section, token);
    if (result !== undefined) return result;
  }

  // 3. Fallback: token zelf (met warning via logger)
  Logger.warning('translation.token_not_found', { token });
  return token;
}