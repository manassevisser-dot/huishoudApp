import React from 'react';
import { View } from 'react-native';
import { useAppOrchestration } from './app/hooks/useAppOrchestration';

// Simpele weergave voor de test-suite
export default function App() {
  const { status } = useAppOrchestration(null); 

  if (status === 'HYDRATING') {
    return <View testID="splash-screen" />;
  }

  if (status === 'UNBOARDING') {
    return <View testID="welcome-wizard" />;
  }

  return <View testID="app-ready" />;
}