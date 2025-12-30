
// src/test-utils/fixtures.ts
// Statische JSON-achtige fixtures + scenario’s (Phoenix-proof)

import type { FormState } from '@shared-types/form';

// ------------------------------
// Baseline fixtures
// ------------------------------

export const HouseholdFixture = {
  householdId: 'h-1',
  members: [
    {
      entityId: 'adult-1',
      fieldId: 'member-adult-1',
      memberType: 'adult'as const,
      naam: 'Jan',
      gender: 'man',
      dateOfBirth: '1985-06-15',
    },
    {
      entityId: 'child-1',
      fieldId: 'member-child-1',
      memberType: 'child' as const,
      naam: 'Mia',
      gender: 'vrouw',
      dateOfBirth: '2015-03-20',
    },
  ],
  lastUpdated: '2025-01-01T12:00:00Z',
};

export const FinanceFixture = {
  income: {
    items: [
      { id: 'inc-1', amountCents: 200000, frequency: 'month' }, // €2000
    ],
  },
  expenses: {
    items: [
      { id: 'exp-1', amountCents: 50000, frequency: 'month' },  // €500
    ],
  },
};

export const FormStateFixture: FormState = {
  activeStep: 'WIZARD',
  currentPageId: 'setupHousehold',
  isValid: false,
  schemaVersion: '1.0',
  data: {
    setup: { aantalMensen: 3, aantalVolwassen: 2 },
    household: HouseholdFixture,
    finance: FinanceFixture,
  },
};

// ------------------------------
// Scenario: WeeklyIncomeScenario
// ------------------------------

export const WeeklyIncomeScenario: FormState = {
  activeStep: 'WIZARD',
  currentPageId: 'setupHousehold',
  isValid: false,
  schemaVersion: '1.0',
  data: {
    setup: { aantalMensen: 3, aantalVolwassen: 2 },
    household: HouseholdFixture,
    finance: {
      income: {
        items: [
          { id: 'inc-week-100', amountCents: 10000, frequency: 'week' },    // ~€433,33 / maand
          { id: 'inc-quarter-300', amountCents: 30000, frequency: 'quarter' }, // €100 / maand
          { id: 'inc-year-12000', amountCents: 1200000, frequency: 'year' },   // €1000 / maand
        ],
      },
      expenses: { items: [] },
    },
  },
};

// ------------------------------
// Scenario: Legacy → Phoenix migratie (leden → members)
// ------------------------------

// Legacy shape (zoals in oude state):
export const LegacyHouseholdFixture = {
  householdId: 'legacy-h-1',
  leden: [
    { id: 'm1', memberType: 'adult', naam: 'Legacy Volw 1' },
    { id: 'm2', memberType: 'child', naam: 'Legacy Kind 1' },
  ],
};

export const LegacyStateFixture = {
  schemaVersion: '1.0',
  setup: { aantalMensen: 2, aantalVolwassen: 1 },
  household: LegacyHouseholdFixture,
  finance: { income: { items: [] }, expenses: { items: [] } },
};

// Voor tests die de gemigreerde (Phoenix) vorm willen valideren:
export const LegacyLedenPhoenixMigrationFixture: FormState = {
  activeStep: 'LANDING',
  currentPageId: 'setupHousehold',
  isValid: false,
  schemaVersion: '1.0',
  data: {
    setup: { aantalMensen: 2, aantalVolwassen: 1 },
    household: {
      householdId: 'legacy-h-1',
      members: [
        {
          entityId: 'm1',
          fieldId: 'member-1',            // gegenereerde UI key
          memberType: 'adult',
          naam: 'Legacy Volw 1',
        },
        {
          entityId: 'm2',
          fieldId: 'member-2',
          memberType: 'child',
          naam: 'Legacy Kind 1',
        },
      ],
      lastUpdated: '2025-01-01T12:00:00Z',
    },
    finance: { income: { items: [] }, expenses: { items: [] } },
  },
};
