import type { PrimitiveStyleRule, BasePrimitiveViewModel } from '@domain/registry/PrimitiveRegistry';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';

const EMPTY_STYLE: PrimitiveStyleRule = {};

export const getEmptyStyle = (): PrimitiveStyleRule => EMPTY_STYLE;

export const toStyleRule = (style: unknown): PrimitiveStyleRule => {
  if (style !== null && typeof style === 'object' && !Array.isArray(style)) {
    return style as PrimitiveStyleRule;
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

export const toBaseViewModel = <TPrimitive extends BasePrimitiveViewModel['primitiveType']>(
  entry: RenderEntryVM,
  primitiveType: TPrimitive,
): Omit<BasePrimitiveViewModel, 'primitiveType'> & { primitiveType: TPrimitive } => ({
  fieldId: entry.fieldId,
  primitiveType,
  error: null,
  errorStyle: EMPTY_STYLE,
});
