// src/ui/screens/feedback/FeedbackHost.test.tsx
/**
 * Tests voor FeedbackHost — pure projector.
 */

// Pas daarna pas de imports
// Modal en AccessibilityInfo zijn globaal gemocked in jest.setup.early.js.
// Geen react-native re-mock hier — dat overschrijft de setup.early mock en
// crasht omdat jest.requireActual('react-native') Platform.OS nodig heeft.
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { FeedbackHost } from './FeedbackHost';
import {
  makeWarningToast,
  makeErrorToast,
  makeCriticalModal,
  makeRecoveryModal,
  resetFeedbackCounter,
} from '@test-utils/factories/feedbackFactory';
import type { FeedbackItem } from '@app/orchestrators/FeedbackOrchestrator';

// ─── Mock de hooks ──────────────────────────────────────────────────────────
const mockDismiss = jest.fn();
const mockExecuteRecovery = jest.fn();
let mockItems: FeedbackItem[] = [];

jest.mock('@ui/providers/FeedbackProvider', () => ({
  useAuditFeedback: () => ({
    items: mockItems,
    dismiss: mockDismiss,
    executeRecovery: mockExecuteRecovery,
  }),
}));

jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: () => ({
    styles: {
      toastStack: { position: 'absolute', zIndex: 9999, top: 60 },
      toast: { flexDirection: 'row', padding: 8 },
      toastWarning: { borderLeftColor: '#FF9500' },
      toastError: { borderLeftColor: '#FF3B30' },
      toastCritical: { borderLeftColor: '#FF3B30' },
      toastText: { fontSize: 14, flex: 1 },
      toastDismissButton: { padding: 8 },
      toastDismissText: { fontSize: 16 },
      modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
      modalCard: { backgroundColor: 'white', padding: 16, borderRadius: 8 },
      modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
      modalIcon: { fontSize: 24, marginRight: 8 },
      modalTitle: { fontSize: 18, fontWeight: '600' },
      modalBody: { fontSize: 14, marginBottom: 16 },
      recoveryButton: { padding: 12, backgroundColor: '#F2F2F7' },
      recoveryButtonText: { fontSize: 16, textAlign: 'center' },
      dismissModalButton: { padding: 12, marginTop: 8 },
      dismissModalText: { fontSize: 16, textAlign: 'center' },
    },
    colors: {
      warning: '#FF9500',
      error: '#FF3B30',
      onError: '#FFFFFF',
      textPrimary: '#1C1C1E',
      textSecondary: '#6E6E73',
      surface: '#FFFFFF',
      border: '#D1D1D6',
    },
  }),
}));

