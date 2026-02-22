/**
 * @file_intent Definieert het contract voor de UIOrchestrator.
 * @repo_architecture Application Layer - Orchestrator Interface.
 */
import type { StyledScreenVM } from '@app/orchestrators/factory/StyleFactory';

export interface IUIOrchestrator {
  /**
   * Bouwt een compleet en gestyled screen view model op basis van een screenId.
   * @param screenId De identifier van het scherm om op te bouwen.
   * @returns Een volledig geconstrueerd view model voor het scherm.
   */
  buildScreen(screenId: string): StyledScreenVM;
}
