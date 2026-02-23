/**
 * @jest-environment node
 */
/* Reden: geen DOM of React Native APIs nodig.
 * jsdom + customExportConditions: ['react-native'] laadt Expo winter runtime
 * (TextDecoder via expo/src/winter/installGlobal.ts) → native module outside scope crash.
 */

// src/adapters/csv/csvService.integration.test.ts
/**
 * @file_intent Integratietests voor de ACL-grens: ruwe CSV → ParsedCsvTransaction[].
 * @test_scope ImportOrchestrator.processCsvImport(csvText: string) → CsvParseResult.
 * @contract
 *   - processCsvImport() accepteert alleen csvText (string) — geen setupData, geen state.
 *   - Retourneert CsvParseResult (discriminated union: success | empty | error).
 *   - Analyse (inkomen vs wizard) is NIET verantwoordelijkheid van deze service (→ CsvAnalysisService).
 *   - ACL-grens: ParsedCsvTransaction heeft geen open 'any'-velden.
 * @removed
 *   - setupData / state parameter (verwijderd in Fase 3+8)
 *   - result.summary.finalIncome (→ CsvAnalysisService.analyse(), niet hier)
 *   - result.transactions op error-resultaat (CsvParseError heeft geen transactions-veld)
 */

import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import { csvFactory } from '@test-utils/index';
import type { CsvParseSuccess } from '@app/orchestrators/types/csvUpload.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const orchestrator = new ImportOrchestrator();

/** Roept processCsvImport aan en asserteert 'success' — geeft getypede CsvParseSuccess terug. */
function parseSuccess(csvText: string): CsvParseSuccess {
  const result = orchestrator.processCsvImport(csvText);
  expect(result.status).toBe('success');
  return result as CsvParseSuccess;
}

// ─── Test suites ───────────────────────────────────────────────────────────────

