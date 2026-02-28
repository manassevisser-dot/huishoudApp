/**
 * Stateless helper-functies voor de entry-mapper laag.
 *
 * @module ui/entries
 * @see {@link ./README.md | Entries — Details}
 *
 * @remarks
 * `toStyleRule` accepteert drie vormen van input:
 * - Een object → direct teruggeven (bestaand RN-stijlobject)
 * - Een string + styles + fallbackKey → styles[fallbackKey] opzoeken (identity-resolver sleutel)
 * - Overige input → leeg object (`{}`)
 *
 * `PrimitiveStyleConfig` beschrijft per primitiveType welke bron en fallback-sleutel
 * worden gebruikt bij stijlresolutie. Dit type wordt door `entry.mappers.ts` ingevuld in
 * de centrale `PRIMITIVE_STYLE_CONFIG`-tabel.
 *
 * `resolveContainerStyle` is de centrale helperfunctie die de config uitleest en
 * `toStyleRule` aanroept met de juiste bron en fallback. Dit voorkomt dat elke mapper
 * de bron-keuze (`childStyle` vs `style`) en de fallback-sleutel zelf hard-codeert.
 */
import type { PrimitiveStyleRule, BasePrimitiveViewModel } from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import type { AppStyles } from '@ui/styles/useAppStyles';

const EMPTY_STYLE: PrimitiveStyleRule = {};

/** Retourneert het gedeelde lege stijlobject (singleton). */
export const getEmptyStyle = (): PrimitiveStyleRule => EMPTY_STYLE;

/**
 * Configuratie-shape voor één primitiveType in de centrale `PRIMITIVE_STYLE_CONFIG`-tabel.
 *
 * @remarks
 * `containerSource` bepaalt welke `RenderEntryVM`-prop als stijlinput dient:
 * - `'childStyle'` = styling voor de primitive zelf (bijv. `"primitive:counter"`)
 * - `'style'`      = styling voor de entry-wrapper (bijv. `"entry:startWizard"`)
 *
 * `containerFallback` en `labelFallback` zijn sleutels in `AppStyles`.
 * De type-constraint `keyof AppStyles` is hier bewust **niet** toegepast:
 * `AppStyles = ReturnType<typeof StyleSheet.create>` heeft geen statisch oplosbare `keyof`,
 * wat cascade-ESLint-fouten (`no-unsafe-assignment`, `no-unsafe-member-access`) veroorzaakt
 * in alle mappers die de config uitlezen.
 *
 * De garantie dat fallback-sleutels werkelijk bestaan in `AppStyles` wordt in plaats
 * daarvan afgedwongen door `entry.style-resolution.integration.test.ts`, die alle
 * mappers aanroept zonder mock en een non-leeg stijlobject vereist.
 *
 * @example
 * // Formulier-primitive: childStyle als bron, entryContainer als fallback
 * { containerSource: 'childStyle', containerFallback: 'entryContainer', ... }
 *
 * // ACTION-primitive: altijd childStyle; fallback via ACTION_STYLE_MAP (per StyleIntent)
 * { containerSource: 'childStyle', containerFallback: 'actionButton' }
 *
 * @architectural_layer UI — enkel gebruikt door entry.mappers.ts, nooit door domein of orchestrator
 */
export interface PrimitiveStyleConfig {
  /** Welke RenderEntryVM-prop de container-stijlinput levert. */
  containerSource:   'childStyle' | 'style';
  /**
   * AppStyles-sleutel als fallback wanneer containerSource een string is.
   * Gevalideerd at runtime door entry.style-resolution.integration.test.ts.
   */
  containerFallback: string;
  /** Welke RenderEntryVM-prop de label-stijlinput levert (enkel voor primitives met label). */
  labelSource?:      'style' | 'childStyle';
  /**
   * AppStyles-sleutel als fallback voor de label-stijl.
   * Gevalideerd at runtime door entry.style-resolution.integration.test.ts.
   */
  labelFallback?:    string;
}

