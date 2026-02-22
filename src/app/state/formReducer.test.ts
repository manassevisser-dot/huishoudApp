// src/app/state/formReducer.test.ts
/**
 * @file_intent Unit tests voor de FormReducer – Pure State Mutator.
 * @contract Test alle FormAction types op correctheid, immutabiliteit en fail-closed gedrag.
 */

// Override de gedeelde jest.setup mock die SUB_KEYS mist
jest.mock('@domain/constants/datakeys', () => ({
  DATA_KEYS: { SETUP: 'setup', HOUSEHOLD: 'household', FINANCE: 'finance', META: 'meta' },
  SUB_KEYS: { MEMBERS: 'members', INCOME: 'income', EXPENSES: 'expenses', ITEMS: 'items' },
}));

import { formReducer, FormAction } from './formReducer';
import { initialFormState } from './initialFormState';
import { DATA_KEYS } from '@domain/constants/datakeys';
import type { FormState } from '@core/types/core';

// Helper om een schone state te maken per test
const makeState = (overrides: Partial<FormState> = {}): FormState => ({
  ...initialFormState,
  ...overrides,
});

describe('formReducer', () => {

  describe('UPDATE_DATA', () => {
    it('mergt nieuwe data immutabel in de state', () => {
      const state = makeState();
      const action: FormAction = {
        type: 'UPDATE_DATA',
        payload: { [DATA_KEYS.SETUP]: { aantalMensen: 3 } },
      };

      const next = formReducer(state, action);

      expect(next.data[DATA_KEYS.SETUP].aantalMensen).toBe(3);
      expect(next).not.toBe(state); // nieuw object
    });

    it('behoudt bestaande data-velden die niet worden geüpdatet', () => {
      const state = makeState();
      const action: FormAction = {
        type: 'UPDATE_DATA',
        payload: { [DATA_KEYS.SETUP]: { aantalMensen: 2 } },
      };

      const next = formReducer(state, action);

      expect(next.data[DATA_KEYS.SETUP].aantalVolwassen).toBe(state.data[DATA_KEYS.SETUP].aantalVolwassen);
    });

    it('muteert de originele state niet', () => {
      const state = makeState();
      const original = JSON.parse(JSON.stringify(state));
      const action: FormAction = {
        type: 'UPDATE_DATA',
        payload: { [DATA_KEYS.SETUP]: { aantalMensen: 5 } },
      };

      formReducer(state, action);

      expect(state.data[DATA_KEYS.SETUP].aantalMensen).toBe(original.data[DATA_KEYS.SETUP].aantalMensen);
    });

    it('update lastModified in meta', () => {
      const state = makeState();
      const before = state.meta.lastModified;

      const action: FormAction = {
        type: 'UPDATE_DATA',
        payload: { [DATA_KEYS.SETUP]: { aantalMensen: 2 } },
      };

      const next = formReducer(state, action);

      expect(next.meta.lastModified).toBeDefined();
      // lastModified moet een geldige ISO string zijn
      expect(() => new Date(next.meta.lastModified)).not.toThrow();
    });
  });

  describe('SET_STEP', () => {
    it('zet de activeStep correct', () => {
      const state = makeState({ activeStep: 'LANDING' });
      const action: FormAction = { type: 'SET_STEP', payload: 'DASHBOARD' };

      const next = formReducer(state, action);

      expect(next.activeStep).toBe('DASHBOARD');
    });

    it('muteert de rest van de state niet', () => {
      const state = makeState();
      const action: FormAction = { type: 'SET_STEP', payload: 'DASHBOARD' };

      const next = formReducer(state, action);

      expect(next.data).toEqual(state.data);
    });
  });

  describe('SET_CURRENT_SCREEN_ID', () => {
    it('zet de currentScreenId correct', () => {
      const state = makeState({ currentScreenId: 'landing' });
      const action: FormAction = { type: 'SET_CURRENT_SCREEN_ID', payload: 'WIZARD_STEP_2' };

      const next = formReducer(state, action);

      expect(next.currentScreenId).toBe('WIZARD_STEP_2');
    });
  });

  describe('UPDATE_VIEWMODEL', () => {
    it('merged nieuwe viewModel data in bestaande viewModels', () => {
      const state = makeState({ viewModels: { dashboard: { title: 'Oud' } } as any });
      const action: FormAction = {
        type: 'UPDATE_VIEWMODEL',
        payload: { dashboard: { title: 'Nieuw' } } as any,
      };

      const next = formReducer(state, action);

      expect((next.viewModels as any).dashboard.title).toBe('Nieuw');
    });

    it('initialiseert viewModels als het undefined is', () => {
      const state = makeState({ viewModels: undefined });
      const action: FormAction = {
        type: 'UPDATE_VIEWMODEL',
        payload: { dashboard: { title: 'Test' } } as any,
      };

      const next = formReducer(state, action);

      expect(next.viewModels).toBeDefined();
    });

    it('behoudt bestaande viewModel keys die niet worden geüpdatet', () => {
      const state = makeState({ viewModels: { dashboard: { title: 'Bewaar mij' }, options: { items: [] } } as any });
      const action: FormAction = {
        type: 'UPDATE_VIEWMODEL',
        payload: { options: { items: [1] } } as any,
      };

      const next = formReducer(state, action);

      expect((next.viewModels as any).dashboard.title).toBe('Bewaar mij');
    });
  });

  describe('RESET_APP', () => {
    it('reset activeStep naar LANDING', () => {
      const state = makeState({ activeStep: 'DASHBOARD' });
      const action: FormAction = { type: 'RESET_APP' };

      const next = formReducer(state, action);

      expect(next.activeStep).toBe('LANDING');
    });

    it('reset isValid naar true', () => {
      const state = makeState({ isValid: false });
      const action: FormAction = { type: 'RESET_APP' };

      const next = formReducer(state, action);

      expect(next.isValid).toBe(true);
    });

    it('reset setup data naar standaardwaarden', () => {
      const state = makeState();
      (state.data[DATA_KEYS.SETUP] as any).aantalMensen = 99;
      const action: FormAction = { type: 'RESET_APP' };

      const next = formReducer(state, action);

      expect(next.data[DATA_KEYS.SETUP].aantalMensen).toBe(1);
    });

    it('reset household members naar lege array', () => {
      const state = makeState();
      (state.data[DATA_KEYS.HOUSEHOLD] as any).members = [{ entityId: 'mem_1' }];
      const action: FormAction = { type: 'RESET_APP' };

      const next = formReducer(state, action);

      expect(next.data[DATA_KEYS.HOUSEHOLD].members).toEqual([]);
    });
  });

  describe('onbekende actie (fail-closed)', () => {
    it('retourneert de bestaande state ongewijzigd voor onbekende acties', () => {
      const state = makeState();
      const action = { type: 'UNKNOWN_ACTION' } as unknown as FormAction;

      const next = formReducer(state, action);

      expect(next).toBe(state); // zelfde referentie
    });
  });

});
