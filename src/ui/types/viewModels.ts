/**
 * @file_intent Dient als een "barrel"-bestand dat alle `ViewModel`-types uit de `@domain`-laag verzamelt en opnieuw exporteert. Het hoofddoel is om een enkel, stabiel en handig import-pad te bieden voor alle UI-componenten, waardoor de noodzaak om diep in de `@domain`-laag te importeren wordt weggenomen.
 * @repo_architecture UI Layer - Type Definition Facade. Dit bestand implementeert het "Facade"-patroon voor types. Het biedt een vereenvoudigde, uniforme interface (`@ui/types/viewModels`) voor een complexer subsysteem (de vele `ViewModel`-types die in `@domain/registry/PrimitiveRegistry` zijn gedefinieerd).
 * @term_definition
 *   - `Barrel File`: Een bestand dat primair tot doel heeft om exports uit andere modules te groeperen en opnieuw te exporteren, om zo het importproces voor consumenten te vereenvoudigen.
 *   - `Re-export`: De techniek van het importeren van een type of functie om deze vervolgens direct weer te exporteren. Dit is de kernfunctionaliteit van dit bestand.
 *   - `ViewModel`: Een datastructuur die specifiek is ontworpen en voorbereid (in de domain/core-laag) voor weergave in de UI.
 *   - `UIFieldViewModel`: Een UI-laag-specifieke alias voor de `PrimitiveViewModel` union-type uit het domein. Deze alias benadrukt dat dit de universele `ViewModel` is voor elk veld-component in de UI.
 * @contract Dit bestand exporteert alle individuele `ViewModel`-types uit de `PrimitiveRegistry`. Het definieert zelf geen nieuwe types, maar creëert wel de `UIFieldViewModel`-alias. Elke `ViewModel` die in het domein wordt gedefinieerd, moet hier opnieuw worden geëxporteerd om beschikbaar te zijn voor de UI-laag.
 * @ai_instruction Wanneer een UI-component een `ViewModel`-type nodig heeft (zoals `TextViewModel` of `ChipGroupViewModel`), importeer deze dan altijd vanuit dit bestand (`@ui/types/viewModels.ts`) en niet rechtstreeks uit de `@domain`-laag. Dit houdt de architectuur zuiver en maakt toekomstige refactoring eenvoudiger. Nieuwe `ViewModel`-types moeten worden gedefinieerd in `@domain/registry/PrimitiveRegistry` en vervolgens hier opnieuw worden geëxporteerd.
 */
// src/ui/types/viewModels.ts

export type {
    // ──────────── BASE ────────────
    PrimitiveStyleRule,
    PrimitiveType,
    BasePrimitiveViewModel, // Dit is de echte naam uit de grep
    PrimitiveViewModel,     // De union type
  
    // ──────────── CONCRETE VIEW MODELS ────────────
    CounterViewModel,
    CurrencyViewModel,
    TextViewModel,
    NumberViewModel,
  
    // ──────────── CHIP GROUP ────────────
    ChipViewModel,
    ChipGroupViewModel,
  
    // ──────────── RADIO ────────────
    RadioOptionViewModel,
    RadioViewModel,
    // ──────────── TOGGLE ────────────
    ToggleViewModel,
    // ──────────── LABEL ────────────
    LabelViewModel,
  
    // ──────────── DATE ────────────
    DateViewModel,
  
    // ──────────── METADATA ────────────
    PrimitiveMetadata,
} from '@domain/registry/PrimitiveRegistry';
  
/**
 * UI-utility type:
 * We gebruiken PrimitiveViewModel (de union uit het domein)
 * als onze universele FieldViewModel.
 */
import type { PrimitiveViewModel as DomainUnion } from '@domain/registry/PrimitiveRegistry';
export type UIFieldViewModel = DomainUnion;

/**
 * ──────────── UI-LAYER SPECIFIC TYPES (geen domain imports) ────────────
 * Deze types beschrijven de structuur van ViewModels zoals die door de
 * orchestrator-laag worden gegenereerd voor de UI-renderer.
 */

/**
 * Een primaire ViewModel - de basis-bouwsteen van een UI-element.
 * Dit is de lightweight versie zonder stijling.
 */
export interface UIPrimitiveViewModel {
  entryId: string;
  primitiveType: string; // bv. 'currency' | 'text' | 'radio' | ...
  styleKey?: string;
}

/**
 * Een entry ViewModel - representeert een invoerveld met optionele label en primitive child.
 */
export interface UIEntryViewModel {
  entryId: string;
  labelToken: string;
  placeholderToken?: string;
  options?: readonly string[];
  optionsKey?: string;
  visibilityRuleName?: string;
  child: UIPrimitiveViewModel;
}

/**
 * Een sectie ViewModel - groepering van gerelateerde entries met layout/styling.
 */
export interface UISectionViewModel {
  sectionId: string;
  titleToken: string;
  layout: 'list' | 'grid' | 'card' | 'stepper';
  uiModel?: 'numericWrapper' | 'collapsible' | 'swipeable' | 'readonly';
  children: UIEntryViewModel[];
}

/**
 * Een scherm ViewModel - de top-level structuur met navigatie.
 */
export interface UIScreenViewModel {
  screenId: string;
  titleToken: string;
  type: string; // 'AUTH' | 'WIZARD' | 'APP_STATIC' | 'SYSTEM'
  sections: UISectionViewModel[];
  navigation: {
    next?: string;
    previous?: string;
  };
}