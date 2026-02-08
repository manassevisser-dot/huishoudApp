// src/app/context/useStableOrchestrator.ts

import { useMemo } from 'react';
import type { FormState } from '@core/types/core';
import type { FormAction } from './formReducer';
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

/**
 * ═══════════════════════════════════════════════════════════
 * STABLE ORCHESTRATOR HOOK
 * ═══════════════════════════════════════════════════════════
 * * Creëert en beheert de MasterOrchestrator instantie.
 * De 'styles' parameter is verwijderd omdat het domein nu zelf
 * de visuele regels dicteert via de ComponentStyleFactory.
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
  masterRef.current?.updateField(fieldId, value);
};


    // 3. Bouw de sub-orchestrators (Clusters)
const visibility = new VisibilityOrchestrator(fso);
const research = new ResearchOrchestrator(fso);
const validation = new ValidationOrchestrator(fso);

// 4. Initialiseer Managers (UIManager heeft geen styles meer nodig)
const ui = new UIManager(fso, visibility, updateFieldCb);
const data = new DataManager(research);
const business = new BusinessManager();
const navManager = new NavigationManager();
const navigation = new NavigationOrchestrator(fso, navManager, validation);

// 5. Assembleer de MasterOrchestrator
const master = new MasterOrchestrator(fso, { data, business, validation }, { ui, navigation });
masterRef.current = master;
    return master;
  }, [dispatch]); // Alleen herspinnen als de dispatch verandert
}