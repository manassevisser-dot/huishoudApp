// src/domain/finance/BankFormatDetector.ts
/**
 * @file_intent Detecteert de bank op basis van de eerste headerregel van een CSV-bestand.
 * @repo_architecture Mobile Industry (MI) - Domain Layer (Finance).
 * @term_definition
 *   headerLine = De eerste regel van een CSV-bestand die kolomnamen bevat.
 *   DutchBank   = Union type van ondersteunde Nederlandse banken (zie csvUpload.types.ts).
 * @contract
 *   detectBank(headerLine) → DutchBank
 *   Pure functie — geen side effects, geen I/O.
 *   Retourneert undefined als geen bekend patroon herkend wordt.
 * @ai_instruction
 *   Voeg nieuwe bankpatronen toe aan BANK_PATTERNS.
 *   Zorg dat elke patroon-check op unieke kolomcombinaties leunt, niet op één kolom.
 *   Volgorde in BANK_PATTERNS is belangrijk: meest specifiek eerst.
 */

import type { DutchBank } from '@app/orchestrators/types/csvUpload.types';

// ─── Detectie-patronen ────────────────────────────────────────────────────────
// Elk patroon is een array van kolommen die ALLEMAAL aanwezig moeten zijn.
// Case-insensitive matching. Volgorde: meest specifiek eerst.
// Bron: eigen bankexport-samples + publieke documentatie bankformaten.

const BANK_PATTERNS: ReadonlyArray<{ bank: Exclude<DutchBank, undefined>; columns: string[] }> = [
  {
    // ING: puntkomma-separated, 'Af Bij' als aparte kolom is uniek voor ING
    bank: 'ING',
    columns: ['datum', 'naam / omschrijving', 'rekening', 'tegenrekening', 'af bij'],
  },
  {
    // Rabobank: komma-separated, bevat 'IBAN/BBAN' en 'Volgnr'
    bank: 'Rabobank',
    columns: ['iban/bban', 'volgnr', 'rentedatum'],
  },
  {
    // ABN AMRO: vergelijkbaar met ING maar zonder 'Af Bij', met 'Code' kolom
    bank: 'ABN AMRO',
    columns: ['datum', 'naam / omschrijving', 'rekening', 'tegenrekening', 'code'],
  },
  {
    // SNS Bank: tab-separated, bevat 'Boekingsdatum' en 'Tegenrekeninghouder'
    bank: 'SNS Bank',
    columns: ['boekingsdatum', 'tegenrekeninghouder', 'omschrijving'],
  },
  {
    // Triodos: bevat 'Boekingsdatum' en 'Tegenrekening naam'
    bank: 'Triodos Bank',
    columns: ['boekingsdatum', 'tegenrekening naam'],
  },
  {
    // Bunq: Engelstalig formaat, 'Amount (EUR)' is kenmerkend
    bank: 'Bunq',
    columns: ['amount (eur)', 'account', 'counterparty'],
  },
  {
    // Revolut: Engelstalig, heeft 'Started Date' en 'Completed Date'
    bank: 'Revolut',
    columns: ['started date', 'completed date', 'description', 'paid out'],
  },
  {
    // N26: Engelstalig, heeft 'Payee' en 'Account number'
    bank: 'N26',
    columns: ['payee', 'account number', 'transaction type'],
  },
  {
    // Knab: bevat 'Rekeningnummer' en 'Transactiedatum'
    bank: 'Knab',
    columns: ['rekeningnummer', 'transactiedatum', 'tegenrekeningnummer'],
  },
  {
    // ASN Bank: bevat 'Boekingsdatum' en 'Opdrachtgeversrekening'
    bank: 'ASN Bank',
    columns: ['boekingsdatum', 'opdrachtgeversrekening'],
  },
];

// ─── Publieke API ──────────────────────────────────────────────────────────────

/**
 * Detecteert de bank op basis van de kolomnamen in de eerste CSV-headerregel.
 *
 * @param headerLine - De eerste regel van het CSV-bestand (rauwe string).
 * @returns De gedetecteerde bank, of undefined als niet herkend.
 *
 * @example
 *   detectBank('Datum;Naam / Omschrijving;Rekening;Tegenrekening;Af Bij;Bedrag')
 *   // → 'ING'
 *
 *   detectBank('IBAN/BBAN,Munt,BIC,Volgnr,Datum,Rentedatum,Bedrag,Saldo')
 *   // → 'Rabobank'
 *
 *   detectBank('onbekende;kolommen;hier')
 *   // → undefined
 */
export function detectBank(headerLine: string): DutchBank {
  // Normaliseer: lowercase, trim spaties rondom separatoren
  const normalizedHeader = headerLine.toLowerCase();

  for (const pattern of BANK_PATTERNS) {
    const allColumnsPresent = pattern.columns.every((col) =>
      normalizedHeader.includes(col.toLowerCase()),
    );

    if (allColumnsPresent) {
      return pattern.bank;
    }
  }

  return undefined;
}

/**
 * Extraheert de eerste niet-lege regel uit een CSV-string voor bank-detectie.
 *
 * @param csvText - Volledige CSV-tekst.
 * @returns De eerste niet-lege regel, of lege string als het bestand leeg is.
 */
export function extractHeaderLine(csvText: string): string {
  const cleaned = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleaned.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0) return trimmed;
  }

  return '';
}

/**
 * Combinatie: extraheert header en detecteert bank in één aanroep.
 * Convenience wrapper voor gebruik in FilePickerAdapter.
 *
 * @param csvText - Volledige CSV-tekst.
 * @returns De gedetecteerde bank, of undefined.
 */
export function detectBankFromCsv(csvText: string): DutchBank {
  const header = extractHeaderLine(csvText);
  return detectBank(header);
}
