// src/ui/types/viewModels.ts

export type {
    // ──────────── BASE ────────────
    ComponentStyleRule,
    ComponentType,
    BaseComponentViewModel, // Dit is de echte naam uit de grep
    ComponentViewModel,     // De union type
  
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
    ComponentMetadata,
} from '@domain/registry/ComponentRegistry';
  
/**
 * UI-utility type:
 * We gebruiken ComponentViewModel (de union uit het domein) 
 * als onze universele FieldViewModel.
 */
import type { ComponentViewModel as DomainUnion } from '@domain/registry/ComponentRegistry';
export type UIFieldViewModel = DomainUnion;