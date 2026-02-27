// src/domain/services/csvProcessor.test.ts
import { csvProcessor } from './csvProcessor';

test('BT-03-processor-invariants: Maakt bedragen schoon en veilig', () => {
  const processor = new csvProcessor();
  const keys = { amount: 'Bedrag', description: 'Omschrijving', date: 'Datum' };

  // Test 1: Duizendtallen en komma's
  // parseAmount retourneert euros (float) — geen toCents() meer in csvProcessor
  const row1 = { 'Bedrag': '1.250,50', 'Omschrijving': 'Test' };
  expect(processor.processRow(row1, keys).amountEuros).toBe(1250.50);

  // Test 2: Negatieve bedragen met euroteken en spaties
  const row2 = { 'Bedrag': '€ -50,00 ', 'Omschrijving': 'Test' };
  expect(processor.processRow(row2, keys).amountEuros).toBe(-50.00);

  // Test 3: NaN-beveiliging (corruptie check)
  const row3 = { 'Bedrag': 'ONGELDIG', 'Omschrijving': 'Test' };
  expect(processor.processRow(row3, keys).amountEuros).toBe(0);
});
