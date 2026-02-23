// src/app/context/useStableOrchestrator.ts
import { useMemo, useRef } from 'react';
import type { FormState } from '@core/types/core';
import type { FormAction } from '@app/state/formReducer';

// Orchestrators
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import { MasterOrchestrator } from '@app/orchestrators/MasterOrchestrator';
import { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
import { VisibilityOrchestrator } from '@app/orchestrators/VisibilityOrchestrator';
import { NavigationOrchestrator } from '@app/orchestrators/NavigationOrchestrator';
import { ValidationOrchestrator } from '@app/orchestrators/ValidationOrchestrator';
import { ValueOrchestrator } from '@app/orchestrators/ValueOrchestrator'; // <--- Nieuw
import { FinancialOrchestrator } from '@app/orchestrators/FinancialOrchestrator';

// Managers
import { UIOrchestrator } from '@app/orchestrators/UIOrchestrator';
import { DataManager } from '@app/orchestrators/managers/DataManager';
import { BusinessManager } from '@app/orchestrators/managers/BusinessManager';
import { NavigationManager } from '@app/orchestrators/managers/NavigationManager';
import { ThemeManager } from '@app/orchestrators/managers/ThemeManager';
import { ValueManager } from '@app/orchestrators/managers/ValueManager'; // <--- Nieuw

export function useStableOrchestrator(
  state: FormState,
  dispatch: (action: FormAction) => void,
): MasterOrchestrator {
  const stateRef = useRef<FormState>(state);
  stateRef.current = state;

  return useMemo(() => {
    // 1. Core State & Late-binding
    const fso = new FormStateOrchestrator(() => stateRef.current, dispatch);

    // 2. Domein Orchestrators (Logic Clusters)
    const visibility = new VisibilityOrchestrator(fso);
    const research = new ResearchOrchestrator(fso);
    const valueOrch = new ValueOrchestrator(fso);
    const financial = new FinancialOrchestrator(fso);
    const business = new BusinessManager(financial);             // ← eerst
    
    // 3. Infrastructure Managers
    const validation = new ValidationOrchestrator(fso, business); // ← dan pas
    const ui = new UIOrchestrator(visibility);
    const data = new DataManager();
    const value = new ValueManager(valueOrch);
    const theme = new ThemeManager();
    const navManager = new NavigationManager();
    const navigation = new NavigationOrchestrator(fso, navManager, validation);
   
    // 4. Assembleer MasterOrchestrator
    const master = new MasterOrchestrator(
      fso,
      { research, data, business, validation, visibility, value },
      { ui, navigation, theme }
    );

    return master;
  }, [dispatch]);
}
