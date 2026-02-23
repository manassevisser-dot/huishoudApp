/**
 * @file_intent Definieert het contract voor de UIOrchestrator.
 * @repo_architecture Application Layer - Orchestrator Interface.
 */

/**
 * Een placeholder type voor het view model van een scherm. 
 * In een echte applicatie zou dit een veel specifiekere structuur hebben.
 */
export type ScreenViewModel = object; // Vervang 'object' door een specifiekere interface als die beschikbaar is.

export interface IUIOrchestrator {
  /**
   * Bouwt een compleet en gestyled screen view model op basis van een screenId.
   * @param screenId De identifier van het scherm om op te bouwen.
   * @returns Een volledig geconstrueerd view model voor het scherm.
   */
  buildScreen(screenId: string): ScreenViewModel;
}
