/**
 * @file_intent Integratietest voor stijlresolutie in entry.mappers.ts.
 *
 * @module ui/entries
 *
 * @remarks
 * ## Scope
 * Valideert dat alle mapper-fallback-sleutels **werkelijk bestaan** in het geassembleerde
 * `AppStyles`-object. In tegenstelling tot `entry.mappers.test.ts` wordt `toStyleRule`
 * hier NIET gemockt — de volledige keten van `RenderEntryVM → mapper → toStyleRule →
 * AppStyles[fallbackKey]` wordt uitgevoerd.
 *
 * ## Waarom deze tests noodzakelijk zijn
 * De unit-tests in `entry.mappers.test.ts` mocken `toStyleRule` en `resolveContainerStyle`
 * volledig weg. Dit betekent dat een niet-bestaande fallback-sleutel (zoals het historische
 * `'inputContainer'`) nooit door de unit-testsuite werd gevangen — hij leverde altijd `{}`
 * terug zonder fout. Deze integratietest sluit dat gat.
 *
 * ## Wat getest wordt
 * 1. Alle form-mappers leveren een non-lege `containerStyle` (bewijs dat `'entryContainer'` bestaat)
 * 2. `toActionViewModel` levert een non-lege `containerStyle` voor primary intent
 * 3. `toActionViewModel` levert een non-lege `containerStyle` voor destructive intent
 * 4. `toActionViewModel` levert een non-lege `containerStyle` voor secondary intent
 * 5. De destructive variant heeft een andere containerStyle dan primary (visueel onderscheid)
 *
 * ## Toevoeging van nieuwe primitives
 * Bij het toevoegen van een nieuwe mapper: voeg ook hier een test toe die verifieert
 * dat de fallback-sleutel bestaat in `AppStyles`.
 *
 * @architectural_layer UI (test) — raakt StyleSheet.create niet aan; test enkel de
 *   logica van `toStyleRule` + de aanwezigheid van AppStyles-sleutels.
 */
import { getAppStyles } from '@ui/styles/useAppStyles';
import {
  toCurrencyViewModel,
  toDateViewModel,
  toTextViewModel,
  toNumberViewModel,
  toCounterViewModel,
  toToggleViewModel,
  toChipGroupViewModel,
  toRadioViewModel,
  toLabelViewModel,
  toActionViewModel,
} from './entry.mappers';
import { PRIMITIVE_TYPES } from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const styles = getAppStyles('light');
const stylesDark = getAppStyles('dark');

/**
 * Basis RenderEntryVM met string-waarden voor style en childStyle.
 * String-input triggert de fallback-logica in toStyleRule (padlijn voor integratietest).
 * Object-input zou de fallback overslaan — dat testen we hier bewust NIET.
 */
const baseEntry: RenderEntryVM = {
  entryId: 'test',
  fieldId: 'test',
  label: 'Test',
  primitiveType: PRIMITIVE_TYPES.TEXT,
  value: '',
  isVisible: true,
  options: undefined,
  optionsKey: undefined,
  placeholder: undefined,
  // Strings triggeren fallback-resolutie — dit is de kritieke pad voor integratietest
  style:      'entry:test',
  childStyle: 'primitive:text',
  onChange: jest.fn(),
};

jest.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: any) => styles,
  },
  Platform: {
    select: (obj: any) => obj.ios || obj.android || {},
    OS: 'ios',
  },
}));

/** Controleert dat een stijlobject niet leeg is (fallback-sleutel bestaat in AppStyles). */
function expectNonEmpty(style: object, label: string): void {
  expect(Object.keys(style).length).toBeGreaterThan(0);
  // Jest's eigen error message is al duidelijk genoeg:
  // "Expected: > 0, Received: 0"
}

// ─── Form primitives ───────────────────────────────────────────────────────────

