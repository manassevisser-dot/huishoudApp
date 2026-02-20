/**
 * @file_intent Rendert een vaste footer-balk met navigatieknoppen ("Terug" en "Verder"). Het component beheert de UI en de interactie-logica voor deze knoppen, inclusief de 'disabled' state.
 * @repo_architecture UI Layer - Navigation/Component. Dit is een specifiek UI-component dat deel uitmaakt van de algemene navigatie-layout.
 * @term_definition
 *   - `canGoNext`: Een boolean die bepaalt of de "Verder"-knop klikbaar is. Deze waarde wordt afgeleid van de `navigation`-orchestrator.
 *   - `FooterContainer`: Een interne layout-component die zorgt voor de correcte positionering, achtergrond, en `safe area` insets voor de footer.
 *   - `useMaster`: Een custom hook die toegang geeft tot de centrale `master`-orchestrator, waar de `navigation`-logica zich bevindt.
 * @contract Het component haalt de navigatie-logica (`navigateNext`, `navigateBack`, `canNavigateNext`) uit de `MasterProvider`. Het haalt stijlen uit de `AppStyles`. De "Verder"-knop wordt automatisch uitgeschakeld (`disabled`) als `navigation.canNavigateNext()` `false` retourneert.
 * @ai_instruction Dit component is ontworpen om 'out-of-the-box' te werken. De logica voor wanneer een gebruiker verder kan, wordt volledig bepaald door de `navigation`-orchestrator in de `master`-laag. Aanpassingen aan de *stijl* van de knoppen doe je in de `AppStyles`, niet in dit bestand. Aanpassingen aan de *logica* (wanneer je verder mag) doe je in de `domain/rules` die door de orchestrator worden gebruikt.
 */
// src/ui/navigation/NavigationFooter.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';

// Sterk getypte subset van de styles die hier gebruikt worden.
// Geen 'any', alleen React Native StyleProp types.
type FooterButtonStyles = {
  button: StyleProp<ViewStyle>;
  secondaryButton: StyleProp<ViewStyle>;
  secondaryButtonText: StyleProp<TextStyle>;
  buttonDisabled: StyleProp<ViewStyle>;
  buttonText: StyleProp<TextStyle>;
  // Optioneel: als je buiten de container nog 'styles.buttonRow' gebruikt
  // buttonRow?: StyleProp<ViewStyle>;
};

export const NavigationFooter: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { styles, Tokens } = useAppStyles();
  const master = useMaster();

  // Orchestrator uit master
  const { navigation } = master;

  // Zorg voor expliciete boolean (strict-boolean-expressions)
  const canGoNext: boolean = navigation.canNavigateNext() === true;

  // SafeArea
  const bottomSpace = Math.max(insets.bottom, Tokens.Space.lg);

  // Hard-typed view van de gebruikte styles, zonder 'any'
  const s = styles as unknown as FooterButtonStyles;

  return (
    <FooterContainer bottomSpace={bottomSpace}>
      <TouchableOpacity onPress={navigation.navigateBack} style={[s.button, s.secondaryButton]}>
        <Text style={s.secondaryButtonText}>Terug</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigation.navigateNext}
        disabled={!canGoNext}
        style={[s.button, !canGoNext && s.buttonDisabled]}
      >
        <Text style={s.buttonText}>Verder</Text>
      </TouchableOpacity>
    </FooterContainer>
  );
};

// --- helpers ---

const FooterContainer: React.FC<{ bottomSpace: number; children: React.ReactNode }> = ({
  bottomSpace,
  children,
}) => {
  // Thema-agnostische, veilige defaults (kan later naar Colors uit je theme)
  const bg = '#FFFFFF';
  const border = '#E5E7EB';

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: bottomSpace,
        backgroundColor: bg,
        borderTopWidth: 1,
        borderTopColor: border,
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 12,
        gap: 12,
      }}
    >
      {children}
    </View>
  );
};