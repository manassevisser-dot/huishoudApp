import {
    makeAlerts,
    makeButtons,
    makeCards,
    makeCheckboxes,
    makeChips,
    makeContainers,
    makeDashboard,
   
    makeHeader,
    makeHelpers,
    makeLayout,
    makeSummary,
    makeToggles,
    makeTypography,
    STYLE_MODULES,
  } from './StyleRegistry';
  
  describe('StyleRegistry exports', () => {
    const factories = {
      makeAlerts,
      makeButtons,
      makeCards,
      makeCheckboxes,
      makeChips,
      makeContainers,
      makeDashboard,    
      makeHeader,
      makeHelpers,
      makeLayout,
      makeSummary,
      makeToggles,
      makeTypography,
    };
  
    test.each(Object.entries(factories))('%s is een functie', (_name, factory) => {
      expect(typeof factory).toBe('function');
    });
  });
  
  describe('STYLE_MODULES', () => {
    test('bevat alle 14 module-namen', () => {
      expect(Object.keys(STYLE_MODULES)).toHaveLength(14);
    });
  
    test('keys matchen met verwachte modules', () => {
      expect(STYLE_MODULES.ALERTS).toBe('Alerts');
      expect(STYLE_MODULES.BUTTONS).toBe('Buttons');
      expect(STYLE_MODULES.CARDS).toBe('Cards');
      expect(STYLE_MODULES.CHECKBOXES).toBe('Checkboxes');
      expect(STYLE_MODULES.CHIPS).toBe('Chips');
      expect(STYLE_MODULES.CONTAINERS).toBe('Containers');
      expect(STYLE_MODULES.DASHBOARD).toBe('Dashboard');
      expect(STYLE_MODULES.HEADER).toBe('Header');
      expect(STYLE_MODULES.HELPERS).toBe('Helpers');
      expect(STYLE_MODULES.LAYOUT).toBe('Layout');
      expect(STYLE_MODULES.SUMMARY).toBe('Summary');
      expect(STYLE_MODULES.TOGGLES).toBe('Toggles');
      expect(STYLE_MODULES.TYPOGRAPHY).toBe('Typography');
    });
  });