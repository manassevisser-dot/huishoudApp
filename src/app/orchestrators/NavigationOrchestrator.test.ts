// src/app/orchestrators/NavigationOrchestrator.test.ts

import { NavigationOrchestrator } from './NavigationOrchestrator';
import { ScreenRegistry } from '@domain/registry/ScreenRegistry';

// Mocks
jest.mock('@domain/registry/ScreenRegistry');
jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  logger: { warn: jest.fn() },
}));

import { logger } from '@adapters/audit/AuditLoggerAdapter';

const makeFso = (overrides = {}) => ({
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    activeStep: 'WIZARD_SETUP_HOUSEHOLD',
    currentScreenId: 'WIZARD_SETUP_HOUSEHOLD',
    data: {},
  })),
  ...overrides,
});

const makeNavigationManager = (overrides = {}) => ({
  getNextStep: jest.fn(() => 'WIZARD_STEP_2'),
  getFirstScreenId: jest.fn(() => 'WIZARD_SETUP_HOUSEHOLD'),
  ...overrides,
});

const makeValidation = (isValid = true) => ({
  validateSection: jest.fn(() => ({ isValid })),
});

describe('NavigationOrchestrator', () => {

  describe('navigateTo', () => {
    it('dispatches SET_STEP when screen is found', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'OVERVIEW' });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);

      sut.navigateTo('DASHBOARD');

      expect(fso.dispatch).toHaveBeenCalledWith({ type: 'SET_STEP', payload: 'DASHBOARD' });
    });

    it('also dispatches SET_CURRENT_SCREEN_ID for WIZARD screens', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD' });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);

      sut.navigateTo('WIZARD_SETUP_HOUSEHOLD');

      expect(fso.dispatch).toHaveBeenCalledWith({ type: 'SET_CURRENT_SCREEN_ID', payload: 'WIZARD_SETUP_HOUSEHOLD' });
    });

    it('logs a warning and does nothing when screen is not found', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue(null);
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);

      sut.navigateTo('UNKNOWN_SCREEN');

      expect(fso.dispatch).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith('navigation_screen_not_found', expect.objectContaining({ screenId: 'UNKNOWN_SCREEN' }));
    });
  });

  describe('canNavigateNext', () => {
    it('returns true when validation passes', () => {
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD' });
      const sut = new NavigationOrchestrator(makeFso() as any, makeNavigationManager() as any, makeValidation(true) as any);
      expect(sut.canNavigateNext()).toBe(true);
    });

    it('returns false when validation fails', () => {
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD' });
      const sut = new NavigationOrchestrator(makeFso() as any, makeNavigationManager() as any, makeValidation(false) as any);
      expect(sut.canNavigateNext()).toBe(false);
    });
  });

  describe('navigateNext', () => {
    it('navigates to nextScreenId from definition when available', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD', nextScreenId: 'WIZARD_STEP_2' });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);

      sut.navigateNext();

      expect(fso.dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'WIZARD_STEP_2' }));
    });

    it('falls back to navigationManager when definition has no nextScreenId', () => {
      const fso = makeFso();
      const navManager = makeNavigationManager();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD', nextScreenId: undefined });
      const sut = new NavigationOrchestrator(fso as any, navManager as any, makeValidation(true) as any);

      sut.navigateNext();

      expect(navManager.getNextStep).toHaveBeenCalled();
    });

    it('does not navigate when canNavigateNext is false and no nextScreenId', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD', nextScreenId: undefined });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation(false) as any);

      sut.navigateNext();

      expect(fso.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('goBack', () => {
    it('navigates to previousScreenId when available', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD', previousScreenId: 'WIZARD_SETUP_HOUSEHOLD' });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);

      sut.goBack();

      expect(fso.dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'WIZARD_SETUP_HOUSEHOLD' }));
    });

    it('falls back to DASHBOARD when no previousScreenId', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD', previousScreenId: undefined });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);

      sut.goBack();

      expect(fso.dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'DASHBOARD' }));
    });
  });

  describe('startWizard', () => {
    it('navigates to first screen from navigationManager', () => {
      const fso = makeFso();
      const navManager = makeNavigationManager();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD' });
      const sut = new NavigationOrchestrator(fso as any, navManager as any, makeValidation() as any);

      sut.startWizard();

      expect(navManager.getFirstScreenId).toHaveBeenCalled();
      expect(fso.dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'WIZARD_SETUP_HOUSEHOLD' }));
    });

    it('falls back to WIZARD_SETUP_HOUSEHOLD when getFirstScreenId returns null', () => {
      const fso = makeFso();
      const navManager = makeNavigationManager({ getFirstScreenId: jest.fn(() => null) });
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD' });
      const sut = new NavigationOrchestrator(fso as any, navManager as any, makeValidation() as any);

      sut.startWizard();

      expect(fso.dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: 'WIZARD_SETUP_HOUSEHOLD' }));
    });
  });

  describe('shortcut navigators', () => {
    it.each([
      ['goToDashboard', 'DASHBOARD'],
      ['goToOptions', 'OPTIONS'],
      ['goToSettings', 'SETTINGS'],
      ['goToCsvUpload', 'CSV_UPLOAD'],
      ['goToReset', 'RESET'],
    ])('%s navigates to %s', (method, screenId) => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'OVERVIEW' });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);

      (sut as any)[method]();

      expect(fso.dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: screenId }));
    });
  });

  describe('navigateBack', () => {
    it('delegates to goBack', () => {
      const fso = makeFso();
      (ScreenRegistry.getDefinition as jest.Mock).mockReturnValue({ type: 'WIZARD', previousScreenId: 'WIZARD_SETUP_HOUSEHOLD' });
      const sut = new NavigationOrchestrator(fso as any, makeNavigationManager() as any, makeValidation() as any);
      const spy = jest.spyOn(sut, 'goBack');

      sut.navigateBack();

      expect(spy).toHaveBeenCalled();
    });
  });

});