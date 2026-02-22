import { labelFromToken } from './labelResolver';
import WizStrings from '@config/WizStrings';

describe('labelFromToken', () => {
  it('retourneert label uit wizard-sectie als token bestaat', () => {
    const token = 'aantalMensen';
    
    // Controleer expliciet of de sectie bestaat (ESLint & Safety check)
    expect(WizStrings.wizard).toBeDefined();
    
    // Gebruik een type guard of non-null assertion (!) 
    // omdat we hierboven al hebben gecheckt of hij bestaat.
    const wizard = WizStrings.wizard!;
    
    if (token in wizard) {
      const expected = wizard[token];
      expect(labelFromToken(token)).toBe(expected);
    } else {
      // Als het token niet in de config staat, moet de test ook falen
      // omdat de test-case dan niet meer representatief is.
      throw new Error(`Token "${token}" niet gevonden in WizStrings.wizard`);
    }
  });

  it('retourneert label uit dashboard-sectie als token niet in wizard staat', () => {
    const token = 'nettoInkomen';
    
    expect(WizStrings.dashboard).toBeDefined();
    const wizard = WizStrings.wizard ?? {}; // Fallback naar leeg object voor veilige 'in' check
    const dashboard = WizStrings.dashboard!;

    // Controleer of de randvoorwaarden van deze test-case kloppen
    const isNotInWizard = !(token in wizard);
    const isInDashboard = token in dashboard;
    
    expect(isNotInWizard).toBe(true);
    expect(isInDashboard).toBe(true);

    expect(labelFromToken(token)).toBe((dashboard as Record<string, string>)[token]);
  });

  it('retourneert label uit common-sectie als token elders niet voorkomt', () => {
    const token = 'cancel';
    
    expect(WizStrings.common).toBeDefined();
    const common = WizStrings.common!;
    const wizard = WizStrings.wizard ?? {};
    const dashboard = WizStrings.dashboard ?? {};

    // Expliciete checks voorkomen 'truthy' verwarring voor ESLint
    expect(token in wizard).toBe(false);
    expect(token in dashboard).toBe(false);
    expect(token in common).toBe(true);

    expect(labelFromToken(token)).toBe((common as Record<string, string>)[token]);
  });

  it('gebruikt token zelf als fallback als deze nergens gevonden wordt', () => {
    const unknownToken = 'onbekend_token_12345';
    expect(labelFromToken(unknownToken)).toBe(unknownToken);
  });
});