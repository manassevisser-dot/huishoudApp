import { UI_LABELS, SCREEN_LABELS } from './labels';
import { UX_TOKENS } from './uxTokens';

describe('UI_LABELS (NL) — token → leesbare tekst', () => {
  test('Top-level navigation labels kloppen', () => {
    expect(UI_LABELS[UX_TOKENS.WIZARD]).toBe('Wizard');
    expect(UI_LABELS[UX_TOKENS.LANDING]).toBe('Welkom');
    expect(UI_LABELS[UX_TOKENS.DASHBOARD]).toBe('Dashboard');
  });

  test('Screen titles (via UX_TOKENS.SCREENS) kloppen', () => {
    expect(UI_LABELS[UX_TOKENS.SCREENS.HOUSEHOLD_SETUP]).toBe('Huishouden Opzetten');
    expect(UI_LABELS[UX_TOKENS.SCREENS.HOUSEHOLD_DETAILS]).toBe('Samenstelling');

    // NB: bron gebruikt &amp; → test verwacht exact dezelfde tekst
    expect(UI_LABELS[UX_TOKENS.SCREENS.INCOME_DETAILS]).toBe('Inkomsten & Lasten');

    expect(UI_LABELS[UX_TOKENS.SCREENS.FIXED_EXPENSES]).toBe('Vaste lasten');
  });

  test('Field labels (via UX_TOKENS.FIELDS) kloppen', () => {
    expect(UI_LABELS[UX_TOKENS.FIELDS.CAR_COUNT]).toBe("Aantal Auto's");
    expect(UI_LABELS[UX_TOKENS.FIELDS.NAME]).toBe('Naam');
  });

  test('Regressie‑guard: alle geteste tokens hebben een label', () => {
    const requiredTokens = [
      // top-level
      UX_TOKENS.WIZARD,
      UX_TOKENS.LANDING,
      UX_TOKENS.DASHBOARD,
      // screens
      UX_TOKENS.SCREENS.HOUSEHOLD_SETUP,
      UX_TOKENS.SCREENS.HOUSEHOLD_DETAILS,
      UX_TOKENS.SCREENS.INCOME_DETAILS,
      UX_TOKENS.SCREENS.FIXED_EXPENSES,
      // fields
      UX_TOKENS.FIELDS.CAR_COUNT,
      UX_TOKENS.FIELDS.NAME,
    ];

    for (const token of requiredTokens) {
      expect(UI_LABELS[token]).toBeDefined();
      expect(typeof UI_LABELS[token]).toBe('string');
      expect((UI_LABELS[token] as string).trim().length).toBeGreaterThan(0);
    }
  });
});

describe('SCREEN_LABELS — legacy façade verwijst naar UI_LABELS', () => {
  test('verwijzingen zijn consistent', () => {
    expect(SCREEN_LABELS.WIZARD).toBe(UI_LABELS[UX_TOKENS.WIZARD]);
    expect(SCREEN_LABELS.LANDING).toBe(UI_LABELS[UX_TOKENS.LANDING]);
    expect(SCREEN_LABELS.DASHBOARD).toBe(UI_LABELS[UX_TOKENS.DASHBOARD]);
  });

  test('bevat geen onverwachte extra sleutels', () => {
    // Houd de façade bewust klein; breidt alleen uit als nodig
    expect(Object.keys(SCREEN_LABELS).sort()).toEqual(['DASHBOARD', 'LANDING', 'WIZARD']);
  });
});
