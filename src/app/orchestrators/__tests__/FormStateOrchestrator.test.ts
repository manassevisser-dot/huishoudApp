/**
 * TEST: FormStateOrchestrator FSM Enforcement (CU-P2-01)
 */
import { FormStateOrchestrator } from '../FormStateOrchestrator';
import type { FormState } from '@core/types/core';

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
    // 1. Maak eerst een nep-dispatch aan bovenin je test of voor de aanroep:
const mockDispatch = jest.fn();

// 2. Pas de aanroep aan (van waarde naar functie + dispatch):
const orchestrator = new FormStateOrchestrator(() => initialState, mockDispatch);
    const originalRef = (orchestrator as any).state;

    orchestrator.updateField('aantalMensen', 5);
    const newRef = (orchestrator as any).state;

    expect(newRef).not.toBe(originalRef);
    expect(orchestrator.getValue('aantalMensen')).toBe(5);
  });
  it('DIAGNOSE: Moet de finance-route bewandelen', () => {
    // 1. Maak eerst een nep-dispatch aan bovenin je test of voor de aanroep:
const mockDispatch = jest.fn();

// 2. Pas de aanroep aan (van waarde naar functie + dispatch):
const orchestrator = new FormStateOrchestrator(() => initialState, mockDispatch); // Gebruik je bestaande initialState
    
    
    // We gebruiken een ID die in de isFinanceItemKey lijst van de reducer staat
    orchestrator.updateField('nettoSalaris', '2500'); 
 
  });
  it('moet ValueProvider contract implementeren', () => {
    // 1. Maak eerst een nep-dispatch aan bovenin je test of voor de aanroep:
const mockDispatch = jest.fn();

// 2. Pas de aanroep aan (van waarde naar functie + dispatch):
const orchestrator = new FormStateOrchestrator(() => initialState, mockDispatch);
    expect(orchestrator.getValue('autoCount')).toBe('Nee');
  });
});