// src/ui/screens/UniversalScreen.tsx
import React, { useMemo } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { DynamicSection } from '@ui/sections/sections';
import { useAppStyles } from '@ui/styles/useAppStyles';

export const UniversalScreen = ({ screenId }: { screenId: string }) => {
  const master = useMaster();
  const insets = useSafeAreaInsets();
  const { Tokens, styles } = useAppStyles();

  // De Master bouwt de volledige boom (Sections + hun FieldViewModels)
  const screenVM = useMemo(() => master.ui.buildScreen(screenId), [screenId, master]);

  if (!screenVM) return null;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ paddingTop: insets.top + Tokens.Space.md }}
      >
        {/* De Master levert sectionen die de DynamicSection kan vreten */}
        {screenVM.sections.map((compVM: any) => (
          <DynamicSection 
            key={compVM.id} 
            definition={compVM.definition} 
            fields={compVM.fields} // De ViewModels voor de velden in dit section
          />
        ))}
      </ScrollView>
    </View>
  );
};