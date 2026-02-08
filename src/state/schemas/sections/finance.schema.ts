// src/state/schemas/sections/finance.schema.ts
import { z } from 'zod';
import { FIELD_CONSTRAINTS_REGISTRY } from '@domain/rules/fieldConstraints';
import { generateSchemaFromConstraint } from '@state/schemas/helpers/schemaHelpers';

/**
 * FINANCE SCHEMA
 * 
 * ⚠️ CRITICAL: Dit schema is GEGENEREERD uit domain constraints (SSOT)
 * ⚠️ Domain constraints in fieldConstraints.ts blijven de single source of truth
 * ⚠️ Min/max/required worden NIET hier gedefinieerd maar komen uit constraints
 * 
 * ADR-01 Enforcement: Adapter layer is de ENIGE plaats waar Zod is gebruikt
 * ADR-03 Enforcement: Domain rules leven in @domain/rules/fieldConstraints.ts
 */

/**
 * BASIS MONEY ITEM SCHEMA
 * 
 * Voor simpele bedrag-velden zonder extra metadata
 */
const MoneyItemSchema = z.object({
  fieldId: z.string(),
  label: z.string().optional(),
  amount: z.number().default(0),
}).passthrough();

/**
 * WOONLASTEN SCHEMA
 * 
 * Conditioneel op woningType (Huur/Koop/Kamer/Anders)
 * Alle velden gegenereerd uit constraints
 */
const WoonlastenSchema = z.object({
  // Huur-specifiek
  kaleHuur: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.kaleHuur),
  servicekosten: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.servicekosten),
  
  // Koop-specifiek
  hypotheekBruto: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.hypotheekBruto),
  ozb: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.ozb),
  
  // Kamer-specifiek
  kostgeld: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.kostgeld),
  
  // Anders
  woonlasten: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.woonlasten),
  
  // Gemeenschappelijk
  gemeentebelastingen: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.gemeentebelastingen),
  waterschapsbelasting: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.waterschapsbelasting),
}).optional();

/**
 * NUTSVOORZIENINGEN SCHEMA
 */
const NutsvoorzieningenSchema = z.object({
  energieGas: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.energieGas),
  water: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.water),
  bijdrageEGW: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.bijdrageEGW),
}).optional();

/**
 * VERZEKERINGEN SCHEMA
 * 
 * Alle premies gegenereerd uit constraints met warn thresholds
 */
const VerzekeringenSchema = z.object({
  // Toggles (enabled/disabled)
  aansprakelijkheid_enabled: z.boolean().optional(),
  reis_enabled: z.boolean().optional(),
  opstal_enabled: z.boolean().optional(),
  uitvaart_enabled: z.boolean().optional(),
  rechtsbijstand_enabled: z.boolean().optional(),
  overlijdensrisico_enabled: z.boolean().optional(),
  
  // Bedragen (alleen als enabled) - gegenereerd uit constraints
  aansprakelijkheid: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.aansprakelijkheid),
  reis: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.reis),
  opstal: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.opstal),
  uitvaart: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.uitvaart),
  rechtsbijstand: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.rechtsbijstand),
  overlijdensrisico: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.overlijdensrisico),
}).optional();

/**
 * ABONNEMENTEN SCHEMA
 * 
 * Streaming wordt dynamisch toegevoegd via passthrough
 * Format: streaming_{service}_enabled en streaming_{service}_amount
 */
const AbonnementenSchema = z.object({
  internetTv: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.internetTv),
  sport: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.sport),
  lezen: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.lezen),
  contributie: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.contributie),
}).passthrough().optional();

/**
 * AUTO KOSTEN SCHEMA
 * 
 * Per auto (auto-1, auto-2)
 * Alle velden met warn thresholds voor ongewoon hoge kosten
 */
const AutoKostenSchema = z.object({
  wegenbelasting: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.wegenbelasting),
  brandstofOfLaden: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.brandstofOfLaden),
  apk: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.apk),
  onderhoudReservering: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.onderhoudReservering),
  lease: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.lease),
  afschrijving: generateSchemaFromConstraint(FIELD_CONSTRAINTS_REGISTRY.afschrijving),
}).optional();

/**
 * COMPLETE EXPENSES SCHEMA
 */
const ExpensesSchema = z.object({
  // Vaste kostenposten
  items: z.array(MoneyItemSchema).default([]),
  
  // Gestructureerde secties (allemaal constraint-driven)
  wonen: WoonlastenSchema,
  nuts: NutsvoorzieningenSchema,
  verzekeringen: VerzekeringenSchema,
  abonnementen: AbonnementenSchema,
  
  // Auto kosten (conditioneel op autoCount)
  'auto-1': AutoKostenSchema,
  'auto-2': AutoKostenSchema,
  
  // Aggregaten (berekend via FinancialOrchestrator)
  living_costs: z.number().default(0),
  energy_costs: z.number().default(0),
  insurance_total: z.number().default(0),
}).passthrough().default({
  items: [],
  living_costs: 0,
  energy_costs: 0,
  insurance_total: 0
});

/**
 * INCOME SCHEMA
 * 
 * Items zijn nu member-specifiek (via members array in household)
 * Huishouden-brede income items zitten in HouseholdSchema
 */
const IncomeSchema = z.object({
  items: z.array(MoneyItemSchema).default([]),
}).passthrough().default({ 
  items: [] 
});

/**
 * COMPLETE FINANCE SCHEMA
 */
export const FinanceSchema = z.object({
  income: IncomeSchema,
  expenses: ExpensesSchema,
}).passthrough().default({
  income: { items: [] },
  expenses: { 
    items: [], 
    living_costs: 0, 
    energy_costs: 0, 
    insurance_total: 0 
  }
});

// Type inference voor TypeScript
export type Finance = z.infer<typeof FinanceSchema>;
export type MoneyItem = z.infer<typeof MoneyItemSchema>;
export type Expenses = z.infer<typeof ExpensesSchema>;