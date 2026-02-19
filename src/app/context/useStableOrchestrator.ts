// src/app/context/useStableOrchestrator.ts
/**
 * @file_intent De 'Bootstrap' van de applicatie. Instantieert de MasterOrchestrator en verbindt Clusters en Managers.
 * @repo_architecture Mobile Industry (MI) - Infrastructure / DI Layer.
 * @term_definition Late-binding = Het gebruik van masterRef om de update-callback te injecteren in managers voordat de Master volledig is geconstrueerd.
 * @contract Stateful (React lifecycle). Garandeert een stabiele referentie van de Master zolang de 'dispatch' niet verandert.
 * @ai_instruction Dit is de enige plek waar 'new' operatoren voor orchestrators zijn toegestaan. Let op de volgorde van instantiatie vanwege onderlinge afhankelijkheden.
 */

import { useMemo } from 'react';
import type { FormState } from '@core/types/core';
import type { FormAction } from '@app/state/formReducer';
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import { MasterOrchestrator } from '@app/orchestrators/MasterOrchestrator';
import { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator.WIP';
import { VisibilityOrchestrator } from '@app/orchestrators/VisibilityOrchestrator';
import { UIManager } from '@app/orchestrators/managers/UIManager';
import { DataManager } from '@app/orchestrators/managers/DataManager';
import { BusinessManager } from '@app/orchestrators/managers/BusinessManager';
import { NavigationManager } from '@app/orchestrators/managers/NavigationManager';
import { NavigationOrchestrator } from '@app/orchestrators/NavigationOrchestrator';
import { ValidationOrchestrator } from '@app/orchestrators/ValidationOrchestrator';
import { ThemeManager } from '@app/orchestrators/managers/ThemeManager';

/**
 * ═══════════════════════════════════════════════════════════
 * STABLE ORCHESTRATOR HOOK
 * ═══════════════════════════════════════════════════════════
 * * Creëert en beheert de MasterOrchestrator instantie.
 * De 'styles' parameter is verwijderd omdat het domein nu zelf
 * de visuele regels dicteert via de SectionStyleFactory.
 */
export function useStableOrchestrator(
  state: FormState,
  dispatch: (action: FormAction) => void,
): MasterOrchestrator {
  return useMemo(() => {
    // 1. Initialiseer de State Orchestrator met een getter voor de huidige state
    const fso = new FormStateOrchestrator(() => state, dispatch);

    // 2. Late-binding voor de update callback om circulaire afhankelijkheden te voorkomen

// 2. Late-binding voor de update callback om circulaire afhankelijkheden te voorkomen
const masterRef: { current: MasterOrchestrator | null } = { current: null };

const updateFieldCb = (fieldId: string, value: unknown) => {
  // Optional chaining voorkomt “no-unsafe-call” en “never”-issues
  masterRef.current?.updateField(fieldId, value as unknown);
};


    // 3. Bouw de sub-orchestrators (Clusters)
const visibility = new VisibilityOrchestrator(fso);
const research = new ResearchOrchestrator(fso);
const validation = new ValidationOrchestrator(fso);

// 4. Initialiseer Managers (UIManager heeft geen styles meer nodig)
const ui = new UIManager(fso, visibility, updateFieldCb);
const data = new DataManager(research);
const business = new BusinessManager();
const theme = new ThemeManager();
const navManager = new NavigationManager();
const navigation = new NavigationOrchestrator(fso, navManager, validation);

// 5. Assembleer de MasterOrchestrator
const master = new MasterOrchestrator(
  fso, 
  { data, business, validation, visibility }, // <--- Voeg hier visibility toe
  { ui, navigation, theme }
);
masterRef.current = master;
    return master;
  }, [dispatch]); 
}