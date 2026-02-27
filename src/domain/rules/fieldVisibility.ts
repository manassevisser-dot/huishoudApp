/**
 * @file_intent Centraliseert de volledige logica voor de zichtbaarheid van UI-componenten en andere dynamische UI-eigenschappen. Dit bestand definieert een robuust, type-veilig systeem (`VisibilityContext`) waarmee UI-regels op een gestructureerde manier de applicatiestaat kunnen bevragen. Het scheidt de *conditie* (bv. "heeft de gebruiker kinderen?") van de *implementatie* in de UI.
 * @repo_architecture Domain Layer - Business Rules.
 * @term_definition
 *   - `VisibilityContext`: Een abstractie die fungeert als een facade of een "lens" op de applicatiestaat. Het biedt regelfuncties een veilige, getypeerde `getValue`-methode om specifieke datapunten uit de staat te lezen, zonder dat de regel de volledige staat-structuur hoeft te kennen.
 *   - `VisibilityRuleFn`: De standaardsignatuur voor een zichtbaarheidsregel: `(context, memberId?) => boolean`. Elke regel is een pure functie die de context evalueert en een ondubbelzinnige `true` of `false` retourneert.
 *   - `fieldVisibilityRules`: Een object dat alle zichtbaarheidsregels van de applicatie centraliseert. De sleutels zijn Engelse, beschrijvende conditienamen (bv. `showMaritalStatus`), wat de logica loskoppelt van specifieke UI-componenten.
 *   - `UI Hint`: Een speciaal type regel dat geen `boolean` retourneert, maar een kwantitatieve aanwijzing voor de UI, zoals het aantal keren dat een component herhaald moet worden (`RepeatCount`). Dit wordt gebruikt voor dynamische lijsten (repeaters).
 * @contract Dit bestand exporteert de `fieldVisibilityRules` en `uiHints` objecten als `const`, wat een stabiele API garandeert. Het exporteert ook de benodigde types zoals `VisibilityContext` en `VisibilityRuleName` om externe afhankelijkheden (zoals de orchestrator) type-veilig te maken. De interne helper `getMemberFromContext` zorgt voor een veilige, robuuste manier om data van een specifiek lid op te zoeken.
 * @ai_instruction Dit bestand is de kern van de dynamische UI-logica en wordt exclusief gebruikt door de **orchestrator-laag**. De orchestrator doorloopt de UI-structuur en voor elk component met een conditie:
 *   1. Creëert een `VisibilityContext` die de actuele applicatiestaat omvat.
 *   2. Roept de corresponderende regel uit `fieldVisibilityRules` aan (bv. `fieldVisibilityRules.showHuurtoeslag(context)`).
 *   3. Gebruikt het `boolean` resultaat om de `visible` eigenschap in de uiteindelijke UI-staat te zetten.
 *   4. Voor "repeaters" roept de orchestrator een hint uit `uiHints` aan (bv. `uiHints.carRepeatCount(context)`) om te bepalen hoeveel instanties van een component moeten worden aangemaakt.
 * Dit patroon zorgt ervoor dat de UI-laag volledig "dom" is en enkel de door de orchestrator voorbereide staat rendert. Alle logica is gecentraliseerd in het domein.
 */

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