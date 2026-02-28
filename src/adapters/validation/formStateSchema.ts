// src/adapters/validation/formStateSchema.ts
/**
 * Bevat de Zod-validatieschema's en afgeleide types voor de volledige form state.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 *
 * @remarks
 * - Deze adapter vertaalt constraints uit `FIELD_CONSTRAINTS_REGISTRY` naar runtime validatie.
 * - Zod wordt uitsluitend binnen deze adapterlaag gebruikt (ADR-01).
 */

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
 * Registry-alias voor kortere en leesbare schema-definities.
 */

// Shorthand alias voor constraints uit de registry.
const R = FIELD_CONSTRAINTS_REGISTRY;

// Typed schema-builders die concrete Zod-typen teruggeven.

/**
 * Bouwt een `z.number()` schema op basis van nummer-constraints.
 *
 * @param c - Constraint met optionele min/max grenzen.
 * @returns Zod number schema met geconfigureerde grenzen.
 */
function buildNumber(c: NumberConstraint) {
  let s = z.number();
  if (c.min !== undefined) s = s.min(c.min);
  if (c.max !== undefined) s = s.max(c.max);
  return s;
  // Retourneert bewust een concreet number-schema.
}

/**
 * Bouwt een `z.string()` schema met optionele regex-validatie.
 *
 * @param c - Constraint met optioneel pattern.
 * @returns Zod string schema met eventueel regex-regel.
 */
function buildString(c: StringConstraint) {
  let s = z.string();
  if (c.pattern instanceof RegExp) {
    s = s.regex(c.pattern, { message: 'Ongeldig formaat' });
  }
  return s;
  // Retourneert bewust een concreet string-schema.
}

/**
 * Bouwt een enum-schema op basis van toegestane stringwaarden.
 *
 * @param c - Constraint met lijst van toegestane enum-waarden.
 * @returns Zod enum/literal/never schema afhankelijk van het aantal waarden.
 */
function buildEnum(c: EnumConstraint) {
  const v = c.values;
  /* istanbul ignore next */
  if (v.length === 0) return z.never();
  /* istanbul ignore next */
  if (v.length === 1) return z.literal(v[0]);
  const [first, second, ...rest] = v;
  return z.enum([first, second, ...rest] as [string, string, ...string[]]);
}

/**
 * Bouwt een `z.boolean()` schema op basis van een boolean-constraint.
 *
 * @param _c - Boolean-constraint (momenteel zonder extra regels).
 * @returns Zod boolean schema.
 */
function buildBoolean(_c: BooleanConstraint) {
  return z.boolean();
  // Retourneert bewust een concreet boolean-schema.
}

// Section-schema's opgebouwd met typed builders.

/**
 * Valideert de setup-sectie van de huishoudconfiguratie.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 *
 * Elke regel wijst direct naar de Registry constraint.
 * TypeScript leidt het type af uit de builder, niet uit `un_known`.
 */
export const SetupSchema = z.object({
  // Verplichte velden.
  aantalMensen:    buildNumber(R.aantalMensen),
  aantalVolwassen: buildNumber(R.aantalVolwassen),
  autoCount:       buildEnum(R.autoCount),
  woningType:      buildEnum(R.woningType),
  // Postcode blijft optioneel omdat de wizard dit veld progressief invult.
  postcode: z.string().optional(),

  // Optionele velden.
  heeftHuisdieren: buildBoolean(R.heeftHuisdieren).optional(),
}).passthrough();
// `passthrough` laat extra (legacy) velden toe.

/**
 * Valideert één lid in de household members-lijst.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 *
 * Gebouwd uit MEMBER_FIELD_KEYS.
 * Alle member-velden zijn optioneel (wizard vult ze stap voor stap in).
 */
export const MemberSchema = z.object({
  // Persoonlijke gegevens.
  name:             buildString(R.name).optional(),
  age:              buildNumber(R.age).optional(),
  dob:              buildString(R.dob).optional(),
  gender:           buildEnum(R.gender).optional(),
  burgerlijkeStaat: buildEnum(R.burgerlijkeStaat).optional(),

  // Inkomensvelden.
  nettoSalaris:        buildNumber(R.nettoSalaris).optional(),
  frequentie:          buildEnum(R.frequentie).optional(),
  vakantiegeldPerJaar: buildNumber(R.vakantiegeldPerJaar).optional(),
  vakantiegeldPerMaand:buildNumber(R.vakantiegeldPerMaand).optional(),
  uitkeringType:       buildEnum(R.uitkeringType).optional(),
  uitkeringBedrag:     buildNumber(R.uitkeringBedrag).optional(),
  zorgtoeslag:         buildNumber(R.zorgtoeslag).optional(),
  reiskosten:          buildNumber(R.reiskosten).optional(),
  overigeInkomsten:    buildNumber(R.overigeInkomsten).optional(),

  // Uitgaven per persoon.
  telefoon: buildNumber(R.telefoon).optional(),
  ov:       buildNumber(R.ov).optional(),
}).passthrough();

