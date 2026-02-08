// src/app/orchestrators/interfaces/INavigationOrchestrator.ts

export interface INavigationOrchestrator {
    /** * Probeert naar de volgende stap te gaan. 
     * Controleert eerst of de huidige sectie valide is.
     */
    navigateNext(): void;
  
    /** * Gaat terug naar de vorige stap.
     */
    navigateBack(): void;
  
    /** * Geeft aan of de 'Volgende' actie op dit moment toegestaan is.
     * Wordt gebruikt om de knop in de UI te enablen/disablen.
     */
    canNavigateNext(): boolean;
  
    /**
     * Haalt de huidige actieve pagina-ID op (bijv. '1setupHousehold').
     */
    getCurrentPageId(): string;
  }