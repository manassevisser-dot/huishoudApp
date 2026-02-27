// src/ui/screens/CriticalError/CriticalErrorContainer.tsx
/**
 * @file_intent Toont een onherstelbare fout-staat met een native bevestigingsdialoog
 *   vóór een volledige reset.
 * @repo_architecture UI Layer - Container Screen. Dun omhulsel: Alert.alert + master.executeReset('full').
 * @term_definition
 *   CriticalError = Een fout-staat waarbij data-integriteit niet meer gegarandeerd kan worden.
 *     De enige correcte actie is een volledige reset (RESET_APP + PersistenceAdapter.clear()).
 *   Alert.alert = Native dialoog die wacht op gebruikersbevestiging vóór een destructieve actie.
 *     Dit is de ENIGE correcte laag voor deze interactie — Alert.alert mag niet in orchestrators.
 *   executeReset('full') → RESET_APP dispatch → PersistenceAdapter.clear() → navigeert naar LANDING.
 * @contract
 *   - Rendert een foutmelding (screenMessage) en één reset-knop.
 *   - Alert-teksten komen uit validationMessages.criticalError — SSOT, geen hardcoded strings.
 *   - Kleuren en spacing komen uit useAppStyles() en Tokens — geen magic numbers of hex-literals.
 *   - Na bevestiging: master.executeReset('full') → reducer muteert activeStep → LANDING.
 *   - Geen expliciete navigatie-aanroep: reducer handelt dat af (zelfde als ResetConfirmationContainer).
 *   - 'setup'-reset is hier NIET aangeboden: bij een kritieke fout is een gedeeltelijke reset onveilig.
 * @ai_instruction
 *   Voeg hier GEEN businesslogica toe. Alles na de bevestiging zit in ResetWorkflow.
 *   Alert.alert mag NIET in orchestrators of workflows — dat is een UI-import.
 *   Teksten wijzigen? → validationMessages.criticalError (SSOT), niet hier.
 *   showConfirmAlert() is de enige plek waar Alert.alert wordt aangeroepen — ESLint-grens.
 * @see ResetWorkflow — voert dispatch + PersistenceAdapter.clear() uit
 * @see validationMessages.criticalError — levert alle teksten
 * @see ResetConfirmationContainer — het referentiepatroon voor Alert.alert + executeReset
 * @replaces CriticalErrorScreen.tsx — mag verwijderd worden zodra dit component in productie is
 */
import * as React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { Tokens } from '@ui/kernel';
import { validationMessages } from '@state/schemas/sections/validationMessages';

// --- Alert-wrapper -----------------------------------------------------------
// Alert.alert heeft in sommige RN type-definities een overloaded/any signatuur.
// Door de aanroep hier te isoleren achter een volledig getypte wrapper, lost
// @typescript-eslint/no-unsafe-call op zonder te verspreiden naar consumers.

interface AlertButtonConfig {
  text: string;
  style?: 'cancel' | 'destructive' | 'default';
  onPress?: () => void;
}

function showConfirmAlert(
  title: string,
  message: string,
  buttons: AlertButtonConfig[],
): void {
  Alert.alert(title, message, buttons);
}

// --- Container (hoofd-export) ------------------------------------------------

interface CriticalErrorCardProps {
  title: string;
  message: string;
}

const CriticalErrorCard: React.FC<CriticalErrorCardProps> = ({
  title,
  message,
}) => {
  const { styles, colors } = useAppStyles();

  return (
    <View style={[styles.dashboardCard, { marginBottom: Tokens.Space.xxl, marginHorizontal: Tokens.Space.lg }]}>
      <Text
        style={[styles.screenTitle, { color: colors.error, marginBottom: Tokens.Space.sm }]}
        testID="critical-error-title"
      >
        {title}
      </Text>
      <Text style={styles.summaryDetail} testID="critical-error-message">
        {message}
      </Text>
    </View>
  );
};

interface ResetButtonProps {
  onPress: () => void;
  label: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onPress, label }) => {
  const { styles, colors } = useAppStyles();

  return (
    <TouchableOpacity
      testID="btn-critical-reset"
      style={[
        styles.button,
        {
          backgroundColor: colors.error,
          marginHorizontal: Tokens.Space.lg,
          marginLeft: 0,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.buttonText}>Reset Applicatie</Text>
    </TouchableOpacity>
  );
};
function useCriticalErrorReset(): () => void {
  const master = useMaster();

  return React.useCallback((): void => {
    const { title, message, confirm, cancel } =
      validationMessages.criticalError.alert;

    showConfirmAlert(title, message, [
      { text: cancel, style: 'cancel' },
      {
        text: confirm,
        style: 'destructive',
        onPress: () => master.executeReset('full'),
      },
    ]);
  }, [master]);
}

export const CriticalErrorContainer: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { styles } = useAppStyles();
  const handleResetPress = useCriticalErrorReset();

  return (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center', paddingBottom: insets.bottom },
      ]}
      testID="critical-error-container"
    >
      <CriticalErrorCard
        title="Kritieke fout"
        message={validationMessages.criticalError.screenMessage}
      />

      <ResetButton
        onPress={handleResetPress}
        label={validationMessages.criticalError.alert.confirm}
      />
    </View>
  );
};