describe('Stijlresolutie — fallback-sleutels bestaan in AppStyles (light thema)', () => {
  describe('Form primitives: containerStyle moet non-leeg zijn via entryContainer fallback', () => {
    it('toCurrencyViewModel: containerStyle is non-leeg', () => {
      const vm = toCurrencyViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.CURRENCY, childStyle: 'primitive:currency' },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toCurrencyViewModel');
    });

    it('toDateViewModel: containerStyle is non-leeg', () => {
      const vm = toDateViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.DATE, childStyle: 'primitive:date' },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toDateViewModel');
    });

    it('toTextViewModel: containerStyle is non-leeg', () => {
      const vm = toTextViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.TEXT, childStyle: 'primitive:text' },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toTextViewModel');
    });

    it('toNumberViewModel: containerStyle is non-leeg', () => {
      const vm = toNumberViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.NUMBER, childStyle: 'primitive:number' },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toNumberViewModel');
    });

    it('toCounterViewModel: containerStyle is non-leeg', () => {
      const vm = toCounterViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.COUNTER, childStyle: 'primitive:counter', value: 1 },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toCounterViewModel');
    });

    it('toToggleViewModel: containerStyle is non-leeg', () => {
      const vm = toToggleViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.TOGGLE, childStyle: 'primitive:toggle', value: false },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toToggleViewModel');
    });

    it('toChipGroupViewModel: containerStyle is non-leeg', () => {
      const vm = toChipGroupViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.CHIP_GROUP, childStyle: 'primitive:chip-group', options: ['A', 'B'] },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toChipGroupViewModel');
    });

    it('toRadioViewModel: containerStyle is non-leeg', () => {
      const vm = toRadioViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.RADIO, childStyle: 'primitive:radio', options: ['A', 'B'] },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toRadioViewModel');
    });

    it('toLabelViewModel: containerStyle is non-leeg', () => {
      const vm = toLabelViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.LABEL, childStyle: 'primitive:label', value: 'tekst' },
        styles
      );
      expectNonEmpty(vm.containerStyle as object, 'toLabelViewModel');
    });
  });

  // ─── ACTION primitives ──────────────────────────────────────────────────────

  describe('ACTION primitive: variant-stijlen bestaan in AppStyles', () => {
    const actionBase: RenderEntryVM = {
      ...baseEntry,
      primitiveType: PRIMITIVE_TYPES.ACTION,
      childStyle: 'primitive:action',
    };

    it('primary intent (default): containerStyle is non-leeg via actionButton', () => {
      const vm = toActionViewModel(actionBase, styles);
      expectNonEmpty(vm.containerStyle as object, 'toActionViewModel[primary]');
    });

    it('secondary intent: containerStyle is non-leeg via actionButtonSecondary', () => {
      const vm = toActionViewModel({ ...actionBase, styleIntent: 'secondary' }, styles);
      expectNonEmpty(vm.containerStyle as object, 'toActionViewModel[secondary]');
    });

    it('neutral intent: containerStyle is non-leeg via actionButton', () => {
      const vm = toActionViewModel({ ...actionBase, styleIntent: 'neutral' }, styles);
      expectNonEmpty(vm.containerStyle as object, 'toActionViewModel[neutral]');
    });

    it('destructive intent: containerStyle is non-leeg via actionButtonDestructive', () => {
      const vm = toActionViewModel({ ...actionBase, styleIntent: 'destructive' }, styles);
      expectNonEmpty(vm.containerStyle as object, 'toActionViewModel[destructive]');
    });

    it('destructive containerStyle verschilt van primary (visueel onderscheid gegarandeerd)', () => {
      const primary     = toActionViewModel(actionBase, styles);
      const destructive = toActionViewModel({ ...actionBase, styleIntent: 'destructive' }, styles);

      // De achtergrondkleur moet verschillen — primair = c.primary, destructief = c.error
      expect(primary.containerStyle).not.toEqual(destructive.containerStyle);
    });

    it('secondary containerStyle verschilt van primary', () => {
      const primary   = toActionViewModel(actionBase, styles);
      const secondary = toActionViewModel({ ...actionBase, styleIntent: 'secondary' }, styles);

      expect(primary.containerStyle).not.toEqual(secondary.containerStyle);
    });
  });

  // ─── Dark thema ──────────────────────────────────────────────────────────────

  describe('Dark thema: dezelfde fallback-sleutels bestaan ook in dark AppStyles', () => {
    it('toCurrencyViewModel (dark): containerStyle is non-leeg', () => {
      const vm = toCurrencyViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.CURRENCY, childStyle: 'primitive:currency' },
        stylesDark
      );
      expectNonEmpty(vm.containerStyle as object, 'toCurrencyViewModel[dark]');
    });

    it('toActionViewModel destructive (dark): containerStyle is non-leeg', () => {
      const vm = toActionViewModel(
        { ...baseEntry, primitiveType: PRIMITIVE_TYPES.ACTION, childStyle: 'primitive:action', styleIntent: 'destructive' },
        stylesDark
      );
      expectNonEmpty(vm.containerStyle as object, 'toActionViewModel[destructive][dark]');
    });
  });
});
