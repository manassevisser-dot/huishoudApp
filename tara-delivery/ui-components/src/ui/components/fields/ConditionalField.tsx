import * as React from 'react';
import { View } from 'react-native';
import { FieldConfig, FormState, FormAction } from '@shared-types/form';
import FormField from './FormField';
import { evaluateVisibleIf } from '../../../utils/fieldVisibility';

interface ConditionalFieldProps {
  field: FieldConfig;
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({ field, state, dispatch }) => {
  // Gebruik de centrale util voor SSOT zichtbaarheid
  const isVisible = evaluateVisibleIf(field.visibleIf, state);

  if (!isVisible || !field.dependentField) {
    return null;
  }

  const dependentField = field.dependentField;
  const section = dependentField.section ?? 'setup';
  const fieldValue = (state.data[section] as any)[dependentField.fieldId];

  return (
    <View style={{ marginTop: 10, paddingLeft: 15, borderLeftWidth: 2, borderLeftColor: '#eee' }}>
      <FormField field={dependentField} state={state} dispatch={dispatch} value={fieldValue} />
    </View>
  );
};

export default ConditionalField;