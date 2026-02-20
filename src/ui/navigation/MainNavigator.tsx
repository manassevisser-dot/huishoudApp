/**
 * @file_intent Dient als de centrale router of "verkeersregelaar" voor het weergeven van schermen. Het component bepaalt welk scherm getoond moet worden op basis van de huidige state van de applicatie.
 * @repo_architecture UI Layer - Navigation/Routing. Dit is het hart van de dynamische scherm-weergave.
 * @term_definition
 *   - `activeStep`: De ID van het scherm dat op dit moment actief is. Deze waarde wordt uit de `FormStateProvider` gehaald en is de "single source of truth" voor welk scherm getoond moet worden.
 *   - `UniversalScreen`: Een generiek scherm-component dat in staat is om elk type scherm te renderen op basis van een `screenId`.
 * @contract Dit component heeft geen eigen UI, maar delegeert de rendering volledig aan `UniversalScreen`. Het is onlosmakelijk verbonden met `FormStateProvider` om te weten welk scherm het moet tonen. Het fungeert als een 'switch' of 'router' op component-niveau.
 * @ai_instruction Dit bestand hoeft zelden aangepast te worden. De logica voor het bepalen van het `activeStep` zit in de `FormStateProvider` en de `domain/rules`. De daadwerkelijke rendering van het scherm gebeurt in `UniversalScreen`. Zie dit component als de lijm die de state (`activeStep`) en de view (`UniversalScreen`) met elkaar verbindt.
 */
// src/ui/navigation/MainNavigator.tsx
import React from 'react';
import { useFormState } from '@ui/providers/FormStateProvider';
import { UniversalScreen } from '../screens/UniversalScreen';

const MainNavigator = () => {
  const { state } = useFormState();

  // state.activeStep is nu de leidende ID uit de ScreenRegistry [cite: 143, 145]
  return <UniversalScreen screenId={state.activeStep} />;
};

export default MainNavigator;