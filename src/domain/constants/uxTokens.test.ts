// src/domain/constants/uxTokens.test.ts
import { UX_TOKENS } from './uxTokens';

describe('UX_TOKENS', () => {
  it('definieert top-level tokens', () => {
    expect(UX_TOKENS.WIZARD).toBe('WIZARD');
    expect(UX_TOKENS.LANDING).toBe('LANDING');
    expect(UX_TOKENS.DASHBOARD).toBe('DASHBOARD');
  });

  it('definieert pagina-tokens', () => {
    expect(UX_TOKENS.SCREENS.HOUSEHOLD_SETUP).toBe('setup_screen_title');
    expect(UX_TOKENS.SCREENS.HOUSEHOLD_DETAILS).toBe('household_screen_title');
    expect(UX_TOKENS.SCREENS.INCOME_DETAILS).toBe('finance_screen_title');
    expect(UX_TOKENS.SCREENS.FIXED_EXPENSES).toBe('fixed_expenses_screen_title');
  });

  it('definieert veld-label tokens', () => {
    expect(UX_TOKENS.FIELDS.AANTAL_MENSEN).toBe('LABEL_AANTAL_MENSEN');
    expect(UX_TOKENS.FIELDS.AGE).toBe('age_label');
    expect(UX_TOKENS.FIELDS.CAR_REPEATER).toBe('LABEL_AUTO_FORMS');
  });
});