/**
 * Valideert één auto-item binnen de uitgaven.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
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
 * Valideert de household-sectie met getypte members-array.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const HouseholdSchema = z.object({
  members: z.array(MemberSchema),
}).passthrough();

/**
 * Valideert de income-sectie op huishoudniveau.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const IncomeSchema = z.object({
  // Huishoudelijke toeslagen en vermogen.
  huurtoeslag:        buildNumber(R.huurtoeslag).optional(),
  kindgebondenBudget: buildNumber(R.kindgebondenBudget).optional(),
  kinderopvangtoeslag:buildNumber(R.kinderopvangtoeslag).optional(),
  kinderbijslag:      buildNumber(R.kinderbijslag).optional(),
  heeftVermogen:      buildEnum(R.heeftVermogen).optional(),
  vermogenWaarde:     buildNumber(R.vermogenWaarde).optional(),

  // Aggregatievelden.
  items: z.array(z.record(z.string(), z.unknown())).optional(),
  totalAmount: z.number().optional(),
}).passthrough();

/**
 * Valideert de expense-sectie inclusief wonen, nuts en auto.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const ExpenseSchema = z.object({
  // Wonen.
  kaleHuur:            buildNumber(R.kaleHuur).optional(),
  servicekosten:       buildNumber(R.servicekosten).optional(),
  hypotheekBruto:      buildNumber(R.hypotheekBruto).optional(),
  ozb:                 buildNumber(R.ozb).optional(),
  gemeentebelastingen: buildNumber(R.gemeentebelastingen).optional(),
  waterschapsbelasting:buildNumber(R.waterschapsbelasting).optional(),
  kostgeld:            buildNumber(R.kostgeld).optional(),
  woonlasten:          buildNumber(R.woonlasten).optional(),

  // Nutsvoorzieningen.
  energieGas:  buildNumber(R.energieGas).optional(),
  water:       buildNumber(R.water).optional(),
  bijdrageEGW: buildNumber(R.bijdrageEGW).optional(),

  // Verzekeringen.
  ziektekostenPremie: buildNumber(R.ziektekostenPremie).optional(),
  aansprakelijkheid:  buildNumber(R.aansprakelijkheid).optional(),
  reis:               buildNumber(R.reis).optional(),
  opstal:             buildNumber(R.opstal).optional(),
  uitvaart:           buildNumber(R.uitvaart).optional(),
  rechtsbijstand:     buildNumber(R.rechtsbijstand).optional(),
  overlijdensrisico:  buildNumber(R.overlijdensrisico).optional(),

  // Abonnementen.
  internetTv:   buildNumber(R.internetTv).optional(),
  sport:        buildNumber(R.sport).optional(),
  lezen:        buildNumber(R.lezen).optional(),
  contributie:  buildNumber(R.contributie).optional(),

  // Auto's.
  autos: z.array(AutoSchema).optional(),

  // Aggregatievelden.
  items: z.array(z.record(z.string(), z.unknown())).optional(),
  totalAmount: z.number().optional(),
}).passthrough();

/**
 * Valideert de finance-sectie met income en expenses.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const FinanceSchema = z.object({
  income:   IncomeSchema,
  expenses: ExpenseSchema,
}).passthrough();

/**
 * Valideert tijdelijke gegevens van de laatste ingevoerde transactie.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const LatestTransactionSchema = z.object({
  latestTransactionDate: z.string().optional(),
  latestTransactionAmount: z.number().optional(),
  latestTransactionCategory: z.string().nullable().optional(),
  latestTransactionDescription: z.string().optional(),
  latestPaymentMethod: z.string().optional(),
}).passthrough();

// Transaction history-schema's voor undo/redo.

/**
 * Valideert één opgeslagen transactie in de undo/redo-stack.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const TransactionRecordSchema = z.object({
  id:           z.string(),
  date:         z.string(),          // ISO-datumstring.
  description:  z.string(),
  amountCents:  z.number(),
  currency:     z.string().default('EUR'),
  category:     z.string().nullable().optional(),
  paymentMethod: z.string().optional(),
});

/**
 * Valideert de past/present/future-structuur voor undo/redo.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const TransactionHistorySchema = z.object({
  past:    z.array(TransactionRecordSchema),
  present: TransactionRecordSchema.nullable(),
  future:  z.array(TransactionRecordSchema),
});

/**
 * Afgeleid type van `TransactionRecordSchema`.
 */
export type TransactionRecord = z.infer<typeof TransactionRecordSchema>;
/**
 * Afgeleid type van `TransactionHistorySchema`.
 */
