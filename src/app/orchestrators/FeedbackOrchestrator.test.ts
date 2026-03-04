// src/app/orchestrators/FeedbackOrchestrator.test.ts
/**
 * Tests voor FeedbackOrchestrator.
 * Geen React-imports — pure class tests.
 * AuditLoggerAdapter wordt gemocked zodat we events handmatig kunnen injecteren.
 */
import { FeedbackOrchestrator } from './FeedbackOrchestrator';
import type { FeedbackItem, RecoveryAction } from './FeedbackOrchestrator';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import type { AuditEvent } from '@adapters/audit/AuditLoggerAdapter';

// ─── Mock AuditLoggerAdapter ──────────────────────────────────────────────────

let capturedListener: ((event: AuditEvent) => void) | null = null;

jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  subscribeToAuditEvents: jest.fn((listener: (e: AuditEvent) => void) => {
    capturedListener = listener;
    return () => { capturedListener = null; };
  }),
}));

// ─── Test helpers ─────────────────────────────────────────────────────────────

const makeAuditEvent = (overrides: Partial<AuditEvent> = {}): AuditEvent => ({
  timestamp:  new Date().toISOString(),
  level:      4,          // warning
  eventName:  'test.event',
  message:    'Test bericht',
  version:    '2025-02-A',
  ...overrides,
});

