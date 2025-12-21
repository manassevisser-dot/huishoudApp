//=====
// App.tsx

import * as React from 'react';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FormProvider, useFormContext } from './src/context/FormContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { Storage } from './src/services/storage';

import Navigator from './src/navigation/Navigator';

import { C1Config } from './src/screens/Wizard/pages/C1.config';
import { C4Config } from './src/screens/Wizard/pages/C4.config';
import { C7Config } from './src/screens/Wizard/pages/C7.config';
import { C10Config } from './src/screens/Wizard/pages/C10.config';

import { computeSummary } from './src/logic/finance';
import { PageConfig } from './src/types/form';

const WIZARD_PAGES: PageConfig[] = [C1Config, C4Config, C7Config, C10Config];

const AppContent: React.FC = () => {
  const { state, dispatch } = useFormContext();

  // === ALL HOOKS AT TOP LEVEL ===
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const [showLanding, setShowLanding] = React.useState(true);
  const [showDailyInput, setShowDailyInput] = React.useState(false);

  const [showOptions, setShowOptions] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showCsvUpload, setShowCsvUpload] = React.useState(false);
  const [showReset, setShowReset] = React.useState(false);
  const [showUndo, setShowUndo] = React.useState(false);

  const c4Index = React.useMemo(() => WIZARD_PAGES.findIndex((p) => p.id === 'C4'), []);

  const atDashboard = currentPageIndex === WIZARD_PAGES.length;

  const summary = React.useMemo(() => computeSummary(state.C7, state.C10), [state.C7, state.C10]);

  const hasMinimumData = summary.totalIncome > 0 && summary.totalExpenses > 0;

  // =========================================================
  // Load saved state on mount + one-time C4 alignment
  // =========================================================
  React.useEffect(() => {
    const loadAndInit = async () => {
      const savedState = await Storage.loadState();
      console.log('[INIT] savedState:', JSON.stringify(savedState ?? null));

      if (savedState) {
        dispatch({ type: 'LOAD_SAVED_STATE', data: savedState });
      }

      // Apply defaults where nothing was stored
      WIZARD_PAGES.forEach((page) => {
        page.fields.forEach((field) => {
          if (
            field.defaultValue !== undefined &&
            (!savedState || savedState[page.id]?.[field.id] === undefined)
          ) {
            dispatch({
              type: 'SET_PAGE_DATA',
              pageId: page.id,
              data: { [field.id]: field.defaultValue },
            });
          }
        });
      });

      setIsLoading(false);
      setShowLanding(true);

      // ✅ Deterministic post-hydration alignment (no timing tricks)
      if (savedState?.C1) {
        const aantalMensen = Math.max(1, Number(savedState.C1.aantalMensen ?? 1));
        const aantalVolwassen = Math.min(
          aantalMensen,
          Math.max(1, Number(savedState.C1.aantalVolwassen ?? 1)),
        );
        console.log('[ALIGN-TRIGGER] payload from savedState:', {
          aantalMensen,
          aantalVolwassen,
        });
        dispatch({
          type: 'ALIGN_HOUSEHOLD_MEMBERS',
          payload: { aantalMensen, aantalVolwassen },
        });
        console.log('[ALIGN-TRIGGER] dispatched');
      } else {
        console.log('[ALIGN-TRIGGER] skipped — no savedState.C1 present');
      }
    };

    loadAndInit();
  }, [dispatch]);

  // =========================================================
  // Dashboard validation (separate effect)
  // =========================================================
  React.useEffect(() => {
    if (atDashboard && !hasMinimumData) {
      Alert.alert(
        'Onvoldoende gegevens',
        'Vul minimaal uw inkomsten (C7) of vaste lasten (C10) in om het dashboard te bekijken.',
        [
          {
            text: 'OK',
            onPress: () => setCurrentPageIndex(WIZARD_PAGES.length - 1),
          },
        ],
      );
    }
  }, [atDashboard, hasMinimumData]);

  // =========================================================
  // HANDLERS
  // =========================================================
  const handleSignup = () => {
    setShowLanding(false);
    setCurrentPageIndex(0);
  };

  const handleSignin = () => {
    setShowLanding(false);
    setCurrentPageIndex(WIZARD_PAGES.length);
  };

  const handleLogout = () => {
    setShowOptions(false);
    setShowSettings(false);
    setShowCsvUpload(false);
    setShowReset(false);
    setShowUndo(false);
    setShowDailyInput(false);
    setShowLanding(true);
  };

  const handleOpenOptions = () => setShowOptions(true);
  const handleCloseOptions = () => setShowOptions(false);

  const handleOpenSettings = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);

  const handleOpenCsvUpload = () => setShowCsvUpload(true);
  const handleCloseCsvUpload = () => setShowCsvUpload(false);

  const handleOpenReset = () => setShowReset(true);
  const handleCloseReset = () => setShowReset(false);

  const handleOpenUndo = () => setShowUndo(true);
  const handleCloseUndo = () => setShowUndo(false);

  const handleWissen = async () => {
    await AsyncStorage.removeItem('@CashflowWizardState');
    await AsyncStorage.removeItem('@MockTransactions');
    await AsyncStorage.removeItem('@Theme');
    dispatch({ type: 'RESET_STATE' });
    setShowReset(false);
    setShowOptions(false);
    setShowLanding(true);
  };

  const handleHerstel = () => {
    dispatch({ type: 'RESET_STATE' });
    setShowReset(false);
    setShowOptions(false);
    setCurrentPageIndex(0);
  };

  const navigateNext = () => {
    if (currentPageIndex < WIZARD_PAGES.length) {
      const currentPage = WIZARD_PAGES[currentPageIndex];

      if (currentPage.id === 'C1') {
        const volwassenen = Number(state.C1?.aantalVolwassen ?? 0);
        if (volwassenen > 4) {
          Alert.alert(
            'Weet je zeker dat dit klopt?',
            `Je geeft aan dat er ${volwassenen} volwassenen in het huishouden zijn.`,
            [
              {
                text: 'Nee',
                style: 'cancel',
                onPress: () => setCurrentPageIndex(0),
              },
              {
                text: 'Ja',
                onPress: () => {
                  if (c4Index >= 0) setCurrentPageIndex(c4Index);
                  else setCurrentPageIndex((p) => p + 1);
                },
              },
            ],
          );
          return;
        }
      }

      setCurrentPageIndex((p) => p + 1);
    }
  };

  const navigatePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((p) => p - 1);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <Navigator
      isLoading={isLoading}
      showUndo={showUndo}
      showReset={showReset}
      showCsvUpload={showCsvUpload}
      showSettings={showSettings}
      showOptions={showOptions}
      showDailyInput={showDailyInput}
      showLanding={showLanding}
      atDashboard={atDashboard}
      onCloseUndo={handleCloseUndo}
      onCloseReset={handleCloseReset}
      onWissen={handleWissen}
      onHerstel={handleHerstel}
      onCloseCsvUpload={handleCloseCsvUpload}
      onCloseSettings={handleCloseSettings}
      onCloseOptions={handleCloseOptions}
      onOpenOptions={handleOpenOptions}
      onOpenSettings={handleOpenSettings}
      onOpenCsvUpload={handleOpenCsvUpload}
      onOpenReset={handleOpenReset}
      onOpenUndo={handleOpenUndo}
      onLogout={handleLogout}
      onDailyInputBack={() => setShowDailyInput(false)}
      onSignup={handleSignup}
      onSignin={handleSignin}
      pages={WIZARD_PAGES}
      pageIndex={currentPageIndex}
      onNext={navigateNext}
      onPrev={navigatePrev}
    />
  );
};

const App: React.FC = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <FormProvider>
        <AppContent />
      </FormProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

export default App;
