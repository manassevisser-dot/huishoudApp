// src/ui/screens/Wizard/WizardPage.tsx
// UPDATED: Rendert containers met CollapsibleSection

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAppStyles } from '@styles/useAppStyles';
import { FieldRenderer } from '@ui/components/FieldRenderer';
import { CollapsibleSection } from '@ui/components/CollapsibleSection';
import { useFormContext } from '@app/context/FormContext';

interface FieldViewModel {
  fieldId: string;
  componentType: string;
  labelToken: string;
  value: unknown;
  isVisible: boolean;
  childFields?: FieldViewModel[];  // 🆕 Voor containers
}

interface WizardPageProps {
  config: {
    pageId: string;
    titleToken: string;
    fields: Array<{
      fieldId: string;
      type?: string;
    }>;
  };
}

export const WizardPage: React.FC<WizardPageProps> = ({ config }) => {
  const { orchestrator } = useFormContext();
  const { context } = useHousehold(); // Of waar je context vandaan komt

  // Eén aanroep: de volledige pipeline (render -> visibility -> component transformatie)
  const componentViewModels = useMemo(
    () => orchestrator.getPageComponentViewModels(
      config.fields.map((f) => f.fieldId),
      context
    ),
    [config.fields, orchestrator, context]
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