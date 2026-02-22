// src/app/orchestrators/VisibilityOrchestrator.test.ts
/**
 * @file_intent Unit tests voor de VisibilityOrchestrator – Fail-closed zichtbaarheids-evaluator.
 * @contract Test delegatie aan visibility rules, fail-closed gedrag, logging en memberId doorgave.
 */

jest.mock('@domain/constants/datakeys', () => ({
  DATA_KEYS: { SETUP: 'setup', HOUSEHOLD: 'household', FINANCE: 'finance', META: 'meta' },
  SUB_KEYS: { MEMBERS: 'members', INCOME: 'income', EXPENSES: 'expenses', ITEMS: 'items' },
}));

jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('@adapters/StateWriter/StateWriterAdapter', () => ({
  StateWriterAdapter: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@adapters/validation/validateAtBoundary', () => ({
  validateAtBoundary: jest.fn(() => ({ success: true, error: null })),
}));

// Controleerbare mock van de domein-regels
jest.mock('@domain/rules/fieldVisibility', () => ({
  fieldVisibilityRules: {
    showHuurtoeslag: jest.fn(() => true),
    showMaritalStatus: jest.fn(() => false),
    member_income_details: jest.fn((_ctx: unknown, memberId?: string) => typeof memberId === 'string' && memberId.length > 0),
    throwingRule: jest.fn(() => { throw new Error('Regel kapot!'); }),
  },
}));

import { VisibilityOrchestrator } from './VisibilityOrchestrator';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import { fieldVisibilityRules } from '@domain/rules/fieldVisibility';

const mockLogger = logger as jest.Mocked<typeof logger>;

// Minimale FSO stub: getValue geeft altijd een veilige default terug
const makeFso = (values: Record<string, unknown> = {}) =>
  ({
    getValue: jest.fn((fieldId: string) => values[fieldId] ?? null),
  }) as any;

describe('VisibilityOrchestrator', () => {

  describe('evaluate – happy path', () => {
    it('retourneert true als de regel true geeft', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      const result = orchestrator.evaluate('showHuurtoeslag');
      expect(result).toBe(true);
    });

    it('retourneert false als de regel false geeft', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      const result = orchestrator.evaluate('showMaritalStatus');
      expect(result).toBe(false);
    });

    it('geeft memberId door aan de regel', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      const result = orchestrator.evaluate('member_income_details', 'lid-1');
      expect(result).toBe(true);
    });

    it('retourneert false als memberId ontbreekt bij lid-specifieke regel', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      const result = orchestrator.evaluate('member_income_details');
      expect(result).toBe(false);
    });

    it('roept de regel aan met een context die getValue heeft', () => {
      const fso = makeFso({ woningType: 'Huur' });
      const orchestrator = new VisibilityOrchestrator(fso);
      orchestrator.evaluate('showHuurtoeslag');

      expect(fieldVisibilityRules.showHuurtoeslag).toHaveBeenCalledWith(
        expect.objectContaining({ getValue: expect.any(Function) }),
        undefined
      );
    });

    it('getValue in de context delegeert aan fso.getValue', () => {
      const fso = makeFso({ woningType: 'Koop' });
      // Gebruik een echte (niet-gemockte) regel die daadwerkelijk getValue aanroept
      (fieldVisibilityRules.showHuurtoeslag as jest.Mock).mockImplementationOnce(
        (ctx: { getValue: (k: string) => unknown }) => {
          ctx.getValue('woningType');
          return true;
        }
      );
      const orchestrator = new VisibilityOrchestrator(fso);
      orchestrator.evaluate('showHuurtoeslag');

      expect(fso.getValue).toHaveBeenCalledWith('woningType');
    });
  });

  describe('evaluate – fail-closed bij onbekende regel', () => {
    it('retourneert false bij onbekende ruleName', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      const result = orchestrator.evaluate('BESTAAT_NIET');
      expect(result).toBe(false);
    });

    it('logt een error bij onbekende ruleName', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      orchestrator.evaluate('BESTAAT_NIET');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'visibility_rule_missing_fail_closed',
        expect.objectContaining({ ruleName: 'BESTAAT_NIET', failClosed: true })
      );
    });

    it('logt GEEN error bij lege string ruleName', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      orchestrator.evaluate('');

      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('retourneert false bij lege string ruleName', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      expect(orchestrator.evaluate('')).toBe(false);
    });
  });

  describe('executeRule – exception handling', () => {
    it('retourneert false als de regel een exception gooit', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      const result = orchestrator.evaluate('throwingRule');
      expect(result).toBe(false);
    });

    it('logt een error als de regel een exception gooit', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      orchestrator.evaluate('throwingRule');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'visibility_rule_execution_failed',
        expect.objectContaining({ failClosed: true, error: 'Regel kapot!' })
      );
    });

    it('gooit de exception NIET opnieuw — fail-closed', () => {
      const orchestrator = new VisibilityOrchestrator(makeFso());
      expect(() => orchestrator.evaluate('throwingRule')).not.toThrow();
    });
  });

});
