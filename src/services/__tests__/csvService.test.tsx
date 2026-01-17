import { toCents, formatCurrency, formatCentsToDutch, formatDutchValue } from '@utils/numbers';
import { parseRawCsv } from '@utils/csvHelper';
import { csvService } from '@services/csvService';

describe('Phoenix Financial Suite - Final Snapshot', () => {
  describe('Module: numbers.ts (Core Logic)', () => {
    it('moet floating-point errors voorkomen via integer-berekening', () => {
      const input = ['0,10', '0,20', '0,70', '0,70', '0,70'];
      const total = input.reduce((acc, val) => acc + toCents(val), 0);
      expect(total).toBe(240); // Exact 240 cent
    });

    it('moet de complexe punt-heuristiek correct toepassen (Regel 61-66)', () => {
      expect(toCents('1.250,50')).toBe(125050); // Standard NL
      expect(toCents('1.250.50')).toBe(125050); // Multiple dots
      expect(toCents('1.250')).toBe(125000); // 3 digits = thousand
      expect(toCents('1.25')).toBe(125); // <3 digits = decimal
    });

    it('moet robuust omgaan met nullables en corruptie (Regel 42/44)', () => {
      expect(toCents(null)).toBe(0);
      expect(toCents(undefined)).toBe(0);
      expect(toCents('€ 12,50 USD')).toBe(1250);
      expect(toCents('10,005')).toBe(1001); // Rounding check
    });

    it('moet formatting functies dekken (Regel 80-91)', () => {
      expect(formatCentsToDutch(125050)).toBe('1.250,50');
      expect(formatCurrency(125050)).toMatch(/€\s*1\.250,50/);
      expect(formatDutchValue(' -1.250,50 ')).toBe('1.250,50');
    });
  });

  describe('Module: csvService.ts (Mapping Logic)', () => {
    it('moet debet-tekens correct toewijzen op basis van mutatie-keys', () => {
      const csv = 'transactie,Af Bij\n100,af\n200,d\n300,-';
      const result = csvService.mapToInternalModel(csv);

      expect(result[0].amount).toBe(-10000);
      expect(result[1].amount).toBe(-20000);
      expect(result[2].amount).toBe(-30000);
    });

    it('moet fallbacks gebruiken voor inconsistente data (Regel 48/73)', () => {
      // Test scenario voor ontbrekende headers en data
      const csv = 'OnbekendeKolom\nSommigeWaarde';
      const result = csvService.mapToInternalModel(csv);

      expect(result[0]).toEqual({
        amount: 0,
        description: 'Geen omschrijving',
        date: '1970-01-01',
        original: expect.any(Object),
      });
    });

    it('moet gracefully failen bij lege of corrupte input', () => {
      expect(csvService.mapToInternalModel('')).toEqual([]);
      const corruptCsv = 'Datum;Bedrag\n20240101;FOUT';
      expect(csvService.mapToInternalModel(corruptCsv)[0].amount).toBe(0);
    });
  });

  describe('Module: csvHelper.ts (Parsing Logic)', () => {
    it('moet diverse delimiters en BOM-characters herkennen', () => {
      expect(parseRawCsv('h1\th2\nv1\tv2')).toHaveLength(1); // Tab
      expect(parseRawCsv('h1;h2\nv1;v2')).toHaveLength(1); // Semicolon
      expect(parseRawCsv('\uFEFF"H1"\n"V1"')).toEqual([{ H1: 'V1' }]); // BOM & Quotes
    });
  });
});
