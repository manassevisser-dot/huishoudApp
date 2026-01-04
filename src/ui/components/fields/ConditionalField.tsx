import * as React from 'react';
import { View } from 'react-native';
import { FieldConfig, FormState, FormAction } from '@shared-types/form';
import FormField from './FormField';

interface ConditionalFieldProps {
  field: FieldConfig;
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({ 
  field, 
  state, 
  dispatch 
}) => {
  // 1. Logica bepalen op basis van de nieuwe 'visibleIf' property [cite: 142]
  let isVisible = true;

  if (typeof field.visibleIf === 'function') {
    isVisible = field.visibleIf(state);
  } else if (typeof field.visibleIf === 'string') {
    // Check of de waarde in de 'setup' sectie waar is (Phoenix SSOT standaard) [cite: 130]
    isVisible = !!(state.data.setup as any)[field.visibleIf];
  }

  // Als het veld niet zichtbaar is of er is geen afhankelijk veld, render niets [cite: 164]
  if (!isVisible || !field.dependentField) {
    return null;
  }

  // 2. De juiste waarde ophalen uit de geneste data-structuur [cite: 130, 152]
  const dependentField = field.dependentField;
  const section = dependentField.section ?? 'setup';
  const fieldValue = (state.data[section] as any)[dependentField.fieldId];

  return (
    <View style={{ marginTop: 10, paddingLeft: 15, borderLeftWidth: 2, borderLeftColor: '#eee' }}>
      <FormField
        field={dependentField}
        state={state}
        dispatch={dispatch}
        value={fieldValue}
      />
    </View>
  );
};

export default ConditionalField;