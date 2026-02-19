// src/domain/rules/fieldVisibility.ts
//
// TYPE-SAFE HYBRIDE VERSIE — soft‑schema + hergebruik van option types
// - Visibility rules lezen uit ECHTE state (niet uit EntryRegistry)
// - Keys zijn ENGELSE conditie‑namen; velden blijven NEDERLANDS in state
// - getValue is getypt op bekende velden (hybride): options‑types + state‑shapes

import { isAowEligible } from './aowRules';
import type { WoningType, AutoCount, UitkeringType } from '@domain/registry/OptionsRegistry';

/* ──────────────────────────────────────────────────────────────────────────────
 * Kleine, herbruikbare type guards (ESLint strict-boolean-expressions friendly)
 * ────────────────────────────────────────────────────────────────────────────── */
const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

const isDefined = <T>(v: T | null | undefined): v is T =>
  v !== null && v !== undefined;

const isNumber = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);

/* ──────────────────────────────────────────────────────────────────────────────
 * Soft-schema types die aansluiten op jouw rules
 * ────────────────────────────────────────────────────────────────────────────── */
export interface MemberBase {
  fieldId?: string;
  memberId?: string;
  leeftijd?: number;
  categories?: {
    werk?: boolean;
    uitkering?: boolean;
    [key: string]: boolean | undefined;
  };
  /** Als het relevant is voor rules: concrete uitkering (discrete variant uit options) */
  uitkeringType?: UitkeringType;
  [extra: string]: unknown;
}

export interface HouseholdState {
  members?: unknown[]; // we casten on-demand naar MemberBase
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Bekende velden die de zichtbaarheid gebruikt (hybride: options + state)
 * ────────────────────────────────────────────────────────────────────────────── */
export type VisibilityKnownFields = {
  // numeriek uit setup/household
  aantalMensen: number;
  aantalVolwassen: number;

  // keuzen uit options.ts (hergebruik van jouw SSOT)
  woningType: WoningType; // 'Koop' | 'Huur' | 'Kamer' | 'Anders'
  autoCount: AutoCount;   // 'Geen' | 'Een' | 'Twee'

  // volledige household node voor member lookups
  household: HouseholdState;
};

/* ──────────────────────────────────────────────────────────────────────────────
 * Context + signatuur van regels
 * ────────────────────────────────────────────────────────────────────────────── */
export interface VisibilityContext {
  getValue: <K extends keyof VisibilityKnownFields>(fieldId: K) => VisibilityKnownFields[K];

