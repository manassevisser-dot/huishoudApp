// src/ui/screens/Wizard/WizardPage.tsx
import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { FieldRenderer } from '@ui/components/FieldRenderer';
import { useWizard } from '@app/context/WizardContext';

// Verander de interface van lokaal naar exported
export interface WizardPageConfig {
  pageId: string;
  titleToken: string;
  fields: Array<{
    fieldId: string;
    type?: string;
  }>;
}

interface WizardPageProps {
  config: WizardPageConfig;
}

export const WizardPage: React.FC<WizardPageProps> = ({ config }) => {
  // We halen de master (orchestrator) nu uit de WizardContext-schil
  const { master } = useWizard();

  // De logica voor het ophalen van ViewModels
  // We gebruiken nu de 'ui' cluster en de 'build' methode [2026-02-10]
  const componentViewModels = useMemo(
    () => master.ui.buildPageComponentViewModels(
      config.fields.map((f) => f.fieldId)
    ),
    [config.fields, master]
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {componentViewModels.map((vm) => (
          <FieldRenderer 
            key={vm.fieldId} 
            viewModel={vm} 
          />
        ))}
      </ScrollView>
    </View>
  );
};