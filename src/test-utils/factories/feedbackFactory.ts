// src/test-utils/factories/feedbackFactory.ts
/**
 * @file_intent Test-factories voor FeedbackItem en gerelateerde types.
 *   Centraliseert de constructie van test-fixtures zodat tests niet
 *   afhankelijk zijn van de interne structuur van FeedbackOrchestrator.
 * @repo_architecture Test Utilities — Factories.
 * @ai_instruction Gebruik makeFeedbackItem() als basis; overschrijf alleen wat relevant is.
 */
import type {
  FeedbackItem,
  FeedbackSeverity,
  FeedbackKind,
  RecoveryAction,
} from '@app/orchestrators/FeedbackOrchestrator';

let counter = 0;

/**
 * Bouwt een volledig FeedbackItem met veilige defaults.
 * Elke aanroep produceert een uniek id.
 */
export const makeFeedbackItem = (
  overrides: Partial<FeedbackItem> = {},
): FeedbackItem => {
  counter += 1;
  return {
    id:             `test-event-${counter}`,
    severity:       'warning',
    kind:           'toast',
    message:        'Test melding',
    eventName:      'test.event',
    recoveryAction: undefined,
    timestamp:      new Date().toISOString(),
    autoDismissMs:  3_000,
    ...overrides,
  };
};

/** Factory shortcut voor een warning toast. */
export const makeWarningToast = (overrides: Partial<FeedbackItem> = {}): FeedbackItem =>
  makeFeedbackItem({ severity: 'warning', kind: 'toast', autoDismissMs: 3_000, ...overrides });

/** Factory shortcut voor een error toast. */
export const makeErrorToast = (overrides: Partial<FeedbackItem> = {}): FeedbackItem =>
  makeFeedbackItem({ severity: 'error', kind: 'toast', autoDismissMs: 6_000, ...overrides });

/** Factory shortcut voor een critical modal. */
export const makeCriticalModal = (overrides: Partial<FeedbackItem> = {}): FeedbackItem =>
  makeFeedbackItem({
    severity:       'critical',
    kind:           'modal',
    autoDismissMs:  undefined,
    recoveryAction: 'dismiss',
    ...overrides,
  });

/** Factory shortcut voor een modal met recovery-actie. */
export const makeRecoveryModal = (
  action: RecoveryAction,
  overrides: Partial<FeedbackItem> = {},
): FeedbackItem =>
  makeCriticalModal({ recoveryAction: action, ...overrides });

/**
 * Reset de interne teller — aanroepen in beforeEach() voor deterministische ids.
 * @example
 * beforeEach(() => resetFeedbackCounter());
 */
export const resetFeedbackCounter = (): void => { counter = 0; };
