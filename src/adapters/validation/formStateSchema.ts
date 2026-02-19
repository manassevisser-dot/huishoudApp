import { z } from 'zod';
import {
  FIELD_CONSTRAINTS_REGISTRY,
} from '@domain/rules/fieldConstraints';
import type {
  NumberConstraint,
  EnumConstraint,
  StringConstraint,
  BooleanConstraint,
} from '@domain/rules/fieldConstraints';

/**
 * ADAPTER LAYER: Zod Schemas
 *
 * ⚠️ CRITICAL: Schemas are GENERATED from domain constraints (SSOT)
 * ⚠️ Domain constraints in fieldConstraints.ts remain the single source of truth
 * ⚠️ This file translates domain rules into Zod runtime validation
 *
 * ADR-01: Adapter layer is the ONLY place where Zod is used
 */

// Shorthand voor leesbaarheid
const R = FIELD_CONSTRAINTS_REGISTRY;

// ════════════════════════════════════════════════════════════════
// TYPED SCHEMA BUILDERS — retourneren specifieke Zod-types
// NOOIT z.ZodType<un_known>
// ════════════════════════════════════════════════════════════════

/** Bouwt z.ZodNumber met min/max uit constraint */
function buildNumber(c: NumberConstraint) {
  let s = z.number();
  if (c.min !== undefined) s = s.min(c.min);
  if (c.max !== undefined) s = s.max(c.max);
  return s;
  // Return type: z.ZodNumber ✅ (niet z.ZodType<un_known>)
}

/** Bouwt z.ZodString met optionele pattern uit constraint */
function buildString(c: StringConstraint) {
  let s = z.string();
  if (c.pattern instanceof RegExp) {
    s = s.regex(c.pattern, { message: 'Ongeldig formaat' });
  }
  return s;
  // Return type: z.ZodString ✅
}

/** Bouwt z.ZodEnum uit constraint values */
function buildEnum(c: EnumConstraint) {
  const v = c.values;
  /* istanbul ignore next */
  if (v.length === 0) return z.never();
  /* istanbul ignore next */
  if (v.length === 1) return z.literal(v[0]);
  const [first, second, ...rest] = v;
  return z.enum([first, second, ...rest] as [string, string, ...string[]]);
}

/** Bouwt z.ZodBoolean */
function buildBoolean(_c: BooleanConstraint) {
  return z.boolean();
  // Return type: z.ZodBoolean ✅
}

// ════════════════════════════════════════════════════════════════
// SECTION SCHEMAS — expliciet gebouwd met typed builders
// ════════════════════════════════════════════════════════════════

/**
 * Setup sectie — huishoudconfiguratie
 *
 * Elke regel wijst direct naar de Registry constraint.
 * TypeScript leidt het type af uit de builder, niet uit `un_known`.
 */
export const SetupSchema = z.object({
  // Required velden (geen .optional())
  aantalMensen:    buildNumber(R.aantalMensen),
  aantalVolwassen: buildNumber(R.aantalVolwassen),
  autoCount:       buildEnum(R.autoCount),
  woningType:      buildEnum(R.woningType),

  // Optionele velden
  heeftHuisdieren: buildBoolean(R.heeftHuisdieren).optional(),
}).passthrough();
// passthrough: staat extra velden toe die nog niet in Registry staan

/**
 * Member-template — één huishoudlid
 *
 * Gebouwd uit MEMBER_FIELD_KEYS.
 * Alle member-velden zijn optioneel (wizard vult ze stap voor stap in).
 */
