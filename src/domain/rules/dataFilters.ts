// src/domain/rules/dataFilters.ts
import type { Member } from '@core/types/core';
import { VisibilityContext } from './fieldVisibility';

/**
 * ADR-06: Defensive Programming
 * Filterregels voor dynamische formulieronderdelen.
 */

type VisibilityKnownFields = { household: unknown };

export const dataFilterRules = {
  member_income_repeater: (ctx: VisibilityContext): Member[] => {
    const household = ctx.getValue('household' as keyof VisibilityKnownFields) as { members?: unknown } | undefined;

    const rawMembers = household?.members;
    const members: Member[] = Array.isArray(rawMembers) ? (rawMembers as Member[]) : [];
    return members;
  },
};
