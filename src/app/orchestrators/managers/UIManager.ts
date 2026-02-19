import { FormStateOrchestrator } from "@app/orchestrators/FormStateOrchestrator";
import { VisibilityOrchestrator } from "@app/orchestrators/VisibilityOrchestrator";
import { RenderOrchestrator } from "@app/orchestrators/RenderOrchestrator";
import { SectionOrchestrator, SectionViewModel } from "@app/orchestrators/SectionOrchestrator";
import { ScreenRegistry } from "@domain/registry/ScreenRegistry";
import { SectionRegistry } from "@domain/registry/SectionRegistry";
import { EntryRegistry } from "@domain/registry/EntryRegistry";
import { labelFromToken } from "@domain/constants/labelResolver";

import type {
  IUIOrchestrator,
  FieldViewModel,
  ScreenViewModel,
} from "@app/orchestrators/interfaces/IUIOrchestrator";

export class UIManager implements IUIOrchestrator {
  private readonly render: RenderOrchestrator;
  private readonly visibility: VisibilityOrchestrator;
  private readonly sectionOrchestrator: SectionOrchestrator;

  constructor(
    fso: FormStateOrchestrator,
    visibility: VisibilityOrchestrator,
    updateField: (fieldId: string, value: unknown) => void,
  ) {
    this.visibility = visibility;
    this.render = new RenderOrchestrator(fso);
    this.sectionOrchestrator = new SectionOrchestrator(updateField);
  }

  /**
   * Het Totaalpakket: Bouwt de volledige hiërarchie op basis van ScreenRegistry.
   */
  public buildScreen(screenId: string): ScreenViewModel | null {
    const screenDef = ScreenRegistry.getDefinition(screenId);
    if (screenDef == null) return null;

    const sections = screenDef.sectionIds
      .map((compId) => this.buildSection(compId))
      .filter((c): c is SectionViewModel => c !== null);

    return {
      screenId: screenDef.id,
      title: labelFromToken(screenDef.titleToken),
      type: screenDef.type,
      sections,
      navigation: {
        next: screenDef.nextScreenId,
        previous: screenDef.previousScreenId,
      },
    };
  }

  /**
   * Directe toegang tot een FieldViewModel (bijv. voor losse renders).
   */
  public buildFieldViewModel(fieldId: string): FieldViewModel | null {
    const vm = this.render.buildFieldViewModel(fieldId);
    if (vm == null) return null;

    const ruleName = vm.visibilityRuleName;
    if (ruleName != null && ruleName !== "") {
      const ok = this.visibility.evaluate(ruleName);
      if (ok !== true) return null;
    }

    return vm;
  }

  // --- helpers ---

  private buildSection(compId: string): SectionViewModel | null {
    const compDef = SectionRegistry.getDefinition(compId);
    if (compDef == null) return null;

    const activefieldIds = compDef.fieldIds.filter((fId) => {
      const entryDef = EntryRegistry.getDefinition(fId);
      if (entryDef == null) return true;

      
const ruleName = entryDef.visibilityRuleName;
if (ruleName == null) return true;

const result = this.visibility.evaluate(ruleName);
return result === true;

    });

    return this.sectionOrchestrator.prepareSection({
      instanceId: compId,
      sectionId: compId,
      dataContext: {}, // Data context wordt (nu) niet gebruikt; kan later gevuld worden
      activefieldIds,
    });
  }
}