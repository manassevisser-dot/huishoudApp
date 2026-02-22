// src/domain/rules/aowRules.test.ts

import { isAowEligible, CURRENT_AOW_AGE } from './aowRules';

describe('isAowEligible', () => {
  it('retourneert true voor leeftijd >= 67', () => {
    expect(isAowEligible(67)).toBe(true);
    expect(isAowEligible(80)).toBe(true);
    expect(isAowEligible('67')).toBe(true);
    expect(isAowEligible('80')).toBe(true);
  });

  it('retourneert false voor leeftijd < 67', () => {
    expect(isAowEligible(66)).toBe(false);
    expect(isAowEligible(0)).toBe(false);
    expect(isAowEligible('66')).toBe(false);
    expect(isAowEligible('0')).toBe(false);
  });

  it('retourneert false voor niet-numerieke input', () => {
    expect(isAowEligible(null)).toBe(false);
    expect(isAowEligible(undefined)).toBe(false);
    expect(isAowEligible('')).toBe(false);
    expect(isAowEligible('niet-een-getal')).toBe(false);
    expect(isAowEligible(NaN)).toBe(false);
    expect(isAowEligible({})).toBe(false);
    expect(isAowEligible([])).toBe(false);
  });

  it('gebruikt de huidige AOW-leeftijd als grens', () => {
    expect(CURRENT_AOW_AGE).toBe(67);
  });
});