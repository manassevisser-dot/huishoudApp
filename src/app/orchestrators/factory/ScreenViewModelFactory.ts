// src/app/factories/ScreenViewModelFactory.ts
/**
 * @file_intent Pure structural factory die de hiërarchische ScreenViewModel opbouwt op basis van statische registry-definities.
 * @repo_architecture Mobile Industry (MI) - Presentation Factory Layer.
 * @term_definition assertFound = Utility die runtime garandeert dat een gevraagd UI-onderdeel daadwerkelijk in de registries bestaat. EntryViewModel = De kleinste bouwsteen (veld) binnen een sectie.
 * @contract Stateless transformatie van Domain Registries naar UI-vriendelijke ViewModels. Deze factory mag GEEN state-logica, zichtbaarheidsregels (pruning) of stijlen toepassen; het levert enkel de ruwe blauwdruk.
 * @ai_instruction De factory volgt strikt de hiërarchie: Screen -> Section -> Entry. Bij het toevoegen van nieuwe UI-componenten moet de mapping hier worden uitgebreid, maar de business logica blijft in de orchestrators.
 */

import { ScreenRegistry } from '@domain/registry/ScreenRegistry';
import { SectionRegistry } from '@domain/registry/SectionRegistry';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { PrimitiveRegistry, type PrimitiveType } from '@domain/registry/PrimitiveRegistry';

// === VM-typen die de renderer verderop gebruikt ===
// (Gebruik jouw bestaande VM-interfaces; dit is de vorm waarop deze factory schrijft.)
export interface ScreenViewModel {
  screenId: string;
  titleToken: string;
  type: string; // 'AUTH' | 'WIZARD' | 'APP_STATIC' | 'SYSTEM'
  sections: SectionViewModel[];
  navigation: { next?: string; previous?: string };
}

export interface SectionViewModel {
  sectionId: string;
  titleToken: string; // afkomstig van Section.labelToken
  layout: 'list' | 'grid' | 'card' | 'stepper';
  uiModel?: 'numericWrapper' | 'collapsible' | 'swipeable' | 'readonly';
  children: EntryViewModel[];
}

export interface PrimitiveViewModel {
  entryId: string;
  primitiveType: PrimitiveType; // bv. 'currency' | 'text' | 'radio' | ...
  styleKey?: string;            // later in StyleFactory te vullen
}

export interface EntryViewModel {
  entryId: string;
  labelToken: string;
  placeholderToken?: string;
  options?: readonly string[];
  optionsKey?: string;
  visibilityRuleName?: string; // NIET evalueren hier (MO/Visibility doet dat)
  child: PrimitiveViewModel;   // lichte primitive-VM
}

function assertFound<T>(value: T | null | undefined, what: string): T {
  if (value == null) throw new Error(`${what} not found`);
  return value;
}

export const ScreenViewModelFactory = {
  build(screenId: string): ScreenViewModel {
    // Screen ophalen (met titleToken, sectionIds, type, nav)
    const screenDef = assertFound(
      ScreenRegistry.getDefinition(screenId),
      `Screen '${screenId}'`,
    );

    const sections: SectionViewModel[] = (screenDef.sectionIds ?? []).map(
      (sectionId: string) => this.buildSection(sectionId),
    );

    return {
      screenId: screenDef.id,
      titleToken: screenDef.titleToken,
      type: screenDef.type,
      sections,
      navigation: {
        next: screenDef.nextScreenId,
        previous: screenDef.previousScreenId,
      },
    };
  },

  buildSection(sectionId: string): SectionViewModel {
    // Section ophalen (met labelToken, fieldIds, layout, uiModel?)
    const sectionDef = assertFound(
      SectionRegistry.getDefinition(sectionId),
      `Section '${sectionId}'`,
    );

    const children: EntryViewModel[] = (sectionDef.fieldIds ?? []).map(
      (entryId: string) => this.buildEntry(entryId),
    );

    return {
      sectionId: sectionDef.id,
      titleToken: sectionDef.labelToken,
      layout: sectionDef.layout,
      uiModel: sectionDef.uiModel,
      children,
    };
  },

  buildEntry(entryId: string): EntryViewModel {
    // Entry ophalen (labelToken, placeholderToken?, primitiveType, options?, optionsKey?, visibilityRuleName?)
    const entryDef = assertFound(
      EntryRegistry.getDefinition(entryId),
      `Entry '${entryId}'`,
    );

    // Validatie: primitive type moet bestaan in PrimitiveRegistry
    const primitiveType = entryDef.primitiveType as PrimitiveType;
    const primitiveMeta = PrimitiveRegistry.getDefinition(primitiveType);
    if (primitiveMeta == null) {
      throw new Error(`Primitive type '${primitiveType}' not registered`);
    }

    // NB: we evalueren niets — alleen dóórgeven wat later nodig is
    return {
      entryId,
      labelToken: entryDef.labelToken,
      placeholderToken: entryDef.placeholderToken,
      options: entryDef.options,
      optionsKey: entryDef.optionsKey,
      visibilityRuleName: entryDef.visibilityRuleName,
      child: {
        entryId,
        primitiveType,
        // styleKey wordt later door StyleFactory ingevuld
      },
    };
  },
};