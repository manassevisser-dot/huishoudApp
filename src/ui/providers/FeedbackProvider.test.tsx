// src/ui/providers/FeedbackProvider.test.tsx
/**
 * Tests voor FeedbackProvider en useAuditFeedback hook.
 * Gebruikt renderHook voor directe hook-tests en render voor integratie.
 */
import React from 'react';
import { act, render, renderHook } from '@testing-library/react-native';
import { FeedbackProvider, useAuditFeedback } from './FeedbackProvider';
import type { FeedbackItem } from '@app/orchestrators/FeedbackOrchestrator';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import {
  makeFeedbackItem,
  makeWarningToast,
  makeErrorToast,
  makeCriticalModal,
  makeRecoveryModal,
  resetFeedbackCounter,
} from '@test-utils/factories/feedbackFactory';

// ─── Mock FeedbackOrchestrator ────────────────────────────────────────────────
// We mocken de class zodat we onFeedback/onDismiss callbacks kunnen opvangen
// en handleEvent handmatig kunnen simuleren.

let capturedOnFeedback: ((item: FeedbackItem) => void) | null = null;
let capturedOnDismiss:  ((id: string) => void) | null = null;
const mockStart = jest.fn();
const mockStop  = jest.fn();
const mockExecuteRecovery = jest.fn();

jest.mock('@app/orchestrators/FeedbackOrchestrator', () => {
  const actual = jest.requireActual('@app/orchestrators/FeedbackOrchestrator');
  return {
    ...actual,
    FeedbackOrchestrator: jest.fn().mockImplementation(
      (_master: unknown, onFeedback: (i: FeedbackItem) => void, onDismiss: (id: string) => void) => {
        capturedOnFeedback = onFeedback;
        capturedOnDismiss  = onDismiss;
        return {
          start: mockStart,
          stop:  mockStop,
          executeRecovery: mockExecuteRecovery,
        };
      },
    ),
  };
});

// ─── Test helpers ─────────────────────────────────────────────────────────────

const mockMaster = { executeReset: jest.fn() } as unknown as MasterOrchestratorAPI;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FeedbackProvider master={mockMaster}>{children}</FeedbackProvider>
);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FeedbackProvider', () => {
  beforeEach(() => {
    resetFeedbackCounter();
    capturedOnFeedback = null;
    capturedOnDismiss  = null;
    jest.clearAllMocks();
  });

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  describe('lifecycle', () => {
    it('start() wordt aangeroepen bij mount', () => {
      render(<FeedbackProvider master={mockMaster}><></></FeedbackProvider>);
      expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('stop() wordt aangeroepen bij unmount', () => {
      const { unmount } = render(
        <FeedbackProvider master={mockMaster}><></></FeedbackProvider>
      );
      unmount();
      expect(mockStop).toHaveBeenCalledTimes(1);
    });
  });

  // ─── useAuditFeedback guard ───────────────────────────────────────────────

  it('gooit als buiten provider gebruikt', () => {
    // Suppress console.error voor verwachte throw
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuditFeedback())).toThrow(
      'useAuditFeedback must be used within <FeedbackProvider>'
    );
    spy.mockRestore();
  });

  // ─── Items toevoegen ──────────────────────────────────────────────────────

  describe('addItem via onFeedback callback', () => {
    it('voegt een toast toe aan items', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        capturedOnFeedback!(makeWarningToast({ id: 'toast-1' }));
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('toast-1');
    });

    it('voegt maximaal MAX_TOASTS (3) toasts toe, oudste verdrongen', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        capturedOnFeedback!(makeWarningToast({ id: 'toast-a' }));
        capturedOnFeedback!(makeErrorToast({   id: 'toast-b' }));
        capturedOnFeedback!(makeWarningToast({ id: 'toast-c' }));
        capturedOnFeedback!(makeErrorToast({   id: 'toast-d' })); // toast-a wordt verdrongen
      });

      const toasts = result.current.items.filter(i => i.kind === 'toast');
      expect(toasts).toHaveLength(3);
      expect(toasts.find(i => i.id === 'toast-a')).toBeUndefined();
      expect(toasts.find(i => i.id === 'toast-d')).toBeDefined();
    });

    it('critical modals worden nooit gestapeld', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        capturedOnFeedback!(makeCriticalModal({ id: 'modal-1' }));
        capturedOnFeedback!(makeCriticalModal({ id: 'modal-2' }));
      });

      const modals = result.current.items.filter(i => i.kind === 'modal');
      expect(modals).toHaveLength(1);
      expect(modals[0].id).toBe('modal-2'); // nieuwste wint
    });

    it('modals en toasts coëxisteren in items[]', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        capturedOnFeedback!(makeWarningToast({ id: 'toast-x' }));
        capturedOnFeedback!(makeCriticalModal({ id: 'modal-x' }));
      });

      expect(result.current.items.filter(i => i.kind === 'toast')).toHaveLength(1);
      expect(result.current.items.filter(i => i.kind === 'modal')).toHaveLength(1);
    });
  });

  // ─── Dismiss ─────────────────────────────────────────────────────────────

  describe('dismiss()', () => {
    it('verwijdert een item op id', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        capturedOnFeedback!(makeWarningToast({ id: 'to-dismiss' }));
      });
      expect(result.current.items).toHaveLength(1);

      act(() => {
        result.current.dismiss('to-dismiss');
      });
      expect(result.current.items).toHaveLength(0);
    });

    it('laat andere items intact', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        capturedOnFeedback!(makeWarningToast({ id: 'keep-me' }));
        capturedOnFeedback!(makeErrorToast({ id: 'remove-me' }));
      });

      act(() => {
        result.current.dismiss('remove-me');
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe('keep-me');
    });
  });

  // ─── executeRecovery ─────────────────────────────────────────────────────

  describe('executeRecovery()', () => {
    it('delegeert naar orchestrator.executeRecovery()', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        result.current.executeRecovery('reset_full', 'modal-1');
      });

      expect(mockExecuteRecovery).toHaveBeenCalledWith('reset_full', 'modal-1');
    });
  });

  // ─── onDismiss callback ───────────────────────────────────────────────────

  describe('onDismiss callback (gebruikt door orchestrator)', () => {
    it('verwijdert item via de onDismiss callback die aan orchestrator is gegeven', () => {
      const { result } = renderHook(() => useAuditFeedback(), { wrapper });

      act(() => {
        capturedOnFeedback!(makeWarningToast({ id: 'via-callback' }));
      });
      expect(result.current.items).toHaveLength(1);

      act(() => {
        capturedOnDismiss!('via-callback');
      });
      expect(result.current.items).toHaveLength(0);
    });
  });
});