export const MemberSchema = z.object({
  // ── Persoonlijk ──────────────────────────────────
  name:             buildString(R.name).optional(),
  age:              buildNumber(R.age).optional(),
  dob:              buildString(R.dob).optional(),
  gender:           buildEnum(R.gender).optional(),
  burgerlijkeStaat: buildEnum(R.burgerlijkeStaat).optional(),

  // ── Inkomen ──────────────────────────────────────
  nettoSalaris:        buildNumber(R.nettoSalaris).optional(),
  frequentie:          buildEnum(R.frequentie).optional(),
  vakantiegeldPerJaar: buildNumber(R.vakantiegeldPerJaar).optional(),
  vakantiegeldPerMaand:buildNumber(R.vakantiegeldPerMaand).optional(),
  uitkeringType:       buildEnum(R.uitkeringType).optional(),
  uitkeringBedrag:     buildNumber(R.uitkeringBedrag).optional(),
  zorgtoeslag:         buildNumber(R.zorgtoeslag).optional(),
  reiskosten:          buildNumber(R.reiskosten).optional(),
  overigeInkomsten:    buildNumber(R.overigeInkomsten).optional(),

  // ── Uitgaven per persoon ─────────────────────────
  telefoon: buildNumber(R.telefoon).optional(),
  ov:       buildNumber(R.ov).optional(),
}).passthrough();

/**
 * Auto-template — één voertuig
 *
 * Gebouwd uit AUTO_FIELD_KEYS.
 */
export const AutoSchema = z.object({
  wegenbelasting:      buildNumber(R.wegenbelasting).optional(),
  brandstofOfLaden:    buildNumber(R.brandstofOfLaden).optional(),
  apk:                 buildNumber(R.apk).optional(),
  onderhoudReservering:buildNumber(R.onderhoudReservering).optional(),
  lease:               buildNumber(R.lease).optional(),
  afschrijving:        buildNumber(R.afschrijving).optional(),
}).passthrough();

/**
 * Household sectie — members array is nu GETYPT
 */
export const HouseholdSchema = z.object({
  members: z.array(MemberSchema),
}).passthrough();

/**
 * Income schema — household-level toeslagen + member income
 */
export const IncomeSchema = z.object({
  // Household-level toeslagen
  huurtoeslag:        buildNumber(R.huurtoeslag).optional(),
  kindgebondenBudget: buildNumber(R.kindgebondenBudget).optional(),
  kinderopvangtoeslag:buildNumber(R.kinderopvangtoeslag).optional(),
  kinderbijslag:      buildNumber(R.kinderbijslag).optional(),
  heeftVermogen:      buildEnum(R.heeftVermogen).optional(),
  vermogenWaarde:     buildNumber(R.vermogenWaarde).optional(),

  // Aggregatie
  items: z.array(z.record(z.string(), z.unknown())).optional(),
  totalAmount: z.number().optional(),
}).passthrough();

/**
 * Expense schema — wonen, nuts, verzekeringen, abonnementen, auto
 */
export const ExpenseSchema = z.object({
  // ── Wonen ────────────────────────────────────────
  kaleHuur:            buildNumber(R.kaleHuur).optional(),
  servicekosten:       buildNumber(R.servicekosten).optional(),
  hypotheekBruto:      buildNumber(R.hypotheekBruto).optional(),
  ozb:                 buildNumber(R.ozb).optional(),
  gemeentebelastingen: buildNumber(R.gemeentebelastingen).optional(),
  waterschapsbelasting:buildNumber(R.waterschapsbelasting).optional(),
  kostgeld:            buildNumber(R.kostgeld).optional(),
  woonlasten:          buildNumber(R.woonlasten).optional(),

  // ── Nuts ─────────────────────────────────────────
  energieGas:  buildNumber(R.energieGas).optional(),
  water:       buildNumber(R.water).optional(),
  bijdrageEGW: buildNumber(R.bijdrageEGW).optional(),

  // ── Verzekeringen ────────────────────────────────
  ziektekostenPremie: buildNumber(R.ziektekostenPremie).optional(),
  aansprakelijkheid:  buildNumber(R.aansprakelijkheid).optional(),
  reis:               buildNumber(R.reis).optional(),
  opstal:             buildNumber(R.opstal).optional(),
  uitvaart:           buildNumber(R.uitvaart).optional(),
  rechtsbijstand:     buildNumber(R.rechtsbijstand).optional(),
  overlijdensrisico:  buildNumber(R.overlijdensrisico).optional(),

  // ── Abonnementen ─────────────────────────────────
  internetTv:   buildNumber(R.internetTv).optional(),
  sport:        buildNumber(R.sport).optional(),
  lezen:        buildNumber(R.lezen).optional(),
  contributie:  buildNumber(R.contributie).optional(),

  // ── Auto's ───────────────────────────────────────
  autos: z.array(AutoSchema).optional(),

  // Aggregatie
  items: z.array(z.record(z.string(), z.unknown())).optional(),
  totalAmount: z.number().optional(),
}).passthrough();

