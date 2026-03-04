// src/ui/providers/FeedbackProvider.tsx
/**
 * @file_intent Beheert de lijst van actieve FeedbackItems als vluchtige UI-state.
 *   Verbindt de FeedbackOrchestrator (app-laag) met FeedbackHost (UI-laag) via Context.
 * @repo_architecture UI Layer - State Management / Provider.
 *   Structureel identiek aan ThemeProvider: dumb state container, delegeert logica naar orchestrator.
 * @term_definition
 *   - vluchtige state: niet persistent, niet in formReducer — leeft alleen in geheugen.
 *   - FeedbackItem: geconstrueerd UI-instructie-object, aangemaakt door FeedbackOrchestrator.
 *   - MAX_TOASTS: maximale gelijktijdige toasts om "toast storm" te voorkomen (ADR-17).
 * @contract
 *   - FeedbackProvider moet BINNEN MasterProvider zitten (heeft master nodig).
 *   - useAuditFeedback() gooit als buiten provider aangeroepen.
 *   - executeRecovery() delegeert altijd via orchestrator — UI roept master nooit direct aan.
 *   - Eén actieve modal tegelijk (kritieke fouten worden niet gestapeld).
 * @ai_instruction
 *   Gebruik useAuditFeedback() in FeedbackHost en nergens anders.
 *   Voeg geen business-logica toe aan deze provider — dat hoort in FeedbackOrchestrator.
 * @see ADR-01 (Lagenscheiding), ADR-04 (Dumb UI), ADR-17 (Accepted Risk)
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  FeedbackOrchestrator,
  type FeedbackItem,
  type RecoveryAction,
} from '@app/orchestrators/FeedbackOrchestrator';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';

// ─── Context type ─────────────────────────────────────────────────────────────

interface FeedbackContextValue {
  /** Actuele lijst van feedback-items (toasts + modals gecombineerd). */
  items: FeedbackItem[];
  /** Verwijdert een item op ID — aangeroepen door auto-dismiss timer of sluitknop. */
  dismiss: (id: string) => void;
  /**
   * Voert recovery-actie uit en dismiss-t het item daarna automatisch.
   * Delegeert naar FeedbackOrchestrator.executeRecovery() — nooit master direct.
   */
  executeRecovery: (action: RecoveryAction, itemId: string) => void;
}

// ─── Constanten ───────────────────────────────────────────────────────────────

/** Maximale gelijktijdige toasts. Oudste wordt verdrongen bij overschrijding. */
const MAX_TOASTS = 3;

// ─── Context + Provider ───────────────────────────────────────────────────────

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

export function FeedbackProvider({ children, master }: { children: ReactNode; master: MasterOrchestratorAPI }) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const orchRef = useRef<FeedbackOrchestrator | null>(null); // useRef: instance-wijzigingen triggeren geen re-render

  const dismiss = useCallback((id: string) => setItems(prev => prev.filter(i => i.id !== id)), []);

  const addItem = useCallback((item: FeedbackItem) => {
    setItems(prev => applyFeedbackPolicy(prev, item)); // extracted: modal-replace + toast-FIFO policy
  }, []);

  const executeRecovery = useCallback((action: RecoveryAction, itemId: string) => {
    orchRef.current?.executeRecovery(action, itemId); // UI delegeert; orchestrator kent recovery-semantiek
  }, []);

  useEffect(() => {
    const orch = new FeedbackOrchestrator(master, addItem, dismiss);
    orchRef.current = orch;
    orch.start();
    return () => { orch.stop(); orchRef.current = null; };
  }, [master, addItem, dismiss]);

  return <FeedbackContext.Provider value={{ items, dismiss, executeRecovery }}>{children}</FeedbackContext.Provider>;
}

// ─── Helper: feedback policy (pure, testbaar los van React) ─────────────────
function applyFeedbackPolicy(prev: FeedbackItem[], item: FeedbackItem): FeedbackItem[] {
  if (item.kind === 'modal') return [...prev.filter(i => i.kind !== 'modal'), item]; // modals: vervang vorige
  const modals = prev.filter(i => i.kind === 'modal');
  const toasts = prev.filter(i => i.kind === 'toast');
  const capped = toasts.length >= MAX_TOASTS ? toasts.slice(1) : toasts; // FIFO bij overflow
  return [...modals, ...capped, item];
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useAuditFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (ctx === undefined) {
    throw new Error('useAuditFeedback must be used within <FeedbackProvider>');
  }
  return ctx;
}
