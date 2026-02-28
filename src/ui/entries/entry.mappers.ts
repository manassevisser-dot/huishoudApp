/**
 * Pure mapper-functies die een `RenderEntryVM` omzetten naar een getypt PrimitiveViewModel.
 *
 * @module ui/entries
 * @see {@link ./README.md | Entries — Details}
 *
 * @remarks
 * Elke mapper ontvangt `styles: AppStyles` als tweede argument. Stijlresolutie verloopt
 * via de centrale `PRIMITIVE_STYLE_CONFIG`-tabel en de `resolveContainerStyle`-helper —
 * geen mapper hard-codeert nog een fallback-sleutel of bron-keuze.
 *
 * ## Stijlresolutie in drie stappen
 * 1. `PRIMITIVE_STYLE_CONFIG[primitiveType]` bepaalt welke RenderEntryVM-prop als bron dient
 *    (`childStyle` voor primitives, `style` voor entry-wrappers).
 * 2. `resolveContainerStyle` roept `toStyleRule` aan met de juiste bron en fallback.
 * 3. Voor ACTION-primitives bepaalt `ACTION_STYLE_MAP[entry.styleIntent]` de fallback-sleutel,
 *    zodat destructieve acties een visueel onderscheiden rode knop krijgen.
 *
 * ## Architecturele grens
 * Variant-logica (welke kleur heeft een destructieve knop?) hoort in dit bestand, niet in
 * de UI-component. De component (`ButtonPrimitive`) consumeert altijd één `containerStyle`
 * zonder te weten welke variant het is. De mapper is de enige plek waar intentie wordt
 * vertaald naar stijl.
 */
import { PRIMITIVE_TYPES } from '@ui/kernel';
import type {
  CurrencyViewModel,
  DateViewModel,
  TextViewModel,
  NumberViewModel,
  CounterViewModel,
  ToggleViewModel,
  ChipGroupViewModel,
  RadioViewModel,
  LabelViewModel,
  ActionViewModel,
} from '@ui/kernel';
import type { RenderEntryVM } from '@app/orchestrators/MasterOrchestrator';
import type { AppStyles } from '@ui/styles/useAppStyles';
import type { StyleIntent } from '@ui/kernel';
import {
  getEmptyStyle,
  toStyleRule,
  toStringValue,
  toNumberValue,
  toBooleanValue,
  toBaseViewModel,
  resolveContainerStyle,
  type PrimitiveStyleConfig,
} from './entry.helpers';

// ─── Centrale stijlconfiguratie ──────────────────────────────────────────────

/**
 * Centrale stijlconfiguratie per primitiveType.
 *
 * @remarks
 * Elke entry beschrijft:
 * - `containerSource`: welke `RenderEntryVM`-prop als stijlinput dient
 *   (`'childStyle'` = primitive-niveau, `'style'` = entry-wrapper-niveau)
 * - `containerFallback`: de `AppStyles`-sleutel als fallback
 * - `labelSource` / `labelFallback`: zelfde principe voor de label-stijl
 *
 * Fallback-sleutels zijn getypeerd als `string` (niet `string & keyof AppStyles`): zie
 * `PrimitiveStyleConfig` in `entry.helpers.ts` voor de motivering. De garantie dat
 * sleutels werkelijk bestaan in `AppStyles` wordt afgedwongen door
 * `entry.style-resolution.integration.test.ts`.
 *
 * @architectural_layer UI — enkel gelezen door mappers in dit bestand
 */