describe('FeedbackHost', () => {
  beforeEach(() => {
    resetFeedbackCounter();
    mockItems = [];
    jest.clearAllMocks();
    // Frisse spy per test — AccessibilityInfo.announceForAccessibility is een
    // jest.fn() uit setup.early.js; clearAllMocks() reset calls maar behoudt impl.
    // spyOn zorgt dat toHaveBeenCalledWith assertions per test geïsoleerd zijn.
    jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(jest.fn());
  });

  // ─── Lege staat ──────────────────────────────────────────────────────────
  it('rendert niets bij lege items-lijst', () => {
    const { queryByTestId } = render(<FeedbackHost />);
    expect(queryByTestId('toast-warning')).toBeNull();
    expect(queryByTestId('toast-error')).toBeNull();
    expect(queryByTestId('critical-modal')).toBeNull();
  });

  // ─── ToastBanner ─────────────────────────────────────────────────────────
  describe('ToastBanner', () => {
    it('toont warning toast', () => {
      mockItems = [makeWarningToast({ message: 'Let op!' })];
      const { getByTestId, getByText } = render(<FeedbackHost />);

      expect(getByTestId('toast-warning')).toBeTruthy();
      expect(getByText('Let op!')).toBeTruthy();
    });

    it('toont error toast', () => {
      mockItems = [makeErrorToast({ message: 'Fout!' })];
      const { getByTestId } = render(<FeedbackHost />);
      expect(getByTestId('toast-error')).toBeTruthy();
    });

    it('roept dismiss aan bij drukken op ✕', () => {
      mockItems = [makeWarningToast({ id: 'dismiss-me' })];
      const { getByTestId } = render(<FeedbackHost />);

      fireEvent.press(getByTestId('toast-dismiss'));
      expect(mockDismiss).toHaveBeenCalledWith('dismiss-me');
    });

    it('rendert meerdere toasts', () => {
      mockItems = [
        makeWarningToast({ id: 'w-1' }),
        makeErrorToast({ id: 'e-1' }),
      ];
      const { getAllByTestId } = render(<FeedbackHost />);
      // /^toast-(warning|error|critical)/ — uitdrukkelijk severity-IDs, NIET toast-dismiss
      expect(getAllByTestId(/^toast-(warning|error|critical)$/).length).toBe(2);
    });

    it('auto-dismiss timer roept dismiss aan', () => {
      jest.useFakeTimers();
      mockItems = [makeWarningToast({ id: 'auto', autoDismissMs: 3000 })];
      render(<FeedbackHost />);

      act(() => { jest.advanceTimersByTime(3000); });
      expect(mockDismiss).toHaveBeenCalledWith('auto');

      jest.useRealTimers();
    });

    it('toast met autoDismissMs=undefined dismisst niet automatisch', () => {
      jest.useFakeTimers();
      mockItems = [makeWarningToast({ id: 'no-auto', autoDismissMs: undefined })];
      render(<FeedbackHost />);

      act(() => { jest.advanceTimersByTime(60000); });
      expect(mockDismiss).not.toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('heeft accessibility role "alert"', () => {
      mockItems = [makeWarningToast({ message: 'A11y test' })];
      const { getByRole } = render(<FeedbackHost />);
      expect(getByRole('alert')).toBeTruthy();
    });

    it('kondigt toast aan via AccessibilityInfo', () => {
      mockItems = [makeWarningToast({ message: 'A11y test' })];
      render(<FeedbackHost />);
      expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith('A11y test');
    });
  });

  // ─── CriticalModal ────────────────────────────────────────────────────────
  describe('CriticalModal', () => {
    it('toont modal bij critical item', () => {
      mockItems = [makeCriticalModal({ message: 'Kritieke fout!' })];
      const { getByTestId, getByText } = render(<FeedbackHost />);

      expect(getByTestId('critical-modal')).toBeTruthy();
      expect(getByText('Kritieke fout!')).toBeTruthy();
    });

    it('toont geen recovery-knop bij recoveryAction="dismiss"', () => {
      mockItems = [makeCriticalModal({ recoveryAction: 'dismiss' })];
      const { queryByTestId } = render(<FeedbackHost />);
      expect(queryByTestId('recovery-button')).toBeNull();
    });

    it('toont recovery-knop bij reset_full', () => {
      mockItems = [makeRecoveryModal('reset_full')];
      const { getByTestId, getByText } = render(<FeedbackHost />);
      expect(getByTestId('recovery-button')).toBeTruthy();
      expect(getByText('App herstellen')).toBeTruthy();
    });

    it('toont recovery-knop bij reset_setup', () => {
      mockItems = [makeRecoveryModal('reset_setup')];
      const { getByText } = render(<FeedbackHost />);
      expect(getByText('Instellingen herstellen')).toBeTruthy();
    });

    it('roept executeRecovery aan bij drukken op recovery-knop', () => {
      mockItems = [makeRecoveryModal('reset_full', { id: 'modal-r' })];
      const { getByTestId } = render(<FeedbackHost />);

      fireEvent.press(getByTestId('recovery-button'));
      expect(mockExecuteRecovery).toHaveBeenCalledWith('reset_full', 'modal-r');
    });

    it('roept dismiss aan bij drukken op sluiten-knop', () => {
      mockItems = [makeCriticalModal({ id: 'modal-d' })];
      const { getByTestId } = render(<FeedbackHost />);

      fireEvent.press(getByTestId('modal-dismiss'));
      expect(mockDismiss).toHaveBeenCalledWith('modal-d');
    });

    it('rendert altijd de "Close" knop', () => {
      mockItems = [makeCriticalModal({ recoveryAction: undefined })];
      const { getByTestId } = render(<FeedbackHost />);
      expect(getByTestId('modal-dismiss')).toBeTruthy();
    });

    it('modal heeft accessibilityViewIsModal prop', () => {
      mockItems = [makeCriticalModal({})];
      const { getByTestId } = render(<FeedbackHost />);
      const modal = getByTestId('critical-modal');
      expect(modal.props.accessibilityViewIsModal).toBe(true);
    });
  });

  // ─── Toast + Modal coëxistentie ───────────────────────────────────────────
  it('toont zowel toasts als modal gelijktijdig', () => {
    mockItems = [
      makeWarningToast({ id: 't-1' }),
      makeCriticalModal({ id: 'm-1' }),
    ];
    const { getByTestId } = render(<FeedbackHost />);

    expect(getByTestId('toast-warning')).toBeTruthy();
    expect(getByTestId('critical-modal')).toBeTruthy();
  });
});