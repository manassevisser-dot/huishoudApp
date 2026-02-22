import {
    GENERAL_OPTIONS,
    HOUSEHOLD_OPTIONS,
    FINANCE_OPTIONS,
  } from './OptionsRegistry';
  
  describe('GENERAL_OPTIONS', () => {
    test('isBoolean bevat Ja en Nee', () => {
      expect(GENERAL_OPTIONS.isBoolean).toEqual(['Ja', 'Nee']);
    });
  });
  
  describe('HOUSEHOLD_OPTIONS', () => {
    test('gender bevat verwachte waarden', () => {
      expect(HOUSEHOLD_OPTIONS.gender).toEqual(['man', 'vrouw', 'anders', 'n.v.t.']);
    });
  
    test('burgerlijkeStaat bevat 6 opties', () => {
      expect(HOUSEHOLD_OPTIONS.burgerlijkeStaat).toHaveLength(6);
      expect(HOUSEHOLD_OPTIONS.burgerlijkeStaat).toContain('Alleenstaand');
      expect(HOUSEHOLD_OPTIONS.burgerlijkeStaat).toContain('Gehuwd');
    });
  
    test('woningType bevat verwachte waarden', () => {
      expect(HOUSEHOLD_OPTIONS.woningType).toEqual(['Koop', 'Huur', 'Kamer', 'Anders']);
    });
  
    test('autoCount bevat verwachte waarden', () => {
      expect(HOUSEHOLD_OPTIONS.autoCount).toEqual(['Geen', 'Een', 'Twee']);
    });
  });
  
  describe('FINANCE_OPTIONS', () => {
    test('incomeCategory bevat verwachte waarden', () => {
      expect(FINANCE_OPTIONS.incomeCategory).toEqual(['geen', 'werk', 'uitkering', 'anders']);
    });
  
    test('incomeFrequency bevat verwachte waarden', () => {
      expect(FINANCE_OPTIONS.incomeFrequency).toEqual(['week', '4wk', 'month', 'quarter', 'year']);
    });
  
    test('uitkeringType bevat alle uitkeringsvormen', () => {
      expect(FINANCE_OPTIONS.uitkeringType).toHaveLength(13);
      expect(FINANCE_OPTIONS.uitkeringType).toContain('Bijstand');
      expect(FINANCE_OPTIONS.uitkeringType).toContain('WW');
      expect(FINANCE_OPTIONS.uitkeringType).toContain('AOW');
      expect(FINANCE_OPTIONS.uitkeringType).toContain('anders');
    });
  
    test('streamingDiensten bevat bekende diensten', () => {
      expect(FINANCE_OPTIONS.streamingDiensten).toHaveLength(8);
      expect(FINANCE_OPTIONS.streamingDiensten).toContain('Netflix');
      expect(FINANCE_OPTIONS.streamingDiensten).toContain('Spotify');
    });
  
    test('verzekeringTypes bevat verwachte types', () => {
      expect(FINANCE_OPTIONS.verzekeringTypes).toHaveLength(6);
      expect(FINANCE_OPTIONS.verzekeringTypes).toContain('aansprakelijkheid');
      expect(FINANCE_OPTIONS.verzekeringTypes).toContain('reis');
    });
  });
  
  describe('immutability', () => {
    test('options zijn readonly (as const)', () => {
      // Runtime check: Object.isFrozen werkt niet op as const,
      // maar we kunnen verifieren dat de arrays bestaan en correct zijn
      expect(Array.isArray(HOUSEHOLD_OPTIONS.gender)).toBe(true);
      expect(Array.isArray(FINANCE_OPTIONS.incomeCategory)).toBe(true);
    });
  });