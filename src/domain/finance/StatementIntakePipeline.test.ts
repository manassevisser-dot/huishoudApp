// src/domain/finance/StatementIntakePipeline.test.ts
import {
  dataProcessor,
  type ResearchCsvItem,
  type ResearchSetupData,
} from './StatementIntakePipeline.WIP';

// Mock toCents zodat we in de tests expliciet in centen kunnen denken.
jest.mock('@domain/helpers/numbers', () => ({
  toCents: (x: number) => x,
}));

/** Helper om snel csv items te maken */
const mkCsv = (overrides: Partial<ResearchCsvItem>): ResearchCsvItem => ({
  amount: 0,
  description: '',
  date: '2025-01-01',
  original: {},
  ...overrides,
});

describe('StatementIntakePipeline.WIP – dataProcessor', () => {
  describe('stripPII', () => {
    it('redigeert IBAN-achtige patronen en behoudt overige tekst', () => {
      // Arrange
      const input = 'Betaling aan NL91ABNA0417164300 voor huur';

      // Act
      const output = dataProcessor.stripPII(input);

      // Assert
      expect(output).toBe('Betaling aan NL** [REDACTED] voor huur');
    });

    it('redigeert meerdere IBANs in één string (case-insensitive)', () => {
      // Arrange
      const input = 'van nl91abna0417164300 naar NL02RABO0123456789';

      // Act
      const output = dataProcessor.stripPII(input);

      // Assert
      expect(output).toBe('van NL** [REDACTED] naar NL** [REDACTED]');
    });

    it('laat strings zonder IBAN ongemoeid', () => {
      const input = 'Referentie: 123-456-XYZ';
      expect(dataProcessor.stripPII(input)).toBe(input);
    });
  });

  describe('categorize', () => {
    it('herkent categorieën op basis van trefwoorden (case-insensitive)', () => {
      expect(dataProcessor.categorize('Huur januari')).toBe('Wonen');
      expect(dataProcessor.categorize('Hypotheek ABN')).toBe('Wonen');

      expect(dataProcessor.categorize('CZ zorgpremie')).toBe('Zorgverzekering');
      expect(dataProcessor.categorize('VGZ incasso')).toBe('Zorgverzekering');

      expect(dataProcessor.categorize('AH XL boodschappen')).toBe('Boodschappen');
      expect(dataProcessor.categorize('LIDL Supermarkt')).toBe('Boodschappen');

      expect(dataProcessor.categorize('Salaris februari')).toBe('Inkomen');
      expect(dataProcessor.categorize('Loonbetaling')).toBe('Inkomen');
    });

    it('valt terug op "Overig" als geen regel matcht', () => {
      expect(dataProcessor.categorize('Spotify Premium')).toBe('Overig');
    });

    it('eerste match wint bij meerdere keyword-hits', () => {
      // Bevat zowel "huur" (Wonen) als "loon" (Inkomen) — de volgorde van CATEGORY_RULES bepaalt de uitkomst.
      expect(dataProcessor.categorize('Huur + loon verrekening')).toBe('Wonen');
    });
  });

  describe('reconcileWithSetup', () => {
    it('kiest csv-inkomen als som > 0, anders setupIncome (via toCents)', () => {
      // Arrange
      const csv: ResearchCsvItem[] = [
        mkCsv({ description: 'Salaris ACME', amount: 300_000 }), // €3.000,00 (centen)
        mkCsv({ description: 'AH boodschappen', amount: -8_500 }),
      ];
      const setup: ResearchSetupData = { maandelijksInkomen: 250_000 }; // €2.500,00

      // Act
      const res = dataProcessor.reconcileWithSetup(csv, setup);

      // Assert
      expect(res.finalIncome).toBe(300_000);
      expect(res.source).toBe('csv');
      expect(res.diff).toBe(300_000 - 250_000);
      expect(res.isDiscrepancy).toBe(true); // |50.000| > 5.000
    });

    it('kiest setupIncome wanneer csvIncome <= 0', () => {
      // Arrange
      const csv: ResearchCsvItem[] = [
        mkCsv({ description: 'AH boodschappen', amount: -8_500 }),
        mkCsv({ description: 'CZ zorg', amount: -10_000 }),
      ];
      const setup: ResearchSetupData = { maandelijksInkomen: 180_000 };

      // Act
      const res = dataProcessor.reconcileWithSetup(csv, setup);

      // Assert
      expect(res.finalIncome).toBe(180_000);
      expect(res.source).toBe('Setup');
      expect(res.diff).toBe(0 - 180_000);
      expect(res.isDiscrepancy).toBe(false); // csvIncome == 0 → discrepantie irrelevant
    });

    describe('threshold: |diff| ten opzichte van 5000 cent', () => {
      it('geen discrepantie bij |diff| < 5000', () => {
        // Arrange
        const csv = [mkCsv({ description: 'Salaris', amount: 204_999 })];
        const setup: ResearchSetupData = { maandelijksInkomen: 200_000 };

        // Act
        const res = dataProcessor.reconcileWithSetup(csv, setup);

        // Assert
        expect(Math.abs(res.diff)).toBe(4_999);
        expect(res.isDiscrepancy).toBe(false);
      });

      it('geen discrepantie bij |diff| = 5000 (strict >)', () => {
        // Arrange
        const csv = [mkCsv({ description: 'Salaris', amount: 205_000 })];
        const setup: ResearchSetupData = { maandelijksInkomen: 200_000 };

        // Act
        const res = dataProcessor.reconcileWithSetup(csv, setup);

        // Assert
        expect(Math.abs(res.diff)).toBe(5_000);
        expect(res.isDiscrepancy).toBe(false);
      });

      it('wél discrepantie bij |diff| > 5000', () => {
        // Arrange
        const csv = [mkCsv({ description: 'Salaris', amount: 210_001 })];
        const setup: ResearchSetupData = { maandelijksInkomen: 200_000 };

        // Act
        const res = dataProcessor.reconcileWithSetup(csv, setup);

        // Assert
        expect(Math.abs(res.diff)).toBe(10_001);
        expect(res.isDiscrepancy).toBe(true);
      });
    });

    it('negeert niet-eindige bedragen in csv (NaN/Infinity) en telt alleen geldige numbers', () => {
      // Arrange
      const csv: ResearchCsvItem[] = [
        mkCsv({ description: 'Salaris', amount: 100_000 }),
        mkCsv({ description: 'Salaris bonus', amount: Number.NaN }), // genegeerd
        mkCsv({ description: 'Salaris uitzonderlijk', amount: Number.POSITIVE_INFINITY }), // genegeerd
      ];
      const setup: ResearchSetupData = { maandelijksInkomen: 90_000 };

      // Act
      const res = dataProcessor.reconcileWithSetup(csv, setup);

      // Assert
      expect(res.finalIncome).toBe(100_000);
      expect(res.source).toBe('csv');
      expect(res.diff).toBe(100_000 - 90_000);
      expect(res.isDiscrepancy).toBe(true); // |10.000| > 5.000
    });

    it('werkt correct wanneer setup.maandelijksInkomen ontbreekt (valt terug op 0)', () => {
      // Arrange
      const csv: ResearchCsvItem[] = [mkCsv({ description: 'Salaris', amount: 75_000 })];
      const setup: ResearchSetupData = {}; // undefined → toCents(0) via mock → 0

      // Act
      const res = dataProcessor.reconcileWithSetup(csv, setup);

      // Assert
      expect(res.finalIncome).toBe(75_000);
      expect(res.source).toBe('csv');
      expect(res.diff).toBe(75_000 - 0);
      expect(res.isDiscrepancy).toBe(true); // |75.000| > 5.000
    });
  });
});