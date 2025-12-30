import * as React from 'react';
import { View } from 'react-native';
import { FormFieldProps } from './FormField';
import FormField from './FormField';

export const ConditionalField: React.FC<FormFieldProps> = ({ 
  field, 
  state, 
  dispatch, 
  value 
}) => {
  // ADR-01: Business logica uit de config halen
  const isVisible = typeof field.condition === 'function' 
  ? field.condition(state) 
  : true;

  if (!isVisible || !field.dependentField) {
    return null;
  }

  return (
    <View style={{ marginTop: 10, paddingLeft: 15, borderLeftWidth: 2, borderLeftColor: '#eee' }}>
      <FormField
        field={field.dependentField}
        state={state}
        dispatch={dispatch}
        value={state[field.dependentField.id]}
      />
    </View>
  );
};

export default ConditionalField;