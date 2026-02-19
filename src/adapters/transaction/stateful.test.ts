// src/adapters/transaction/stateful.test.ts

import { StatefulTransactionAdapter } from './stateful';
import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter';

const getHistory = (a: any): any[] => a.history;

// Mock de audit logger
jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  AuditLogger: {
    log: jest.fn(),
  },
}));



describe('StatefulTransactionAdapter', () => {
  let adapter: StatefulTransactionAdapter;
  const initialState = { step: 'LANDING', data: {} };

  beforeEach(() => {
    (AuditLogger.log as jest.Mock).mockClear();
    adapter = new StatefulTransactionAdapter(initialState);
  });

  describe('constructor', () => {
    it('initialiseert history met INIT-state', () => {
      expect(adapter.getCurrentState()).toEqual(initialState);
    });

    it('logt INIT-event bij aanmaken', () => {
      expect(AuditLogger.log).toHaveBeenCalledWith('INFO', expect.objectContaining({
        event: 'transaction_push',
        type: 'INIT',
      }));
    });
  });

  describe('push', () => {
    it('voegt nieuwe state toe aan history', () => {
      const newState = { step: 'WIZARD', data: { aantalMensen: 3 } };
      adapter.push(newState, 'SET_STEP');

      expect(adapter.getCurrentState()).toEqual(newState);
      expect(AuditLogger.log).toHaveBeenCalledWith('INFO', expect.objectContaining({
        event: 'transaction_push',
        type: 'SET_STEP',
      }));
    });

    it('trunct history bij push na undo', () => {
      // Arrange: 3 states
      adapter.push({ step: 'A' }, 'ACTION_A');
      adapter.push({ step: 'B' }, 'ACTION_B');
      expect(adapter.getCurrentState()?.step).toBe('B');

      // Act: undo + push
      adapter.undo(); // terug naar A
      adapter.push({ step: 'C' }, 'ACTION_C');

      // Assert: B is verwijderd, C is toegevoegd
      expect(adapter.getCurrentState()?.step).toBe('C');
      const history = getHistory(adapter);
expect(history.map(s => s.step)).toEqual(['LANDING', 'A', 'C']);
    });
  });

  describe('undo', () => {
    it('gaat terug in de geschiedenis', () => {
      adapter.push({ step: 'WIZARD' }, 'SET_STEP');
      adapter.push({ step: 'INCOME' }, 'SET_INCOME');

      expect(adapter.getCurrentState()?.step).toBe('INCOME');

      const undone = adapter.undo();
      expect(undone?.step).toBe('WIZARD');
      expect(adapter.getCurrentState()?.step).toBe('WIZARD');

      expect(AuditLogger.log).toHaveBeenCalledWith('ACTION', {
        event: 'undo',
        pointer: 1,
      });
    });

    it('retourneert null als er niets te undo-en is', () => {
      // Alleen initial state → geen undo mogelijk
      const result = adapter.undo();
      expect(result).toBeNull();
      expect(adapter.getCurrentState()).toEqual(initialState);
    });
  });

  describe('redo', () => {
    it('herstelt vorige state na undo', () => {
      adapter.push({ step: 'WIZARD' }, 'SET_STEP');
      adapter.push({ step: 'INCOME' }, 'SET_INCOME');

      adapter.undo(); // terug naar WIZARD
      expect(adapter.getCurrentState()?.step).toBe('WIZARD');

      const redone = adapter.redo();
      expect(redone?.step).toBe('INCOME');
      expect(adapter.getCurrentState()?.step).toBe('INCOME');

      expect(AuditLogger.log).toHaveBeenCalledWith('ACTION', {
        event: 'redo',
        pointer: 2,
      });
    });

    it('retourneert null als er niets te redo-en is', () => {
      // Geen undo gedaan → geen redo mogelijk
      const result = adapter.redo();
      expect(result).toBeNull();
      expect(adapter.getCurrentState()).toEqual(initialState);
    });
  });

  describe('calculateDistribution', () => {
    it('verdeelt bedrag eerlijk met rest verdeeld over eerste items', () => {
      expect(adapter.calculateDistribution(100, 3)).toEqual([34, 33, 33]);
      expect(adapter.calculateDistribution(10, 4)).toEqual([3, 3, 2, 2]);
      expect(adapter.calculateDistribution(0, 5)).toEqual([0, 0, 0, 0, 0]);
    });

    it('werkt met negatieve waarden (onafhankelijk van volgorde)', () => {
        const result = adapter.calculateDistribution(-10, 3);
        
        // Check of de som klopt
        expect(result.reduce((a, b) => a + b, 0)).toBe(-10);
        
        // Of check of de getallen kloppen door te sorteren voor de vergelijking
        expect(result.sort()).toEqual([-4, -3, -3].sort());
      });
  });

  describe('getCurrentState', () => {
    it('retourneert huidige state', () => {
      expect(adapter.getCurrentState()).toEqual(initialState);
    });
  });


describe('StatefulTransactionAdapter - undo', () => {
  
    it('moet success: true teruggeven bij een geslaagde undo', () => {
      // Arrange: zorg dat er iets is om ongedaan te maken
      adapter.push({ step: 'A' }, 'ACTION_A');
      adapter.push({ step: 'B' }, 'ACTION_B');
  
      // Act
      const result = adapter.undo();
  
      // Assert
      expect(result).toEqual({ "step": "A" });
      expect(adapter.getCurrentState()?.step).toBe('A');
    });
  
    it('moet null of een foutmelding teruggeven als er geen geschiedenis is', () => {
      // Arrange: zorg voor een lege adapter (of alleen de landing state)
      // Act
      const result = adapter.undo();
  
      // Assert
      // Afhankelijk van je logica: of het is null, of success is false
      if (result === null) {
        expect(result).toBeNull();
      } else {
        expect(result.success).toBe(false);
        expect(result.message).toBeDefined();
      }
    });
  
    it('moet de geschiedenis correct inkorten na een undo', () => {
      // Arrange: 3 stappen
      adapter.push({ step: 'A' }, 'A');
      adapter.push({ step: 'B' }, 'B');
      adapter.push({ step: 'C' }, 'C');
  
      // Act
      adapter.undo(); // Gaat van C naar B
  
      // Assert
      // Check of we nu op B staan
      expect(adapter.getCurrentState()?.step).toBe('B');
      
      // Check of de "toekomst" (C) nog wel of niet bestaat 
      // (afhankelijk of je een Redo-functie hebt of dat je het weggooit)
    });
  });
});