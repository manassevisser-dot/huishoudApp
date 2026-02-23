// src/ui/screens/screens.tsx
/**
 * @file_intent Koppelt screen-ID's aan hun specifieke renderer-component.
 *   Renderers die afwijken van DefaultScreenRenderer (bijv. extra footer, eigen container)
 *   worden hier geregistreerd via SCREEN_RENDERERS en SCREEN_TYPE_RENDERERS.
 * @repo_architecture UI Layer - Screen Renderer Registry.
 * @term_definition
 *   DefaultScreenRenderer = Toont alleen SectionList (scroll + DynamicSection per sectie).
 *   WizardScreenRenderer  = DefaultScreenRenderer + NavigationFooter onderaan.
 *   ScreenRenderer        = React-component die ScreenRendererProps ontvangt.
 * @ai_instruction
 *   Voeg een nieuw scherm toe in SCREEN_RENDERERS als het:
 *     - Een extra footer/actieknop nodig heeft (DailyInput-patroon)
 *     - Volledig eigen UI heeft die niet via de ViewModel-pipeline loopt (CSV, Options)
 *   Schermen die puur via de ViewModel-pipeline renderen (wizard-stappen, Settings)
 *   hoeven hier NIET geregistreerd te worden — DefaultScreenRenderer of WizardScreenRenderer
 *   pakt ze automatisch op.
 * @changes [Fase 4]
 *   OptionsScreenRenderer  — navigatieknoppen via useMaster(), vervangt losstaande OptionsScreen.
 *   CsvUploadScreenRenderer — delegeert volledig aan CsvUploadContainer (stateful container).
 *   CsvAnalysisScreenRenderer — delegeert aan CsvAnalysisFeedback (presentatie-sectie).
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView as RNScrollView } from 'react-native';
import { DynamicSection } from '@ui/sections/sections';
import { NavigationFooter } from '@ui/navigation/NavigationFooter';
import { DailyInputActionFooter } from '@ui/screens/actions/DailyInputActionFooter';
import { CsvUploadContainer } from '@ui/screens/csv/CsvUploadContainer';
import { CsvAnalysisFeedback } from '@ui/sections/CsvAnalysisFeedback';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import type { RenderScreenVM } from '@app/orchestrators/MasterOrchestrator';

interface ScreenRendererProps {
  screenVM: RenderScreenVM;
  topPadding: number;
  onSaveDailyTransaction: () => void;
}

// ─── Gedeelde basis ───────────────────────────────────────────────────────────

const SectionList: React.FC<{ screenVM: RenderScreenVM; topPadding: number }> = ({
  screenVM,
  topPadding,
}) => (
  <ScrollView contentContainerStyle={{ paddingTop: topPadding }}>
    {screenVM.sections.map((section) => (
      <DynamicSection
        key={section.sectionId}
        sectionId={section.sectionId}
        title={section.title}
        layout={section.layout}
        uiModel={section.uiModel}
        children={section.children}
      />
    ))}
  </ScrollView>
);

// ─── Standaard renderers ──────────────────────────────────────────────────────

const DefaultScreenRenderer: React.FC<ScreenRendererProps> = ({ screenVM, topPadding }) => (
  <SectionList screenVM={screenVM} topPadding={topPadding} />
);

const DailyInputScreenRenderer: React.FC<ScreenRendererProps> = ({
  screenVM,
  topPadding,
  onSaveDailyTransaction,
}) => (
  <>
    <SectionList screenVM={screenVM} topPadding={topPadding} />
    <DailyInputActionFooter onSave={onSaveDailyTransaction} />
  </>
);

const WizardScreenRenderer: React.FC<ScreenRendererProps> = ({ screenVM, topPadding }) => (
  <>
    <SectionList screenVM={screenVM} topPadding={topPadding} />
    <NavigationFooter />
  </>
);

// ─── Options renderer [Fase 4A] ───────────────────────────────────────────────
// Vervangt de losstaande OptionsScreen.tsx die props-callbacks verwachtte.
// Navigatie loopt nu via useMaster() — geen prop-drilling meer.

const OptionsScreenRenderer: React.FC<ScreenRendererProps> = ({ topPadding }) => {
  const master = useMaster();
  const { styles } = useAppStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <RNScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: topPadding, paddingBottom: 120 + insets.bottom },
        ]}
      >
        <Text style={styles.screenTitle}>Opties</Text>

        <TouchableOpacity
          style={[styles.button, { marginBottom: 16 }]}
          onPress={() => master.navigation.goToSettings()}
        >
          <Text style={styles.buttonText}>Instellingen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginBottom: 16 }]}
          onPress={() => master.navigation.goToCsvUpload()}
        >
          <Text style={styles.buttonText}>CSV uploaden</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginBottom: 16 }]}
          onPress={() => master.navigation.goToReset()}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </RNScrollView>

      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: Math.max(20, insets.bottom + 8) },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => master.navigation.goToDashboard()}
        >
          <Text style={styles.secondaryButtonText}>Terug naar Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── CSV Upload renderer [Fase 4B/4C] ────────────────────────────────────────
// Delegeert volledig aan CsvUploadContainer (stateful: isUploading, error, navigatie).
// SectionList wordt overgeslagen — CSV_DROPZONE_CARD heeft geen fieldIds.

const CsvUploadScreenRenderer: React.FC<ScreenRendererProps> = ({ topPadding }) => (
  <View style={{ flex: 1, paddingTop: topPadding }}>
    <CsvUploadContainer />
  </View>
);

// ─── CSV Analyse renderer [Fase 4D] ──────────────────────────────────────────
// Delegeert aan CsvAnalysisFeedback (presentatie-only, leest viewModels.csvAnalysis).
// ScrollView voor lange analyse-resultaten.

const CsvAnalysisScreenRenderer: React.FC<ScreenRendererProps> = ({ topPadding }) => (
  <ScrollView contentContainerStyle={{ paddingTop: topPadding }}>
    <CsvAnalysisFeedback />
  </ScrollView>
);

// ─── Renderer registry ────────────────────────────────────────────────────────

type ScreenRenderer = React.ComponentType<ScreenRendererProps>;

const SCREEN_RENDERERS: Record<string, ScreenRenderer> = {
  DAILY_INPUT: DailyInputScreenRenderer,
  OPTIONS: OptionsScreenRenderer,
  CSV_UPLOAD: CsvUploadScreenRenderer,
  CSV_ANALYSIS: CsvAnalysisScreenRenderer,
};

const SCREEN_TYPE_RENDERERS: Record<string, ScreenRenderer> = {
  WIZARD: WizardScreenRenderer,
};

// ─── Resolver ─────────────────────────────────────────────────────────────────

export function resolveScreenRenderer(screenVM: RenderScreenVM): ScreenRenderer {
  const byId = SCREEN_RENDERERS[screenVM.screenId];
  if (byId !== undefined) {
    return byId;
  }

  const byType = SCREEN_TYPE_RENDERERS[screenVM.type];
  if (byType !== undefined) {
    return byType;
  }

  return DefaultScreenRenderer;
}
