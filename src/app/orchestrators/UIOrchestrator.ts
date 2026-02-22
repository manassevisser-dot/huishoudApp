/**
 * @file_intent Implementeert de IUIOrchestrator interface en coördineert de UI-bouwlogica.
 * @repo_architecture Application Layer - Orchestrator.
 */
import { UIManager } from './managers/UIManager';
import { IUIOrchestrator } from './interfaces/IUIOrchestrator';
import type { StyledScreenVM } from '@app/orchestrators/factory/StyleFactory';

export class UIOrchestrator implements IUIOrchestrator {
  private readonly uiManager: UIManager;

  /**
   * Initialiseert de UIOrchestrator met een StyleResolver.
   * @param styleResolver De functie die stijlen kan ophalen op basis van een key.
   */
  constructor() {
    this.uiManager = new UIManager();
  }

  /**
   * Delegeert het bouwen van het screen view model naar de UIManager.
   * @param screenId De identifier van het scherm.
   * @returns Het gestylede screen view model.
   */
  buildScreen(screenId: string): StyledScreenVM {
    return this.uiManager.buildScreen(screenId);
  }
}
