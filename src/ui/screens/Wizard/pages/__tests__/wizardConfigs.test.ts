import { setupHouseholdConfig } from '../1setupHousehold.config';
import { detailsHouseholdConfig } from '../2detailsHousehold.config';
import { incomeDetailsConfig } from '../3incomeDetails.config';
import { fixedExpensesConfig } from '../4fixedExpenses.config';

const allConfigs = [
  { id: 'setup', cfg: setupHouseholdConfig },
  { id: 'details', cfg: detailsHouseholdConfig },
  { id: 'income', cfg: incomeDetailsConfig },
  { id: 'expenses', cfg: fixedExpensesConfig },
];

describe('Wizard Config Contract Audit', () => {
  it('moet garanderen dat alle conditionele velden in setupHouseholdConfig de juiste signalen afgeven', () => {
    const fields = setupHouseholdConfig.fields;

    const volwassenField = fields.find((f) => f.fieldId === 'aantalVolwassen');
    const kindField = fields.find((f) => f.fieldId === 'kinderenLabel');

    // We testen nu op metadata/signalen in plaats van executie
    expect(volwassenField).toBeDefined();
    expect(volwassenField?.requiresVisibilityCheck).toBe(true);
    expect(volwassenField?.requiresConstraint).toBe('max');

    expect(kindField).toBeDefined();
    expect(kindField?.requiresVisibilityCheck).toBe(true);
    expect(kindField?.requiresDerivedValue).toBe(true);
  });

  it('moet garanderen dat incomeDetailsConfig geen inline logica bevat maar signalen', () => {
    const fields = incomeDetailsConfig.fields;
    
    // Check voor het specifieke inkomstenveld
    const incomeField = fields.find(f => f.fieldId === 'inkomstenPerLid');
    
    expect(incomeField?.requiresVisibilityCheck).toBe(true);
    expect(incomeField?.dependsOnContext).toBe('memberId');
    
   // ADR-04 check: Gebruik 'any' om de afwezigheid van verboden properties te checken
   fields.forEach((field: any) => {
   expect(field.visibleIf).toBeUndefined();
    expect(field.filter).toBeUndefined();
   });
  });

  it('moet de signalen voor de auto_repeater in fixedExpensesConfig valideren', () => {
    const autoRepeater = fixedExpensesConfig.fields.find((f) => f.fieldId === 'car_repeater');

    expect(autoRepeater).toBeDefined();
    expect(autoRepeater?.requiresVisibilityCheck).toBe(true);
    expect(autoRepeater?.requiresConstraint).toBe('count');
  });

  it('moet basis validiteit van alle configs garanderen (Structural Integrity)', () => {
    allConfigs.forEach(({ cfg }) => {
      expect(cfg.pageId).toBeDefined();
      expect(Array.isArray(cfg.fields)).toBe(true);
      
      // Elk veld moet een fieldId hebben voor de adapter façade
      cfg.fields.forEach(field => {
        expect(field.fieldId).toBeDefined();
      });
    });
  });
});