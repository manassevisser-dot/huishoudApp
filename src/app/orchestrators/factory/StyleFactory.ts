// src/app/factories/ScreenStyleFactory.ts
/**
 * @file_intent Verantwoordelijk voor het injecteren van stijl-objecten in een bestaand ScreenViewModel op basis van een StyleRegistry.
 * @repo_architecture Mobile Industry (MI) - Presentation Decorator Layer.
 * @term_definition StyleKeyStrategy = De logica die bepaalt welke registry-key (bijv. screen.type of primitiveType) wordt gebruikt om de juiste stijl op te zoeken. StyledVM = Een uitgebreide versie van het ViewModel die visuele metadata (StyleObject) bevat voor de renderer.
 * @contract Pure transformatie: neemt een 'kaal' ViewModel en geeft een 'styled' ViewModel terug. Het voert geen domeinlogica of zichtbaarheidschecks uit, maar fungeert puur als een bridge tussen de UI-registries en visuele definities.
 * @ai_instruction Maakt gebruik van een resolver-patroon om ontkoppeld te blijven van de feitelijke StyleRegistry. Bij het aanpassen van de styling-strategie (bijv. specifieke stijlen per entryId) moet de StyleKeyStrategy worden uitgebreid.
 */

import type {
  ScreenViewModel as InScreenVM,
  SectionViewModel as InSectionVM,
  EntryViewModel as InEntryVM,
  PrimitiveViewModel as InPrimitiveVM,
} from '@app/orchestrators/interfaces/IUIOrchestrator';
import type { PrimitiveType } from '@domain/registry/PrimitiveRegistry';

// -------- Styled-Versies (voegen alleen 'style?' toe) --------
export type StyleObject = unknown; // laat dit je eigen UI-style type zijn (bv. RN Style)

export interface StyledPrimitiveVM extends InPrimitiveVM {
  style?: StyleObject;
}

export interface StyledEntryVM extends InEntryVM {
  style?: StyleObject;
  child: StyledPrimitiveVM;
}

export interface StyledSectionVM extends InSectionVM {
  style?: StyleObject;
  children: StyledEntryVM[];
}

export interface StyledScreenVM extends InScreenVM {
  style?: StyleObject;
  sections: StyledSectionVM[];
}

// -------- Resolver-contracts --------
export interface StyleResolver {
  /** Haal een style op aan de hand van key; return undefined als onbekend */
  getStyle: (styleKey: string) => StyleObject | undefined;
}

export interface StyleKeyStrategy {
  /** Key voor het hele scherm (gebruik bv. type of id) */
  screenKey: (screen: InScreenVM) => string;

  /** Key voor een sectie (gebruik bv. layout/uiModel of id) */
  sectionKey: (section: InSectionVM) => string;

  /** Key voor een entry (gebruik bv. entryId of een conventie) */
  entryKey: (entry: InEntryVM) => string;

  /** Key voor een primitive (bv. primitive:<type>) */
  primitiveKey: (primitive: InPrimitiveVM) => string;
}

// -------- Een goede default key-strategie (af te stemmen op jouw StyleRegistry) --------
// We benutten data die jouw registries leveren: screen.type, section.layout/uiModel, entry.entryId, primitive.primitiveType. [1](https://deconnectie-my.sharepoint.com/personal/manasse_visser_arnhem_nl/Documents/Microsoft%20Copilot%20Chat-bestanden/registry_full_context.txt)
const defaultKeyStrategy: StyleKeyStrategy = {
  screenKey: (screen) => `screen.type:${screen.type}`,
  sectionKey: (sec) =>
    sec.uiModel ? `section.layout:${sec.layout}|ui:${sec.uiModel}` : `section.layout:${sec.layout}`,
  entryKey: (entry) => `entry:${entry.entryId}`,
  primitiveKey: (prim) => `primitive:${prim.primitiveType as PrimitiveType}`,
};

// --------- De StyleFactory zelf ---------
export const ScreenStyleFactory = {
  /**
   * Bind styles aan een bestaand ScreenViewModel.
   * @param svm  - output van je pure ScreenViewModelFactory
   * @param resolver - adapter om jouw StyleRegistry te gebruiken (vereist)
   * @param keys - optionele key-strategie; default gebruikt type/layout/uiModel/primitiveType
   */
  bind(
    svm: InScreenVM,
    resolver: StyleResolver,
    keys: StyleKeyStrategy = defaultKeyStrategy
  ): StyledScreenVM {
    const styleKey = keys.screenKey(svm);
    const screenStyle = resolver.getStyle(styleKey);

    return {
      ...svm,
      style: screenStyle,
      sections: svm.sections.map((sec) => this.bindSection(sec, resolver, keys)),
    };
  },

  private_bindEntry(entry: InEntryVM, resolver: StyleResolver, keys: StyleKeyStrategy): StyledEntryVM {
    const entryStyleKey = keys.entryKey(entry);
    const entryStyle = resolver.getStyle(entryStyleKey);
    const child = this.private_bindPrimitive(entry.child, resolver, keys);
    return {
      ...entry,
      style: entryStyle,
      child,
    };
  },

  private_bindPrimitive(prim: InPrimitiveVM, resolver: StyleResolver, keys: StyleKeyStrategy): StyledPrimitiveVM {
    const primitiveStyleKey = keys.primitiveKey(prim);
    const primitiveStyle = resolver.getStyle(primitiveStyleKey);
    return {
      ...prim,
      style: primitiveStyle,
    };
  },

  bindSection(sec: InSectionVM, resolver: StyleResolver, keys: StyleKeyStrategy): StyledSectionVM {
    const sectionStyleKey = keys.sectionKey(sec);
    const sectionStyle = resolver.getStyle(sectionStyleKey);
    const children = sec.children.map((e) => this.private_bindEntry(e, resolver, keys));
    return {
      ...sec,
      style: sectionStyle,
      children,
    };
  },
};