import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, align      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>HuishoudApp — Snack minimal branch</Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}



