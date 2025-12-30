// src/ui/components/fields/FormField.tsx
import * as React from 'react';
import { View } from 'react-native';
import { FieldConfig, FormState, FormAction } from '../../../shared-types/form';

export interface FormFieldProps {
  field: FieldConfig;
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  value: any;
}

const FormField: React.FC<FormFieldProps> = ({ field, state, dispatch, value }) => {
  
  /**
   * Onze reducer verwacht het Phoenix-contract:
   * Directe properties op de action, geen geneste payload.
   */
  const handleChange = (newValue: any) => {
    dispatch({
      type: 'SET_FIELD',
      fieldId: field.fieldId, // Directe property
      value: newValue,        // Directe property
    });
  };

  // Render logica op basis van field.type
  switch (field.type) {
    case 'counter':
      // Hier komt straks je CounterField component:
      // return <CounterField field={field} value={value} onChange={handleChange} />;
      return null;

    case 'text':
      // Hier komt straks je TextInputField component:
      // return <TextInputField field={field} value={value} onChange={handleChange} />;
      return null;

    case 'section':
    case 'collapsible-section':
    case 'repeater':
      // Deze worden meestal door de PageRenderer of een Parent afgehandeld,
      // maar we vangen ze hier op om fouten te voorkomen.
      return null;

    default:
      // Onbekend veldtype of placeholder
      console.warn(`Veldtype "${field.type}" wordt (nog) niet ondersteund in FormField.`);
      return <View />;
  }
};

export default FormField;