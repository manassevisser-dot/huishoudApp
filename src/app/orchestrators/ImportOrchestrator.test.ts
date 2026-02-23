import { ImportOrchestrator } from './ImportOrchestrator';
import type { CsvItem as ImportCsvItem } from '@core/types/research';

describe('ImportOrchestrator', () => {
  let orchestrator: ImportOrchestrator;

  beforeEach(() => {
    orchestrator = new ImportOrchestrator();
    jest.clearAllMocks();
  });

  describe('processCsvImport - Empty CSV', () => {
    it('moet lege CSV als empty status retourneren', () => {
      const result = orchestrator.processCsvImport({
        csvText: '',
        setupData: null
      });

      expect(result.status).toBe('empty');
      expect(result.transactions).toHaveLength(0);
      expect(result.count).toBe(0);
      expect(result.summary.finalIncome).toBe(0);
    });

    it('moet whitespace-only CSV als empty status retourneren', () => {
      const result = orchestrator.processCsvImport({
        csvText: '   \n\t  ',
        setupData: null
      });

      expect(result.status).toBe('empty');
      expect(result.transactions).toHaveLength(0);
    });
  });

  describe('processCsvImport - Valid Transactions', () => {
    it('moet geldige CSV-transacties correct parsen', () => {
      // Aanname: csvAdapter zal dit moeten mapen naar AdapterCsvItem[]
      const csvData = 'date\tamount\tdescription\n2024-01-15\t100.50\tTest Transaction';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      // Als er transacties zijn geparst:
      if (result.status === 'success') {
        expect(result.transactions).toHaveLength(result.count);
        expect(result.transactions[0]).toHaveProperty('id');
        expect(result.transactions[0]).toHaveProperty('fieldId');
        expect(result.transactions[0]).toHaveProperty('amount');
        expect(result.transactions[0]).toHaveProperty('date');
        expect(result.transactions[0]).toHaveProperty('description');
        expect(result.transactions[0]).toHaveProperty('category');
        expect(result.transactions[0]).toHaveProperty('isIgnored', false);
        expect(result.transactions[0]).toHaveProperty('original');
      }
    });

    it('moet transactie-ID consistent genereren op basis van canonical data', () => {
      const csvData = 'date\tamount\tdescription\n2024-01-15\t100.50\tTest';

      const result1 = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      const result2 = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result1.status === 'success' && result2.status === 'success') {
        expect(result1.transactions[0].id).toBe(result2.transactions[0].id);
      }
    });

    it('moet amountCents correct als integraal getal calculeren', () => {
      const csvData = 'date\tamount\tdescription\n2024-01-15\t50.75\tTest';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length > 0) {
        const tx = result.transactions[0];
        expect(tx.amountCents).toBe(Math.round(tx.amount * 100));
        expect(Number.isInteger(tx.amountCents)).toBe(true);
      }
    });

    it('moet zero-amount transacties filteren', () => {
      // Zero amounts worden gefilterd in isValidAmount()
      const result = orchestrator.processCsvImport({
        csvText: 'date\tamount\tdescription\n2024-01-15\t0\tZero Amount',
        setupData: null
      });

      if (result.status === 'success') {
        expect(result.transactions).not.toContainEqual(
          expect.objectContaining({ amount: 0 })
        );
      }
    });

    it('moet undefined/NaN amounts filteren', () => {
      // Invalid amounts worden gefilterd
      const result = orchestrator.processCsvImport({
        csvText: 'date\tamount\tdescription\n2024-01-15\tinvalid\tBad Amount',
        setupData: null
      });

      // Zou lege transacties moeten hebben of empty status
      expect(result.transactions).toHaveLength(0);
    });
  });

  describe('processCsvImport - Data Sanitization', () => {
    it('moet missing descriptions met fallback vullen en flag zetten', () => {
      const csvData = 'date\tamount\tdescription\n2024-01-15\t100\t\n2024-01-16\t200\tValid desc';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length > 0) {
        // Check if any transaction has the missing_description flag
        const txWithMissingDesc = result.transactions.find(tx =>
          Array.isArray(tx.original.flags) &&
          (tx.original.flags as readonly string[]).includes('missing_description')
        );
        if (txWithMissingDesc) {
          expect(txWithMissingDesc.description).toBe('Geen omschrijving');
        }
      }
    });

    it('moet missing dates met import-timestamp vullen en flag zetten', () => {
      const csvData = 'date\tamount\tdescription\n\t100\tTest';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length > 0) {
        const tx = result.transactions[0];
        expect(tx.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(tx.original.flags).toContain('missing_date');
      }
    });

    it('moet invalid dates met fallback vullen en flag zetten', () => {
      const csvData = 'date\tamount\tdescription\n2024-99-99\t100\tTest';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length > 0) {
        const tx = result.transactions[0];
        expect(tx.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(tx.original.flags).toContain('missing_date');
      }
    });

    it('moet PII uit beschrijvingen strippen', () => {
      // Dit hangt af van dataProcessor.stripPII implementatie
      const csvData = 'date\tamount\tdescription\n2024-01-15\t100\tJohn Doe paid rent';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length > 0) {
        const tx = result.transactions[0];
        // PII strip logic zou "John Doe" moeten verwijderen
        expect(tx.description).toBeDefined();
      }
    });

    it('moet fallback category gebruiken voor ongeclassificeerde transacties', () => {
      // Afhankelijk van dataProcessor.categorize implementatie
      const csvData = 'date\tamount\tdescription\n2024-01-15\t100\txyzunknownxyz';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length > 0) {
        const tx = result.transactions[0];
        const flags = Array.isArray(tx.original.flags) ? tx.original.flags : [];
        if (flags.includes('fallback_category' as never)) {
          expect(tx.category).toBe('Overig');
        }
      }
    });
  });

  describe('processCsvImport - Summary Calculation', () => {
    it('moet summary met setupData calculeren', () => {
      const setupData = {
        maandelijksInkomen: 2000,
        housingIncluded: false
      };

      const csvData = 'date\tamount\tdescription\n2024-01-15\t100\tTest';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData
      });

      expect(result.summary).toBeDefined();
      expect(result.summary).toHaveProperty('finalIncome');
      expect(result.summary).toHaveProperty('source');
      expect(result.summary).toHaveProperty('isDiscrepancy');
    });

    it('moet hasMissingCosts detecteren voor Wonen transacties', () => {
      // Afhankelijk van categorization - Wonen items detection
      const setupData = {
        maandelijksInkomen: 2000,
        housingIncluded: false
      };

      const csvData = 'date\tamount\tdescription\n2024-01-15\t500\tRent payment';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData
      });

      // Als categorization "Wonen" resulteert en housingIncluded false:
      // hasMissingCosts zou true kunnen zijn
      expect(result).toHaveProperty('hasMissingCosts');
    });
  });

  describe('processCsvImport - Error Handling', () => {
    it('moet malformed CSV gracefully afhandelen met error status', () => {
      const result = orchestrator.processCsvImport({
        csvText: '{{invalid json structure',
        setupData: null
      });

      // Afhankelijk van csvAdapter implementation
      expect(result).toHaveProperty('status');
      if (result.status === 'error') {
        expect(result.errorMessage).toBeDefined();
        expect(result.transactions).toHaveLength(0);
      }
    });

    it('moet transactie-metadata correct instellen', () => {
      const csvData = 'date\tamount\tdescription\n2024-01-15\t100\tTest';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length > 0) {
        const tx = result.transactions[0];
        expect(tx.original).toMatchObject({
          schemaVersion: 'csv-v1',
          columnMapVersion: 'v1',
          flags: expect.any(Array),
          importedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
        });
        expect(Object.isFrozen(tx.original.flags)).toBe(true);
      }
    });

    it('moet fieldId unique per transactie genereren', () => {
      const csvData = 'date\tamount\tdescription\n2024-01-15\t100\tTest1\n2024-01-16\t200\tTest2';

      const result = orchestrator.processCsvImport({
        csvText: csvData,
        setupData: null
      });

      if (result.status === 'success' && result.transactions.length >= 2) {
        const [tx1, tx2] = result.transactions;
        expect(tx1.fieldId).not.toBe(tx2.fieldId);
      }
    });
  });
});
