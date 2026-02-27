// src/ui/screens/Reset/ResetConfirmationContainer.tsx
/**
 * @file_intent Toont de reset-opties (WISSEN / HERSTEL) met native bevestigingsdialogen.
 * @repo_architecture UI Layer - Container Screen. Dun omhulsel: Alert.alert + master-aanroep.
 * @term_definition
 *   Alert.alert = Native dialoog die wacht op gebruikersbevestiging vóór een destructieve actie.
 *     Dit is de ENIGE correcte laag voor deze interactie (UI ≠ applicatielaag).
 *   executeReset('full')  → alles wissen → reducer navigeert naar LANDING.
 *   executeReset('setup') → alleen wizard wissen → reducer navigeert naar WIZARD_SETUP_HOUSEHOLD.
 * @contract
 *   Rendert twee kaarten met beschrijvingstekst en bevestigingsknop.
 *   Alert-teksten komen uit validationMessages.reset — SSOT, geen hardcoded strings.
 *   Kleuren en spacing komen uit useAppStyles() (colors) en Tokens — geen magic numbers of hex-literals.
 *   Na bevestiging: master.executeReset() → reducer muteert activeStep → MainNavigator toont nieuw scherm.
 *   Geen expliciete navigatie-aanroep nodig: de reducer handelt dat af.
 * @ai_instruction
 *   Voeg hier GEEN businesslogica toe. Alles wat na de bevestiging gebeurt zit in ResetWorkflow.
 *   Alert.alert mag NIET in orchestrators of workflows — dat is een UI-import.
 *   Teksten wijzigen? → validationMessages.reset (SSOT), niet hier.
 *   Kleuren wijzigen? → Colors.ts (SSOT via useAppStyles), niet hier.
 *   showConfirmAlert() is de enige plek waar Alert.alert wordt aangeroepen — ESLint-grens.
 * @see ResetWorkflow — voert de daadwerkelijke dispatch + PersistenceAdapter.clear() uit
 * @see validationMessages.reset — levert alle bevestiging- en beschrijvingsteksten
 * @see Colors.ts / Tokens.ts — kleuren en spacing via useAppStyles()
 * @see CsvUploadContainer — het referentiepatroon voor deze container-stijl
 * @replaces ResetScreen.tsx — mag verwijderd worden zodra dit component in productie is
 */
import * as React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { Tokens } from '@ui/kernel';
import { validationMessages } from '@state/schemas/sections/validationMessages';

// ─── Constanten ───────────────────────────────────────────────────────────────

/** Onderste padding voor de ScrollView zodat content boven de home-indicator uitkomt. */
const SCROLL_BOTTOM_PADDING = 120;

// ─── Getypte Alert-wrapper ────────────────────────────────────────────────────
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


/**
 * Interface Sub-component: WISSEN kaart: Puur weergave-component: kent geen MasterOrchestratorAPI.
 * 
 * @module src/ui/screens/Reset/ResetConfirmationContainer.tsx
 * @see {@link ./README.md | Module - Details}
 * 
 * @typeParam WissenKaartProps - Props voor de WissenKaart component.
 * @property {() => void} onConfirm - Callback die wordt aangeroepen wanneer de gebruiker bevestigt dat ze willen wissen. Deze functie voert de daadwerkelijke reset-actie uit via de MasterOrchestrator.
 */
interface WissenKaartProps {
  onConfirm: () => void;
}

const WissenKaart: React.FC<WissenKaartProps> = ({ onConfirm }) => {
  const { styles, colors } = useAppStyles();

  const handleWissen = React.useCallback(() => {
    const { title, message, confirm, cancel } = validationMessages.reset.wipe;
    showConfirmAlert(title, message, [
      { text: cancel, style: 'cancel' },
      { text: confirm, style: 'destructive', onPress: onConfirm },
    ]);
  }, [onConfirm]);

  return (
    <View style={[styles.dashboardCard, { marginBottom: Tokens.Space.xxl }]}>
      <Text style={[styles.entryLabel, { marginBottom: Tokens.Space.sm }]}>WISSEN</Text>
      <Text style={styles.summaryDetail}>{validationMessages.reset.wipe.hint}</Text>
      <TouchableOpacity
        testID="btn-wissen"
        style={[styles.button, { backgroundColor: colors.error, marginTop: Tokens.Space.lg, marginLeft: 0 }]}
        onPress={handleWissen}
      >
        <Text style={styles.buttonText}>WISSEN</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Sub-component: HERSTEL kaart ───────────────────────────────────────────
// Puur weergave-component: kent geen MasterOrchestratorAPI.
// Ontvangt een volledig getypte () => void callback van de container.

interface HerstelKaartProps {
  onConfirm: () => void;
}

const HerstelKaart: React.FC<HerstelKaartProps> = ({ onConfirm }) => {
  const { styles, colors } = useAppStyles();

  const handleHerstel = React.useCallback(() => {
    const { title, message, confirm, cancel } = validationMessages.reset.wizardOnly;
    showConfirmAlert(title, message, [
      { text: cancel, style: 'cancel' },
      { text: confirm, onPress: onConfirm },
    ]);
  }, [onConfirm]);

  return (
    <View style={[styles.dashboardCard, { marginBottom: Tokens.Space.xxl }]}>
      <Text style={[styles.entryLabel, { marginBottom: Tokens.Space.sm }]}>HERSTEL</Text>
      <Text style={styles.summaryDetail}>{validationMessages.reset.wizardOnly.hint}</Text>
      <TouchableOpacity
        testID="btn-herstel"
        style={[styles.button, { backgroundColor: colors.primary, marginTop: Tokens.Space.lg, marginLeft: 0 }]}
        onPress={handleHerstel}
      >
        <Text style={styles.buttonText}>HERSTEL</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Container (hoofd-export) ─────────────────────────────────────────────────

export const ResetConfirmationContainer: React.FC = () => {
  const master = useMaster();
  const insets = useSafeAreaInsets();
  const { styles } = useAppStyles();

  // Callbacks op container-niveau: master is hier direct van useMaster() getypt
  // zodat ESLint de volledige type-keten kan volgen zonder tussenliggende prop-drilling.
  const onWissenConfirmed = React.useCallback((): void => {
    master.executeReset('full');
  }, [master]);

  const onHerstelConfirmed = React.useCallback((): void => {
    master.executeReset('setup');
  }, [master]);

  return (
    <View style={styles.container} testID="reset-confirmation-container">
      <View style={styles.screenContainer}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: SCROLL_BOTTOM_PADDING + insets.bottom },
          ]}
        >
          <Text style={styles.screenTitle}>Reset Opties</Text>
          <WissenKaart onConfirm={onWissenConfirmed} />
          <HerstelKaart onConfirm={onHerstelConfirmed} />
        </ScrollView>
      </View>
    </View>
  );
};
