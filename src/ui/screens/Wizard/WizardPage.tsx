import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useForm } from '../../../app/context/FormContext';
import { useAppStyles } from '../../styles/useAppStyles';
import  FormField  from '../../components/fields/FormField';
import { Logger } from '../../../services/logger';
import { WizStrings } from 'src/config/Strings'

interface WizardPageProps {
  config: any;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const WizardPage: React.FC<WizardPageProps> = ({
  config,
  onNext,
  onBack,
  isFirst,
  isLast,
}) => {
  const { state, dispatch } = useForm();
  const { styles } = useAppStyles();

  React.useEffect(() => {
    Logger.info(`Scherm geladen: ${config.title}`);
  }, [config.title]);

  return (
    <View style={styles.container}>
      <Text 
        style={styles.pageTitle}
        accessibilityRole="header"
        accessibilityLiveRegion="assertive"
      >
        {config.title}
      </Text>
      
      {/* GEFIXED: styles.formContainer vervangen door styles.container of styles.inputContainer */}
      <ScrollView style={styles.container}>
        {config.fields.map((field: any) => (
          <FormField
            key={field.fieldId}
            field={field}
            state={state}
            dispatch={dispatch}
            value={state[field.fieldId] ?? state.setup?.[field.fieldId]} 
          />
        ))}
      </ScrollView>

      {/* GEFIXED: Geen inline style meer, maar gebruik maken van layout styles uit je tokens */}
      <View style={styles.buttonContainer}>
        {!isFirst && (
          <TouchableOpacity onPress={onBack} style={styles.secondaryButton}>
            <Text style={styles.buttonText}>{WizStrings.wizard.back}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          onPress={onNext} 
          style={styles.button}
          accessibilityLabel={isLast ? WizStrings.wizard.finish : WizStrings.wizard.next}
        >
          <Text style={styles.buttonText}>
            {isLast ? WizStrings.wizard.finish : WizStrings.wizard.next}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WizardPage;