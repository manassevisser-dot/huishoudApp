// [ORIGINEEL — zie src/app/orchestrators/UIOrchestrator.ts]
// Bewaard als referentie. Niet aanpassen.
import { UIManager } from './managers/UIManager';
import { IUIOrchestrator } from './interfaces/IUIOrchestrator';
import type { StyledScreenVM } from '@app/orchestrators/factory/StyleFactory';

export class UIOrchestrator implements IUIOrchestrator {
  private readonly uiManager: UIManager;

  constructor() {
    this.uiManager = new UIManager();
  }

  buildScreen(screenId: string): StyledScreenVM {
    return this.uiManager.buildScreen(screenId);
  }
}
