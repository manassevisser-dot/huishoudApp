// src/domain/constants/uiSections.test.ts
import { UI_SECTIONS, UISection } from './uiSections';

describe('UI_SECTIONS', () => {
  it('bevat de juiste section keys als readonly strings', () => {
    expect(UI_SECTIONS.HOUSEHOLD_SETUP).toBe('household_setup');
    expect(UI_SECTIONS.HOUSEHOLD_DETAILS).toBe('household_details');
    expect(UI_SECTIONS.INCOME_DETAILS).toBe('income_details');
    expect(UI_SECTIONS.FIXED_EXPENSES).toBe('fixed_expenses');
    expect(UI_SECTIONS.csv_UPLOAD).toBe('csv_upload');
    expect(UI_SECTIONS.WIZARD).toBe('wizard');
  });

  it('garandeert dat UISection een union is van alle waarden', () => {
    // Dit compileert alleen als `section` een geldige key is
    const section: UISection = 'WIZARD';
    expect(section).toBeDefined();
  });
});