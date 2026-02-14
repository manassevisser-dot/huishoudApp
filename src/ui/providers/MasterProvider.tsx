import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useStableOrchestrator } from '@app/context/useStableOrchestrator';
import { useFormState } from './FormStateProvider';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';

const MasterContext = createContext<MasterOrchestratorAPI | undefined>(undefined);

export function MasterProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useFormState();
  
  // Cast naar de API zodat de UI niet weet dat het de concrete klasse is
  const master = useStableOrchestrator(state, dispatch) as MasterOrchestratorAPI;

  const value = useMemo(() => master, [master]);
  return <MasterContext.Provider value={value}>{children}</MasterContext.Provider>;
}

export function useMaster(): MasterOrchestratorAPI {
  const m = useContext(MasterContext);
  if (m === undefined) throw new Error('useMaster must be used within <MasterProvider>');
  return m;
}