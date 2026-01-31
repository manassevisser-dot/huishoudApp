/**
 * TEST: FormStateOrchestrator FSM Enforcement (CU-P2-01)
 */
import { FormStateOrchestrator } from '../FormStateOrchestrator';
import type { FormState } from '@shared-types/form';

describe('FormStateOrchestrator', () => {
  const initialState = {
    schemaVersion: "1.0",
    activeStep: 'setup',
    currentPageId: 'page1',
    isValid: true,
    data: {
      setup: {
        aantalMensen: 1,
        aantalVolwassen: 1,
        autoCount: 'Nee' as const,
        heeftHuisdieren: false,
        woningType: 'Huur' as const,
      },
      household: {
        members: [
          {
            entityId: 'mem_0',
            fieldId: 'member-1',
            memberType: 'adult' as const,
            firstName: 'Jan',
            lastName: 'Jansen',
            // 'dateOfBirth' ipv 'dob' om te matchen met je interface
            dateOfBirth: '1990-01-01',
            // Deze velden zitten in [key: string]: unknown maar we casten naar unknown 
            // om de 'excess property check' van de object literal te omzeilen.
            categories: {
              geen: false,
              werk: true,
              uitkering: false,
              anders: false,
            },
            nettoSalaris: 2500,
          },
        ],
        huurtoeslag: 0,
        zorgtoeslag: 0,
      },
      // ✅ K-B2: Finance plat onder data, niet genest in household
      finance: {
        income: { items: [] },
        expenses: {
          items: [],
          living_costs: 0,
          energy_costs: 0,
          insurance_total: 0,
        },
      },
    },
    meta: { 
      lastModified: new Date().toISOString(), 
      version: 1 
    },
  } as unknown as FormState;

  it('moet state immutabel updaten via updateField', () => {
    const orchestrator = new FormStateOrchestrator(initialState);
    const originalRef = (orchestrator as any).state;

    orchestrator.updateField('aantalMensen', 5);
    const newRef = (orchestrator as any).state;

    expect(newRef).not.toBe(originalRef);
    expect(orchestrator.getValue('aantalMensen')).toBe(5);
  });

  it('moet ValueProvider contract implementeren', () => {
    const orchestrator = new FormStateOrchestrator(initialState);
    expect(orchestrator.getValue('autoCount')).toBe('Nee');
  });
});