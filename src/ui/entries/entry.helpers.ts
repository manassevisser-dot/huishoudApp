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
 */
import type { PrimitiveStyleRule, BasePrimitiveViewModel } from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import type { AppStyles } from '@ui/styles/useAppStyles';

const EMPTY_STYLE: PrimitiveStyleRule = {};

/** Retourneert het gedeelde lege stijlobject (singleton). */
export const getEmptyStyle = (): PrimitiveStyleRule => EMPTY_STYLE;

/**
 * Zet een ruwe stijlinput om naar een bruikbaar `PrimitiveStyleRule`.
 *
 * @param style - Object, identity-resolver string, of onbekende waarde
 * @param styles - Geassembleerd AppStyles-object (van `useAppStyles`)
 * @param fallbackKey - String-sleutel in `styles` die wordt gebruikt als `style` geen object is
 * @returns Resolved stijlobject, of `{}` als niets bruikbaar is
 *
 * @example
 * toStyleRule(entry.childStyle, styles, 'inputContainer')
 */
export const toStyleRule = (
  style: unknown,
  styles?: AppStyles,
  fallbackKey?: string & keyof AppStyles,
): PrimitiveStyleRule => {
  // Object-input: direct gebruiken (bestaand gedrag)
  if (style !== null && typeof style === 'object' && !Array.isArray(style)) {
    return style as PrimitiveStyleRule;
  }
  // String-input (identity-resolver sleutel): fallback uit styles-object
  if (styles !== undefined && fallbackKey !== undefined) {
    return (styles[fallbackKey] ?? EMPTY_STYLE) as PrimitiveStyleRule;
  }
  return EMPTY_STYLE;
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
