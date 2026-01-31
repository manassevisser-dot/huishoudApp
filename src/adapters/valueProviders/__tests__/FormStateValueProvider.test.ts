/**
 * TEST: FormStateValueProvider Canon Compliance (CU-P2-02)
 */
import { FormStateValueProvider } from '../FormStateValueProvider';
import type { DomainValueProvider } from '@domain/core';

describe('FormStateValueProvider', () => {
  const mockDomainProvider: DomainValueProvider = {
    getValue: jest.fn((fieldId: string) => {
      const map: Record<string, unknown> = {
        aantalMensen: 3,       // De sectie 'household.' is er dan al af
        autoCount: 'Twee',     // De sectie 'setup.' is er dan al af
        huurtoeslag: 150       // Uitzondering blijft gelijk
      };
      return map[fieldId];
    }),
  };

  it('moet domein-waarden correct ophalen via DomainValueProvider met sectie', () => {
    const provider = new FormStateValueProvider(mockDomainProvider);
  
    // Gebruik het volledige pad zoals het uit de form-state komt
    expect(provider.getValue('household.aantalMensen')).toBe(3);
    expect(provider.getValue('setup.autoCount')).toBe('Twee');
  });
  
  it('moet data.-prefix EN sectie-prefix correct normaliseren', () => {
    const provider = new FormStateValueProvider(mockDomainProvider);
  
    // De adapter stript 'data.' én 'household.' -> houdt 'aantalMensen' over voor domein
    expect(provider.getValue('data.household.aantalMensen')).toBe(3);
  });
  
  it('moet uitzonderingen (toeslagen) zonder sectie toestaan', () => {
    const provider = new FormStateValueProvider(mockDomainProvider);
  
    expect(provider.getValue('huurtoeslag')).toBe(150);
  });

  it('moet onbekende velden fail-closed behandelen', () => {
    const provider = new FormStateValueProvider(mockDomainProvider);

    expect(provider.getValue('onbekendVeld')).toBeUndefined();
  });

  it('moet niet-ondersteunde genormaliseerde velden blokkeren', () => {
    const provider = new FormStateValueProvider(mockDomainProvider);

    expect(provider.getValue('data.nietBestaat')).toBeUndefined();
  });
});
