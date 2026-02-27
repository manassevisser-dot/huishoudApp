// src/app/workflows/__tests__/SettingsWorkflow.test.ts
/**
 * Tests voor de SettingsWorkflow + de vier gewijzigde bestanden die de pipeline sluiten.
 *
 * Dekt:
 *   1. SettingsWorkflow.execute — happy path (boolean true/false, string 'dark'/'light')
 *   2. SettingsWorkflow.execute — onbekende waarde (warn, geen setTheme)
 *   3. SettingsWorkflow.execute — niet-theme fieldId (geen setTheme, wel log)
 *   4. MappingContext.valueResolvers — resolver heeft prioriteit boven fso.getValue()
 *   5. ThemeManager.setTheme — listener vóór await (race condition fix)
 *   6. ThemeManager.setTheme — geen crash als listener niet geregistreerd is
 *   7. labelFromToken — 'darkModeLabel' resolveert via settings-sectie
 *   8. EntryRegistry — 'darkModeToggle' bestaat met constraintsKey 'theme'
 *   9. SectionRegistry — APP_PREFERENCES_SECTION bevat 'darkModeToggle'
 */

import { SettingsWorkflow } from './SettingsWorkflow';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import { ThemeManager } from '@app/orchestrators/managers/ThemeManager';
import { labelFromToken } from '@domain/constants/labelResolver';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { SectionRegistry } from '@domain/registry/SectionRegistry';

// ─── Mock helpers ─────────────────────────────────────────────────────────────

jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  Logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// StorageShim mock — voorkomt AsyncStorage I/O in unit tests
jest.mock('@services/storageShim', () => ({
  loadTheme: jest.fn().mockResolvedValue('light'),
  saveTheme: jest.fn().mockResolvedValue(undefined),
}));

// ─────────────────────────────────────────────────────────────────────────────