const PRIMITIVE_STYLE_CONFIG: Record<string, PrimitiveStyleConfig> = {
  [PRIMITIVE_TYPES.CURRENCY]:          { containerSource: 'childStyle', containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.DATE]:              { containerSource: 'childStyle', containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.TEXT]:              { containerSource: 'childStyle', containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.NUMBER]:            { containerSource: 'childStyle', containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.COUNTER]:           { containerSource: 'childStyle', containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.TOGGLE]:            { containerSource: 'childStyle', containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.CHIP_GROUP]:        { containerSource: 'style',      containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE]: { containerSource: 'style',    containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.RADIO]:             { containerSource: 'style',      containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  [PRIMITIVE_TYPES.LABEL]:             { containerSource: 'style',      containerFallback: 'entryContainer', labelSource: 'style', labelFallback: 'entryLabel' },
  // ACTION gebruikt een aparte variant-lookup via ACTION_STYLE_MAP — zie toActionViewModel
  [PRIMITIVE_TYPES.ACTION]:            { containerSource: 'childStyle', containerFallback: 'actionButton' },
};

/**
 * Variant-naar-stijlsleutel mapping voor ACTION primitives.
 *
 * @remarks
 * De `StyleIntent` wordt ingesteld in `EntryRegistry` (domeinlaag) en door-ge-thread via
 * `RenderEntryVM.styleIntent` (orchestrator-laag). De mapper leest de intentie en kiest
 * de bijbehorende `AppStyles`-sleutel. Dit is de **enige plek** in de codebase waar
 * intentie wordt vertaald naar een concrete stijlsleutel.
 *
 * Architecturele reden: de `ButtonPrimitive`-component consumeert één `containerStyle`
 * zonder te weten welke variant het is. Variant-logica in de component zou betekenen
 * dat de UI beslist over domein-intentie — een DDD-schending.
 *
 * Fallback: als `styleIntent` ontbreekt of onbekend is, wordt `'actionButton'`
 * (de primaire variant) gebruikt.
 *
 * @architectural_layer UI — enkel gelezen door `toActionViewModel`
 */
// Bewust getypeerd als `string` (niet `string & keyof AppStyles`): zie PrimitiveStyleConfig
// en toStyleRule voor de motivering. Sleutel-validatie via integratietest.
const ACTION_STYLE_MAP: Partial<Record<StyleIntent, string>> = {
  primary:     'actionButton',
  secondary:   'actionButtonSecondary',
  neutral:     'actionButton',
  destructive: 'actionButtonDestructive',
};

// ─── Mapper-functies ─────────────────────────────────────────────────────────

/**
 * Mapt een `RenderEntryVM` naar een `CurrencyViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[CURRENCY]`:
 * - `containerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 * - `labelStyle`     ← `entry.style`,      fallback `'entryLabel'`
 */
export const toCurrencyViewModel = (entry: RenderEntryVM, styles: AppStyles): CurrencyViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.CURRENCY];
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.CURRENCY),
    label: entry.label,
    value: toStringValue(entry.value),
    placeholder: entry.placeholder,
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    onCurrencyChange: (value: string) => entry.onChange(value),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `DateViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[DATE]`:
 * - `containerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 * - `labelStyle`     ← `entry.style`,      fallback `'entryLabel'`
 */
export const toDateViewModel = (entry: RenderEntryVM, styles: AppStyles): DateViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.DATE];
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.DATE),
    label: entry.label,
    value: toStringValue(entry.value),
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    onDateChange: (value: string) => entry.onChange(value),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `TextViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[TEXT]`:
 * - `containerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 * - `labelStyle`     ← `entry.style`,      fallback `'entryLabel'`
 */
export const toTextViewModel = (entry: RenderEntryVM, styles: AppStyles): TextViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.TEXT];
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.TEXT),
    label: entry.label,
    value: toStringValue(entry.value),
    placeholder: entry.placeholder,
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    onTextChange: (value: string) => entry.onChange(value),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `NumberViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[NUMBER]`:
 * - `containerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 * - `labelStyle`     ← `entry.style`,      fallback `'entryLabel'`
 */
export const toNumberViewModel = (entry: RenderEntryVM, styles: AppStyles): NumberViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.NUMBER];
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.NUMBER),
    label: entry.label,
    value: toStringValue(entry.value),
    placeholder: entry.placeholder,
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    onNumberChange: (value: string) => entry.onChange(value),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `CounterViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[COUNTER]`:
 * - `containerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 * - `labelStyle`     ← `entry.style`,      fallback `'entryLabel'`
 */
export const toCounterViewModel = (entry: RenderEntryVM, styles: AppStyles): CounterViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.COUNTER];
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.COUNTER),
    label: entry.label,
    value: toNumberValue(entry.value),
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    onCounterChange: (value: number) => entry.onChange(value),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `ToggleViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[TOGGLE]`:
 * - `containerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 * - `labelStyle`     ← `entry.style`,      fallback `'entryLabel'`
 */
export const toToggleViewModel = (entry: RenderEntryVM, styles: AppStyles): ToggleViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.TOGGLE];
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.TOGGLE),
    label: entry.label,
    value: toBooleanValue(entry.value),
    labelTrue: 'Ja',
    labelFalse: 'Nee',
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    onToggle: (value: boolean) => entry.onChange(value),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `ChipGroupViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[CHIP_GROUP]`:
 * - `containerStyle`     ← `entry.style`,      fallback `'entryContainer'`
 * - `labelStyle`         ← `entry.style`,      fallback `'entryLabel'`
 * - `chipContainerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 *   (chip-niveau styling: elk chip-item gebruikt childStyle als bron)
 */
