// src/app/workflows/ResetWorkflow.ts
/**
 * @file_intent Coördineert de twee reset-varianten: volledig wissen (full) en alleen setup herstellen (setup).
 * @repo_architecture Mobile Industry (MI) - Workflow Layer.
 * @term_definition
 *   ResetType 'full'  = RESET_APP dispatch + PersistenceAdapter.clear() — alles weg, terug naar LANDING.
 *   ResetType 'setup' = RESET_SETUP dispatch — setup/household/finance leeg, transacties behouden.
 * @contract
 *   execute(type, fso) → dispatcht de juiste actie, logt via AuditLogger.
 *   'full': roept ook PersistenceAdapter.clear() aan (fire-and-forget) — fixet known bug in FormStateProvider.
 *   Retourneert void. Navigatie is impliciet via reducer (activeStep-mutatie).
 * @ai_instruction
 *   Alert.alert zit NIET hier — dat is UI-logica in ResetConfirmationContainer.
 *   De reducer (formReducer) is autoriteit over wat er gewist wordt en waarheen er genavigeerd wordt.
 *   Voeg nieuwe reset-varianten hier toe als nieuwe ResetType-branches.
 * @see DailyTransactionWorkflow, SettingsWorkflow — patronen die hier gevolgd worden
 * @see FormStateProvider @ai_instruction — "Bij RESET_APP: PersistenceAdapter.clear() aanroepen"
 * @see formReducer.RESET_SETUP — behoudt transactionHistory, csvImport, latestTransaction
 */

import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import * as PersistenceAdapter from '@adapters/system/PersistenceAdapter';
import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';

/** Discriminated union voor de twee reset-modi. */
export type ResetType = 'full' | 'setup';

export class ResetWorkflow {
  /**
   * Voert de reset-workflow uit op basis van het opgegeven type.
   *
   * @param type  - 'full' wist alles (RESET_APP), 'setup' wist alleen de wizard-data (RESET_SETUP).
   * @param fso   - Voor dispatch(); als param voor stateless aanpak (zelfde patroon als DailyTransactionWorkflow).
   */
  public execute(type: ResetType, fso: FormStateOrchestrator): void {
    if (type === 'full') {
      this.executeFullReset(fso);
    } else {
      this.executeSetupReset(fso);
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────

  /**
   * Volledig wissen: reducer naar LANDING + AsyncStorage leegmaken.
   * PersistenceAdapter.clear() is fire-and-forget (void): de reducer-dispatch
   * is synchroon en de UI-navigatie vindt direct plaats. De storage-clear
   * mag asynchroon volgen.
   *
   * ⚠️ Known bug fix: FormStateProvider.@ai_instruction documenteert dat clear()
   *    bij RESET_APP aangeroepen moet worden. Zonder deze aanroep hydreert de app
   *    bij herstart de "gewiste" data terug uit AsyncStorage.
   */
  private executeFullReset(fso: FormStateOrchestrator): void {
    fso.dispatch({ type: 'RESET_APP' });
    void PersistenceAdapter.clear();
    Logger.info('reset_completed', {
      workflow: 'reset',
      type: 'full',
    });
  }

  /**
   * Gedeeltelijk wissen: alleen setup/household/finance terug naar initieel.
   * transactionHistory, csvImport en latestTransaction blijven behouden.
   * PersistenceAdapter.clear() wordt NIET aangeroepen — auto-save in FormStateProvider
   * slaat de partieel gereset state vanzelf op.
   */
  private executeSetupReset(fso: FormStateOrchestrator): void {
    fso.dispatch({ type: 'RESET_SETUP' });
    Logger.info('reset_completed', {
      workflow: 'reset',
      type: 'setup',
    });
  }
}
