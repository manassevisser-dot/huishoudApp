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
 *     - Volledig eigen UI heeft die niet via de ViewModel-pipeline loopt (bijv. CSV)
 *   Schermen die puur via de ViewModel-pipeline renderen (wizard-stappen, Settings, Options)
 *   hoeven hier NIET geregistreerd te worden — DefaultScreenRenderer of WizardScreenRenderer
 *   pakt ze automatisch op via SectionRegistry + EntryRegistry.
 *   LANDING valt door naar DefaultScreenRenderer (type 'AUTH', geen type-renderer).
 * @changes [Fase 4]
 *   CsvUploadScreenRenderer — delegeert volledig aan CsvUploadContainer (stateful container).
 *   CsvAnalysisScreenRenderer — delegeert aan CsvAnalysisFeedbackContainer (VM via factory).
 * @changes [Fase 6]
 *   ACTION primitive toegevoegd: navigatieknoppen als gewone entries in SectionRegistry.
 * @changes [Fase 7+]
 *   OptionsScreenRenderer — OPTIONS = SectionList + NavigationBackFooter.
 *   SplashScreenRenderer  — SPLASH = ActivityIndicator + laadtekst (geen pipeline).
 *   LandingScreen.tsx en SplashScreen.tsx kunnen worden verwijderd.
 */
import React from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { DynamicSection } from '@ui/sections/sections';
import { NavigationFooter, NavigationBackFooter } from '@ui/navigation/NavigationFooter';
import { DailyInputActionFooter } from '@ui/screens/actions/DailyInputActionFooter';
import { CsvUploadContainer } from '@ui/screens/csv/CsvUploadContainer';
import { CsvAnalysisFeedbackContainer } from '@ui/sections/CsvAnalysisFeedback';
import { TransactionHistoryContainer } from '@ui/sections/TransactionHistoryContainer';
import { ResetConfirmationContainer } from '@ui/screens/Reset/ResetConfirmationContainer';
import type { RenderScreenVM } from '@app/orchestrators/MasterOrchestrator';

interface ScreenRendererProps {
  screenVM: RenderScreenVM;
  topPadding: number;
  onSaveDailyTransaction: () => void;
}

// --- Gedeelde basis -----------------------------------------------------------

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

// --- Standaard renderers ------------------------------------------------------

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

// --- Splash renderer ----------------------------------------------------------
// Toont een ActivityIndicator + laadtekst. SPLASH.sectionIds = [] — geen pipeline-sections.
// DefaultScreenRenderer zou een lege ScrollView renderen zonder spinner: niet bruikbaar.
// SplashContent scheidt hook-gebruik (useAppStyles) van de renderer-shell.
// SplashScreen.tsx kan na deze registratie verwijderd worden.

const SplashContent: React.FC = () => {
  const { styles, colors } = useAppStyles();
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.screenTitle}>Phoenix wordt geladen...</Text>
    </View>
  );
};

const SplashScreenRenderer: React.FC<ScreenRendererProps> = () => <SplashContent />;

// --- Options renderer ---------------------------------------------------------
// GLOBAL_OPTIONS_LIST-entries (goToSettings, goToCsvUpload, goToReset) renderen
// via SectionList (ACTION-primitives in EntryRegistry).
// NavigationBackFooter levert "Terug" via:
//   navigation.navigateBack() → goBack() → ScreenRegistry[OPTIONS].previousScreenId = 'DASHBOARD'
// OptionsScreen.tsx kan na deze registratie verwijderd worden.

const OptionsScreenRenderer: React.FC<ScreenRendererProps> = ({ screenVM, topPadding }) => (
  <>
    <SectionList screenVM={screenVM} topPadding={topPadding} />
    <NavigationBackFooter />
  </>
);

// --- CSV Upload renderer [Fase 4B/4C] -----------------------------------------
// Delegeert volledig aan CsvUploadContainer (stateful: isUploading, error, navigatie).
// SectionList wordt overgeslagen — CSV_DROPZONE_CARD heeft geen fieldIds.

const CsvUploadScreenRenderer: React.FC<ScreenRendererProps> = ({ topPadding }) => (
  <View style={{ flex: 1, paddingTop: topPadding }}>
    <CsvUploadContainer />
  </View>
);

// --- CSV Analyse renderer [Fase 6] --------------------------------------------
// Delegeert aan CsvAnalysisFeedbackContainer (stateless: VM via factory).

const CsvAnalysisScreenRenderer: React.FC<ScreenRendererProps> = ({ topPadding }) => (
  <View style={{ flex: 1, paddingTop: topPadding }}>
    <CsvAnalysisFeedbackContainer />
  </View>
);

// --- Reset renderer -----------------------------------------------------------
// Delegeert volledig aan ResetConfirmationContainer (Alert.alert + master.executeReset).
// RESET_CONFIRMATION_CARD.fieldIds = [] — geen EntryRegistry-velden, container bypast pipeline.

const ResetScreenRenderer: React.FC<ScreenRendererProps> = ({ topPadding }) => (
  <View style={{ flex: 1, paddingTop: topPadding }}>
    <ResetConfirmationContainer />
  </View>
);

// --- Undo renderer [Fase 7] ---------------------------------------------------
// TRANSACTION_HISTORY_LIST → TransactionHistoryContainer (Swipeable lijst, VM via factory).
// TRANSACTION_ACTIONS_CARD → DynamicSection (ACTION entries via registry).

const UndoScreenRenderer: React.FC<ScreenRendererProps> = ({ screenVM, topPadding }) => {
  const historySection = screenVM.sections.find(
    (s) => s.sectionId === 'TRANSACTION_HISTORY_LIST'
  );
  const actionsSection = screenVM.sections.find(
    (s) => s.sectionId === 'TRANSACTION_ACTIONS_CARD'
  );

  return (
    <View style={{ flex: 1, paddingTop: topPadding }}>
      <TransactionHistoryContainer />

      {actionsSection !== undefined && (
        <DynamicSection
          key={actionsSection.sectionId}
          sectionId={actionsSection.sectionId}
          title={actionsSection.title}
          layout={actionsSection.layout}
          uiModel={actionsSection.uiModel}
          children={actionsSection.children}
        />
      )}

      {/* Suppress unused historySection warning */}
      {historySection !== undefined && null}
    </View>
  );
};

// --- Renderer registry --------------------------------------------------------

type ScreenRenderer = React.ComponentType<ScreenRendererProps>;

const SCREEN_RENDERERS: Record<string, ScreenRenderer> = {
  SPLASH:       SplashScreenRenderer,
  DAILY_INPUT:  DailyInputScreenRenderer,
  OPTIONS:      OptionsScreenRenderer,
  CSV_UPLOAD:   CsvUploadScreenRenderer,
  CSV_ANALYSIS: CsvAnalysisScreenRenderer,
  UNDO:         UndoScreenRenderer,
  RESET:        ResetScreenRenderer,
};

const SCREEN_TYPE_RENDERERS: Record<string, ScreenRenderer> = {
  WIZARD: WizardScreenRenderer,
};

// --- Resolver -----------------------------------------------------------------

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
