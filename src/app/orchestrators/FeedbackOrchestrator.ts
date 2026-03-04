// src/app/orchestrators/FeedbackOrchestrator.ts
/**
 * @file_intent Classificeert AuditEvents naar gebruikersfeedback (toast/modal) en
 *   coördineert recovery-acties via de MasterOrchestratorAPI.
 * @repo_architecture Application Layer - Orchestrator.
 *   Zit TUSSEN infrastructuur (AuditLoggerAdapter) en UI (FeedbackProvider).
 *   Bevat de enige plek waar de beslissing "welk event leidt tot welke UX" wordt gemaakt.
 * @term_definition
 *   FeedbackItem     = Volledig geconstrueerd UI-instructie-object. Bevat alles wat
 *                      FeedbackProvider en FeedbackHost nodig hebben zonder verdere
 *                      kennis van audit-internals.
 *   FeedbackSeverity = 'warning' | 'error' | 'critical' — afgeleid van RFC 5424 levels.
 *   FeedbackKind     = 'toast' | 'modal' — bepaalt render-patroon in FeedbackHost.
 *   RecoveryAction   = Gecodeerde herstelprocedure (ADR-17: accepted risk gedocumenteerd).
 * @contract
 *   - start() abonneert op AuditLogger; stop() meld af. Beide zijn idempotent.
 *   - Alleen events met level 0–4 worden verwerkt (AuditLoggerAdapter filtert al op ≤4).
 *   - Dezelfde eventName wordt maximaal eens per THROTTLE_MS doorgegeven (spam-bescherming).
 *   - executeRecovery() delegeert naar master en dismiss-t het item daarna altijd.
 * @ai_instruction
 *   Om een nieuw event aan recovery te koppelen: voeg toe aan RECOVERY_MAP.
 *   Om throttle aan te passen: wijzig THROTTLE_MS.
 *   Om severity-mapping te wijzigen: wijzig toSeverity().
 *   Dit bestand heeft GEEN React-imports — blijft testbaar als pure class.
 * @see ADR-01 (Lagenscheiding), ADR-12 (Auditability), ADR-17 (Accepted Risk)
 */

import {
  subscribeToAuditEvents,
  type AuditEvent,
} from '@adapters/audit/AuditLoggerAdapter';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';

// ─── Publieke types (geëxporteerd voor FeedbackProvider en tests) ─────────────

export type FeedbackSeverity = 'warning' | 'error' | 'critical';
export type FeedbackKind     = 'toast' | 'modal';

/**
 * Gecodeerde herstelprocedure.
 * 'dismiss' = geen recovery-logica, alleen sluiten.
 * ADR-17: elke keuze hier is een gedocumenteerde accepted risk.
 */
export type RecoveryAction = 'reset_full' | 'reset_setup' | 'dismiss';

/**
 * Volledig geconstrueerd UI-instructie-object.
 * Alle velden zijn al vertaald — FeedbackHost bevat geen if-else over AuditEvent.
 */
export interface FeedbackItem {
  /** Uniek per item — gebruikt als React key en voor dismiss. */
  id: string;
  severity: FeedbackSeverity;
  /** Bepaalt render-patroon: toast (niet-blokkerend) of modal (blokkerend). */
  kind: FeedbackKind;
  /** User-facing bericht — afkomstig van AuditEvent.message of eventName als fallback. */
  message: string;
  /** Originele eventName voor audit-tracing. */
  eventName: string;
  /** Aanwezig als de orchestrator een recovery-procedure kent voor dit event. */
  recoveryAction?: RecoveryAction;
  /** ISO 8601 timestamp van het originele audit-event. */
  timestamp: string;
  /**
   * Auto-dismiss na N milliseconden.
   * undefined = geen auto-dismiss (altijd bij critical/modal).
   */
  autoDismissMs?: number;
}

// ─── Interne constanten ───────────────────────────────────────────────────────

/**
 * RFC 5424 → severity mapping.
 * Exact gespiegeld aan de level-documentatie in AuditLoggerAdapter.
 * levels 5–7 (notice/info/debug) produceren geen UI-feedback.
 */
const three = 3
const four = 4
const toSeverity = (level: number): FeedbackSeverity | null => {
  if (level <= 2) return 'critical';  // 0: emergency, 1: alert, 2: critical
  if (level === three) return 'error';    // 3: error
  if (level === four) return 'warning';  // 4: warning
  return null;                         // 5–7: geen UI-feedback
};

