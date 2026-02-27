// src/app/workflows/SettingsWorkflow.ts
/**
 * @file_intent Coördineert de workflow voor het wijzigen van applicatie-instellingen.
 * @repo_architecture Mobile Industry (MI) - Workflow Layer.
 * @term_definition
 *   Settings = Applicatie-brede voorkeuren die buiten de FormState leven (thema, toekomstig: taal, notificaties).
 *   IThemeOrchestrator = De interface voor ThemeManager; verantwoordelijk voor opslag en notificatie.
 * @contract
 *   execute(fieldId, value, themeManager) → logt via AuditLogger, roept ThemeManager aan bij thema-wijziging.
 *   Retourneert void; fouten worden gelogd, nooit gegooid.
 * @ai_instruction Dit is de SSOT voor settings-wijzigingen. Voeg hier nieuwe settings toe als fieldId-branches.
 *   Voor het thema: boolean true = 'dark', false = 'light'. De UI-laag (TOGGLE) werkt met booleans;
 *   deze workflow vertaalt naar de Theme-string die ThemeManager verwacht.
 * @see DailyTransactionWorkflow — patroon dat hier gevolgd wordt
 */

import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import type { IThemeOrchestrator } from '@app/orchestrators/interfaces/IThemeOrchestrator';
import type { Theme } from '@domain/constants/Colors';

export class SettingsWorkflow {
  /**
   * Verwerkt een settings-wijziging.
   *
   * @param fieldId       - Het instellingsveld (bijv. 'theme').
   * @param value         - De nieuwe waarde. Voor 'theme': boolean (true = dark, false = light).
   * @param themeManager  - Geïnjecteerd voor opslag en React-notificatie.
   */
  public execute(
    fieldId: string,
    value: unknown,
    themeManager: IThemeOrchestrator,
  ): void {
    Logger.info('settings_changed', {
      workflow: 'settings',
      fieldId,
      value: String(value),
    });

    if (fieldId === 'theme') {
      this.applyTheme(value, themeManager);
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────

  /**
   * Vertaalt boolean toggle-waarde naar Theme-string en roept ThemeManager aan.
   * boolean true  → 'dark'
   * boolean false → 'light'
   * Onbekende waarden worden genegeerd (fail-silent) en gelogd als warning.
   */
  private applyTheme(value: unknown, themeManager: IThemeOrchestrator): void {
    let theme: Theme;

    if (value === true || value === 'dark') {
      theme = 'dark';
    } else if (value === false || value === 'light') {
      theme = 'light';
    } else {
      Logger.warn('settings_theme_invalid_value', {
        workflow: 'settings',
        receivedValue: String(value),
      });
      return;
    }

    void themeManager.setTheme(theme);
  }
}
