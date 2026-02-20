/**
 * @file_intent Definieert de 'Phoenix' finance calculator, een robuuste en veerkrachtige engine voor het berekenen van financiële totalen (inkomsten, uitgaven, netto) uit data van onbekende of variërende structuren. De naam 'Phoenix' is een metafoor voor het vermogen van de calculator om te werken met incomplete, legacy of inconsistente data-formats en er toch een valide, bruikbare output uit te distilleren.
 * @repo_architecture Domain Layer - Business Rules.
 * @term_definition
 *   - `Phoenix Calculator`: Een berekeningsengine die ontworpen is om niet te falen (`fail-safe`). Het inspecteert de "vorm" van de input-data en past de juiste berekeningsstrategie toe. Als de data-structuur onbekend is, retourneert het een nul-resultaat in plaats van een error te gooien.
 *   - `Type Guard`: Een serie functies (`isObject`, `isFinanceItem`, `isFinanceSection`, etc.) die op runtime de structuur van `unknown` data valideren om veilig naar een specifiek type te kunnen casten.
 *   - `Financial Totals`: De gestandaardiseerde output-interface (`{ totalIncomeCents, totalExpensesCents, netCents }`) die door de calculator wordt gegarandeerd, ongeacht de input.
 *   - `Cents-based Calculation`: Een best practice waarbij alle financiële berekeningen worden uitgevoerd met integers (centen) om afrondingsfouten met floating-point getallen te voorkomen.
 * @contract Dit bestand exporteert de `computePhoenixSummary` functie en de `FinancialTotals` interface. `computePhoenixSummary` accepteert data van het type `unknown` en garandeert altijd de teruggave van een `FinancialTotals` object. Het inspecteert de input, delegeert aan gespecialiseerde handlers (`handleItemList`, `handleAggregate`), en retourneert een `FinancialTotals` object met nullen als de input onherkenbaar is.
 * @ai_instruction De `computePhoenixSummary` functie wordt aangeroepen door **orchestrators**. Een orchestrator verzamelt de relevante (en mogelijk ongestructureerde) financiële data uit de applicatiestaat en geeft deze door aan de calculator. De orchestrator ontvangt een gestandaardiseerd `FinancialTotals` object terug, dat vervolgens wordt opgenomen in de state die naar de mobiele UI wordt gestuurd. Dit patroon isoleert de complexe, defensieve berekeningslogica in het domein, waardoor de orchestrator zich kan concentreren op state management en de UI "dom" kan blijven.
 */
// src/domain/rules/financeRules.ts
export interface FinancialTotals {
  totalIncomeCents: number;
  totalExpensesCents: number;
  netCents: number;
}

/* ============================================================
 * Domain-internal types (niet exporteren)
 * ============================================================ */

interface FinanceItem {
  amountCents?: number;
  amount?: number;
  value?: number;
}

interface FinanceSection {
  items: FinanceItem[];
}

interface FinanceAggregate {
  income?: FinanceSection;
  expenses?: FinanceSection;
}

/* ============================================================
 * Type guards — fail closed
 * ============================================================ */

function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null;
}

function isFinanceItem(input: unknown): input is FinanceItem {
  return isObject(input);
}

function isFinanceItemList(input: unknown): input is FinanceItem[] {
  return Array.isArray(input) && input.every(isFinanceItem);
}

function isFinanceSection(input: unknown): input is FinanceSection {
  return isObject(input) && 'items' in input && isFinanceItemList(input.items);
}

function isFinanceAggregate(input: unknown): input is FinanceAggregate {
  return isObject(input);
}

/* ============================================================
 * Kleine, pure helpers (complexity reducer)
 * ============================================================ */

function extractValue(item: FinanceItem): number {
  return Number(item.amountCents ?? item.amount ?? item.value ?? 0);
}

function sumIncomeFromItems(items: FinanceItem[]): number {
  return items.reduce((sum, item) => sum + Math.max(extractValue(item), 0), 0);
}

function sumExpensesFromItems(items: FinanceItem[]): number {
  return items.reduce((sum, item) => {
    const val = extractValue(item);
    return val < 0 ? sum + Math.abs(val) : sum;
  }, 0);
}

/* ============================================================
 * Scenario handlers
 * ============================================================ */

function handleItemList(data: FinanceItem[]): FinancialTotals {
  const income = sumIncomeFromItems(data);
  const expenses = sumExpensesFromItems(data);

  return {
    totalIncomeCents: Math.round(income),
    totalExpensesCents: Math.round(expenses),
    netCents: Math.round(income - expenses),
  };
}

function handleAggregate(data: FinanceAggregate): FinancialTotals {
  const income = isFinanceSection(data.income)
    ? sumIncomeFromItems(data.income.items)
    : 0;

  const expenses = isFinanceSection(data.expenses)
    ? sumExpensesFromItems(data.expenses.items)
    : 0;

  return {
    totalIncomeCents: Math.round(income),
    totalExpensesCents: Math.round(expenses),
    netCents: Math.round(income - expenses),
  };
}

/* ============================================================
 * PHOENIX FINANCE CALCULATOR (public API)
 * ============================================================ */

export const computePhoenixSummary = (data: unknown): FinancialTotals => {
  if (isFinanceItemList(data)) {
    return handleItemList(data);
  }

  if (isFinanceAggregate(data)) {
    return handleAggregate(data);
  }

  return {
    totalIncomeCents: 0,
    totalExpensesCents: 0,
    netCents: 0,
  };
};
