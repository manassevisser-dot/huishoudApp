import { CSVProcessor } from '../CSVProcessor';

describe('CSV Baseline Snapshots', () => {
  const processor = new CSVProcessor();
  const keys = { 
    date: 'Datum', 
    amount: 'Bedrag', 
    description: 'Omschrijving', 
    mutation: 'Af/Bij' 
  };

  it('moet een valide rij correct omzetten naar centen (Baseline)', () => {
    const row = { 
      Datum: '2023-10-27', 
      Bedrag: '1.250,50', 
      'Af/Bij': 'Af', 
      Omschrijving: 'Huur' 
    };
    // De snapshot slaat het resultaat op in een apart bestand
    expect(processor.processRow(row, keys)).toMatchSnapshot();
  });

  it('moet NaN-safe zijn bij corrupte invoer', () => {
    const row = { Bedrag: 'FOUT', Omschrijving: 'Corrupt' };
    expect(processor.processRow(row, keys).amount).toBe(0);
  });
});