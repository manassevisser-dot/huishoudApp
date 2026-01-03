import * as React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useForm } from '@app/context/FormContext';
import FormField from '@components/fields/FormField';
import { WizardPageConfig, DataSection } from '@shared-types/form'; 

interface WizardPageProps {
  config: WizardPageConfig;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const WizardPage: React.FC<WizardPageProps> = ({ config, onNext, onBack, isFirst, isLast }) => {
  const { state, dispatch } = useForm();

  return (
    <View style={styles.container}>
      {/* Header op basis van WizardPageConfig [cite: 31] */}
      {config.titleToken && <Text style={styles.title}>{config.titleToken}</Text>}
      {config.title && <Text style={styles.title}>{config.title}</Text>}
      
      <ScrollView style={styles.scrollContainer}>
        {config.fields.map((field) => {
          // ✅ 1. Bepaal de sectie (Data Lade)
          // Prioriteit: Veld-override [cite: 17] -> Pagina-default [cite: 31] -> Fallback 'setup' [cite: 27]
          const targetSection: DataSection = field.section || config.section || 'setup';

          // ✅ 2. Haal de waarde veilig op uit de state [cite: 27, 28, 29]
          // Indexering is nu veilig omdat targetSection gegarandeerd DataSection is.
          const sectionData = state.data[targetSection];
          const value = (sectionData as any)?.[field.fieldId];

          // ✅ 3. Check zichtbaarheid (Functie of String-key check) [cite: 20]
          let isVisible = true;
          if (typeof field.visibleIf === 'function') {
            isVisible = field.visibleIf(state);
          } else if (typeof field.visibleIf === 'string') {
            // Check of de string-key in de huidige sectie een 'truthy' waarde heeft
            isVisible = !!(state.data as any)[targetSection]?.[field.visibleIf];
          }

          if (!isVisible) return null;

          // ✅ 4. Render het atomaire veld [cite: 16, 20]
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

      {/* Navigatie logica kan hieronder, gebruikmakend van onNext/onBack props */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
});