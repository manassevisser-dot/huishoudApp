// src/ui/navigation/Navigator.tsx
import * as React from 'react';
import { features } from '@config/features';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import TempWizardScreen from '@screens/TempWizardScreen';
import LandingScreen from '@screens/LandingScreen';
import WizardController from '@screens/Wizard/OUDWizardController';
import DashboardScreen from '@screens/Dashboard/DashboardScreen';
import DailyInputScreen from '@ui/screens/DailyInput/DailyInputScreen';
import OptionsScreen from '@screens/Options/OptionsScreen';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import CsvUploadScreen from '@screens/CSV/CsvUploadScreen';
import ResetScreen from '@screens/Reset/ResetScreen';
import UndoScreen from '@screens/Daily/UndoScreen';
import { PageConfig } from '../../shared-types/form';

type NavigatorProps = {
  // Flags
  isLoading: boolean;
  showUndo: boolean;
  showReset: boolean;
  showCsvUpload: boolean;
  showSettings: boolean;
  showOptions: boolean;
  showDailyInput: boolean;
  showLanding: boolean;
  atDashboard: boolean;
  showTempWizard: boolean;

  // Handlers
  onCloseUndo: () => void;
  onCloseReset: () => void;
  onWissen: () => Promise<void>;
  onHerstel: () => void;
  onCloseCsvUpload: () => void;
  onCloseSettings: () => void;
  onCloseOptions: () => void;
  onOpenOptions: () => void;
  onOpenSettings: () => void;
  onOpenCsvUpload: () => void;
  onOpenReset: () => void;
  onOpenUndo: () => void;
  onLogout: () => void;
  onDailyInputBack: () => void;
  onSignup: () => void;
  onSignin: () => void;
  onCloseTempWizard?: () => void;
  // Wizard (controlled)
  pages: PageConfig[];
  pageIndex: number;
  onNext: () => void;
  onPrev: () => void;
};

export default function Navigator({
  isLoading,
  showUndo,
  showReset,
  showCsvUpload,
  showSettings,
  showOptions,
  showDailyInput,
  showLanding,
  atDashboard,
  showTempWizard,
  onCloseUndo,
  onCloseReset,
  onWissen,
  onHerstel,
  onCloseCsvUpload,
  onCloseSettings,
  onCloseOptions,
  onOpenOptions,
  onOpenSettings,
  onOpenCsvUpload,
  onOpenReset,
  onOpenUndo,
  onLogout,
  onDailyInputBack,
  onSignup,
  onSignin,
  onCloseTempWizard,
  pages,
  pageIndex,
  onNext,
  onPrev,
}: NavigatorProps) {
  const { styles } = useAppStyles();

  // PRIORITY 0: Loading
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Laden...</Text>
      </View>
    );
  }

  // PRIORITY 1: Management
  if (showUndo) return <UndoScreen onClose={onCloseUndo} />;
  if (showReset) {
    return <ResetScreen onClose={onCloseReset} onWissen={onWissen} onHerstel={onHerstel} />;
  }
  if (showCsvUpload) return <CsvUploadScreen onClose={onCloseCsvUpload} />;
  if (showSettings) return <SettingsScreen onClose={onCloseSettings} />;
  if (showOptions) {
    return (
      <OptionsScreen
        onClose={onCloseOptions}
        onSettings={onOpenSettings}
        onCsvUpload={onOpenCsvUpload}
        onReset={onOpenReset}
      />
    );
  }

  // PRIORITY 2: Daily Input
  if (showDailyInput) return <DailyInputScreen onBack={onDailyInputBack} />;

  // PRIORITY 3: Landing
  if (showLanding) return <LandingScreen onSignup={onSignup} onSignin={onSignin} />;

  // PRIORITY 4: Dashboard
  if (atDashboard) {
    return (
      <View style={styles.container}>
        <DashboardScreen
          onAddTransaction={() => onDailyInputBack()} // open daily input via App handler
          onLogout={onLogout}
          onOpenOptions={onOpenOptions}
          onOpenUndo={onOpenUndo}
        />
      </View>
    );
  }

  // PRIORITY 5: TempWizard (tijdelijke nieuwe flow)
  if (showTempWizard) {
    // Tip: als jouw TempWizardScreen een 'onFinish' of 'onClose' prop heeft:
    // return <TempWizardScreen onFinish={onCloseTempWizard} />;
    return <TempWizardScreen />;
  }

  // PRIORITY 6: Wizard via feature-flag
  if (features.useTempWizard) {
    return <TempWizardScreen />;
  }
  return (
    <View style={styles.container}>
      <WizardController /* props indien nodig */ />
    </View>
  );
}
