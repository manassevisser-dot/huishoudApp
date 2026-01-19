import * as React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useForm } from '@app/context/FormContext';
import FormField from '@components/fields/FormField';
import { WizardPageConfig, DataSection } from '@shared-types/form';
import { evaluateVisibleIf } from '../../../utils/fieldVisibility';

interface WizardPageProps {
  config: WizardPageConfig;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const WizardPage: React.FC<WizardPageProps> = ({ config }) => {
  const { state, dispatch } = useForm();

  return (
    <View style={styles.container}>
      {config.titleToken && <Text style={styles.title}>{config.titleToken}</Text>}
      {config.title && <Text style={styles.title}>{config.title}</Text>}

      <ScrollView style={styles.scrollContainer}>
        {config.fields.map((field) => {
          const targetSection: DataSection = field.section || config.section || 'setup';
          const sectionData = state.data[targetSection];
          const value = (sectionData as any)?.[field.fieldId];

          // Gebruik de centrale util voor SSOT zichtbaarheid
          if (!evaluateVisibleIf(field.visibleIf, state)) {
            return null;
          }

          return (
            <FormField
              key={field.fieldId}
              field={field}
              state={state}
              dispatch={dispatch}
              value={value}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  scrollContainer: { flex: 1 },
});