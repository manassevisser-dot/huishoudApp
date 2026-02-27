// src/domain/constants/labelResolver.ts

/**
 * Vertaalt een string-token naar de bijbehorende meldingstekst via `WizStrings`.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 * @see {@link ../../config/WizStrings.ts | WizStrings — berichtenbron}
 *
 * @remarks
 * **Verantwoordelijkheidsgrens**:
 * - `labelFromToken` + `WizStrings` → meldingen (validatieteksten, bevestigingen, foutmeldingen)
 * - `UI_LABELS[UX_TOKENS.*]` → labels (schermtitels, veldlabels, navigatietekst)
 *
 * Opzoekolgorde: `wizard` → `dashboard` → `common` → `landing` →
 * `options` → `undo` → `settings` → fallback (token zelf).
 *
 * ⚠️ De `csvAnalysis`-sectie van `WizStrings` wordt **niet** doorzocht.
 * CSV-analyse meldingen vallen daardoor terug op de ruwe token-string.
 * Zie TODO.md §1.
 */

/* eslint-disable complexity */
import WizStrings from '@config/WizStrings';

/**
 * Zoekt `token` op in alle bekende `WizStrings`-secties en retourneert de gevonden tekst.
 * Retourneert `token` zelf als er geen match is (fail-open).
 *
 * @param token - De token-string om op te zoeken (bijv. `'wizard.title'`)
 * @returns De gevonden Nederlandse tekst, of `token` als fallback
 *
 * @example
 * labelFromToken('dashboard.title') // → 'Dashboard'
 * labelFromToken('onbekend.token')  // → 'onbekend.token'  (fallback)
 */
export function labelFromToken(token: string): string {
  if (token in (WizStrings.wizard    ?? {})) return (WizStrings.wizard    as Record<string, string>)[token] ?? token;
  if (token in (WizStrings.dashboard ?? {})) return (WizStrings.dashboard as Record<string, string>)[token] ?? token;
  if (token in (WizStrings.common    ?? {})) return (WizStrings.common    as Record<string, string>)[token] ?? token;
  if (token in (WizStrings.landing   ?? {})) return (WizStrings.landing   as Record<string, string>)[token] ?? token;
  if (token in (WizStrings.options   ?? {})) return (WizStrings.options   as Record<string, string>)[token] ?? token;
  if (token in (WizStrings.undo      ?? {})) return (WizStrings.undo      as Record<string, string>)[token] ?? token;
  if (token in (WizStrings.settings  ?? {})) return (WizStrings.settings  as Record<string, string>)[token] ?? token;
  // Fallback: token zelf
  return token;
}
