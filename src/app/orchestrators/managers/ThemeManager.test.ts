// src/app/orchestrators/managers/ThemeManager.test.ts
import { ThemeManager } from './ThemeManager';
import { loadTheme, saveTheme } from '@services/storageShim';

// 1. Mock de externe storage service
jest.mock('@services/storageShim', () => ({
  loadTheme: jest.fn(),
  saveTheme: jest.fn(),
}));

describe('ThemeManager', () => {
  let manager: ThemeManager;

  beforeEach(() => {
    manager = new ThemeManager();
    jest.clearAllMocks();
  });

  describe('loadTheme', () => {
    it('moet het thema laden van storage en de cache updaten', async () => {
      (loadTheme as jest.Mock).mockResolvedValue('dark');

      const theme = await manager.loadTheme();

      expect(loadTheme).toHaveBeenCalledTimes(1);
      expect(theme).toBe('dark');
      expect(manager.getTheme()).toBe('dark');
    });

    it('moet terugvallen op "light" als storage leeg is', async () => {
      (loadTheme as jest.Mock).mockResolvedValue(null);

      const theme = await manager.loadTheme();

      expect(theme).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('moet het thema opslaan en de listener informeren', async () => {
      const listenerSpy = jest.fn();
      manager.onThemeChange(listenerSpy);

      await manager.setTheme('dark');

      expect(saveTheme).toHaveBeenCalledWith('dark');
      expect(manager.getTheme()).toBe('dark');
      expect(listenerSpy).toHaveBeenCalledWith('dark');
    });

    it('moet ook werken zonder geregistreerde listener', async () => {
      // Dit test de null-check (this._listener !== undefined)
      await expect(manager.setTheme('light')).resolves.not.toThrow();
      expect(saveTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('getTheme', () => {
    it('moet standaard "light" teruggeven', () => {
      expect(manager.getTheme()).toBe('light');
    });
  });

  describe('onThemeChange', () => {
    it('moet de listener correct registreren', async () => {
      const callback = jest.fn();
      manager.onThemeChange(callback);
      
      await manager.setTheme('dark');
      
      expect(callback).toHaveBeenCalledWith('dark');
    });
  });
});