// src/ui/screens/UniversalScreen.tsx
/**
 * @file_intent Dient als een generieke, herbruikbare container voor het renderen van elke willekeurige, door de orchestrator gedefinieerde, scherm-view. Het vraagt op basis van een `screenId` de `MasterOrchestrator` om de bijbehorende `screenViewModel` te bouwen en rendert deze vervolgens.
 * @repo_architecture UI Layer - Screen/View. Dit is het top-level component voor het weergeven van een volledige schermweergave. Het is een directe consument van de `MasterOrchestrator` en de brug tussen de navigatie-state en de daadwerkelijke UI-rendering.
 * @term_definition
 *   - `UniversalScreen`: Dit component. Een "domme" maar universele container die elke door de `MasterOrchestrator` gedefinieerde UI-structuur kan weergeven.
 *   - `screenId`: Een unieke string (bijv. "GREETING_STEP") die een specifieke schermconfiguratie identificeert.
 *   - `screenVM` (Screen ViewModel): De volledige datastructuur voor een scherm, gegenereerd door `master.ui.buildScreen()`. Het bevat een array van `sections`.
 *   - `DynamicSection`: Een sub-component dat een enkele sectie binnen het scherm rendert, inclusief alle bijbehorende velden (`Entry`-componenten).
 * @contract Dit component ontvangt een `screenId` als prop. Het roept `master.ui.buildScreen(screenId)` aan om de `screenViewModel` op te halen. Vervolgens itereert het over de `sections` van dit viewmodel en delegeert het renderen van elke sectie aan het `DynamicSection` component.
 * @ai_instruction Je hoeft dit bestand vrijwel nooit te wijzigen. Om een nieuw scherm in de app te tonen, moet je: 1. Een nieuwe scherm-configuratie met een unieke `screenId` definiëren binnen de `MasterOrchestrator`. 2. Ervoor zorgen dat de `NavigationOrchestrator` naar deze `screenId` kan navigeren. 3. De navigatie-stack zal dit `UniversalScreen` component renderen met de juiste `screenId`, waarna het scherm automatisch wordt opgebouwd en getoond.
 */
// src/ui/screens/UniversalScreen.tsx
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { resolveScreenRenderer } from '@ui/screens/screens';
import type { RenderScreenVM } from '@app/orchestrators/MasterOrchestrator';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';

interface UniversalScreenProps {
  screenId: string;
}

const buildSaveDailyTransactionHandler = (master: MasterOrchestratorAPI): (() => void) => () => {
  const saved = master.saveDailyTransaction();
  if (saved === true) {
    master.navigation.goToDashboard();
  }
};

export const UniversalScreen = ({ screenId }: UniversalScreenProps) => {
  const master = useMaster();
  const insets = useSafeAreaInsets();
  const { Tokens, styles } = useAppStyles();
  const screenVM = useMemo(() => master.buildRenderScreen(screenId), [screenId, master]) as RenderScreenVM | null;
  const onSaveDailyTransaction = useMemo(() => buildSaveDailyTransactionHandler(master), [master]);

  if (screenVM === null) {
    return null;
  }

  const ScreenRenderer = resolveScreenRenderer(screenVM);
  const topPadding = insets.top + Tokens.Space.md;

  return (
    <View style={styles.container}>
      <ScreenRenderer
        screenVM={screenVM}
        topPadding={topPadding}
        onSaveDailyTransaction={onSaveDailyTransaction}
      />
    </View>
  );
};