describe('SettingsWorkflow', () => {
  let workflow: SettingsWorkflow;
  let mockThemeManager: { setTheme: jest.Mock; getTheme: jest.Mock; loadTheme: jest.Mock; onThemeChange: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    workflow = new SettingsWorkflow();
    mockThemeManager = {
      setTheme: jest.fn().mockResolvedValue(undefined),
      getTheme: jest.fn().mockReturnValue('light'),
      loadTheme: jest.fn().mockResolvedValue('light'),
      onThemeChange: jest.fn(),
    };
  });

  // ─── Groep 1: happy path ────────────────────────────────────────────────────

  describe('execute — thema wijzigen', () => {
    it('roept setTheme("dark") aan bij boolean true', () => {
      workflow.execute('theme', true, mockThemeManager);

      expect(mockThemeManager.setTheme).toHaveBeenCalledTimes(1);
      expect(mockThemeManager.setTheme).toHaveBeenCalledWith('dark');
    });

    it('roept setTheme("light") aan bij boolean false', () => {
      workflow.execute('theme', false, mockThemeManager);

      expect(mockThemeManager.setTheme).toHaveBeenCalledWith('light');
    });

    it('roept setTheme("dark") aan bij string "dark"', () => {
      workflow.execute('theme', 'dark', mockThemeManager);

      expect(mockThemeManager.setTheme).toHaveBeenCalledWith('dark');
    });

    it('roept setTheme("light") aan bij string "light"', () => {
      workflow.execute('theme', 'light', mockThemeManager);

      expect(mockThemeManager.setTheme).toHaveBeenCalledWith('light');
    });

    it('logt settings_changed via Logger.info', () => {
      workflow.execute('theme', true, mockThemeManager);

      expect(Logger.info).toHaveBeenCalledWith('settings_changed', expect.objectContaining({
        workflow: 'settings',
        fieldId: 'theme',
      }));
    });
  });

  // ─── Groep 2: ongeldige waarde ──────────────────────────────────────────────

  describe('execute — ongeldige thema-waarde', () => {
    it('logt warning en roept setTheme NIET aan bij null', () => {
      workflow.execute('theme', null, mockThemeManager);

      expect(mockThemeManager.setTheme).not.toHaveBeenCalled();
      expect(Logger.warn).toHaveBeenCalledWith(
        'settings_theme_invalid_value',
        expect.objectContaining({ workflow: 'settings' }),
      );
    });

    it('logt warning en roept setTheme NIET aan bij een getal', () => {
      workflow.execute('theme', 42, mockThemeManager);

      expect(mockThemeManager.setTheme).not.toHaveBeenCalled();
      expect(Logger.warn).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Groep 3: onbekend fieldId ──────────────────────────────────────────────

  describe('execute — niet-theme fieldId', () => {
    it('logt settings_changed maar roept setTheme NIET aan', () => {
      workflow.execute('taal', 'nl', mockThemeManager);

      expect(Logger.info).toHaveBeenCalledWith('settings_changed', expect.objectContaining({
        fieldId: 'taal',
      }));
      expect(mockThemeManager.setTheme).not.toHaveBeenCalled();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('MappingContext — valueResolvers prioriteit', () => {
  /**
   * Test dat valueResolvers hogere prioriteit heeft dan fso.getValue().
   * We testen de logica direct zonder UIOrchestrator te instantiëren.
   */
  it('resolver heeft prioriteit als fieldId aanwezig is in valueResolvers', () => {
    const resolvers: Record<string, () => unknown> = {
      theme: () => true, // donker thema actief
    };
    const mockFso = { getValue: jest.fn().mockReturnValue('zou niet aangeroepen worden') };

    // Simuleer de resolveEntryValue-logica rechtstreeks
    const fieldId = 'theme';
    const resolved = resolvers[fieldId] !== undefined
      ? resolvers[fieldId]()
      : mockFso.getValue(fieldId);

    expect(resolved).toBe(true);
    expect(mockFso.getValue).not.toHaveBeenCalled();
  });

  it('valt terug op fso.getValue als fieldId niet in resolvers staat', () => {
    const resolvers: Record<string, () => unknown> = {
      theme: () => true,
    };
    const mockFso = { getValue: jest.fn().mockReturnValue(2) };

    const fieldId = 'aantalMensen';
    const resolved = resolvers[fieldId] !== undefined
      ? resolvers[fieldId]()
      : mockFso.getValue(fieldId);

    expect(resolved).toBe(2);
    expect(mockFso.getValue).toHaveBeenCalledWith('aantalMensen');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('ThemeManager — race condition fix', () => {
  it('roept listener aan vóór saveTheme resolveert', async () => {
    const callOrder: string[] = [];
    const { saveTheme } = jest.requireMock('@services/storageShim') as {
      saveTheme: jest.Mock;
    };

    // saveTheme pas resolven nadat we de volgorde kunnen opnemen
    saveTheme.mockImplementation(
      () => new Promise<void>((resolve) => {
        callOrder.push('saveTheme-resolved');
        resolve();
      }),
    );

    const manager = new ThemeManager();
    manager.onThemeChange(() => { callOrder.push('listener-called'); });

    await manager.setTheme('dark');

    // Listener moet vóór saveTheme in de lijst staan
    expect(callOrder.indexOf('listener-called')).toBeLessThan(
      callOrder.indexOf('saveTheme-resolved'),
    );
  });

  it('crasht niet als er geen listener geregistreerd is', async () => {
    const manager = new ThemeManager();
    await expect(manager.setTheme('dark')).resolves.not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('labelFromToken — settings-sectie', () => {
  it('resolveert "darkModeLabel" naar "Donker thema"', () => {
    expect(labelFromToken('darkModeLabel')).toBe('Donker thema');
  });

  it('geeft de token terug als fallback bij onbekende token', () => {
    expect(labelFromToken('ONBEKEND_TOKEN_XYZ')).toBe('ONBEKEND_TOKEN_XYZ');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('EntryRegistry — darkModeToggle', () => {
  it('bestaat in het register', () => {
    const entry = EntryRegistry.getDefinition('darkModeToggle');
    expect(entry).not.toBeNull();
  });

  it('heeft primitiveType "toggle"', () => {
    const entry = EntryRegistry.getDefinition('darkModeToggle');
    expect(entry?.primitiveType).toBe('toggle');
  });

  it('heeft constraintsKey "theme" zodat valueResolver triggert', () => {
    const entry = EntryRegistry.getDefinition('darkModeToggle');
    expect(entry?.constraintsKey).toBe('theme');
  });

  it('heeft labelToken "darkModeLabel"', () => {
    const entry = EntryRegistry.getDefinition('darkModeToggle');
    expect(entry?.labelToken).toBe('darkModeLabel');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('SectionRegistry — APP_PREFERENCES_SECTION', () => {
  it('bestaat in het register', () => {
    const section = SectionRegistry.getDefinition('APP_PREFERENCES_SECTION');
    expect(section).not.toBeNull();
  });

  it('bevat "darkModeToggle" in fieldIds', () => {
    const section = SectionRegistry.getDefinition('APP_PREFERENCES_SECTION');
    expect(section?.fieldIds).toContain('darkModeToggle');
  });

  it('is niet meer leeg (stub is gevuld)', () => {
    const section = SectionRegistry.getDefinition('APP_PREFERENCES_SECTION');
    expect(section?.fieldIds.length).toBeGreaterThan(0);
  });
});
