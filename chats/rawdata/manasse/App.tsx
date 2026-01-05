
import React from 'react';
import { SafeAreaView, View, StatusBar, Platform } from 'react-native';

// <<< Belangrijk: pas paden aan aan jouw structuur >>>
import HouseholdSetupOrganism from './src/organisms/HouseholdSetupOrganism_Full';
import { COLORS } from './src/design/DesignAtoms';

export default function App() {
  // Expo Web toont geen native statusbar; SafeAreaView werkt wel.
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Kleine edge-case fix voor web: padding bovenin */}
      <View style={{ flex: 1, paddingTop: Platform.OS === 'web' ? 16 : 0 }}>
        {/* Je organism rendert hier */}
        <HouseholdSetupOrganism />
      </View>

      {/* Optioneel: StatusBar alleen op native devices */}
      {Platform.OS !== 'web' && <StatusBar barStyle="dark-content" />}
    </SafeAreaView>
  );
}
