//=====
// App.tsx

import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAppStyles } from './src/styles/useAppStyles'; // FIXED PATH
import {
  FormProvider,
  useFormContext,
} from './src/context/FormContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Storage } from './src/services/storage';
import LandingScreen from './src/screens/LandingScreen';
import WizardPage from './src/screens/Wizard/WizardPage';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import DailyInputScreen from './src/screens/DailyInput/DailyInputScreen';
import OptionsScreen from './src/screens/Options/OptionsScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';
import CsvUploadScreen from './src/screens/CSV/CsvUploadScreen';
import ResetScreen from './src/screens/Reset/ResetScreen';
import UndoScreen from './src/screens/Daily/UndoScreen';
import { C1Config } from './src/screens/Wizard/pages/C1.config';
import { C4Config } from './src/screens/Wizard/pages/C4.config';
import { C7Config } from './src/screens/Wizard/pages/C7.config';
import { C10Config } from './src/screens/Wizard/pages/C10.config';
import { calculateFinancialSummary } from './src/utils/finance';
import { PageConfig } from './src/types/form';

const WIZARD_PAGES: PageConfig[] = [
  C1Config,
  C4Config,
  C7Config,
  C10Config,
];

const AppContent: React.FC = () => {
  const { state, dispatch } = useFormContext();
  const { theme } = useTheme();
  const { styles, colors } = useAppStyles(); // Destructure styles and colors
  const insets = useSafeAreaInsets();
  
  // === ALL HOOKS AT TOP LEVEL (NO CONDITIONALS) ===
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Existing flags
  const [showLanding, setShowLanding] = React.useState(true);
  const [showDailyInput, setShowDailyInput] = React.useState(false);
  
  // NEW P0 flags
  const [showOptions, setShowOptions] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showCsvUpload, setShowCsvUpload] = React.useState(false);
  const [showReset, setShowReset] = React.useState(false);
  const [showUndo, setShowUndo] = React.useState(false);
  
  const c4Index = React.useMemo(
    () => WIZARD_PAGES.findIndex((p) => p.id === 'C4'),
    []
  );

  const atDashboard = currentPageIndex === WIZARD_PAGES.length;
  const summary = React.useMemo(
    () => calculateFinancialSummary(state.C7, state.C10),
    [state.C7, state.C10]
  );
  const hasMinimumData =
    summary.inkomenTotaalMaand > 0 && summary.lastenTotaalVast > 0;

  // Load saved state on mount
  React.useEffect(() => {
    const loadAndInit = async () => {
      const savedState = await Storage.loadState();
      if (savedState) {
        dispatch({ type: 'LOAD_SAVED_STATE', data: savedState });
      }
      WIZARD_PAGES.forEach((page) => {
        page.fields.forEach((field) => {
          if (
            field.defaultValue !== undefined &&
            (!savedState ||
              savedState[page.id]?.[field.id] === undefined)
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
      
      // CRITICAL P0: Force landing screen after state restoration
      setShowLanding(true);
    };
    loadAndInit();
  }, [dispatch]);

  // Validate minimum data when reaching dashboard
  React.useEffect(() => {
    if (atDashboard && !hasMinimumData) {
      Alert.alert(
        'Onvoldoende gegevens',
        'Vul minimaal uw inkomsten (C7) of vaste lasten (C10) in om het dashboard te bekijken.',
        [{ text: 'OK', onPress: () => setCurrentPageIndex(WIZARD_PAGES.length - 1) }]
      );
    }
  }, [atDashboard, hasMinimumData]);

  // === HANDLERS (AFTER ALL HOOKS) ===
  
  const handleSignup = () => {
    setShowLanding(false);
    setCurrentPageIndex(0);
  };
  
  const handleSignin = () => {
    setShowLanding(false);
    setCurrentPageIndex(WIZARD_PAGES.length);
  };

  // NEW P0: Logout handler (closes session, keeps data)
  const handleLogout = () => {
    setShowOptions(false);
    setShowSettings(false);
    setShowCsvUpload(false);
    setShowReset(false);
    setShowUndo(false);
    setShowDailyInput(false);
    setShowLanding(true);
    // NO AsyncStorage clear
    // NO dispatch RESET_STATE
  };
  
  // NEW P0: Options navigation
  const handleOpenOptions = () => {
    setShowOptions(true);
  };
  
  const handleCloseOptions = () => {
    setShowOptions(false);
  };
  
  const handleOpenSettings = () => {
    setShowSettings(true);
  };
  
  const handleCloseSettings = () => {
    setShowSettings(false);
  };
  
  const handleOpenCsvUpload = () => {
    setShowCsvUpload(true);
  };
  
  const handleCloseCsvUpload = () => {
    setShowCsvUpload(false);
  };
  
  const handleOpenReset = () => {
    setShowReset(true);
  };
  
  const handleCloseReset = () => {
    setShowReset(false);
  };
  
  const handleOpenUndo = () => {
    setShowUndo(true);
  };
  
  const handleCloseUndo = () => {
    setShowUndo(false);
  };
  
  // NEW P2: WISSEN handler (nuclear option - delete EVERYTHING)
  const handleWissen = async () => {
    await AsyncStorage.removeItem('@CashflowWizardState');
    await AsyncStorage.removeItem('@MockTransactions');
    await AsyncStorage.removeItem('@Theme');
    dispatch({ type: 'RESET_STATE' });
    setShowReset(false);
    setShowOptions(false);
    setShowLanding(true);
  };
  
  // NEW P2: HERSTEL handler (reset wizard, keep transactions)
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
        const volwassen = Number(state.C1?.aantalVolwassen ?? 0);
        if (volwassen > 4) {
          Alert.alert(
            'Weet je zeker dat dit klopt?',
            `Je geeft aan dat er ${volwassen} volwassenen in het huishouden zijn.`,
            [
              { text: 'Nee', style: 'cancel', onPress: () => setCurrentPageIndex(0) },
              {
                text: 'Ja',
                onPress: () => {
                  if (c4Index >= 0) setCurrentPageIndex(c4Index);
                  else setCurrentPageIndex((prev) => prev + 1);
                },
              },
            ]
          );
          return;
        }
      }
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const navigatePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  // === RENDERING LOGIC (PRIORITY ORDER) ===
  
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Laden...</Text>
      </View>
    );
  }

  // PRIORITY 1: Management screens
  if (showUndo) {
    return <UndoScreen onClose={handleCloseUndo} />;
  }

  if (showReset) {
    return (
      <ResetScreen
        onClose={handleCloseReset}
        onWissen={handleWissen}
        onHerstel={handleHerstel}
      />
    );
  }

  if (showCsvUpload) {
    return <CsvUploadScreen onClose={handleCloseCsvUpload} />;
  }

  if (showSettings) {
    return <SettingsScreen onClose={handleCloseSettings} />;
  }

  if (showOptions) {
    return (
      <OptionsScreen
        onClose={handleCloseOptions}
        onSettings={handleOpenSettings}
        onCsvUpload={handleOpenCsvUpload}
        onReset={handleOpenReset}
      />
    );
  }

  // PRIORITY 2: Daily Input
  if (showDailyInput) {
    return <DailyInputScreen onBack={() => setShowDailyInput(false)} />;
  }

  // PRIORITY 3: Landing
  if (showLanding) {
    return <LandingScreen onSignup={handleSignup} onSignin={handleSignin} />;
  }

  // PRIORITY 4: Dashboard
  if (atDashboard) {
    return (
      <View style={styles.container}>
        <DashboardScreen
          onAddTransaction={() => setShowDailyInput(true)}
          onLogout={handleLogout}
          onOpenOptions={handleOpenOptions}
          onOpenUndo={handleOpenUndo}
        />
      </View>
    );
  }

  // PRIORITY 5: Wizard (fallback)
  const currentPage = WIZARD_PAGES[currentPageIndex];
  return (
    <View style={styles.container}>
      <WizardPage
        page={currentPage}
        onNext={navigateNext}
        onPrev={navigatePrev}
        isFirst={currentPageIndex === 0}
        isLast={currentPageIndex === WIZARD_PAGES.length - 1}
      />
    </View>
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