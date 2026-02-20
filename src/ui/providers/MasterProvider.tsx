/**
 * @file_intent Creëert en levert de centrale `MasterOrchestrator`-instantie aan de applicatie via een React Context. Deze orchestrator is het belangrijkste toegangspunt voor UI-componenten om te interageren met bedrijfslogica en applicatieservices.
 * @repo_architecture UI Layer - Service Provider / Dependency Injection. Deze provider injecteert de kernlogica van de applicatie (de `MasterOrchestrator`) in de React-componentenboom. Het verbindt de declaratieve UI-laag met de imperatieve logica van de orchestrator.
 * @term_definition
 *   - `MasterOrchestratorAPI`: De publieke interface van de orchestrator. UI-componenten mogen alleen met deze API interacteren, niet met de concrete implementatie. Dit dwingt een scheiding van zorgen af.
 *   - `useStableOrchestrator`: Een factory-hook die een enkele, stabiele instantie van de `MasterOrchestrator` creëert en de huidige `state` en `dispatch`-functie eraan doorgeeft.
 *   - `useMaster`: De consumer-hook die elk component toegang geeft tot de `MasterOrchestratorAPI`.
 * @contract De `MasterProvider` moet binnen de `FormStateProvider` worden geplaatst. Het instantieert de `MasterOrchestrator` en maakt zijn publieke API (`MasterOrchestratorAPI`) beschikbaar via de `useMaster`-hook. Componenten die `useMaster` gebruiken, ontvangen een stabiele instantie van de orchestrator die ze kunnen gebruiken om acties te activeren (bijv. `master.navigation.navigateNext()`).
 * @ai_instruction Om acties op applicatieniveau uit te voeren (bijv. navigeren, gegevens verzenden), gebruik je de `useMaster`-hook om de orchestrator-instantie op te halen en zijn methoden aan te roepen (bijv. `const master = useMaster(); master.navigation.navigateNext();`). De UI-componenten mogen zelf geen complexe bedrijfslogica bevatten; ze moeten dit delegeren aan de orchestrator. Dit bestand is de brug die deze delegatie mogelijk maakt. Je hoeft dit bestand zelden te bewerken, maar je zult de `useMaster`-hook vaak gebruiken.
 */
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
