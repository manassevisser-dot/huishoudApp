import React from 'react';
import { View } from 'react-native';
import { FormState, FormAction } from '@shared-types/form';
import InputCounter from './InputCounter';
import ToggleSwitch from './ToggleSwitch';
import { FieldConfig } from '@shared-types/fields';

interface FormFieldProps {
  field: FieldConfig;
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  value: any;
}

const FormField: React.FC<FormFieldProps> = ({ field, dispatch, value }) => {
  const targetSection = field.section ?? 'setup';

  const handleChange = (newValue: any) => {
    dispatch({
      type: 'SET_FIELD',
      payload: { section: targetSection, field: field.fieldId, value: newValue },
    });
  };

  return (
    <View>
      {field.type === 'counter' && (
        <InputCounter
          fieldId={field.fieldId}
          label={field.label || field.labelToken}
          value={Number(value || 0)}
          onChange={(p) => handleChange(p.value)}
          min={field.validation?.min}
          max={field.validation?.max}
        />
      )}
      {field.type === 'toggle' && (
        <ToggleSwitch value={!!value} onToggle={() => handleChange(!value)} />
      )}
      {/* Voeg hier DateField en MoneyInput toe op dezelfde wijze */}
    </View>
  );
};

export default FormField;
