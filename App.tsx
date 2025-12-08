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

import styles from './src/styles/AppStyles';
import {
  FormProvider,
  useFormContext,
} from './src/context/FormContext';
import { Storage } from './src/services/storage';
import LandingScreen from './src/screens/LandingScreen';
import WizardPage from './src/screens/Wizard/WizardPage';
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import { C1Config } from './src/screens/Wizard/pages/C1.config';
import { C4Config } from './src/screens/Wizard/pages/C4.config';
import { C7Config } from './src/screens/Wizard/pages/C7.config';
import { C10Config } from './src/screens/Wizard/pages/C10.config';
import { calculateFinancialSummary } from './src/utils/finance';
import { PageConfig } from './src/types/form';

// ============================================================================
// WIZARD CONFIGURATION (PAGES)
// ============================================================================
const WIZARD_PAGES: PageConfig[] = [
  C1Config,
  C4Config,
  C7Config,
  C10Config,
];

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const AppContent: React.FC = () => {
  const { state, dispatch } = useFormContext();
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const insets = useSafeAreaInsets();
  const [showLanding, setShowLanding] = React.useState(true);

  const c4Index = React.useMemo(
    () => WIZARD_PAGES.findIndex((p) => p.id === 'C4'),
    []
  );

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
    };
    loadAndInit();
  }, [dispatch]);

  const handleSignup = () => {
    setShowLanding(false);
    setCurrentPageIndex(0);
  };
  
  const handleSignin = () => {
    setShowLanding(false);
    setCurrentPageIndex(WIZARD_PAGES.length);
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
              {
                text: 'Nee',
                style: 'cancel',
                onPress: () => {
                  setCurrentPageIndex(0);
                },
              },
              {
                text: 'Ja',
                onPress: () => {
                  if (c4Index >= 0) {
                    setCurrentPageIndex(c4Index);
                  } else {
                    setCurrentPageIndex((prev) => prev + 1);
                  }
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

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Laden...</Text>
      </View>
    );
  }

  if (showLanding) {
    return <LandingScreen onSignup={handleSignup} onSignin={handleSignin} />;
  }

  const atDashboard = currentPageIndex === WIZARD_PAGES.length;
  const isLastWizardPage = currentPageIndex === WIZARD_PAGES.length - 1;

  if (atDashboard) {
    const summary = calculateFinancialSummary(state.C7, state.C10);
    const hasMinimumData = summary.inkomenTotaalMaand > 0 || summary.lastenTotaalVast > 0;
    
    if (!hasMinimumData) {
      // Redirect back to last page with warning
      React.useEffect(() => {
        Alert.alert(
          'Onvoldoende gegevens',
          'Vul minimaal uw inkomsten (C7) of vaste lasten (C10) in om het dashboard te bekijken.',
          [
            {
              text: 'OK',
              onPress: () => setCurrentPageIndex(WIZARD_PAGES.length - 1),
            },
          ]
        );
      }, []);
    }

    return (
      <View style={styles.container}>
        <DashboardScreen />
        <View
          style={[
            styles.buttonContainer,
            {
              bottom: insets.bottom,
              paddingBottom: Math.max(20, insets.bottom + 8),
            },
          ]}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setCurrentPageIndex(WIZARD_PAGES.length - 1)}>
            <Text style={styles.secondaryButtonText}>
              Terug naar Laatste Pagina
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentPageIndex(0)}>
            <Text style={styles.buttonText}>Begin Opnieuw</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentPage = WIZARD_PAGES[currentPageIndex];
  return (
    <View style={styles.container}>
      <WizardPage
        page={currentPage}
        onNext={navigateNext}
        onPrev={navigatePrev}
        isFirst={currentPageIndex === 0}
        isLast={isLastWizardPage}
      />
    </View>
  );
};

const App: React.FC = () => (
  <SafeAreaProvider>
    <FormProvider>
      <AppContent />
    </FormProvider>
  </SafeAreaProvider>
);

export default App;
