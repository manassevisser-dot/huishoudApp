// src/domain/finance/BankFormatDetector.test.ts
import { detectBank, extractHeaderLine, detectBankFromCsv } from './BankFormatDetector';

describe('BankFormatDetector', () => {
  describe('detectBank', () => {
    it('detects ING bank from Dutch header', () => {
      const header = 'Datum;Naam / Omschrijving;Rekening;Tegenrekening;Af Bij;Bedrag';
      expect(detectBank(header)).toBe('ING');
    });

    it('detects ING bank from header with extra spaces', () => {
      const header = 'Datum ; Naam / Omschrijving ; Rekening ; Tegenrekening ; Af Bij ; Bedrag';
      expect(detectBank(header)).toBe('ING');
    });

    it('detects Rabobank from header', () => {
      const header = 'IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo';
      expect(detectBank(header)).toBe('Rabobank');
    });

    it('detects Rabobank from comma-separated header', () => {
      const header = 'IBAN/BBAN,Volgnr,Datum,Rentedatum,Bedrag,Saldo';
      expect(detectBank(header)).toBe('Rabobank');
    });

    it('detects ABN AMRO from header', () => {
      const header = 'Datum;Naam / Omschrijving;Rekening;Tegenrekening;Code;Bedrag';
      expect(detectBank(header)).toBe('ABN AMRO');
    });

    it('detects SNS Bank from tab-separated header', () => {
      const header = 'Boekingsdatum\tTegenrekeninghouder\tOmschrijving\tBedrag';
      expect(detectBank(header)).toBe('SNS Bank');
    });

    it('detects Triodos Bank from header', () => {
      const header = 'Boekingsdatum,Tegenrekening naam,Omschrijving,Bedrag';
      expect(detectBank(header)).toBe('Triodos Bank');
    });

    it('detects Bunq from English header', () => {
      const header = 'Date,Amount (EUR),Account,Counterparty,Description';
      expect(detectBank(header)).toBe('Bunq');
    });

    it('detects Revolut from English header', () => {
      const header = 'Started Date,Completed Date,Description,Paid Out,Paid In';
      expect(detectBank(header)).toBe('Revolut');
    });

    it('detects N26 from English header', () => {
      const header = 'Date,Payee,Account Number,Transaction Type,Amount';
      expect(detectBank(header)).toBe('N26');
    });

    it('detects Knab from Dutch header', () => {
      const header = 'Rekeningnummer;Transactiedatum;Tegenrekeningnummer;Bedrag';
      expect(detectBank(header)).toBe('Knab');
    });

    it('detects ASN Bank from header', () => {
      const header = 'Boekingsdatum,Opdrachtgeversrekening,Omschrijving,Bedrag';
      expect(detectBank(header)).toBe('ASN Bank');
    });

    it('handles case-insensitive matching correctly', () => {
      const header = 'datum;naam / omschrijving;rekening;tegenrekening;af bij;bedrag';
      expect(detectBank(header)).toBe('ING');
    });

    it('returns undefined for unknown bank format', () => {
      const header = 'Kolom1;Kolom2;Kolom3;Kolom4';
      expect(detectBank(header)).toBeUndefined();
    });

    it('returns undefined for empty header', () => {
      expect(detectBank('')).toBeUndefined();
    });

    it('respects pattern order - most specific first', () => {
      // Header die zowel ING als ABN AMRO patronen bevat
      const header = 'Datum;Naam / Omschrijving;Rekening;Tegenrekening;Af Bij;Code;Bedrag';
      // ING (met 'Af Bij') komt eerst in BANK_PATTERNS, dus die moet detecteren
      expect(detectBank(header)).toBe('ING');
    });

    it('handles headers with special characters', () => {
      const header = 'Datum;Naam / Omschrijving (oud);Rekening#;Tegenrekening@;Af Bij$;Bedrag';
      expect(detectBank(header)).toBe('ING');
    });
  });

  describe('extractHeaderLine', () => {
    it('extracts first non-empty line from CSV', () => {
      const csv = '\n\nDatum;Naam;Bedrag\n1 jan;Test;100\n';
      expect(extractHeaderLine(csv)).toBe('Datum;Naam;Bedrag');
    });

    it('handles Windows line endings (\\r\\n)', () => {
      const csv = '\r\n\r\nDatum;Naam;Bedrag\r\n1 jan;Test;100\r\n';
      expect(extractHeaderLine(csv)).toBe('Datum;Naam;Bedrag');
    });

    it('removes BOM character', () => {
      const csv = '\uFEFFDatum;Naam;Bedrag\n1 jan;Test;100';
      expect(extractHeaderLine(csv)).toBe('Datum;Naam;Bedrag');
    });

    it('returns empty string for empty CSV', () => {
      expect(extractHeaderLine('')).toBe('');
    });

    it('returns empty string for whitespace-only CSV', () => {
      expect(extractHeaderLine('   \n  \n  ')).toBe('');
    });

    it('handles CSV with only one line', () => {
      const csv = 'Datum;Naam;Bedrag';
      expect(extractHeaderLine(csv)).toBe('Datum;Naam;Bedrag');
    });
  });

  describe('detectBankFromCsv', () => {
    it('extracts header and detects bank in one call', () => {
      const csv = '\n\nDatum;Naam / Omschrijving;Rekening;Tegenrekening;Af Bij;Bedrag\n1 jan;Test;NL01;NL02;Af;100';
      expect(detectBankFromCsv(csv)).toBe('ING');
    });

    it('returns undefined for empty CSV', () => {
      expect(detectBankFromCsv('')).toBeUndefined();
    });

    it('returns undefined for CSV with unknown format', () => {
      const csv = 'Kolom1;Kolom2;Kolom3\nWaarde1;Waarde2;Waarde3';
      expect(detectBankFromCsv(csv)).toBeUndefined();
    });

    it('handles BOM character in CSV', () => {
      const csv = '\uFEFFDatum;Naam / Omschrijving;Rekening;Tegenrekening;Af Bij;Bedrag\n1 jan;Test;NL01;NL02;Af;100';
      expect(detectBankFromCsv(csv)).toBe('ING');
    });

    it('works with minimal CSV content', () => {
      const csv = 'Datum;Naam;Bedrag';
      expect(detectBankFromCsv(csv)).toBeUndefined(); // Geen bankpatroon, dus undefined
    });
  });

  describe('edge cases and error handling', () => {
    it('handles undefined input gracefully', () => {
      // @ts-expect-error - testen van runtime gedrag met verkeerde input
      expect(detectBank(undefined)).toBeUndefined();
    });

    it('handles null input gracefully', () => {
      // @ts-expect-error - testen van runtime gedrag met verkeerde input
      expect(detectBank(null)).toBeUndefined();
    });

    it('handles numeric input gracefully', () => {
      // @ts-expect-error - testen van runtime gedrag met verkeerde input
      expect(detectBank(123)).toBeUndefined();
    });

    it('handles header with only separators', () => {
      expect(detectBank(';;;,,,;;;')).toBeUndefined();
    });

    it('is pure - same input always returns same output', () => {
      const header = 'Datum;Naam / Omschrijving;Rekening;Tegenrekening;Af Bij;Bedrag';
      const result1 = detectBank(header);
      const result2 = detectBank(header);
      expect(result1).toBe(result2);
    });
  });
});