/**
 * Event-naam → recovery-actie mapping.
 * Exact de set die ook in AuditLoggerAdapter als CRITICAL_EVENTS / EMERGENCY_EVENTS staat.
 * ADR-17: elke entry is een gedocumenteerde accepted risk.
 */
const RECOVERY_MAP: Readonly<Record<string, RecoveryAction>> = {
  'storage.unrecoverable': 'reset_full',
  'memory.corruption':     'reset_full',
  'system.crash':          'reset_full',
  'database.corruption':   'reset_full',
  'hydration.failed':      'reset_setup',
  'validation.crash':      'reset_setup',
};

/** Minimale tijd (ms) tussen twee feedback-items met dezelfde eventName. */
const THROTTLE_MS = 5_000;

/**
 * Auto-dismiss tijden per severity.
 * critical krijgt geen auto-dismiss — gebruiker moet bewust handelen.
 */
const AUTO_DISMISS_MS: Record<FeedbackSeverity, number | undefined> = {
  warning:  3_000,
  error:    6_000,
  critical: undefined,
};

// ─── FeedbackOrchestrator ─────────────────────────────────────────────────────

export class FeedbackOrchestrator {
  private unsubscribe: (() => void) | null = null;
  /** Throttle-register: eventName → timestamp van laatste doorgestuurd event. */
  private readonly recentEvents = new Map<string, number>();

  /**
   * @param master       - Delegatie-target voor recovery-acties (geen directe master-aanroep in UI).
   * @param onFeedback   - Callback waarmee FeedbackProvider een nieuw item ontvangt.
   * @param onDismiss    - Callback waarmee FeedbackProvider een item verwijdert.
   */
  constructor(
    private readonly master: MasterOrchestratorAPI,
    private readonly onFeedback: (item: FeedbackItem) => void,
    private readonly onDismiss:  (id: string) => void,
  ) {}

  /**
   * Abonneert op AuditLogger.
   * Idempotent: dubbele start() heeft geen effect.
   */
  public start(): void {
    if (this.unsubscribe !== null) return;
    this.unsubscribe = subscribeToAuditEvents(this.handleEvent);
  }

  /**
   * Meldt af van AuditLogger en ruimt throttle-register op.
   * Idempotent: dubbele stop() heeft geen effect.
   */
  public stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.recentEvents.clear();
  }

  /**
   * Voert de recovery-actie uit en dismiss-t het bijbehorende item.
   * Enige plek in de applicatie die recovery-acties naar master stuurt.
   * UI roept deze methode aan — nooit master direct.
   */
  public executeRecovery(action: RecoveryAction, itemId: string): void {
    switch (action) {
      case 'reset_full':  this.master.executeReset('full');  break;
      case 'reset_setup': this.master.executeReset('setup'); break;
      case 'dismiss':     break; // geen actie, alleen dismiss
    }
    this.onDismiss(itemId);
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  /**
   * Verwerkt een inkomend AuditEvent.
   * Arrow function zodat `this` correct gebonden blijft als callback.
   */
  private readonly handleEvent = (event: AuditEvent): void => {
    const severity = toSeverity(event.level);
    if (severity === null) return; // levels 5–7 produceren geen UI-feedback

    // Throttle: dezelfde eventName niet binnen THROTTLE_MS herhalen
    const now = Date.now();
    const lastSeen = this.recentEvents.get(event.eventName) ?? 0;
    if (now - lastSeen < THROTTLE_MS) return;
    this.recentEvents.set(event.eventName, now);

    const recoveryAction = this.resolveRecovery(event.eventName, severity);

    const item: FeedbackItem = {
      id:             `${event.eventName}-${now}`,
      severity,
      kind:           severity === 'critical' ? 'modal' : 'toast',
      message:        event.message ?? event.eventName,
      eventName:      event.eventName,
      recoveryAction,
      timestamp:      event.timestamp,
      autoDismissMs:  AUTO_DISMISS_MS[severity],
    };

    this.onFeedback(item);
  };

  /**
   * Bepaalt de recovery-actie voor een event.
   * Critical events zonder specifieke mapping krijgen 'dismiss' (altijd sluitbaar).
   * Warning/error zonder mapping: geen recovery-knop (undefined).
   */
  private resolveRecovery(
    eventName: string,
    severity: FeedbackSeverity,
  ): RecoveryAction | undefined {
    const mapped = RECOVERY_MAP[eventName];
    if (mapped !== undefined) return mapped;
    if (severity === 'critical') return 'dismiss';
    return undefined;
  }
}
