/**
 * Factory voor het genereren van verschillende bank CSV formaten.
 * Gebaseerd op de officiële export-structuren van ABN, Rabo en ING.
 */
export const csvFactory = {
  /**
   * Genereert ABN AMRO (Tab-separated) data
   */
  createAbnAmro: () => ({
    fileName: 'voorbeeld_abn_amro_bankafschrift.txt',
    content: `Boekdatum\tRekening\tTegenrekening\tOmschrijving\tTransactiesoort\tBedrag\tValuta\tSaldoNa
  2025-01-05\tNL12ABNA0123456789\tNL98SNSB0001234567\tHUUR JANUARI\tIncasso\t-1250.0\tEUR\t3901.18
  2025-01-06\tNL12ABNA0123456789\tNL23INGB0987654321\tTERUGBETALING\tBijschrijving\t200.0\tEUR\t4101.18`,
  }),

  /**
   * Genereert Rabobank (Comma-separated) data
   */
  createRabobank: () => ({
    fileName: 'voorbeeld_rabobank_bankafschrift.csv',
    content: `Datum,Omschrijving,Rekening,Tegenrekening,Bedrag,Valuta,Type,Mededeling,Saldo
  2025-01-03,Online Shop,NL76RABO0012345678,NL44INGB0012345678,-99.5,EUR,Betaalpas,Bestelling 12345,3651.18
  2025-01-04,Factuur klant,NL76RABO0012345678,NL91TRIO0123456789,1500.0,EUR,Overboeking,Factuur 2025-001,5151.18`,
  }),

  /**
   * Genereert ING (Comma-separated, Af/Bij kolom) data
   */
  createIng: () => ({
    fileName: 'voorbeeld_ing_bankafschrift.csv',
    content: `Datum,Naam/Omschrijving,Rekening,Tegenrekening,Code,Af Bij,Bedrag (EUR),MutatieSoort,Mededelingen,Saldo na mutatie,Tag
  2025-01-01,Supermarkt XYZ,NL12INGB0001234567,NL98RABO0007654321,,Af,-45.32,Pinbetaling,Boodschappen,1250.68,
  2025-01-02,Werkgever BV,NL12INGB0001234567,NL33ABNA0123456789,,Bij,2500.0,Salarisbetaling,Salaris Januari,3750.68,`,
  }),

  /**
   * Maakt een ongeldig bestand voor error-handling tests
   */
  createInvalid: () => ({
    fileName: 'corrupt.csv',
    content: `Header1;Header2;Header3
  Data;Zonder;Bedragen`,
  }),
};
