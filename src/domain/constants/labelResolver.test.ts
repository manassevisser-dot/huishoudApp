// src/domain/constants/labelResolver.test.ts
/**
 * @test_intent Valideer dat labelFromToken tokens correct opzoekt in WizStrings.
 * Tokens zijn afgestemd op de werkelijke WizStrings-structuur:
 *   wizard:    { back, next, finish }
 *   dashboard: { title, welcome }
 *   common:    { loading, error }
 */
import { labelFromToken } from './labelResolver';
import WizStrings from '@config/WizStrings';

describe('labelFromToken', () => {
  it('retourneert label uit wizard-sectie als token bestaat', () => {
    // 'back' bestaat in WizStrings.wizard
    const token = 'back';

    expect(WizStrings.wizard).toBeDefined();
    const wizard = WizStrings.wizard!;

    if (token in wizard) {
      expect(labelFromToken(token)).toBe(wizard[token as keyof typeof wizard]);
    } else {
      throw new Error(`Token "${token}" niet gevonden in WizStrings.wizard`);
    }
  });

  it('retourneert label uit dashboard-sectie als token niet in wizard staat', () => {
    // 'title' zit in dashboard, niet in wizard
    const token = 'title';

    expect(WizStrings.dashboard).toBeDefined();
    const wizard = WizStrings.wizard ?? {};
    const dashboard = WizStrings.dashboard!;

    const isNotInWizard = !(token in wizard);
    const isInDashboard = token in dashboard;

    expect(isNotInWizard).toBe(true);
    expect(isInDashboard).toBe(true);

    expect(labelFromToken(token)).toBe((dashboard as Record<string, string>)[token]);
  });

  it('retourneert label uit common-sectie als token elders niet voorkomt', () => {
    // 'loading' zit in common, niet in wizard of dashboard
    const token = 'loading';

    expect(WizStrings.common).toBeDefined();
    const common = WizStrings.common!;
    const wizard = WizStrings.wizard ?? {};
    const dashboard = WizStrings.dashboard ?? {};

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
