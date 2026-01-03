import { toCents } from '@utils/numbers';

// Voorbeeld van een test die nu wél 100% betrouwbaar is:
it('moet meerdere CSV rijen exact optellen zonder afrondingsfouten', () => {
    const input = ["0,10", "0,20"]; // De klassieke float-fout bron
    const total = input.reduce((acc, val) => acc + toCents(val), 0);
    
    expect(total).toBe(30); // Precies 30 cent. Geen 30.00000000004
  });