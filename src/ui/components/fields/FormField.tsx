import * as React from 'react';
import { View } from 'react-native';
import { FieldConfig, FormState, FormAction } from '@shared-types/form';
// Importeer hier je werkelijke componenten
// import CounterField from './CounterField';
// import TextInputField from './TextInputField';

export interface FormFieldProps {
  field: FieldConfig;
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  value: any;
}

const FormField: React.FC<FormFieldProps> = ({ field, state, dispatch, value }) => {
  // Handige helper om waarde updates te sturen
  const handleChange = (newValue: any) => {
    dispatch({
      type: 'SET_FIELD',
      payload: { path: field.id, value: newValue }
    });
  };

  // Render logica op basis van field.type
  switch (field.type) {
    case 'counter':
      // return <CounterField field={field} value={value} onChange={handleChange} />;
      return null; 
    case 'text':
      // return <TextInputField field={field} value={value} onChange={handleChange} />;
      return null;
    default:
      return null;
  }
};

export default FormField;