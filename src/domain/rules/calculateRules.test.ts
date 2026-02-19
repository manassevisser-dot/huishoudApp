// src/domain/rules/financeRules.test.ts
import { computePhoenixSummary } from './calculateRules';

describe('computePhoenixSummary (Phoenix Finance Calculator)', () => {
  describe('als lijst van items', () => {
    it('somt positieve bedragen als inkomsten en negatieve als uitgaven (abs), met correcte prioriteit en afronding', () => {
      const items = [
        { amountCents: 1000 },                       // +1000 (inkomen)
        { amount: 2000 },                            // +2000 (inkomen)
        { value: -150 },                             // -150  (uitgave 150)
        { value: 0 },                                // 0     (neutraal)
        { value: 123.49 },                           // +123.49 → telt mee, afronding pas op totaal
        { amountCents: 500, amount: 400, value: 300 } // prioriteit → 500 (inkomen)
      ];

      // Verwachting (voor afronding per totalen):
      // income raw = 1000 + 2000 + 123.49 + 500 = 3623.49
      // expenses raw = 150
      // totalIncomeCents = round(3623.49) = 3623
      // totalExpensesCents = round(150) = 150
      // netCents = round(3623.49 - 150) = round(3473.49) = 3473

      const res = computePhoenixSummary(items as any);
      expect(res).toEqual({
        totalIncomeCents: 3623,
        totalExpensesCents: 150,
        netCents: 3473,
      });
    });

    it('leeg array → alle totalen 0', () => {
      expect(computePhoenixSummary([])).toEqual({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });
    });

    it('negatieve bedragen worden NIET als negatieve inkomsten geteld, maar als uitgaven', () => {
      const items = [
        { amountCents: -100 }, // uitgave 100
        { amount: -250.2 },    // uitgave 250.2
        { value: 300 },        // inkomen 300
      ];
      // income = 300
      // expenses = 100 + 250.2 = 350.2 → round = 350
      // net = round(300 - 350.2) = round(-50.2) = -50
      const res = computePhoenixSummary(items as any);
      expect(res).toEqual({
        totalIncomeCents: 300,
        totalExpensesCents: 350,
        netCents: -50,
      });
    });
  });

  describe('als aggregate object { income: {items}, expenses: {items} }', () => {
    it('aggregate – income & expenses secties (verwachte gedrag, onthult bug in implementatie)', () => {
      const data = {
        income: {
          items: [
            { amountCents: 5000 },  // +5000
            { amount: -100 },       // negatief → mag NIET meetellen als inkomen
          ],
        },
        expenses: {
          items: [
            { amountCents: -1200 }, // uitgave 1200
            { value: -800.6 },      // uitgave 800.6
            { value: 50 },          // positief → géén uitgave
          ],
        },
      };

      // Verwachting:
      // income = 5000
      // expenses = 1200 + 800.6 = 2000.6 → round = 2001
      // net = round(5000 - 2000.6) = round(2999.4) = 2999
      const res = computePhoenixSummary(data as any);
      expect(res).toEqual({
        totalIncomeCents: 5000,
        totalExpensesCents: 2001, // <-- hier gaat jouw huidige code waarschijnlijk 0 geven
        netCents: 2999,
      });
    });

    it('aggregate met lege of ontbrekende secties → totalen op basis van aanwezige secties, anders 0', () => {
      expect(
        computePhoenixSummary({ income: { items: [] }, expenses: { items: [] } } as any)
      ).toEqual({ totalIncomeCents: 0, totalExpensesCents: 0, netCents: 0 });

      expect(
        computePhoenixSummary({ income: { items: [{ amountCents: 123 }] } } as any)
      ).toEqual({ totalIncomeCents: 123, totalExpensesCents: 0, netCents: 123 });

      expect(
        computePhoenixSummary({ expenses: { items: [{ amountCents: -456 }] } } as any)
      ).toEqual({ totalIncomeCents: 0, totalExpensesCents: 456, netCents: -456 });
    });
  });

  describe('onbekende/ongeldige input', () => {
    it('null/undefined/primities → fail closed naar 0‑totalen', () => {
      expect(computePhoenixSummary(null as any)).toEqual({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });
      expect(computePhoenixSummary(undefined as any)).toEqual({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });
      expect(computePhoenixSummary('foo' as any)).toEqual({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });
      expect(computePhoenixSummary(123 as any)).toEqual({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });
    });

    it('array met niet‑object entries → valt niet door de itemlijst‑guard en levert 0 via aggregate‑pad', () => {
      // isFinanceItemList([]) vereist every(isObject) — bij getallen faalt dat,
      // daarna isFinanceAggregate(array) → true (typeof array === 'object'), maar zonder secties → 0.
      const data = [1, 2, 3] as unknown;
      expect(computePhoenixSummary(data)).toEqual({
        totalIncomeCents: 0,
        totalExpensesCents: 0,
        netCents: 0,
      });
    });
  });
});