  // (optioneel) fallback overload — laat deze weg als je ALLE keys wilt afdwingen
  // getValue(fieldId: string): un_known;
}

export type VisibilityRuleFn = (ctx: VisibilityContext, memberId?: string) => boolean;

/* ──────────────────────────────────────────────────────────────────────────────
 * Enige bron van visibility-regels — keys zijn ENGELSE condities
 * ────────────────────────────────────────────────────────────────────────────── */
export const fieldVisibilityRules = {
  /**
   * ==================== GENERIC / EXISTING ====================
   *
   * was: 'aantalVolwassen' (veldnaam) → nu conditie‑naam
   */
  isAdultInputVisible: (ctx: VisibilityContext): boolean => {
    const aantalMensen = ctx.getValue('aantalMensen');
    return aantalMensen > 0;
  },

  /**
   * was: 'kinderenLabel' (veld/UI) → nu conditie‑naam
   */
  calculateChildrenCount: (ctx: VisibilityContext): boolean => {
    const n = ctx.getValue('aantalMensen');
    const m = ctx.getValue('aantalVolwassen');
    return n > m;
  },

  /** Toon lid‑specifieke inkomensdetails? (alleen als memberId niet leeg is) */
  member_income_details: (_ctx: VisibilityContext, memberId?: string): boolean => {
    return isNonEmptyString(memberId);
  },

  /**
   * ==================== HOUSEHOLD RULES ====================
   */
  showMaritalStatus: (ctx: VisibilityContext): boolean => {
    const aantalVolwassen = ctx.getValue('aantalVolwassen');
    return aantalVolwassen > 1;
  },

  showPostcode: (ctx: VisibilityContext): boolean => {
    const aantalVolwassen = ctx.getValue('aantalVolwassen');
    return aantalVolwassen <= 1;
  },

  /**
   * ==================== INCOME / BENEFIT RULES ====================
   */
  showHuurtoeslag: (ctx: VisibilityContext): boolean => {
    const woningType = ctx.getValue('woningType');
    return woningType === 'Huur';
  },

  showKgb: (ctx: VisibilityContext): boolean => {
    const n = ctx.getValue('aantalMensen');
    const m = ctx.getValue('aantalVolwassen');
    return (n - m) > 0;
  },

  /**
   * GEFIXED: echte member-structuur: household.members[{ categories: {...}, leeftijd? }]
   */
  hasWorkSelected: (ctx: VisibilityContext, memberId?: string): boolean => {
    if (!isNonEmptyString(memberId)) return false;

    const member = getMemberFromContext(ctx, memberId);
    if (!isDefined(member)) return false;

    const cats = member.categories;
    return cats !== undefined && cats !== null && cats.werk === true;
  },

  hasBenefitSelected: (ctx: VisibilityContext, memberId?: string): boolean => {
    if (!isNonEmptyString(memberId)) return false;

    const member = getMemberFromContext(ctx, memberId);
    if (!isDefined(member)) return false;

    const cats = member.categories;
    return cats !== undefined && cats !== null && cats.uitkering === true;
  },

  isPensionado: (ctx: VisibilityContext, memberId?: string): boolean => {
    if (!isNonEmptyString(memberId)) return false;

    const member = getMemberFromContext(ctx, memberId);
    if (!isDefined(member)) return false;

    const leeftijd = member.leeftijd;
    return isNumber(leeftijd) && isAowEligible(leeftijd);
  },

  /**
   * ==================== HOUSING RULES ====================
   */
  isWoningHuur: (ctx: VisibilityContext): boolean => {
    const woningType = ctx.getValue('woningType');
    return woningType === 'Huur';
  },

  isWoningKoop: (ctx: VisibilityContext): boolean => {
    const woningType = ctx.getValue('woningType');
    return woningType === 'Koop';
  },

  isWoningKamer: (ctx: VisibilityContext): boolean => {
    const woningType = ctx.getValue('woningType');
    return woningType === 'Kamer';
  },

  /**
   * ==================== CAR RULES ====================
   * 'car_repeater' (UI-term) is verwijderd; gebruik 'hasCars' als conditie.
   */
  hasCars: (ctx: VisibilityContext): boolean => {
    const autoCount = ctx.getValue('autoCount'); // 'Geen' | 'Een' | 'Twee'
    return autoCount !== 'Geen';
  },
} as const;

/** Alle geldige regelnamen — automatisch afgeleid. */
export type VisibilityRuleName = keyof typeof fieldVisibilityRules;

/** Strikt type voor de map (extra guard; optioneel extern te gebruiken). */
export type VisibilityRulesMap = Record<VisibilityRuleName, VisibilityRuleFn>;

/* ──────────────────────────────────────────────────────────────────────────────
 * Helper: member lookup (expliciete null/undefined checks i.p.v. truthy)
 * ────────────────────────────────────────────────────────────────────────────── */
function getMemberFromContext(
  ctx: VisibilityContext,
  memberId: string
): MemberBase | null {
  const household = ctx.getValue('household');

  if (!isDefined(household) || !Array.isArray(household.members)) {
    return null;
  }

  const found = household.members.find((m: unknown) => {
    const x = m as Partial<MemberBase>;
    const byFieldId = isNonEmptyString(x.fieldId) && x.fieldId === memberId;
    const byMemberId = isNonEmptyString(x.memberId) && x.memberId === memberId;
    return byFieldId || byMemberId;
  });

  return (found ?? null) as MemberBase | null;
}
/* ──────────────────────────────────────────────────────────────────────────────
 * UI HINTS (DOMEIN)
 * - UI-beslissingen die afhangen van domeinwaarden, maar geen 'zichtbaar of niet' zijn.
 * - Hier: hoe vaak de 'auto' sectie moet herhalen op basis van autoCount.
 * - Blijft in het domein, zodat UI alleen 'uitvoert'.
 * ────────────────────────────────────────────────────────────────────────────── */

export type RepeatCount = 0 | 1 | 2;

/** Map AutoCount -> RepeatCount (fail-closed naar 0). */
function mapAutoCountToRepeat(autoCount: AutoCount): RepeatCount {
  switch (autoCount) {
    case 'Geen': return 0;
    case 'Een':  return 1;
    case 'Twee': return 2;
    default:     return 0; // fail-safe
  }
}

/**
 * UI-hints voor herhaalgedrag van secties/containers.
 * - Geen booleans (visibility), maar kwantitatieve hints.
 * - Te gebruiken door Render/Section-laag.
 */
export const uiHints = {
  /** Hoeveel auto-secties/containers renderen? (0 bij 'Geen', 1 bij 'Een', 2 bij 'Twee') */
  carRepeatCount: (ctx: VisibilityContext): RepeatCount => {
    const autoCount = ctx.getValue('autoCount'); // typed: AutoCount
    return mapAutoCountToRepeat(autoCount);
  },

  /**
   * Handig als je indices wilt loopen in de UI: [], [0], of [0,1].
   * (Pure helper bovenop carRepeatCount; optioneel.)
   */
  carRepeatIndices: (ctx: VisibilityContext): number[] => {
    const n = uiHints.carRepeatCount(ctx);
    return n === 0 ? [] : Array.from({ length: n }, (_, i) => i);
  },
} as const;

export type UiHintName = keyof typeof uiHints;