/**
 * Finance sectie — income + expenses, nu volledig getypt
 */
export const FinanceSchema = z.object({
  income:   IncomeSchema,
  expenses: ExpenseSchema,
}).passthrough();

// ════════════════════════════════════════════════════════════════
// FORMSTATE SCHEMA — de complete state, volledig getypt
// ════════════════════════════════════════════════════════════════

export const FormStateSchema = z.object({
  schemaVersion: z.literal('1.0'),
  activeStep:    z.string(),
  currentScreenId: z.string(),
  isValid:       z.boolean(),
  data: z.object({
    setup:     SetupSchema,
    household: HouseholdSchema,
    finance:   FinanceSchema,
  }),
  viewModels: z.object({
    financialSummary: z.object({
      totalIncomeDisplay:   z.string(),
      totalExpensesDisplay: z.string(),
      netDisplay:           z.string(),
    }).optional(),
  }).optional(),
  meta: z.object({
    lastModified: z.string(),
    version:      z.number(),
  }),
});

// ════════════════════════════════════════════════════════════════
// AFGELEIDE TYPES — z.infer geeft nu ECHTE types
// ════════════════════════════════════════════════════════════════

/** Het volledige FormState type — afgeleid, niet handmatig */
export type FormState = z.infer<typeof FormStateSchema>;

/** Alias voor validatie-resultaat */
export type ValidatedFormState = FormState;

/** De drie data-secties */
export type DataSection = 'setup' | 'household' | 'finance';

/** Member type — afgeleid uit MemberSchema */
export type Member = z.infer<typeof MemberSchema>;

/** Auto type — afgeleid uit AutoSchema */
export type Auto = z.infer<typeof AutoSchema>;

// ════════════════════════════════════════════════════════════════
// RUNTIME VALIDATION — voor dynamische veldvalidatie
// ════════════════════════════════════════════════════════════════

/**
 * Runtime schema-lookup per veld-ID.
 *
 * ⚠️ Dit is een Record<string, ...> en verliest compile-time types.
 * ⚠️ Gebruik dit ALLEEN voor runtime validatie in orchestrators.
 * ⚠️ Voor compile-time types: gebruik FormState, Member, Auto types.
 */
export const FieldSchemas: Record<string, z.ZodTypeAny> = Object.fromEntries(
  Object.entries(FIELD_CONSTRAINTS_REGISTRY).map(([fieldId, constraint]) => {
    let s: z.ZodTypeAny;
    switch (constraint.type) {
      case 'number':  s = buildNumber(constraint); break;
      case 'string':  s = buildString(constraint); break;
      case 'enum':    s = buildEnum(constraint); break;
      case 'boolean': s = buildBoolean(constraint); break;
      /* istanbul ignore next */
      default:        s = z.unknown();
    }
    return [fieldId, s];
  })
);

/**
 * Valideer complete FormState
 *
 * @param input - Un_known input to validate
 * @returns Validated FormState met echte types
 * @throws ZodError if validation fails
 */
/**
 * Valideer complete FormState.
 * De input is unknown omdat dit de grens van de adapter is (ADR-01).
 */
export function parseFormState(input: unknown): FormState {
  return FormStateSchema.parse(input);
}