const makeMockMaster = (): jest.Mocked<Pick<MasterOrchestratorAPI, 'executeReset'>> => ({
  executeReset: jest.fn(),
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FeedbackOrchestrator', () => {
  let received: FeedbackItem[];
  let dismissed: string[];
  let mockMaster: ReturnType<typeof makeMockMaster>;

  const makeOrch = () =>
    new FeedbackOrchestrator(
      mockMaster as unknown as MasterOrchestratorAPI,
      item => received.push(item),
      id   => dismissed.push(id),
    );

  beforeEach(() => {
    received    = [];
    dismissed   = [];
    mockMaster  = makeMockMaster();
    capturedListener = null;
    jest.clearAllMocks();
  });

  // ─── start/stop ─────────────────────────────────────────────────────────────

  describe('start() / stop()', () => {
    it('abonneert op AuditLogger bij start()', () => {
      const orch = makeOrch();
      orch.start();
      expect(capturedListener).not.toBeNull();
    });

    it('meldt af bij stop()', () => {
      const orch = makeOrch();
      orch.start();
      orch.stop();
      expect(capturedListener).toBeNull();
    });

    it('is idempotent: dubbele start() maakt geen tweede subscriber', () => {
      const { subscribeToAuditEvents } = require('@adapters/audit/AuditLoggerAdapter');
      const orch = makeOrch();
      orch.start();
      orch.start();
      expect(subscribeToAuditEvents).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Severity mapping ────────────────────────────────────────────────────────

  describe('severity mapping (RFC 5424)', () => {
    beforeEach(() => makeOrch().start());

    it.each([
      [0, 'critical', 'modal'],
      [1, 'critical', 'modal'],
      [2, 'critical', 'modal'],
      [3, 'error',    'toast'],
      [4, 'warning',  'toast'],
    ] as const)(
      'level %i → severity "%s", kind "%s"',
      (level, expectedSeverity, expectedKind) => {
        capturedListener!(makeAuditEvent({ level, eventName: `unique.${level}` }));
        expect(received[0]).toMatchObject({ severity: expectedSeverity, kind: expectedKind });
      },
    );

    it.each([5, 6, 7])(
      'level %i produceert geen feedback',
      (level) => {
        capturedListener!(makeAuditEvent({ level: level as any, eventName: `level.${level}` }));
        expect(received).toHaveLength(0);
      },
    );
  });

  // ─── Auto-dismiss ────────────────────────────────────────────────────────────

  describe('autoDismissMs', () => {
    beforeEach(() => makeOrch().start());

    it('warning toast: 3000ms', () => {
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'w.1' }));
      expect(received[0].autoDismissMs).toBe(3_000);
    });

    it('error toast: 6000ms', () => {
      capturedListener!(makeAuditEvent({ level: 3, eventName: 'e.1' }));
      expect(received[0].autoDismissMs).toBe(6_000);
    });

    it('critical modal: geen auto-dismiss', () => {
      capturedListener!(makeAuditEvent({ level: 2, eventName: 'c.1' }));
      expect(received[0].autoDismissMs).toBeUndefined();
    });
  });

  // ─── RECOVERY_MAP ────────────────────────────────────────────────────────────

  describe('recovery mapping', () => {
    beforeEach(() => makeOrch().start());

    it.each([
      ['storage.unrecoverable', 'reset_full'],
      ['memory.corruption',     'reset_full'],
      ['system.crash',          'reset_full'],
      ['database.corruption',   'reset_full'],
      ['hydration.failed',      'reset_setup'],
      ['validation.crash',      'reset_setup'],
    ] as const)(
      '"%s" → recoveryAction "%s"',
      (eventName, expectedAction) => {
        capturedListener!(makeAuditEvent({ level: 2, eventName }));
        expect(received[0].recoveryAction).toBe(expectedAction);
      },
    );

    it('critical zonder mapping krijgt "dismiss"', () => {
      capturedListener!(makeAuditEvent({ level: 2, eventName: 'unknown.critical' }));
      expect(received[0].recoveryAction).toBe('dismiss');
    });

    it('warning/error zonder mapping heeft geen recoveryAction', () => {
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'unknown.warning' }));
      expect(received[0].recoveryAction).toBeUndefined();
    });
  });

  // ─── Throttling ──────────────────────────────────────────────────────────────

  describe('throttling', () => {
    it('blokkeert hetzelfde event binnen 5 seconden', () => {
      makeOrch().start();
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'throttled.event' }));
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'throttled.event' }));
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'throttled.event' }));
      expect(received).toHaveLength(1);
    });

    it('laat verschillende events door', () => {
      makeOrch().start();
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'event.a' }));
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'event.b' }));
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'event.c' }));
      expect(received).toHaveLength(3);
    });

    it('ruimt throttle-register op bij stop()', () => {
      const orch = makeOrch();
      orch.start();
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'recycled.event' }));
      orch.stop();
      orch.start();
      // Na stop/start is het register leeg — event mag opnieuw door
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'recycled.event' }));
      expect(received).toHaveLength(2);
    });
  });

  // ─── executeRecovery ─────────────────────────────────────────────────────────

  describe('executeRecovery()', () => {
    let orch: FeedbackOrchestrator;

    beforeEach(() => {
      orch = makeOrch();
      orch.start();
    });

    it.each([
      ['reset_full',  'full'],
      ['reset_setup', 'setup'],
    ] as const)(
      'action "%s" delegeert naar master.executeReset("%s")',
      (action, resetType) => {
        orch.executeRecovery(action, 'item-1');
        expect(mockMaster.executeReset).toHaveBeenCalledWith(resetType);
      },
    );

    it('"dismiss" roept master.executeReset NIET aan', () => {
      orch.executeRecovery('dismiss', 'item-1');
      expect(mockMaster.executeReset).not.toHaveBeenCalled();
    });

    it('dismisst het item altijd na recovery', () => {
      orch.executeRecovery('reset_full', 'item-xyz');
      expect(dismissed).toContain('item-xyz');
    });
  });

  // ─── Message fallback ────────────────────────────────────────────────────────

  describe('message fallback', () => {
    it('gebruikt event.message als aanwezig', () => {
      makeOrch().start();
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'msg.test', message: 'Eigen bericht' }));
      expect(received[0].message).toBe('Eigen bericht');
    });

    it('valt terug op eventName als message undefined is', () => {
      makeOrch().start();
      capturedListener!(makeAuditEvent({ level: 4, eventName: 'fallback.test', message: undefined }));
      expect(received[0].message).toBe('fallback.test');
    });
  });
});