/**
 * Zet een ruwe stijlinput om naar een bruikbaar `PrimitiveStyleRule`.
 *
 * @param style - Object, identity-resolver string, of onbekende waarde
 * @param styles - Geassembleerd AppStyles-object (van `useAppStyles`)
 * @param fallbackKey - Sleutel in `styles` die wordt gebruikt als `style` geen object is.
 *   Bewust getypeerd als `string` (niet `string & keyof AppStyles`): `AppStyles` is
 *   `ReturnType<typeof StyleSheet.create>` en heeft geen statisch oplosbare `keyof`,
 *   wat cascade-ESLint-fouten veroorzaakt in alle aanroepen. De garantie dat de sleutel
 *   werkelijk bestaat wordt afgedwongen door `entry.style-resolution.integration.test.ts`.
 * @returns Resolved stijlobject, of `{}` als niets bruikbaar is
 *
 * @example
 * toStyleRule(entry.childStyle, styles, 'entryContainer')
 */
export const toStyleRule = (
  style: unknown,
  styles?: AppStyles,
  fallbackKey?: string,
): PrimitiveStyleRule => {
  // Object-input: direct gebruiken (bestaand gedrag)
  if (style !== null && typeof style === 'object' && !Array.isArray(style)) {
    return style as PrimitiveStyleRule;
  }
  // String-input (identity-resolver sleutel): fallback uit styles-object.
  // Cast naar Record<string, unknown> omdat AppStyles geen string-index-signature heeft;
  // directe string-toegang geeft een TypeScript 'error' type dat cascade-ESLint-fouten
  // veroorzaakt in alle callers. De key-validatie is de verantwoordelijkheid van
  // entry.style-resolution.integration.test.ts, niet van de type-checker.
  if (styles !== undefined && fallbackKey !== undefined) {
    return ((styles as Record<string, unknown>)[fallbackKey] ?? EMPTY_STYLE) as PrimitiveStyleRule;
  }
  return EMPTY_STYLE;
};

/**
 * Resolvet de `containerStyle` van een entry via de centrale `PRIMITIVE_STYLE_CONFIG`.
 *
 * @param entry  - Bron-entry met `style` en `childStyle`
 * @param styles - Geassembleerd AppStyles-object
 * @param config - Config-record voor het huidige primitiveType
 * @returns Resolved stijlobject, nooit `undefined`
 *
 * @remarks
 * Centralisatie hier voorkomt dat elke mapper de bron-keuze (`childStyle` vs `style`)
 * en de fallback-sleutel zelf hard-codeert. Één wijziging in de centrale config heeft direct
 * effect op alle mappers die deze helper aanroepen.
 *
 * @architectural_layer UI — pure functie, geen React-context vereist
 */
export const resolveContainerStyle = (
  entry: RenderEntryVM,
  styles: AppStyles,
  config: PrimitiveStyleConfig,
): PrimitiveStyleRule => {
  const source = config.containerSource === 'childStyle' ? entry.childStyle : entry.style;
  return toStyleRule(source, styles, config.containerFallback);
};

export const toStringValue = (value: unknown): string => (typeof value === 'string' ? value : '');

export const toNumberValue = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return 0;
};

export const toBooleanValue = (value: unknown): boolean => value === true;

/**
 * Bouwt de gedeelde basisvelden voor elk PrimitiveViewModel.
 *
 * @param entry - Bron-entry met fieldId en overige metadata
 * @param primitiveType - Het concrete primitiveType (discriminant)
 * @returns Basis-property-set met `fieldId`, `primitiveType`, `error: null`, `errorStyle: {}`
 */
export const toBaseViewModel = <TPrimitive extends BasePrimitiveViewModel['primitiveType']>(
  entry: RenderEntryVM,
  primitiveType: TPrimitive,
): Omit<BasePrimitiveViewModel, 'primitiveType'> & { primitiveType: TPrimitive } => ({
  fieldId: entry.fieldId,
  primitiveType,
  error: null,
  errorStyle: EMPTY_STYLE,
});
