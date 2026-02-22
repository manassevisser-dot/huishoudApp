/**
 * @file_intent Contract test die verifieert welke fieldIds zichtbaar zijn
 * in de setupHousehold sectie, gegeven een specifieke state en visibility rules.
 *
 * Keten onder test:
 *   screenConfig.fields → visibilityRuleMap → VisibilityOrchestrator.evaluate() → visible fieldIds
 *
 * Dit is een integratie-contract: het test niet één unit, maar het CONTRACT
 * tussen state, domein-regels en de orchestrator die ze verbindt.
 */
import { VisibilityOrchestrator } from '@app/orchestrators/VisibilityOrchestrator';
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import { createMockState } from '@test-utils/factories/stateFactory';
import { setupHouseholdConfig } from '@ui/screens/Wizard/pages/1setupHousehold.config';

// ─── CONTRACT: fieldId → visibilityRule mapping ──────────────────────
// Dit is de bron van waarheid voor welke regel welk veld bestuurt.
// Velden zonder rule zijn ALTIJD zichtbaar (geen gate).
const FIELD_VISIBILITY_MAP: Record<string, string | undefined> = {
  aantalMensen: undefined,                // altijd zichtbaar
  aantalVolwassen: 'isAdultInputVisible', // zichtbaar als aantalMensen > 0
  kinderenLabel: 'calculateChildrenCount', // zichtbaar als aantalMensen > aantalVolwassen
  postcode: undefined,                    // altijd zichtbaar
  autoCount: undefined,                   // altijd zichtbaar
  heeftHuisdieren: undefined,             // altijd zichtbaar
};

// ─── Helper: simuleert wat UIManager zou doen ────────────────────────
function getVisibleFieldIds(
  visibility: VisibilityOrchestrator,
  fields: Array<{ fieldId: string }>,
  ruleMap: Record<string, string | undefined>,
): string[] {
  return fields
    .filter(({ fieldId }) => {
      const ruleName = ruleMap[fieldId];
      // Geen rule = altijd zichtbaar
      if (ruleName === undefined) return true;
      return visibility.evaluate(ruleName);
    })
    .map(({ fieldId }) => fieldId);
}

// ─── Helpers voor FSO mock ───────────────────────────────────────────
function createFSO(setupOverrides: Record<string, unknown>): FormStateOrchestrator {
  const state = createMockState({
    data: { setup: setupOverrides },
  });

  // FSO constructor: getState callback + dispatch
  const getState = () => state;
  const noopDispatch = jest.fn();

  return new FormStateOrchestrator(getState, noopDispatch);
}

// ═════════════════════════════════════════════════════════════════════
// CONTRACT TESTS
// ═════════════════════════════════════════════════════════════════════
describe('CONTRACT: setupHousehold section visibility', () => {
  const { fields } = setupHouseholdConfig;

  it('toont ALLE velden wanneer aantalMensen=3, aantalVolwassen=1', () => {
    const fso = createFSO({ aantalMensen: 3, aantalVolwassen: 1 });
    const visibility = new VisibilityOrchestrator(fso);

    const visible = getVisibleFieldIds(visibility, fields, FIELD_VISIBILITY_MAP);

    // aantalMensen > 0 → aantalVolwassen zichtbaar ✓
    // aantalMensen(3) > aantalVolwassen(1) → kinderenLabel zichtbaar ✓
    expect(visible).toEqual([
      'aantalMensen',
      'aantalVolwassen',
      'kinderenLabel',
      'postcode',
      'autoCount',
      'heeftHuisdieren',
    ]);
  });

  it('verbergt kinderenLabel wanneer aantalMensen === aantalVolwassen', () => {
    const fso = createFSO({ aantalMensen: 2, aantalVolwassen: 2 });
    const visibility = new VisibilityOrchestrator(fso);

    const visible = getVisibleFieldIds(visibility, fields, FIELD_VISIBILITY_MAP);

    // aantalMensen(2) > aantalVolwassen(2) is FALSE → kinderenLabel verborgen
    expect(visible).not.toContain('kinderenLabel');
    expect(visible).toContain('aantalVolwassen');
  });

  it('verbergt aantalVolwassen EN kinderenLabel wanneer aantalMensen=0', () => {
    const fso = createFSO({ aantalMensen: 0, aantalVolwassen: 0 });
    const visibility = new VisibilityOrchestrator(fso);

    const visible = getVisibleFieldIds(visibility, fields, FIELD_VISIBILITY_MAP);

    // aantalMensen=0 → isAdultInputVisible false → aantalVolwassen verborgen
    // aantalMensen(0) > aantalVolwassen(0) false → kinderenLabel verborgen
    expect(visible).toEqual([
      'aantalMensen',
      'postcode',
      'autoCount',
      'heeftHuisdieren',
    ]);
  });

  it('alleenstaande: aantalMensen=1, aantalVolwassen=1 → geen kinderenLabel', () => {
    const fso = createFSO({ aantalMensen: 1, aantalVolwassen: 1 });
    const visibility = new VisibilityOrchestrator(fso);

    const visible = getVisibleFieldIds(visibility, fields, FIELD_VISIBILITY_MAP);

    expect(visible).toContain('aantalMensen');
    expect(visible).toContain('aantalVolwassen'); // 1 > 0 = true
    expect(visible).not.toContain('kinderenLabel'); // 1 > 1 = false
  });

  // ─── Guard: config-integriteit ───────────────────────────────────
  it('alle fieldIds in config hebben een entry in de visibility map', () => {
    const configIds = fields.map(f => f.fieldId);
    const mapIds = Object.keys(FIELD_VISIBILITY_MAP);

    expect(mapIds).toEqual(expect.arrayContaining(configIds));
  });
});