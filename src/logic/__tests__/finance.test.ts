// src/logic/__tests__/finance.test.ts
import { computePhoenixSummary } from '../finance';

describe('Finance Logic — Maandelijkse Aggregatie', () => {
  it('moet kwartaalbedragen correct naar maanden omrekenen (afgerond op cent)', () => {
    const mockData = {
      income: { items: [{ amount: 10000, frequency: 'quarter' }] }, // €100 / 3 = €33.33
      expenses: { items: [] }
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(3333); // Exacte cent-validatie
  });

  it('moet netto resultaat correct berekenen bij diverse frequenties', () => {
    const mockData = {
      income: { items: [{ amount: 10000, frequency: 'month' }] },     // +10000
      expenses: { items: [{ amount: 2500, frequency: 'week' }] }      // -10833 (2500 * 4.333...)
    };
    const result = computePhoenixSummary(mockData);
    expect(result.netCents).toBe(-833); 
  });
});
describe('Finance Logic — Phoenix Integriteit', () => {

  it('moet omgaan met ontbrekende velden (Robustness)', () => {
    // Edge Case: Geen items of corrupt data [cite: 9, 10]
    const mockData = { income: {}, expenses: null };
    const result = computePhoenixSummary(mockData);
    
    expect(result.totalIncomeCents).toBe(0);
    expect(result.netCents).toBe(0);
  });

  it('moet vallen op de default multiplier bij onbekende frequentie', () => {
    // Gebruikersfout: onbekende frequentie [cite: 10, 11]
    const mockData = {
      income: { items: [{ amount: 5000, frequency: 'onbekend' }] }
    };
    const result = computePhoenixSummary(mockData);
    // Factor 1 (maand) is de fallback
    expect(result.totalIncomeCents).toBe(5000);
  });

  it('moet legacy "amountCents" ondersteunen naast "amount"', () => {
    // Backward Compatibility: oudere schema velden 
    const mockData = {
      income: { items: [{ amountCents: 1000, frequency: 'month' }] }
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(1000);
  });

  it('moet afrondingsverschillen deterministic afhandelen (Idempotency)', () => {
    // Test de jaarlijkse multiplier (1/12) [cite: 1, 15]
    // €100 per jaar = 8.3333... per maand -> moet 833 cent worden
    const mockData = {
      income: { items: [{ amount: 10000, frequency: 'year' }] }
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(833);
  });
});
describe('Finance Logic — Branch Coverage Optimalisatie', () => {

  it('moet de "month" fallback gebruiken bij een lege frequentie (Regel 16)', () => {
    // Test de (frequency || 'month') branch met een lege string
    const mockData = {
      income: { items: [{ amount: 1000, frequency: "" }] }
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(1000); // 1000 * 1
  });

  it('moet de fallback naar 0 gebruiken als beide amount-velden ontbreken (Regel 30-35)', () => {
    // Test de (item?.amount ?? item?.amountCents ?? 0) branch
    const mockData = {
      income: { items: [{ frequency: 'month' }] } // Geen enkel bedrag veld
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(0);
  });

  it('moet exact de amountCents pakken als amount undefined is', () => {
    // Specifieke check voor de ?? operator in de keten
    const mockData = {
      income: { items: [{ amount: undefined, amountCents: 500 }] }
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(500);
  });
  
  it('moet omgaan met een volledig leeg item object', () => {
    const mockData = {
      income: { items: [{}] }
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(0);
  });
});
it('moet de fallback naar 0 gebruiken voor UITGAVEN zonder bedrag (Regel 35)', () => {
  // Dit raakt specifiek de ?? 0 in de expenseItems.reduce keten
  const mockData = {
    income: { items: [] },
    expenses: { items: [{ frequency: 'month' }] } // Item zonder amount/amountCents
  };
  const result = computePhoenixSummary(mockData);
  expect(result.totalExpensesCents).toBe(0);
  expect(result.netCents).toBe(0);
});
describe('GM-007: Phoenix Finance Snapshot', () => {
  it('moet een consistent financieel overzicht genereren (Integriteit Contract)', () => {
    // Arrange: Een realistisch huishoud-scenario
    const mockFinanceData = {
      income: {
        items: [
          { amount: 500000, frequency: 'month', label: 'Salaris' },   // 5000.00
          { amount: 120000, frequency: 'quarter', label: 'Bonus' }, // 400.00
        ]
      },
      expenses: {
        items: [
          { amount: 150000, frequency: 'month', label: 'Huur' },     // 1500.00
          { amount: 10000, frequency: 'week', label: 'Boodschappen' }, // 433.33 (afgerond)
          { amount: 60000, frequency: 'year', label: 'Verzekering' }, // 50.00
        ]
      }
    };

    // Act
    const summary = computePhoenixSummary(mockFinanceData);

    // Assert
    // Dit maakt een .snap bestand aan met de exacte uitkomsten
    expect(summary).toMatchSnapshot();
  });
});