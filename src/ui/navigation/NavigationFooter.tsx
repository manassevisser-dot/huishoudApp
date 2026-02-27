/**
 * @file_intent Rendert vaste footer-balken voor navigatie.
 *   NavigationFooter     = "Terug" + "Verder" (wizard-stappen, Verder disabled als validatie faalt).
 *   NavigationBackFooter = alleen "Terug" (APP_STATIC schermen met previousScreenId, bijv. OPTIONS).
 *     Gebruikt navigation.navigateBack() → NavigationOrchestrator.goBack() → leest previousScreenId.
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
import { View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { Tokens } from '@ui/kernel';
import type { ColorScheme } from '@ui/kernel';
import type { AppStyles } from '@ui/styles/useAppStyles';

// --- Private hook ------------------------------------------------------------

interface FooterSetup {
  styles: AppStyles;
  colors: ColorScheme;
  navigation: ReturnType<typeof useMaster>['navigation'];
  bottomSpace: number;
}

function useFooterSetup(): FooterSetup {
  const insets = useSafeAreaInsets();
  const { styles, colors, Tokens } = useAppStyles();
  const master = useMaster();

  return {
    styles,
    colors,
    navigation: master.navigation,
    bottomSpace: Math.max(insets.bottom, Tokens.Space.lg),
  };
}

// --- NavigationFooter --------------------------------------------------------

export const NavigationFooter: React.FC = () => {
  const { styles, colors, navigation, bottomSpace } = useFooterSetup();

  // Expliciete boolean — strict-boolean-expressions
  const canGoNext: boolean = navigation.canNavigateNext() === true;

  return (
    <FooterContainer bottomSpace={bottomSpace} colors={colors}>
      <TouchableOpacity
      testID="nav-button-back"
        onPress={navigation.navigateBack}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={styles.secondaryButtonText}>Terug</Text>
      </TouchableOpacity>

      <TouchableOpacity
      testID="nav-button-next"
        onPress={navigation.navigateNext}
        disabled={!canGoNext}
        style={[styles.button, !canGoNext && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>Verder</Text>
      </TouchableOpacity>
    </FooterContainer>
  );
};

// --- NavigationBackFooter ----------------------------------------------------

/**
 * Rendert alleen een "Terug"-knop. Bedoeld voor APP_STATIC schermen die
 * previousScreenId hebben in ScreenRegistry maar geen wizard-"Verder"-knop nodig hebben.
 *
 * Flow: knop → navigation.navigateBack() → NavigationOrchestrator.goBack()
 *       → leest previousScreenId uit ScreenRegistry → navigateTo(previousScreenId).
 *
 * @example OPTIONS: previousScreenId = 'DASHBOARD' → "Terug" navigeert naar dashboard.
 * @see ScreenRegistry — previousScreenId per scherm
 * @see NavigationOrchestrator.goBack() — de implementatie
 */
export const NavigationBackFooter: React.FC = () => {
  const { styles, colors, navigation, bottomSpace } = useFooterSetup();

  return (
    <FooterContainer bottomSpace={bottomSpace} colors={colors}>
      <TouchableOpacity
        testID="nav-button-back"
        onPress={navigation.navigateBack}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={styles.secondaryButtonText}>Terug</Text>
      </TouchableOpacity>
    </FooterContainer>
  );
};

// --- FooterContainer ---------------------------------------------------------

interface FooterContainerProps {
  bottomSpace: number;
  colors: ColorScheme;
  children: React.ReactNode;
}

const FooterContainer: React.FC<FooterContainerProps> = ({
  bottomSpace,
  colors,
  children,
}) => (
  <View
    testID="footer-container"
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: bottomSpace,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      flexDirection: 'row',
      paddingHorizontal: Tokens.Space.lg,
      paddingTop: Tokens.Space.md,
      gap: Tokens.Space.md,
    }}
  >
    {children}
  </View>
);
