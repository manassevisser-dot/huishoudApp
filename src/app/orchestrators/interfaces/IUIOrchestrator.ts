/**
 * Contract voor de UIOrchestrator: assembleert gestylde screen view models.
 *
 * @module app/orchestrators/interfaces
 * @see {@link ./README.md | Interfaces — Details}
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
