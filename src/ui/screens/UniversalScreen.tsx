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
import { View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { DynamicSection } from '@ui/sections/sections';
import { useAppStyles } from '@ui/styles/useAppStyles';

export const UniversalScreen = ({ screenId }: { screenId: string }) => {
  const master = useMaster();
  const insets = useSafeAreaInsets();
  const { Tokens, styles } = useAppStyles();

  // De Master bouwt de volledige boom (Sections + hun FieldViewModels)
  const screenVM = useMemo(() => master.ui.buildScreen(screenId), [screenId, master]);

  if (!screenVM) return null;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ paddingTop: insets.top + Tokens.Space.md }}
      >
        {/* De Master levert sectionen die de DynamicSection kan vreten */}
        {screenVM.sections.map((compVM: any) => (
          <DynamicSection 
            key={compVM.id} 
            definition={compVM.definition} 
            fields={compVM.fields} // De ViewModels voor de velden in dit section
          />
        ))}
      </ScrollView>
    </View>
  );
};