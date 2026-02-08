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
    ? sumIncomeFromItems(data.expenses.items)
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