describe('ImportOrchestrator — ACL boundary', () => {

  // ── Parse ────────────────────────────────────────────────────────────────────

  describe('parse: bankformaten', () => {
    it('verwerkt ING-formaat (Af/Bij kolom) correct', () => {
      const { content } = csvFactory.createIng();

      const result = parseSuccess(content);

      expect(result.transactions.length).toBeGreaterThan(0);
      // Bedragen zijn correct omgezet: Af = negatief, Bij = positief
      const amounts = result.transactions.map((tx) => tx.amount);
      expect(amounts.some((a) => a < 0)).toBe(true);  // Af-transactie aanwezig
      expect(amounts.some((a) => a > 0)).toBe(true);  // Bij-transactie aanwezig
    });

    it('verwerkt Rabobank-formaat (comma-separated) correct', () => {
      const { content } = csvFactory.createRabobank();

      const result = parseSuccess(content);

      expect(result.transactions.length).toBeGreaterThan(0);
    });

    it('verwerkt ABN AMRO-formaat (tab-separated) correct', () => {
      // Geen leading spaces — csvFactory.createAbnAmro() heeft template-literal inspringing
      // die parseRawCsv doet falen. Inline CSV zonder inspringing.
      const content = [
        'Boekdatum\tRekening\tTegenrekening\tOmschrijving\tTransactiesoort\tBedrag\tValuta\tSaldoNa',
        '2025-01-05\tNL12ABNA0123456789\tNL98SNSB0001234567\tHUUR JANUARI\tIncasso\t-1250.0\tEUR\t3901.18',
        '2025-01-06\tNL12ABNA0123456789\tNL23INGB0987654321\tTERUGBETALING\tBijschrijving\t200.0\tEUR\t4101.18',
      ].join('\n');

      const result = parseSuccess(content);

      expect(result.transactions.length).toBeGreaterThan(0);
    });
  });

  // ── ParsedCsvTransaction structuur ───────────────────────────────────────────

  describe('parse: ParsedCsvTransaction structuur (ACL-contract)', () => {
    it('elke transactie heeft alle verplichte ACL-velden', () => {
      const { content } = csvFactory.createIng();
      const result = parseSuccess(content);

      for (const tx of result.transactions) {
        expect(typeof tx.id).toBe('string');
        expect(tx.id.startsWith('csv_')).toBe(true);

        expect(typeof tx.fieldId).toBe('string');
        expect(tx.fieldId.startsWith('csv_tx_')).toBe(true);

        expect(typeof tx.amount).toBe('number');
        expect(typeof tx.amountCents).toBe('number');
        expect(Number.isInteger(tx.amountCents)).toBe(true);

        expect(typeof tx.date).toBe('string');
        expect(tx.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD

        expect(typeof tx.description).toBe('string');
        expect(typeof tx.category).toBe('string');
        expect(tx.category.length).toBeGreaterThan(0);

        expect(typeof tx.isIgnored).toBe('boolean');
      }
    });

    it('amount is euros, amountCents is centen (geen dubbele conversie)', () => {
      const { content } = csvFactory.createIng();
      const result = parseSuccess(content);

      for (const tx of result.transactions) {
        // amount: euros (float), amountCents: centen (integer)
        expect(Number.isFinite(tx.amount)).toBe(true);
        expect(Number.isInteger(tx.amountCents)).toBe(true);

        // Contract: amountCents === Math.round(amount * 100)
        expect(tx.amountCents).toBe(Math.round(tx.amount * 100));

        // Teken consistent
        if (tx.amount < 0) expect(tx.amountCents).toBeLessThan(0);
        if (tx.amount > 0) expect(tx.amountCents).toBeGreaterThan(0);
      }
    });

    it('original.schemaVersion is aanwezig (audit-metadata)', () => {
      const { content } = csvFactory.createIng();
      const result = parseSuccess(content);

      for (const tx of result.transactions) {
        expect(tx.original.schemaVersion).toBeDefined();
        expect(typeof tx.original.rawDigest).toBe('string');
      }
    });
  });

  // ── Filtering ────────────────────────────────────────────────────────────────

  describe('parse: filtering', () => {
    it('filtert transacties met bedrag = 0 uit', () => {
      const rawCsv = [
        'Datum,Naam/Omschrijving,Rekening,Tegenrekening,Code,Af Bij,Bedrag (EUR),MutatieSoort,Mededelingen,Saldo na mutatie,Tag',
        '20240101,Bakker,NL01INGB0001234567,NL02RABO0012345678,,Af,10.00,Pinbetaling,Brood,990.00,',
        '20240101,Ruis,NL01INGB0001234567,NL02RABO0012345678,,Af,0.00,Pinbetaling,Niets,990.00,',
        '20240101,Anoniem,NL01INGB0001234567,NL02RABO0012345678,,Af,5.00,Pinbetaling, ,985.00,',
      ].join('\n');

      const result = parseSuccess(rawCsv);

      expect(result.transactions).toHaveLength(2);
      expect(result.transactions.every((tx) => tx.amount !== 0)).toBe(true);
    });
  });

  // ── PII ──────────────────────────────────────────────────────────────────────

  describe('parse: PII-stripping', () => {
    it('verwijdert e-mailadressen uit omschrijvingen', () => {
      const rawCsv = [
        'Datum,Naam/Omschrijving,Rekening,Tegenrekening,Code,Af Bij,Bedrag (EUR),MutatieSoort,Mededelingen,Saldo na mutatie,Tag',
        '20240101,J. Jansen,NL01INGB0001234567,NL02RABO0012345678,,Af,50.00,Pinbetaling,Huur van jan.jansen@email.com,950.00,',
      ].join('\n');

      const result = parseSuccess(rawCsv);

      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].description).not.toContain('email.com');
      expect(result.transactions[0].description).not.toContain('@');
    });

    it('behoudt de omschrijving als er geen PII in zit', () => {
      const rawCsv = [
        'Datum,Naam/Omschrijving,Rekening,Tegenrekening,Code,Af Bij,Bedrag (EUR),MutatieSoort,Mededelingen,Saldo na mutatie,Tag',
        '20240101,Albert Heijn,NL01INGB0001234567,NL02RABO0012345678,,Af,35.50,Pinbetaling,Boodschappen week 3,964.50,',
      ].join('\n');

      const result = parseSuccess(rawCsv);

      // De adapter pikt de 'Naam/Omschrijving'-kolom als description-veld (regex: /Naam|Omschrijving/).
      // Waarde is 'Albert Heijn' — geen PII, dus ongewijzigd doorgegeven.
      expect(result.transactions[0].description).toContain('Albert Heijn');
    });
  });

  // ── Error handling ────────────────────────────────────────────────────────────

  describe('parse: error handling', () => {
    it('retourneert status empty bij een corrupt bestand zonder bedragen', () => {
      const { content } = csvFactory.createInvalid();

      const result = orchestrator.processCsvImport(content);

      expect(result.status).toBe('empty');
      // CsvParseEmpty heeft geen .transactions veld — type guard vereist
      expect('transactions' in result).toBe(false);
    });

    it('retourneert status error bij null-input', () => {
     
      const result = orchestrator.processCsvImport(null as any);

      expect(result.status).toBe('error');
      expect('errorMessage' in result).toBe(true);
    });

    it('retourneert status empty bij lege string', () => {
      const result = orchestrator.processCsvImport('');

      expect(result.status).toBe('empty');
    });

    it('retourneert status empty bij whitespace-only input', () => {
      const result = orchestrator.processCsvImport('   \n\t  ');

      expect(result.status).toBe('empty');
    });
  });

  // ── Metadata ────────────────────────────────────────────────────────────────

  describe('parse: metadata', () => {
    it('parsedCount klopt met het aantal transacties', () => {
      const { content } = csvFactory.createIng();
      const result = parseSuccess(content);

      expect(result.metadata.parsedCount).toBe(result.transactions.length);
    });

    it('skippedCount is aanwezig in metadata', () => {
      const { content } = csvFactory.createIng();
      const result = parseSuccess(content);

      expect(typeof result.metadata.skippedCount).toBe('number');
    });
  });
});
