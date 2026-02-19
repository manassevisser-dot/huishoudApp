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