export const toChipGroupViewModel = (entry: RenderEntryVM, styles: AppStyles): ChipGroupViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.CHIP_GROUP];
  const selected = toStringValue(entry.value);
  const options = entry.options ?? [];
  const empty = getEmptyStyle();

  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.CHIP_GROUP),
    label: entry.label,
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    chipContainerStyle: toStyleRule(entry.childStyle, styles, 'entryContainer'),
    chips: options.map((option) => {
      const isSelected = option === selected;
      return {
        label: option,
        selected: isSelected,
        containerStyle: empty,
        textStyle: empty,
        onPress: () => entry.onChange(option),
        accessibilityLabel: option,
        accessibilityState: { selected: isSelected },
      };
    }),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `RadioViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[RADIO]`:
 * - `containerStyle`      ← `entry.style`,      fallback `'entryContainer'`
 * - `labelStyle`          ← `entry.style`,      fallback `'entryLabel'`
 * - `radioContainerStyle` ← `entry.childStyle`, fallback `'entryContainer'`
 *   (radio-item-niveau styling)
 */
export const toRadioViewModel = (entry: RenderEntryVM, styles: AppStyles): RadioViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.RADIO];
  const selected = toStringValue(entry.value);
  const options = entry.options ?? [];

  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.RADIO),
    label: entry.label,
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    radioContainerStyle: toStyleRule(entry.childStyle, styles, 'entryContainer'),
    options: options.map((option) => ({
      label: option,
      value: option,
      selected: option === selected,
      onSelect: () => entry.onChange(option),
    })),
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `ActionViewModel`.
 *
 * @remarks
 * Stijlresolutie via `ACTION_STYLE_MAP[entry.styleIntent]`:
 * - `containerStyle` ← `entry.childStyle`, fallback bepaald door `styleIntent`
 *
 * De `styleIntent` wordt ingesteld in `EntryRegistry` (domeinlaag) en door-ge-thread
 * via `RenderEntryVM`. De mapper vertaalt die intentie naar een concrete `AppStyles`-sleutel.
 * De `ButtonPrimitive`-component zelf heeft **geen kennis van varianten** — hij consumeert
 * altijd één `containerStyle`. Dit is een bewuste DDD-grens: intentie-vertaling hoort
 * in de mapper, niet in de component.
 *
 * | styleIntent   | AppStyles-sleutel       | Visueel resultaat                |
 * |---------------|-------------------------|----------------------------------|
 * | `'primary'`   | `'actionButton'`        | Primaire kleur (blauw/brandkleur)|
 * | `'secondary'` | `'actionButtonSecondary'`| Secundaire kleur (grijs)         |
 * | `'neutral'`   | `'actionButton'`        | Zelfde als primary               |
 * | `'destructive'`| `'actionButtonDestructive'`| Error-kleur (rood)            |
 * | `undefined`   | `'actionButton'`        | Primaire kleur (safe default)    |
 */
export const toActionViewModel = (entry: RenderEntryVM, styles: AppStyles): ActionViewModel => {
  const intent = (entry.styleIntent as StyleIntent | undefined) ?? 'primary';
  const fallbackKey = ACTION_STYLE_MAP[intent] ?? 'actionButton';
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.ACTION),
    label: entry.label,
    containerStyle: toStyleRule(entry.childStyle, styles, fallbackKey),
    onPress: () => { entry.onChange(null); },
  };
};

/**
 * Mapt een `RenderEntryVM` naar een `LabelViewModel`.
 *
 * @remarks
 * Stijlresolutie via `PRIMITIVE_STYLE_CONFIG[LABEL]`:
 * - `containerStyle` ← `entry.style`,      fallback `'entryContainer'`
 * - `labelStyle`     ← `entry.style`,      fallback `'entryLabel'`
 * - `valueStyle`     ← `entry.childStyle`, fallback `'entryLabel'`
 *   (de waarde-tekst gebruikt childStyle als bron, afwijkend van andere label-stijlen)
 */
export const toLabelViewModel = (entry: RenderEntryVM, styles: AppStyles): LabelViewModel => {
  const config = PRIMITIVE_STYLE_CONFIG[PRIMITIVE_TYPES.LABEL];
  return {
    ...toBaseViewModel(entry, PRIMITIVE_TYPES.LABEL),
    label: entry.label,
    value: toStringValue(entry.value),
    containerStyle: resolveContainerStyle(entry, styles, config),
    labelStyle: toStyleRule(entry.style, styles, config.labelFallback),
    valueStyle: toStyleRule(entry.childStyle, styles, 'entryLabel'),
  };
};