export type TransactionHistory = z.infer<typeof TransactionHistorySchema>;

/**
 * Valideert één geparste CSV-transactie.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const ParsedCsvTransactionSchema = z.object({
  id: z.string(),
  date: z.string(),              // ISO-datumstring.
  description: z.string(),
  amountCents: z.number(),
  amount: z.number(),
  category: z.string().optional(),
  isIgnored: z.boolean().optional(),
  original: z.record(z.string(), z.unknown()),
}).strict();

/**
 * Valideert de csvImport-sectie met metadata en transacties.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const CsvImportSchema = z.object({
  transactions: z.array(ParsedCsvTransactionSchema),  // Geparste transacties.
  importedAt: z.string(),                              // ISO-string van importtijdstip.
  period: z.object({ 
    from: z.string(), 
    to: z.string() 
  }).nullable(),                                       // Optionele periode van transacties.
  status: z.enum(['idle', 'parsed', 'analyzed']),      // Status van de import.
  sourceBank: z.string().optional(),                   // Bronbank, bijvoorbeeld ING.
  fileName: z.string(),                                // Originele bestandsnaam.
  transactionCount: z.number(),                        // Totaal aantal transacties.
}).optional();

/**
 * Valideert het analyse-resultaat van CSV-data in `viewModels.csvAnalysis`.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */
export const CsvAnalysisResultSchema = z.object({
  isDiscrepancy: z.boolean(),
  hasMissingCosts: z.boolean(),
  discrepancyDetails: z.string().optional(),
  periodSummary: z.object({
    totalIncomeCents: z.number(),
    totalExpensesCents: z.number(),
    balanceCents: z.number(),
    transactionCount: z.number(),
  }),
  setupComparison: z.object({
    csvIncomeCents: z.number(),
    setupIncomeCents: z.number(),
    diffCents: z.number(),
  }).nullable(),
}).optional();

/**
 * Valideert de volledige persistente form state.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 */

export const FormStateSchema = z.object({
  schemaVersion: z.literal('1.0'),
  activeStep:    z.string(),
  currentScreenId: z.string(),
  isValid:       z.boolean(),
  data: z.object({
    setup:     SetupSchema,
    household: HouseholdSchema,
    finance:   FinanceSchema,
    latestTransaction: LatestTransactionSchema.optional(),
    csvImport:  CsvImportSchema,
    transactionHistory: TransactionHistorySchema.optional(), // Optionele undo/redo-stack.
  }),
  viewModels: z.object({
    financialSummary: z.object({
      totalIncomeDisplay:   z.string(),
      totalExpensesDisplay: z.string(),
      netDisplay:           z.string(),
    }).optional(),
    csvAnalysis: CsvAnalysisResultSchema.optional(),
  }).optional(),
  meta: z.object({
    lastModified: z.string(),
    version:      z.number(),
  }),
});

// Afgeleide types op basis van schema's.

/**
 * Volledige form state, afgeleid uit `FormStateSchema`.
 */
export type FormState = z.infer<typeof FormStateSchema>;

/**
 * Alias voor een gevalideerde form state.
 */
export type ValidatedFormState = FormState;

/**
 * Beschikbare data-secties binnen de form state.
 */
export type DataSection = 'setup' | 'household' | 'finance' | 'latestTransaction';

/**
 * Member type afgeleid uit `MemberSchema`.
 */
export type Member = z.infer<typeof MemberSchema>;

/**
 * Auto type afgeleid uit `AutoSchema`.
 */
export type Auto = z.infer<typeof AutoSchema>;

/**
 * LatestTransaction type afgeleid uit `LatestTransactionSchema`.
 */
export type LatestTransaction = z.infer<typeof LatestTransactionSchema>;

// Afgeleide types voor CSV-import.
/**
 * CSV-importstatus afgeleid uit `CsvImportSchema`.
 */
export type CsvImportState = z.infer<typeof CsvImportSchema>;

/**
 * CSV-analyseresultaat afgeleid uit `CsvAnalysisResultSchema`.
 */
export type CsvAnalysisResult = z.infer<typeof CsvAnalysisResultSchema>;

// Runtime-validatie voor dynamische veldcontrole.

/**
 * Bevat runtime schema-lookup per veld-ID.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
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
 * Parse en valideert onbekende input naar een geldige `FormState`.
 *
 * @module adapters/validation/formStateSchema
 * @see {@link ./README.md | Validation Layer - Details}
 *
 * @param input - Onbekende input van buiten de adaptergrens.
 * @returns Volledig gevalideerde `FormState`.
 * @throws ZodError wanneer de input niet aan het schema voldoet.
 */
export function parseFormState(input: unknown): FormState {
  return FormStateSchema.parse(input);
}
